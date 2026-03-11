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
 * Controller para atualização de preços
 */

/**
 * POST /api/precos/atualizar
 * Aciona manualmente a atualização de preços
 */
export async function atualizarPrecos(req, res) {
  try {
    const { produto_id } = req.body || {};

    // Se especificou um produto, atualiza apenas ele
    if (produto_id) {
      const produto = await Produto.findByPk(produto_id);
      
      if (!produto) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        });
      }

      console.log(`[Controller] Atualizando produto ${produto.mlb_id}...`);
      
      const scrapeResult = await scrapeProduct(produto.url_produto);
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

      const precoAntigo = produto.preco;
      const precoNovo = scrapedProduto.price;

      await produto.update({
        preco: precoNovo,
        preco_original: scrapedProduto.original_price || produto.preco_original,
      });

      const mudou = precoAntigo !== precoNovo;

      return res.json({
        success: true,
        message: mudou ? 'Preço atualizado' : 'Preço inalterado',
        data: {
          produto: produto.mlb_id,
          preco_anterior: precoAntigo,
          preco_atual: precoNovo,
          mudou,
        },
      });
    }

    // Se não, aciona o serviço de atualização completa
    console.log('[Controller] Acionando atualização completa de preços...');
    
    // Executa uma vez imediatamente
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
 * GET /api/precos/status
 * Retorna o status do serviço de atualização automática
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
