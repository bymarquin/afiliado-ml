import axios from "axios";
import fs from "fs";

const path = 'data/mercadolivre.json'
function lerJson(){
    const json_data = fs.readFileSync(path, 'utf-8')
    return JSON.parse(json_data)
}

function grampearURL(url){
const url_original = url;
const product_id = url_original.match(/MLB[^#]*#/)
const formatted_id = product_id[0].replace('#', '')
const url_api =
  `https://www.mercadolivre.com.br/p/api/deferred?id=${formatted_id}&app=pdp&component_ids=open_box_alternatives&allow_test_items=false`;
fetchAndSave(url_api, url).catch(console.error);
}

const client = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9",
    "Referer": "https://www.mercadolivre.com.br/",
  },
  timeout: 15000,
});

async function fetchAndSave(url, original_url) {
  const response = await client.get(url);
  

  const json =
    typeof response.data === "string"
      ? JSON.parse(response.data)
      : response.data;

    const products = lerJson()

    const product_id = json.id
    const product_title = json.schema[0].name
    const product_image = json.schema[0].image
    const product_url = original_url
    const product_rate = json.schema[0].aggregateRating.ratingValue
    const product_rateCount = json.schema[0].aggregateRating.ratingCount
    const product_price = json.schema[0].offers.price
    const product_originalprice = json.components.track.melidata_event.event_data.original_price
    const product_description = json.schema[0].description
    const product_review1 = json.schema[0].review[0].reviewBody
    const product_review2 = json.schema[0].review[1].reviewBody
    const product_review3 = json.schema[0].review[2].reviewBody

    const product = {
        id: product_id,
        title: product_title,
        image: product_image,
        url: product_url,
        rate: product_rate,
        rateCount: product_rateCount,
        original_price: product_originalprice,
        price: product_price,
        description: product_description,
        review1: product_review1,
        review2: product_review2,
        review3: product_review3
    }
    products.push(product)
  const formatted = JSON.stringify(products, null, 2);

  fs.writeFileSync(path, formatted, "utf-8");

  console.log("PRODUTO CADASTRADO COM SUCESSO!!!");
}


grampearURL("https://www.mercadolivre.com.br/placa-de-video-revenger-nvidia-gt-210-1gb-ddr3-hdmi-dvi-vga/p/MLB26912068#polycard_client=search-desktop&search_layout=grid&position=7&type=product&tracking_id=3ce78a33-11ab-4e53-b3e9-0eb593308e8d&wid=MLB5290780014&sid=search")