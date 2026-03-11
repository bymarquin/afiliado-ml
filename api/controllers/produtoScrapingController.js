import { scrapeProduct as scrapeProductService } from '../services/scraping.js';
import { Produto } from '../models/index.js';

function parseScrapingResult(scrapeResult) {
  if (typeof scrapeResult !== 'string') {
    return scrapeResult;
  }

  try {
    return JSON.parse(scrapeResult);
  } catch {
    return null;
  }
}

/**
 * Controller para gerenciar scraping e criação de produtos
 */

/**
 * POST /api/produtos/scraping
 * Faz scraping de um produto do Mercado Livre e cria no banco
 * @param {Object} req - Objeto da requisição Express
 * @param {Object} res - Objeto da resposta Express
 */
export async function scrapeAndCreateProduto(req, res) {
  try {
    const { url, url_afiliado } = req.body;

    // Valida se a URL foi fornecida
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL é necessária',
        message: 'Por favor, forneça a URL do produto como parâmetro "url"',
      });
    }

    // Valida o formato da URL
    if (!isValidUrl(url) || !isMercadoLivreUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'URL inválida',
        message: 'A URL deve ser válida e pertencer ao Mercado Livre',
      });
    }

    // Extrai o ID do produto da URL
    const mlb_id = extractMlbId(url);
    if (!mlb_id) {
      return res.status(400).json({
        success: false,
        error: 'URL inválida',
        message: 'Não foi possível extrair o ID do produto da URL',
      });
    }

    // Verifica se o produto já existe
    const existingProduto = await Produto.findOne({ where: { mlb_id } });
    if (existingProduto) {
      return res.status(409).json({
        success: false,
        error: 'Produto já cadastrado',
        message: 'Este produto já existe no sistema',
        data: existingProduto,
      });
    }

    // Faz o scraping do produto
    const productData = await scrapeProductService(url);
    const parsedData = parseScrapingResult(productData);

    if (!Array.isArray(parsedData)) {
      return res.status(502).json({
        success: false,
        error: 'Erro ao processar dados de scraping',
      });
    }

    const produto = parsedData[0];

    if (!produto || !produto.title || produto.price === undefined || produto.price === null || !produto.url) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao fazer scraping',
        message: 'Não foi possível obter os dados do produto',
      });
    }

    // Cria o produto no banco
    const novoProduto = await Produto.create({
      mlb_id: mlb_id,
      titulo: produto.title,
      descricao: produto.description || null,
      preco: produto.price,
      preco_original: produto.original_price || null,
      imagem_url: produto.image || null,
      url_produto: produto.url,
      url_afiliado: url_afiliado || url,
      avaliacao: produto.rate || null,
      avaliacao_qtd: produto.rateCount || null,
      status: 'ativo',
      destaque: false,
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: novoProduto,
    });
  } catch (error) {
    console.error('Erro ao fazer scraping e criar produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar produto',
    });
  }
}

/**
 * GET /api/produtos/scraping?url=...
 * Apenas faz o scraping e retorna os dados (sem salvar)
 */
export async function scrapeProduto(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL é necessária',
        message: 'Por favor, forneça uma URL válida como parâmetro "url"',
      });
    }

    if (!isValidUrl(url) || !isMercadoLivreUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'URL inválida',
        message: 'A URL deve ser válida e pertencer ao Mercado Livre',
      });
    }

    const productData = await scrapeProductService(url);
    const parsedData = parseScrapingResult(productData);

    if (!Array.isArray(parsedData)) {
      return res.status(502).json({
        success: false,
        error: 'Erro ao processar dados de scraping',
      });
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('Erro no scraping:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer scraping',
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

function isMercadoLivreUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return /mercadolivre\.com(\.br)?$/.test(parsedUrl.hostname);
  } catch {
    return false;
  }
}

/**
 * Extrai o ID do produto (MLB...) da URL
 * @param {string} url - URL do produto
 * @returns {string|null} ID do produto ou null
 */
function extractMlbId(url) {
  const match = url.match(/MLB[\w\d]+/);
  return match ? match[0] : null;
}
