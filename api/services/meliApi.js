import axios from "axios";

const PRODUCT_ID_PATTERN = /MLB-?\d+/i;

const client = axios.create({
  timeout: 15000,
});

let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Obtém ou renova um token de acesso utilizando Client Credentials
 * @returns {Promise<string|null>} Token de acesso ou null se nenhuma credencial estiver definida
 */
export async function getAccessToken() {
  // Prioriza o token de acesso de usuário fornecido no .env se estiver definido
  if (process.env.MERCADO_LIVRE_ACCESS_TOKEN && process.env.MERCADO_LIVRE_ACCESS_TOKEN.trim() !== "") {
    return process.env.MERCADO_LIVRE_ACCESS_TOKEN.trim();
  }

  const clientId = process.env.MERCADO_LIVRE_CLIENT_ID;
  const clientSecret = process.env.MERCADO_LIVRE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  // Retorna do cache se ainda for válido (com 60s de margem de segurança)
  if (cachedToken && tokenExpiresAt && Date.now() < (tokenExpiresAt - 60000)) {
    return cachedToken;
  }

  console.log(`[MeliApi] Solicitando novo token de acesso via Client Credentials para o ID: ${clientId}`);
  try {
    const response = await client.post(
      "https://api.mercadolibre.com/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    const { access_token, expires_in } = response.data;
    cachedToken = access_token;
    tokenExpiresAt = Date.now() + (expires_in * 1000);
    console.log(`[MeliApi] Token obtido com sucesso! Válido por ${expires_in} segundos.`);
    return cachedToken;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error(`[MeliApi] Erro ao obter token de acesso: ${errorMsg}`);
    
    // Fallback para token estático no .env
    if (process.env.MERCADO_LIVRE_ACCESS_TOKEN) {
      console.log("[MeliApi] Usando token estático do .env como fallback");
      return process.env.MERCADO_LIVRE_ACCESS_TOKEN;
    }
    throw new Error(`Falha na autenticação com a API do Mercado Livre: ${errorMsg}`);
  }
}

/**
 * Extrai o ID do produto Mercado Livre (ex: MLB334455667) a partir de uma URL ou string.
 * @param {string} input - URL ou ID do produto
 * @returns {string|null} ID formatado do produto ou null
 */
export function extractMlbId(input) {
  if (!input) return null;
  const match = input.match(PRODUCT_ID_PATTERN);
  if (!match || !match[0]) return null;
  // Remove hifens se houver (ex: MLB-334455667 -> MLB334455667)
  return match[0].replace("-", "").toUpperCase();
}

/**
 * Busca dados do produto utilizando a API oficial do Mercado Livre.
 * @param {string} urlOrId - URL do produto ou o ID do produto (ex: MLB334455667)
 * @returns {Promise<string>} String contendo JSON no mesmo formato gerado por scraping.js
 */
export async function getProductFromMeliApi(urlOrId) {
  const meliId = extractMlbId(urlOrId);
  if (!meliId) {
    throw new Error("ID do produto não encontrado ou formato inválido.");
  }

  const token = await getAccessToken();
  const headers = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 1. Busca os dados básicos do item
  let itemResponse;
  try {
    itemResponse = await client.get(`https://api.mercadolibre.com/items/${meliId}`, { headers });
  } catch (error) {
    const status = error.response?.status;
    const errorMsg = error.response?.data?.message || error.message;
    throw new Error(`Erro ao buscar produto na API do Mercado Livre (Status: ${status}): ${errorMsg}`);
  }

  const item = itemResponse.data;

  // 2. Busca a descrição do item
  let descriptionText = "";
  try {
    const descResponse = await client.get(`https://api.mercadolibre.com/items/${meliId}/description`, { headers });
    descriptionText = descResponse.data?.plain_text || descResponse.data?.text || "";
  } catch (error) {
    console.warn(`[MeliApi] Não foi possível carregar a descrição do produto ${meliId}: ${error.message}`);
  }

  // 3. Busca a categoria do item para extrair a árvore de categorias (breadcrumbs)
  let categories = [];
  if (item.category_id) {
    try {
      const catResponse = await client.get(`https://api.mercadolibre.com/categories/${item.category_id}`, { headers });
      if (catResponse.data?.path_from_root) {
        categories = catResponse.data.path_from_root.map((cat) => cat.name);
      }
    } catch (error) {
      console.warn(`[MeliApi] Não foi possível obter as categorias do produto ${meliId}: ${error.message}`);
    }
  }

  // 4. Mapeamento das imagens de alta qualidade
  const images = (item.pictures || []).map((pic) => pic.secure_url || pic.url).filter(Boolean);
  const mainImage = images[0] || item.thumbnail || null;

  // 5. Extração da marca (brand) a partir dos atributos
  const brandAttr = (item.attributes || []).find((attr) => attr.id === "BRAND");
  const brand = brandAttr ? brandAttr.value_name : null;

  // 6. Mapeamento das variações (variants)
  const variants = (item.variations || []).map((variant) => {
    // Une atributos da variação para compor um nome (ex: "Cor: Preto - Voltagem: 110V")
    const variantName = (variant.attributes || [])
      .map((attr) => `${attr.name}: ${attr.value_name}`)
      .filter(Boolean)
      .join(" - ");

    // Associa a imagem da variação a partir do picture_ids usando as imagens do item principal
    let variantImage = null;
    if (variant.picture_ids && variant.picture_ids[0]) {
      const matchedPic = item.pictures?.find((p) => p.id === variant.picture_ids[0]);
      if (matchedPic) {
        variantImage = matchedPic.secure_url || matchedPic.url;
      }
    }

    return {
      id: variant.id ? String(variant.id) : null,
      name: variantName || null,
      selected: false,
      available: (variant.available_quantity ?? 0) > 0,
      url: item.permalink || urlOrId,
      image: variantImage || mainImage,
    };
  });

  // 7. Estruturação do objeto final seguindo o padrão de scraping.js
  const product = {
    id: item.id,
    title: item.title,
    image: mainImage,
    image_high_quality: mainImage,
    images: images.length > 0 ? images : [mainImage],
    url: item.permalink || urlOrId,
    url_afiliado: item.permalink || urlOrId,
    rate: null, // API oficial não fornece rating agregado publicamente
    rateCount: null,
    rating: null,
    rating_count: null,
    review_count: null,
    original_price: item.original_price ? Number(item.original_price) : null,
    price: item.price ? Number(item.price) : 0,
    price_currency: item.currency_id || "BRL",
    availability: (item.available_quantity ?? 0) > 0 ? "in_stock" : "out_of_stock",
    condition: item.condition || null,
    description: descriptionText,
    review1: null,
    review2: null,
    review3: null,
    reviews: [],
    brand: brand,
    categories: categories,
    variants: variants,
  };

  return JSON.stringify([product], null, 2);
}
