import { scrapeProduct as scrapeProductService } from "../services/scraping.js";

/**
 * Controller para gerenciar requisições de scraping
 */

/**
 * Realiza o scraping de um produto e retorna os dados
 * @param {Object} req - Objeto da requisição Express
 * @param {Object} res - Objeto da resposta Express
 */
export async function scrapeProductController(req, res) {
  const { url } = req.query;

  // Valida se a URL foi fornecida
  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL é necessária",
      message: "Por favor, forneça uma URL válida como parâmetro 'url'",
    });
  }

  // Valida o formato da URL
  if (!isValidUrl(url)) {
    return res.status(400).json({
      success: false,
      error: "URL inválida",
      message: "A URL fornecida não é válida",
    });
  }

  try {
    const productData = await scrapeProductService(url);
    const parsedData =
      typeof productData === "string" ? JSON.parse(productData) : productData;
    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("Erro no controller de scraping:", error.message);
    res.status(500).json({
      success: false,
      error: "Erro ao acessar o link",
      message: error.message,
    });
  }
}

/**
 * Valida se uma string é uma URL válida
 * @param {string} url - URL a validar
 * @returns {boolean} True se válida, false caso contrário
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
