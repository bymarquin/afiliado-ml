import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

puppeteer.use(StealthPlugin());

async function run() {
  const url = "https://www.mercadolivre.com.br/capacete-integral-fw3-gtx-estrela-com-viseira-transparente-e-oculos-interno-fum/p/MLB64157702?pdp_filters=item_id%3AMLB4639439405&offer_type=BEST_PRICE";
  
  console.log("Iniciando Puppeteer para inspecionar hierarquia de classes do preço...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  
  console.log("Aguardando 5 segundos...");
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  console.log("\n=== PARENTS DO PRIMEIRO .ui-pdp-price__part ===");
  const firstPrice = $(".ui-pdp-price__part").first();
  if (firstPrice.length > 0) {
    let parent = firstPrice.parent();
    let depth = 0;
    while (parent.length > 0 && depth < 6) {
      const tagName = parent.prop("tagName");
      const className = parent.attr("class");
      const id = parent.attr("id");
      console.log(`[Parent ${depth}] <${tagName} class="${className}" id="${id}">`);
      parent = parent.parent();
      depth++;
    }
  } else {
    console.log("Nenhum elemento .ui-pdp-price__part encontrado!");
  }

  await browser.close();
}

run();
