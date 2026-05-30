import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

puppeteer.use(StealthPlugin());

async function run() {
  const url = "https://www.mercadolivre.com.br/capacete-integral-fw3-gtx-estrela-com-viseira-transparente-e-oculos-interno-fum/p/MLB64157702?pdp_filters=item_id%3AMLB4639439405&offer_type=BEST_PRICE";
  
  console.log("Iniciando Puppeteer para rastrear pais do preço principal do catálogo...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  
  console.log("Aguardando 5 segundos...");
  await new Promise(r => setTimeout(r, 5000));
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  // Encontra o elemento que contém R$505,91 ou similar
  let targetPriceEl = null;
  $(".andes-money-amount").each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes("505") || text.includes("502") || text.includes("549")) {
      targetPriceEl = $(el);
      console.log(`\nEncontrado elemento alvo: "${text}" | Classe: "${$(el).attr("class")}"`);
      
      let parent = targetPriceEl.parent();
      let depth = 0;
      while (parent.length > 0 && depth < 8) {
        const tagName = parent.prop("tagName");
        const className = parent.attr("class");
        console.log(`[Parent ${depth}] <${tagName} class="${className}">`);
        parent = parent.parent();
        depth++;
      }
    }
  });

  await browser.close();
}

run();
