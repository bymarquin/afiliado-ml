import express from "express";
import { scrapeProductController } from "../controllers/scrapingController.js";

const router = express.Router();

/**
 * @route GET /api/scrape
 * @description Realiza o scraping de um produto
 * Query params:
 *   - url (required): URL do produto a fazer scraping
 *
 * Exemplo:
 *   GET /api/scrape?url=https://www.mercadolivre.com.br/...
 *   ?url={link do mercado livre}
 */
router.get("/", scrapeProductController);

export default router;
