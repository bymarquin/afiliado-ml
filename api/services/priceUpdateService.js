import { Produto } from '../models/index.js';
import { scrapeProduct } from './scraping.js';

/**
 * Serviço de atualização automática de preços
 * Verifica periodicamente os produtos e atualiza preços quando mudam
 */

class PriceUpdateService {
  constructor() {
    this.interval = null;
    this.isRunning = false;
    this.lastRun = null;
    this.stats = {
      totalChecks: 0,
      totalUpdates: 0,
      lastUpdate: null,
    };
  }

  start(intervalMs) {
    if (this.interval) {
      console.log('[PriceUpdate] Serviço já está rodando');
      return;
    }

    console.log(`[PriceUpdate] Iniciando serviço com intervalo de ${this._formatInterval(intervalMs)}`);

    this.run();

    this.interval = setInterval(() => {
      this.run();
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('[PriceUpdate] Serviço parado');
    }
  }

  async run() {
    if (this.isRunning) {
      console.log('[PriceUpdate] Execução anterior ainda em andamento, pulando...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log('[PriceUpdate] Iniciando verificação de preços...');

      const produtos = await Produto.findAll({
        where: { status: 'active' },
      });

      console.log(`[PriceUpdate] ${produtos.length} produtos para verificar`);

      let updatesCount = 0;

      for (const produto of produtos) {
        try {
          const updated = await this._checkAndUpdateProduto(produto);
          if (updated) {
            updatesCount += 1;
          }
        } catch (error) {
          console.error(`[PriceUpdate] Erro ao verificar ${produto.meli_id}: ${error.message}`);
        }
      }

      this.stats.totalChecks++;
      this.lastRun = new Date();

      const duration = Date.now() - startTime;
      console.log(`[PriceUpdate] Verificação concluída em ${duration}ms | ${updatesCount} atualizações`);
    } catch (error) {
      console.error('[PriceUpdate] Erro na execução:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  async _checkAndUpdateProduto(produto) {
    try {
      const scrapeResult = await scrapeProduct(produto.product_url);
      const scrapedData = typeof scrapeResult === 'string' ? JSON.parse(scrapeResult) : scrapeResult;

      const scrapedProduto = scrapedData[0];

      if (!scrapedProduto) {
        console.log(`[PriceUpdate] ${produto.meli_id}: Dados não encontrados`);
        return false;
      }

      const currentPrice = parseFloat(produto.price);
      const scrapedPrice = parseFloat(scrapedProduto.price);
      const scrapedOriginalPrice = scrapedProduto.original_price
        ? parseFloat(scrapedProduto.original_price)
        : null;

      let changed = false;
      const changes = [];

      if (scrapedPrice && currentPrice !== scrapedPrice) {
        changes.push(`preço: R$ ${currentPrice} → R$ ${scrapedPrice}`);
        changed = true;
      }

      const currentOriginalPrice = produto.original_price ? parseFloat(produto.original_price) : null;

      if (scrapedOriginalPrice && currentOriginalPrice !== scrapedOriginalPrice) {
        changes.push(`preço original: R$ ${currentOriginalPrice || 0} → R$ ${scrapedOriginalPrice}`);
        changed = true;
      }

      if (changed) {
        await produto.update({
          price: scrapedPrice || currentPrice,
          original_price: scrapedOriginalPrice || produto.original_price,
        });

        this.stats.totalUpdates++;
        this.stats.lastUpdate = new Date();

        console.log(`[PriceUpdate] ✅ ${produto.meli_id}: ${changes.join(', ')}`);
        return true;
      }

      console.log(`[PriceUpdate] ✓ ${produto.meli_id}: Sem alterações`);
      return false;
    } catch (error) {
      console.error(`[PriceUpdate] ❌ ${produto.meli_id}: ${error.message}`);
      return false;
    }
  }

  _formatInterval(ms) {
    const hours = ms / (1000 * 60 * 60);
    if (hours >= 1) {
      return `${hours}h`;
    }
    const minutes = ms / (1000 * 60);
    return `${minutes}min`;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      isActive: !!this.interval,
      lastRun: this.lastRun,
      stats: this.stats,
    };
  }
}

export const priceUpdateService = new PriceUpdateService();
export { PriceUpdateService };
