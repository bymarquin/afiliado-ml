import express from "express";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import routes from "./routes/index.js";

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

app.listen(PORT, () => {
  console.log(`API On! Servidor rodando em http://localhost:${PORT}`);
});
