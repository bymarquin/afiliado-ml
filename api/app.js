import express from "express";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import routes from "./routes/index.js";
import { priceUpdateService } from "./services/priceUpdateService.js";

configDotenv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", routes);

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API está funcionando" });
});

const PORT = process.env.PORT || "3000";

// Intervalo de atualização de preços (padrão: 6 horas)
const PRICE_UPDATE_INTERVAL = parseInt(process.env.PRICE_UPDATE_INTERVAL) || 21600000;

app.listen(PORT, () => {
  console.log(`API On! Servidor rodando em http://localhost:${PORT}`);
  
  // Inicia o serviço de atualização automática de preços
  priceUpdateService.start(PRICE_UPDATE_INTERVAL);
});
