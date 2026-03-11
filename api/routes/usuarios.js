import express from 'express';
import {
  listUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  getUsuarioMe,
} from '../controllers/usuarioController.js';

const router = express.Router();

/**
 * @route POST /api/usuarios/login
 * @description Realiza login do usuário
 * @body {object} body - Credenciais de login
 * @body {string} email - Email do usuário (obrigatório)
 * @body {string} senha - Senha do usuário (obrigatório)
 * @returns {object} token - Token JWT de autenticação
 */
router.post('/login', loginUsuario);

/**
 * @route GET /api/usuarios/me
 * @description Obtém dados do usuário autenticado
 * @header {string} Authorization - Token JWT (Bearer <token>)
 */
router.get('/me', getUsuarioMe);

/**
 * @route GET /api/usuarios
 * @description Lista todos os usuários com paginação
 * @query {number} page - Número da página (padrão: 1)
 * @query {number} limit - Quantidade por página (padrão: 20)
 * @query {boolean} ativo - Filtra por status ativo
 * @query {string} search - Busca por nome ou email
 * @query {string} order - Campo para ordenação (padrão: created_at)
 * @query {string} direction - Direção da ordenação (ASC, DESC)
 */
router.get('/', listUsuarios);

/**
 * @route GET /api/usuarios/:id
 * @description Obtém um usuário específico pelo ID
 * @param {number} id - ID do usuário
 */
router.get('/:id', getUsuario);

/**
 * @route POST /api/usuarios
 * @description Cria um novo usuário
 * @body {object} body - Dados do usuário
 * @body {string} nome - Nome do usuário (obrigatório)
 * @body {string} email - Email do usuário (obrigatório)
 * @body {string} senha - Senha do usuário (obrigatório)
 * @body {boolean} ativo - Status ativo (padrão: true)
 */
router.post('/', createUsuario);

/**
 * @route PUT /api/usuarios/:id
 * @description Atualiza um usuário existente
 * @param {number} id - ID do usuário
 * @body {object} body - Dados para atualização
 */
router.put('/:id', updateUsuario);

/**
 * @route DELETE /api/usuarios/:id
 * @description Remove um usuário (soft delete - desativa)
 * @param {number} id - ID do usuário
 */
router.delete('/:id', deleteUsuario);

export default router;
