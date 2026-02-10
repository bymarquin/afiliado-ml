import express from "express";
import { scrapeProductController } from "../controllers/scrapingController.js";

const router = express.Router();

/**
 * GET /api/scrape
 * Realiza o scraping de um produto
 * Query params:
 *   - url (required): URL do produto a fazer scraping
 *
 * Exemplo:
 *   GET /api/scrape?url=https://www.mercadolivre.com.br/...
 *   ?url={link do mercado livre}
 */
router.get("/scrape", scrapeProductController);

export default router;
