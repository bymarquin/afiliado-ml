import express from 'express';
import {
  listProdutos,
  getProduto,
  getProdutoByMlbId,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutosDestaque,
  getProdutosRandom,
} from '../controllers/produtoController.js';

const router = express.Router();

/**
 * @route GET /api/produtos
 * @description Lista todos os produtos com paginação e filtros
 * @query {number} page - Número da página (padrão: 1)
 * @query {number} limit - Quantidade por página (padrão: 20)
 * @query {string} status - Filtra por status (ativo, inativo, sem_estoque)
 * @query {boolean} destaque - Filtra por destaque
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

/**
 * @route GET /api/produtos/random
 * @description Lista produtos aleatórios
 * @query {number} limit - Quantidade de produtos (padrão: 10)
 * @query {string} status - Filtra por status (padrão: ativo)
 */
router.get('/random', getProdutosRandom);

/**
 * @route GET /api/produtos/mlb/:mlb_id
 * @description Obtém um produto pelo ID do Mercado Livre
 * @param {string} mlb_id - ID do produto no Mercado Livre
 */
router.get('/mlb/:mlb_id', getProdutoByMlbId);

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
 * @body {string} mlb_id - ID do produto no Mercado Livre (obrigatório)
 * @body {string} titulo - Título do produto (obrigatório)
 * @body {string} descricao - Descrição do produto
 * @body {number} preco - Preço do produto (obrigatório)
 * @body {number} preco_original - Preço original (antes do desconto)
 * @body {string} imagem_url - URL da imagem do produto
 * @body {string} url_produto - URL do produto (obrigatório)
 * @body {string} url_afiliado - URL de afiliado
 * @body {number} avaliacao - Avaliação média (0-5)
 * @body {number} avaliacao_qtd - Quantidade de avaliações
 * @body {string} status - Status do produto (ativo, inativo, sem_estoque)
 * @body {boolean} destaque - Destaque na homepage
 * @body {number[]} categoria_ids - Array de IDs de categorias
 */
router.post('/', createProduto);

/**
 * @route PUT /api/produtos/:id
 * @description Atualiza um produto existente
 * @param {number} id - ID do produto
 * @body {object} body - Dados para atualização
 */
router.put('/:id', updateProduto);

/**
 * @route DELETE /api/produtos/:id
 * @description Remove um produto
 * @param {number} id - ID do produto
 */
router.delete('/:id', deleteProduto);

export default router;
