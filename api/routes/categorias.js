import express from 'express';
import {
  listCategorias,
  getCategoria,
  getCategoriaBySlug,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriasArvore,
} from '../controllers/categoriaController.js';

const router = express.Router();

/**
 * @route GET /api/categorias
 * @description Lista todas as categorias
 * @query {boolean} ativo - Filtra por status ativo (padrão: true)
 * @query {number|null} pai - Filtra por categoria pai (null para categorias raiz)
 */
router.get('/', listCategorias);

/**
 * @route GET /api/categorias/arvore
 * @description Retorna a árvore de categorias (categorias raiz com subcategorias)
 */
router.get('/arvore', getCategoriasArvore);

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
 * @body {string} nome - Nome da categoria (obrigatório)
 * @body {string} slug - Slug da categoria (obrigatório)
 * @body {number} categoria_pai_id - ID da categoria pai (opcional)
 * @body {boolean} ativo - Status ativo (padrão: true)
 */
router.post('/', createCategoria);

/**
 * @route PUT /api/categorias/:id
 * @description Atualiza uma categoria existente
 * @param {number} id - ID da categoria
 * @body {object} body - Dados para atualização
 */
router.put('/:id', updateCategoria);

/**
 * @route DELETE /api/categorias/:id
 * @description Remove uma categoria
 * @param {number} id - ID da categoria
 */
router.delete('/:id', deleteCategoria);

export default router;
