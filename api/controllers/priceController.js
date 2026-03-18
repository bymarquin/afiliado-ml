import { priceUpdateService } from '../services/priceUpdateService.js';
import { scrapeProduct } from '../services/scraping.js';
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
 * @route POST /api/precos/atualizar
 * @description Aciona manualmente a atualização de preços
 */
export async function atualizarPrecos(req, res) {
  try {
    const productId = req.body?.product_id ?? req.body?.produto_id;

    if (productId) {
      const produto = await Produto.findByPk(productId);

      if (!produto) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        });
      }

      console.log(`[Controller] Atualizando produto ${produto.meli_id}...`);

      const scrapeResult = await scrapeProduct(produto.product_url);
      const scrapedData = parseScrapingResult(scrapeResult);

      if (!Array.isArray(scrapedData)) {
        return res.status(502).json({
          success: false,
          error: 'Erro ao processar dados de scraping',
        });
      }

      const scrapedProduto = scrapedData[0];

      if (!scrapedProduto || scrapedProduto.price === undefined || scrapedProduto.price === null) {
        return res.status(400).json({
          success: false,
          error: 'Erro ao fazer scraping',
        });
      }

      const oldPrice = produto.price;
      const newPrice = scrapedProduto.price;

      await produto.update({
        price: newPrice,
        original_price: scrapedProduto.original_price || produto.original_price,
      });

      const changed = oldPrice !== newPrice;

      return res.json({
        success: true,
        message: changed ? 'Preço atualizado' : 'Preço inalterado',
        data: {
          product: produto.meli_id,
          previous_price: oldPrice,
          current_price: newPrice,
          changed,
        },
      });
    }

    console.log('[Controller] Acionando atualização completa de preços...');

    await priceUpdateService.run();

    res.json({
      success: true,
      message: 'Atualização de preços concluída',
      stats: priceUpdateService.stats,
    });
  } catch (error) {
    console.error('[Controller] Erro ao atualizar preços:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar preços',
    });
  }
}

/**
 * @route GET /api/precos/status
 * @description Retorna o status do serviço de atualização automática
 */
export async function statusPrecos(req, res) {
  try {
    const status = priceUpdateService.getStatus();

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('[Controller] Erro ao buscar status:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar status',
    });
  }
}
