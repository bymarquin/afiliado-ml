import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

puppeteer.use(StealthPlugin());

async function run() {
  const url = "https://www.mercadolivre.com.br/capacete-integral-fw3-gtx-estrela-com-viseira-transparente-e-oculos-interno-fum/p/MLB64157702?pdp_filters=item_id%3AMLB4639439405&offer_type=BEST_PRICE";
  
  console.log("Iniciando Puppeteer para inspecionar classes do Buy Box / Sidebar...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  
  console.log("Aguardando 5 segundos...");
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  const containers = [
    ".ui-pdp-buybox",
    ".ui-box-component",
    ".ui-pdp-sidebar",
    ".ui-pdp-container__sidebar",
    ".ui-pdp-container__col--right"
  ];
  
  for (const sel of containers) {
    const el = $(sel);
    console.log(`\n=== TESTANDO SELETOR CONTAINER: "${sel}" (Encontrado: ${el.length > 0}) ===`);
    if (el.length > 0) {
      el.find(".andes-money-amount").each((i, subEl) => {
        const text = $(subEl).text().trim();
        const fraction = $(subEl).find(".andes-money-amount__fraction").text().trim();
        const cents = $(subEl).find(".andes-money-amount__cents").text().trim();
        console.log(`[${i}] Texto: "${text}" | Fraction: "${fraction}" | Cents: "${cents}"`);
      });
    }
  }

  await browser.close();
}

run();
