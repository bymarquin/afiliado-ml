import { scrapeProduct } from './api/services/scraping.js';

const url = "https://www.mercadolivre.com.br/capacete-para-moto-integral-asx-city-preto-fosco-tamanho-58-m/p/MLB29577528?pdp_filters=item_id%3AMLB3929244983&matt_event_ts=1773838648362&matt_d2id=25b29e78-9073-4ec1-a012-ad893db2498a&matt_tracing_id=e6192155-b8ba-438d-9419-d2fb046d370f#reco_backend=item_decorator&wid=MLB3929244983&reco_client=home_affiliate-profile&reco_item_pos=0&source=affiliate-profile&reco_backend_type=function&reco_id=f2b51331-8368-4753-a767-5ab65c9a8a76&tracking_id=ad24f31c-3a19-46cb-9999-abaee2af1db8&sid=recos&c_id=/home/card-featured/element&c_uid=4e918383-8639-4307-b1df-f181f0b7f3a1";

console.log("Iniciando teste de scraping...");

scrapeProduct(url)
  .then(result => {
    console.log("Resultado do Scraping:");
    console.log(result);
  })
  .catch(error => {
    console.error("Erro no teste:", error.message);
  });
