import { scrapeProduct as scrapeProductService } from '../services/scraping.js';
import { Produto } from '../models/index.js';

const ALLOWED_STATUS = ['active', 'inactive', 'out_of_stock'];

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

function parseNullableNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
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

    const title = req.body.title ?? req.body.titulo ?? produto.title;
    const description = req.body.description ?? req.body.descricao ?? produto.description ?? null;
    const price = parseNullableNumber(req.body.price ?? req.body.preco ?? produto.price);
    const originalPrice = parseNullableNumber(
      req.body.original_price ?? req.body.preco_original ?? produto.original_price
    );
    const imageUrl = req.body.image_url ?? req.body.imagem_url ?? produto.image ?? null;
    const productUrl = req.body.product_url ?? req.body.url_produto ?? produto.url ?? url;
    const finalAffiliateUrl = affiliateUrl || url;
    const rating = parseNullableNumber(req.body.rating ?? req.body.avaliacao ?? produto.rate);
    const ratingCount = parseNullableNumber(
      req.body.rating_count ?? req.body.avaliacao_qtd ?? produto.rateCount
    );
    const status = req.body.status ?? 'active';
    const featured = parseBoolean(req.body.featured ?? req.body.destaque, false);

    if (!title || price === null || !productUrl) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: 'title, price e product_url são obrigatórios',
      });
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    const novoProduto = await Produto.create({
      meli_id: meliId,
      title,
      description,
      price,
      original_price: originalPrice,
      image_url: imageUrl,
      product_url: productUrl,
      affiliate_url: finalAffiliateUrl,
      rating,
      rating_count: ratingCount,
      status,
      featured,
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
