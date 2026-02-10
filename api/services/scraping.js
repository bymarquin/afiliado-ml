import axios from "axios";

export async function scrapeProduct(url) {
  const url_original = url;
  // Corrige: regex mais robusto e validação
  const product_id_match = url_original.match(/MLB[\w\d]+/);
  if (!product_id_match || !product_id_match[0]) {
    throw new Error("ID do produto não encontrado na URL.");
  }
  const formatted_id = product_id_match[0];
  const url_api = `https://www.mercadolivre.com.br/p/api/deferred?id=${formatted_id}&app=pdp&component_ids=open_box_alternatives&allow_test_items=false`;
  return await fetchAndSave(url_api, url);
}

const client = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9",
    Referer: "https://www.mercadolivre.com.br/",
  },
  timeout: 15000,
});

async function fetchAndSave(url, original_url) {
  const url_af = url;
  const response = await client.get(url);
  const products = [];

  const json =
    typeof response.data === "string"
      ? JSON.parse(response.data)
      : response.data;

  // Corrige: validação robusta da estrutura do JSON
  if (!json.schema || !Array.isArray(json.schema) || !json.schema[0]) {
    throw new Error("Dados do produto não encontrados na resposta da API.");
  }

  const product_id = json.id;
  const product_title = json.schema[0].name;
  const product_image = json.schema[0].image;
  const product_url = original_url;
  const product_rate = json.schema[0].aggregateRating?.ratingValue;
  const product_rateCount = json.schema[0].aggregateRating?.ratingCount;
  const product_price = json.schema[0].offers?.price;
  const product_originalprice =
    json.components?.track?.melidata_event?.event_data?.original_price;
  const product_description = json.schema[0].description;
  const product_review1 = json.schema[0].review?.[0]?.reviewBody;
  const product_review2 = json.schema[0].review?.[1]?.reviewBody;
  const product_review3 = json.schema[0].review?.[2]?.reviewBody;

  const product = {
    id: product_id,
    title: product_title,
    image: product_image,
    url: product_url,
    url_afiliado: url_af,
    rate: product_rate,
    rateCount: product_rateCount,
    original_price: product_originalprice,
    price: product_price,
    description: product_description,
    review1: product_review1,
    review2: product_review2,
    review3: product_review3,
  };
  products.push(product);
  const formatted = JSON.stringify(products, null, 2);

  return formatted;
}
