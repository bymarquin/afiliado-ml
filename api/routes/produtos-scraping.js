import express from 'express';
import {
  scrapeAndCreateProduto,
  scrapeProduto,
} from '../controllers/produtoScrapingController.js';

const router = express.Router();

/**
 * @route POST /api/produtos/scraping
 * @description Faz scraping de um produto do Mercado Livre e cria no banco
 * @body {object} body - Dados para scraping
 * @body {string} url - URL do produto no Mercado Livre (obrigatório)
 * @body {string} url_afiliado - URL de afiliado (opcional, usa a própria URL se não fornecido)
 * @returns {object} produto - Produto criado com dados do scraping
 */
router.post('/scraping', scrapeAndCreateProduto);

/**
 * @route GET /api/produtos/scraping?url=...
 * @description Apenas faz o scraping e retorna os dados (sem salvar)
 * @query {string} url - URL do produto no Mercado Livre
 */
router.get('/scraping', scrapeProduto);

export default router;
