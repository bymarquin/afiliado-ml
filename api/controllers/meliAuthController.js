import { getMeliAuthStatus, startMeliAuth } from "../services/meliAuthSession.js";

export function getMeliAuthStatusController(req, res) {
  res.json({
    success: true,
    data: getMeliAuthStatus(),
  });
}

export function startMeliAuthController(req, res) {
  const status = startMeliAuth();

  res.status(202).json({
    success: true,
    message: "Janela de autenticação do Mercado Livre aberta. Faça login e tente o scraping novamente.",
    data: status,
  });
}
