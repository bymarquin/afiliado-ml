import express from "express";
import { scrapeProductController } from "../controllers/scrapingController.js";
import {
  getMeliAuthStatusController,
  startMeliAuthController,
} from "../controllers/meliAuthController.js";
import { requireAuth } from "../middlewares/auth.js";

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
router.get("/auth/status", requireAuth, getMeliAuthStatusController);
router.post("/auth/start", requireAuth, startMeliAuthController);

export default router;
