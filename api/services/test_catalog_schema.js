import { scrapeProduct } from "./scraping.js";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

process.env.MERCADO_LIVRE_API_USE_OFFICIAL = "false";

async function runTest() {
  const url = "https://www.mercadolivre.com.br/capacete-integral-fw3-gtx-estrela-com-viseira-transparente-e-oculos-interno-fum/p/MLB64157702?pdp_filters=item_id%3AMLB4639439405&offer_type=BEST_PRICE";
  
  console.log("=== INICIANDO TESTE DO SCRAPER COM PÁGINA DE CATÁLOGO ===");
  try {
    const result = await scrapeProduct(url);
    const parsed = JSON.parse(result);
    console.log("\n✅ SUCESSO! Produto de catálogo recuperado:\n");
    console.log("ID:", parsed[0].id);
    console.log("Título:", parsed[0].title);
    console.log("Preço Atual:", parsed[0].price_currency, parsed[0].price);
    console.log("Preço Original (Sem desconto):", parsed[0].original_price);
    console.log("Imagem Principal:", parsed[0].image);
    console.log("Qtd Imagens:", parsed[0].images.length);
    console.log("Marca:", parsed[0].brand);
    console.log("Categorias:", parsed[0].categories);
    console.log("Variações encontradas:", parsed[0].variants.length);
  } catch (error) {
    console.error("\n❌ ERRO no teste:", error.message);
  }
}

runTest();
