import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

puppeteer.use(StealthPlugin());

async function run() {
  const url = "https://produto.mercadolivre.com.br/MLB-3641859651-capacete-masculino-feminino-asx-city-preto-fechado-esportivo-_JM?searchVariation=183149880135#polycard_client=recommendations_vip-v2p&reco_backend=ranker_retrieval_online_vpp_v2p&reco_model=organicos_deduplication&reco_client=vip-v2p&reco_item_pos=1&reco_backend_type=low_level&reco_id=4eba89ad-ea48-4e8d-ac85-83bb1c96f448";
  
  console.log("Iniciando Puppeteer para testar seletor de galeria...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  
  console.log("Aguardando 5 segundos para resolução do desafio...");
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  console.log("\n=== TESTANDO SELETOR: .ui-pdp-gallery img ===");
  $(".ui-pdp-gallery img").each((i, el) => {
    const className = $(el).attr("class");
    const src = $(el).attr("data-zoom") || $(el).attr("src") || $(el).attr("data-src");
    console.log(`[${i}] Classe: "${className}" | Src: "${src}"`);
  });

  console.log("\n=== TESTANDO SELETOR: .ui-pdp-gallery__container img ===");
  $(".ui-pdp-gallery__container img").each((i, el) => {
    const className = $(el).attr("class");
    const src = $(el).attr("data-zoom") || $(el).attr("src") || $(el).attr("data-src");
    console.log(`[${i}] Classe: "${className}" | Src: "${src}"`);
  });
  
  await browser.close();
}

run();
