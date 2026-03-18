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
 * @route POST /api/produtos/scraping
 * @description Faz scraping de um produto do Mercado Livre e cria no banco
 */
export async function scrapeAndCreateProduto(req, res) {
  try {
    const { url } = req.body;
    const affiliateUrl = req.body.affiliate_url ?? req.body.url_afiliado;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL é necessária',
        message: 'Por favor, forneça a URL do produto como parâmetro "url"',
      });
    }

    if (!isValidUrl(url) || !isMercadoLivreUrl(url)) {
      return res.status(400).json({
        success: false,
        error: 'URL inválida',
        message: 'A URL deve ser válida e pertencer ao Mercado Livre',
      });
    }

    const meliId = extractMlbId(url);
    if (!meliId) {
      return res.status(400).json({
        success: false,
        error: 'URL inválida',
        message: 'Não foi possível extrair o ID do produto da URL',
      });
    }

    const existingProduto = await Produto.findOne({ where: { meli_id: meliId } });
    if (existingProduto) {
      return res.status(409).json({
        success: false,
        error: 'Produto já cadastrado',
        message: 'Este produto já existe no sistema',
        data: existingProduto,
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

    const produto = parsedData[0];

    if (!produto || !produto.title || produto.price === undefined || produto.price === null || !produto.url) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao fazer scraping',
        message: 'Não foi possível obter os dados do produto',
      });
    }

    const novoProduto = await Produto.create({
      meli_id: meliId,
      title: produto.title,
      description: produto.description || null,
      price: produto.price,
      original_price: produto.original_price || null,
      image_url: produto.image || null,
      product_url: produto.url,
      affiliate_url: affiliateUrl || url,
      rating: produto.rate || null,
      rating_count: produto.rateCount || null,
      status: 'active',
      featured: false,
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
 * @route GET /api/produtos/scraping
 * @description Apenas faz o scraping e retorna os dados (sem salvar)
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

function extractMlbId(url) {
  const match = url.match(/MLB[\w\d]+/);
  return match ? match[0] : null;
}
