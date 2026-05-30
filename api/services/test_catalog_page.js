import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

puppeteer.use(StealthPlugin());

async function run() {
  const url = "https://www.mercadolivre.com.br/capacete-integral-fw3-gtx-estrela-com-viseira-transparente-e-oculos-interno-fum/p/MLB64157702?pdp_filters=item_id%3AMLB4639439405&offer_type=BEST_PRICE";
  
  console.log("Iniciando Puppeteer para inspecionar página de catálogo...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  
  console.log("Aguardando 5 segundos...");
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  console.log("\n=== 1. TÍTULO ENCONTRADO ===");
  console.log("ui-pdp-title:", $(".ui-pdp-title").text().trim());
  console.log("ui-pdp-title--catalog:", $(".ui-pdp-title--catalog").text().trim());
  console.log("h1:", $("h1").text().trim());

  console.log("\n=== 2. VALORES DE .andes-money-amount ===");
  $(".andes-money-amount").each((i, el) => {
    const className = $(el).attr("class");
    const text = $(el).text().trim();
    const fraction = $(el).find(".andes-money-amount__fraction").text().trim();
    const cents = $(el).find(".andes-money-amount__cents").text().trim();
    console.log(`[${i}] Classe: "${className}" | Texto: "${text}" | Fraction: "${fraction}" | Cents: "${cents}"`);
  });

  await browser.close();
}

run();
