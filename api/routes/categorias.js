import express from 'express';
import {
  listCategorias,
  getCategoria,
  getCategoriaBySlug,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasArvore,
} from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route GET /api/categorias
 * @description Lista todas as categorias
 * @query {boolean} is_active - Filtra por status ativo (padrão: true)
 * @query {number|null} parent_category_id - Filtra por categoria pai (null para categorias raiz)
 */
router.get('/', listCategorias);

/**
 * @route GET /api/categorias/arvore
 * @description Retorna a árvore de categorias (categorias raiz com subcategorias)
 */
router.get('/arvore', getCategoriasArvore);
router.get('/tree', getCategoriasArvore);

/**
 * @route GET /api/categorias/slug/:slug
 * @description Obtém uma categoria pelo slug
 * @param {string} slug - Slug da categoria
 */
router.get('/slug/:slug', getCategoriaBySlug);

/**
 * @route GET /api/categorias/:id
 * @description Obtém uma categoria específica pelo ID
 * @param {number} id - ID da categoria
 */
router.get('/:id', getCategoria);

/**
 * @route POST /api/categorias
 * @description Cria uma nova categoria
 * @body {object} body - Dados da categoria
 * @body {string} name - Name da categoria (obrigatório)
 * @body {string} slug - Slug da categoria (opcional, API gera automaticamente quando ausente)
 * @body {number} parent_category_id - ID da categoria pai (opcional)
 * @body {boolean} is_active - Status ativo (padrão: true)
 */
router.post('/', requireAuth, createCategoria);

/**
 * @route PUT /api/categorias/:id
 * @description Atualiza uma categoria existente
 * @param {number} id - ID da categoria
 * @body {object} body - Dados para atualização
 */
router.put('/:id', requireAuth, updateCategoria);

/**
 * @route DELETE /api/categorias/:id
 * @description Remove uma categoria
 * @param {number} id - ID da categoria
 */
router.delete('/:id', requireAuth, deleteCategoria);

export default router;
