import express from 'express';
import {
  listProdutos,
  getProduto,
  getProdutoClicks,
  goToProduto,
  getProdutoByMlbId,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutosDestaque,
  getProdutosRandom,
} from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route GET /api/produtos
 * @description Lista todos os produtos com paginação e filtros
 * @query {number} page - Número da página (padrão: 1)
 * @query {number} limit - Quantidade por página (padrão: 20)
 * @query {string} status - Filtra por status (active, inactive, out_of_stock)
 * @query {boolean} featured - Filtra por destaque
 * @query {string} categoria - Filtra por slug da categoria
 * @query {string} search - Busca no título do produto
 * @query {string} order - Campo para ordenação (padrão: created_at)
 * @query {string} direction - Direção da ordenação (ASC, DESC)
 */
router.get('/', listProdutos);

/**
 * @route GET /api/produtos/destaque
 * @description Lista produtos em destaque
 * @query {number} limit - Quantidade de produtos (padrão: 10)
 */
router.get('/destaque', getProdutosDestaque);
router.get('/featured', getProdutosDestaque);

/**
 * @route GET /api/produtos/random
 * @description Lista produtos aleatórios
 * @query {number} limit - Quantidade de produtos (padrão: 10)
 * @query {string} status - Filtra por status (padrão: active)
 */
router.get('/random', getProdutosRandom);

/**
 * @route GET /api/produtos/mlb/:meli_id
 * @description Obtém um produto pelo ID do Mercado Livre
 * @param {string} meli_id - ID do produto no Mercado Livre
 */
router.get('/mlb/:meli_id', getProdutoByMlbId);
router.get('/meli/:meli_id', getProdutoByMlbId);

/**
 * @route GET /api/produtos/:id/clicks
 * @description Retorna quantidade de cliques do produto
 * @param {number} id - ID do produto
 */
router.get('/:id/clicks', getProdutoClicks);

/**
 * @route GET /api/produtos/:id/go
 * @description Registra clique e redireciona para o Mercado Livre
 * @param {number} id - ID do produto
 */
router.get('/:id/go', goToProduto);

/**
 * @route GET /api/produtos/:id
 * @description Obtém um produto específico pelo ID
 * @param {number} id - ID do produto
 */
router.get('/:id', getProduto);

/**
 * @route POST /api/produtos
 * @description Cria um novo produto
 * @body {object} body - Dados do produto
 * @body {string} meli_id - ID do produto no Mercado Livre (obrigatório)
 * @body {string} title - Título do produto (obrigatório)
 * @body {string} description - Descrição do produto
 * @body {number} price - Preço do produto (obrigatório)
 * @body {number} original_price - Preço original (antes do desconto)
 * @body {string} image_url - URL da imagem do produto
 * @body {string} product_url - URL do produto (obrigatório)
 * @body {string} affiliate_url - URL de afiliado
 * @body {number} rating - Avaliação média (0-5)
 * @body {number} rating_count - Quantidade de avaliações
 * @body {string} status - Status do produto (active, inactive, out_of_stock)
 * @body {boolean} featured - Destaque na homepage
 * @body {number[]} category_ids - Array de IDs de categorias
 */
router.post('/', requireAuth, requireAdmin, createProduto);

/**
 * @route PUT /api/produtos/:id
 * @description Atualiza um produto existente
 * @param {number} id - ID do produto
 * @body {object} body - Dados para atualização
 */
router.put('/:id', requireAuth, requireAdmin, updateProduto);

/**
 * @route DELETE /api/produtos/:id
 * @description Remove um produto
 * @param {number} id - ID do produto
 */
router.delete('/:id', requireAuth, requireAdmin, deleteProduto);

export default router;
