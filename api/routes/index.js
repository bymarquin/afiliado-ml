import express from "express";
import scrapingRoutes from "./scraping.js";
import produtosRoutes from "./produtos.js";
import produtosScrapingRoutes from "./produtos-scraping.js";
import categoriasRoutes from "./categorias.js";
import usuariosRoutes from "./usuarios.js";
import precosRoutes from "./precos.js";

const router = express.Router();

// Registra todas as rotas da API
// IMPORTANTE: Rotas específicas devem vir antes das rotas com parâmetros (:id)
router.use("/scrape", scrapingRoutes);
router.use("/produtos", produtosScrapingRoutes); // vem antes de produtosRoutes
router.use("/produtos", produtosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/precos", precosRoutes);

export default router;
