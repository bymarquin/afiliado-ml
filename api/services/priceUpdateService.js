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

  /**
   * Inicia o serviço de atualização automática
   * @param {number} intervalMs - Intervalo em milissegundos
   */
  start(intervalMs) {
    if (this.interval) {
      console.log('[PriceUpdate] Serviço já está rodando');
      return;
    }

    console.log(`[PriceUpdate] Iniciando serviço com intervalo de ${this._formatInterval(intervalMs)}`);
    
    // Executa imediatamente na primeira vez
    this.run();
    
    // Agenda execuções periódicas
    this.interval = setInterval(() => {
      this.run();
    }, intervalMs);
  }

  /**
   * Para o serviço de atualização
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('[PriceUpdate] Serviço parado');
    }
  }

  /**
   * Executa uma verificação de preços
   */
  async run() {
    if (this.isRunning) {
      console.log('[PriceUpdate] Execução anterior ainda em andamento, pulando...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log('[PriceUpdate] Iniciando verificação de preços...');

      // Busca todos os produtos ativos
      const produtos = await Produto.findAll({
        where: { status: 'ativo' },
      });

      console.log(`[PriceUpdate] ${produtos.length} produtos para verificar`);

      let updatesCount = 0;

      for (const produto of produtos) {
        try {
          await this._checkAndUpdateProduto(produto);
        } catch (error) {
          console.error(`[PriceUpdate] Erro ao verificar ${produto.mlb_id}: ${error.message}`);
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

  /**
   * Verifica e atualiza um produto específico
   * @param {Produto} produto - Produto do banco
   */
  async _checkAndUpdateProduto(produto) {
    try {
      // Faz scraping do produto
      const scrapeResult = await scrapeProduct(produto.url_produto);
      const scrapedData = typeof scrapeResult === 'string' 
        ? JSON.parse(scrapeResult) 
        : scrapeResult;
      
      const scrapedProduto = scrapedData[0];

      if (!scrapedProduto) {
        console.log(`[PriceUpdate] ${produto.mlb_id}: Dados não encontrados`);
        return;
      }

      // Compara preços
      const precoAtual = parseFloat(produto.preco);
      const precoScraped = parseFloat(scrapedProduto.price);
      const precoOriginalScraped = scrapedProduto.original_price 
        ? parseFloat(scrapedProduto.original_price) 
        : null;

      let changed = false;
      const changes = [];

      // Verifica mudança de preço
      if (precoScraped && precoAtual !== precoScraped) {
        changes.push(`preço: R$ ${precoAtual} → R$ ${precoScraped}`);
        changed = true;
      }

      // Verifica mudança de preço original
      const precoOriginalAtual = produto.preco_original 
        ? parseFloat(produto.preco_original) 
        : null;
      
      if (precoOriginalScraped && precoOriginalAtual !== precoOriginalScraped) {
        changes.push(`preço original: R$ ${precoOriginalAtual || 0} → R$ ${precoOriginalScraped}`);
        changed = true;
      }

      // Atualiza se houve mudança
      if (changed) {
        await produto.update({
          preco: precoScraped || precoAtual,
          preco_original: precoOriginalScraped || produto.preco_original,
        });

        this.stats.totalUpdates++;
        this.stats.lastUpdate = new Date();

        console.log(`[PriceUpdate] ✅ ${produto.mlb_id}: ${changes.join(', ')}`);
      } else {
        console.log(`[PriceUpdate] ✓ ${produto.mlb_id}: Sem alterações`);
      }

    } catch (error) {
      console.error(`[PriceUpdate] ❌ ${produto.mlb_id}: ${error.message}`);
    }
  }

  /**
   * Formata intervalo em texto legível
   * @param {number} ms - Milissegundos
   * @returns {string}
   */
  _formatInterval(ms) {
    const hours = ms / (1000 * 60 * 60);
    if (hours >= 1) {
      return `${hours}h`;
    }
    const minutes = ms / (1000 * 60);
    return `${minutes}min`;
  }

  /**
   * Retorna status do serviço
   * @returns {Object}
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      isActive: !!this.interval,
      lastRun: this.lastRun,
      stats: this.stats,
    };
  }
}

// Instância singleton do serviço
export const priceUpdateService = new PriceUpdateService();

// Exporta também a classe para testes
export { PriceUpdateService };
