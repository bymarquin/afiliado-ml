import express from "express";
import scrapingRoutes from "./scraping.js";

const router = express.Router();

// Registra as rotas de scraping diretamente em /api
router.use("/", scrapingRoutes);

export default router;
