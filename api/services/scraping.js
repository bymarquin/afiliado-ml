import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { getProductFromMeliApi } from "./meliApi.js";

puppeteer.use(StealthPlugin());

const PRODUCT_ID_PATTERN = /MLB-?\d+/i;

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeMeliImageUrl(url) {
  if (typeof url !== "string") return null;
  
  // Força HTTPS
  let normalized = url.startsWith("http://") 
    ? url.replace("http://", "https://") 
    : url;

  // Substitui qualquer sufixo de tamanho (-I, -G, -V, -R, etc.) para o tamanho original (-O)
  return normalized.replace(/-[A-Z]\.(jpg|jpeg|png|webp)$/i, "-O.$1");
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim()))];
}

function extractMlbId(url) {
  if (!url) return null;
  const match = url.match(PRODUCT_ID_PATTERN);
  return match ? match[0].replace("-", "").toUpperCase() : null;
}

/**
 * Realiza o scraping de um produto do Mercado Livre usando Puppeteer Stealth para burlar o Cloudflare/Anubis.
 * @param {string} url - URL do produto
 * @returns {Promise<string>} String contendo o JSON do produto em formato de array compatível
 */
export async function scrapeProduct(url) {
  // Se configurado para usar a API oficial do Mercado Livre, redireciona a chamada
  if (process.env.MERCADO_LIVRE_API_USE_OFFICIAL === "true") {
    console.log(`[MeliApi] Buscando dados do produto via API oficial: ${url}`);
    return await getProductFromMeliApi(url);
  }

  console.log(`[Scraping] Iniciando navegador Stealth Puppeteer para: ${url}`);
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-infobars",
        "--window-size=1280,800"
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.setExtraHTTPHeaders({
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    console.log("[Scraping] Acessando página do produto...");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    console.log("[Scraping] Aguardando resolução do desafio Cloudflare/Anubis...");
    // Aguarda o seletor clássico de título ou algum elemento principal da página de produto
    await page.waitForSelector(".ui-pdp-title", { timeout: 12000 });

    const html = await page.content();
    console.log("[Scraping] Desafio superado com sucesso! Extraindo dados da DOM...");

    const product = parseHtmlProductData(html, url);
    await browser.close();

    return JSON.stringify([product], null, 2);
  } catch (error) {
    console.error(`[Scraping] Falha ao raspar produto: ${error.message}`);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

/**
 * Faz o parser do HTML completo da página e extrai os campos no formato padrão do banco.
 * @param {string} html - HTML bruto da página do produto
 * @param {string} url - URL do produto
 * @returns {object} Objeto do produto mapeado
 */
function parseHtmlProductData(html, url) {
  const $ = cheerio.load(html);
  const meliId = extractMlbId(url);

  // 1. Tenta encontrar blocos JSON-LD para extrair dados estruturados (SEO)
  let productSchema = null;
  let breadcrumbSchema = null;

  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json?.["@type"] === "Product") {
        productSchema = json;
      } else if (Array.isArray(json)) {
        const prod = json.find((item) => item?.["@type"] === "Product");
        if (prod) productSchema = prod;
      }

      if (json?.["@type"] === "BreadcrumbList") {
        breadcrumbSchema = json;
      }
    } catch (e) {
      // Ignora erros de parse do JSON
    }
  });

  const aggregateRating = productSchema?.aggregateRating || {};
  const offers = Array.isArray(productSchema?.offers)
    ? productSchema.offers[0]
    : productSchema?.offers || {};

  // 2. Extrai Título (Título clássico da PDP do Mercado Livre)
  const product_title = $(".ui-pdp-title").text().trim() || productSchema?.name || "";

  // 3 e 4. Extrai Preço Atual e Preço Original
  let product_price = null;
  let product_originalprice = null;

  $(".andes-money-amount").each((i, el) => {
    const $el = $(el);
    
    // Ignora elementos dentro de recomendações, carrosséis, outras variações ou ofertas não selecionadas
    const isExcluded = $el.closest([
      ".ui-recommendations-carousel-free",
      ".recos-polycard",
      ".poly-card",
      ".andes-carousel-free",
      ".ui-pdp-outside_variations__thumbnails__item",
      ".ui-pdp-outside_variations",
      ".ui-pdp-other-sellers",
      ".ui-pdp-buy-box-offers__offer-list-item--NOT-SELECTED"
    ].join(",")).length > 0;
    
    if (isExcluded) return;

    const fraction = $el.find(".andes-money-amount__fraction").text().replace(/\./g, "").trim();
    const cents = $el.find(".andes-money-amount__cents").text().trim() || "00";
    const parsedVal = fraction ? parseFloat(`${fraction}.${cents}`) : null;

    if (parsedVal) {
      if ($el.hasClass("ui-pdp-price__original-value") || $el.parent().hasClass("ui-pdp-price__part--original")) {
        product_originalprice = parsedVal;
      } else if ($el.hasClass("andes-money-amount--weight-semibold")) {
        product_price = parsedVal;
      } else if (!product_price && !$el.hasClass("ui-pdp-color--BLACK")) {
        product_price = parsedVal;
      }
    }
  });

  // Fallbacks usando o schema JSON-LD se a extração da DOM falhar
  if (!product_price) {
    product_price = toNumber(firstDefined(offers?.price, 0));
  }
  if (!product_originalprice) {
    product_originalprice = productSchema?.offers?.priceSpecification?.price ? toNumber(productSchema.offers.priceSpecification.price) : null;
  }

  // 5. Extrai Imagens de alta qualidade
  const domImages = [];
  
  // Varre apenas as imagens de dentro do contêiner da galeria oficial do produto
  $(".ui-pdp-gallery img").each((i, el) => {
    const className = $(el).attr("class") || "";
    const src = $(el).attr("data-zoom") || $(el).attr("src") || $(el).attr("data-src");
    
    if (src && !className.includes("clip") && !src.includes("base64,")) {
      domImages.push(normalizeMeliImageUrl(src));
    }
  });

  if (productSchema?.image) {
    asArray(productSchema.image).forEach((img) => domImages.push(normalizeMeliImageUrl(img)));
  }

  const images = uniqueStrings(domImages);
  const product_image = images[0] || null;

  // 6. Extrai Avaliações (Rating)
  const ratingValue = $(".ui-pdp-review__rating").first().text().trim();
  const ratingCountText = $(".ui-pdp-review__amount").first().text().replace(/[^\d]/g, "").trim();
  
  const rating = toNumber(ratingValue) || toNumber(aggregateRating?.ratingValue) || null;
  const ratingCount = toNumber(ratingCountText) || toNumber(aggregateRating?.ratingCount) || null;

  // 7. Extrai Descrição do produto
  const product_description = $(".ui-pdp-description__content").text().trim() || productSchema?.description || "";

  // 8. Extrai Categorias
  const categoriesList = [];
  $(".andes-breadcrumb__item a").each((i, el) => {
    categoriesList.push($(el).text().trim());
  });
  if (breadcrumbSchema?.itemListElement) {
    asArray(breadcrumbSchema.itemListElement).forEach((item) => {
      if (item?.item?.name) categoriesList.push(item.item.name);
    });
  }
  const product_categories = uniqueStrings(categoriesList);

  // 9. Marca (Brand)
  const product_brand = $(".ui-pdp-brand-link").text().trim() || productSchema?.brand?.name || productSchema?.brand || null;

  // 10. Variações (Se existirem no seletor da página)
  const variants = [];
  $(".ui-pdp-variations__picker, .ui-pdp-variation").each((i, el) => {
    const variantId = $(el).attr("data-id") || `variant-${i}`;
    const variantName = $(el).find(".ui-pdp-variations__picker-title, .ui-pdp-variation-title").text().trim() || $(el).text().trim();
    variants.push({
      id: variantId,
      name: variantName,
      selected: false,
      available: true,
      url: url,
      image: product_image,
    });
  });

  return {
    id: meliId,
    title: product_title,
    image: product_image,
    image_high_quality: product_image,
    images,
    url: url,
    url_afiliado: url,
    rate: rating,
    rateCount: ratingCount,
    rating: rating,
    rating_count: ratingCount,
    review_count: ratingCount,
    original_price: product_originalprice,
    price: product_price,
    price_currency: "BRL",
    availability: "in_stock",
    condition: "new",
    description: product_description,
    review1: null,
    review2: null,
    review3: null,
    reviews: [],
    brand: product_brand,
    categories: product_categories,
    variants: variants,
  };
}
