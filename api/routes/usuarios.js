import express from 'express';
import {
  createUsuario,
  loginUsuario,
  getUsuarioMe,
} from '../controllers/userController.js';
import { requireAuth, requireBootstrapAdmin } from '../middlewares/auth.js';

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
router.get('/me', requireAuth, getUsuarioMe);

/**
 * @route POST /api/usuarios
 * @description Cria o usuário admin inicial (bootstrap único)
 * @body {object} body - Dados do usuário
 * @body {string} name - Name do usuário (obrigatório)
 * @body {string} email - Email do usuário (obrigatório)
 * @body {string} password - Senha do usuário (obrigatório)
 * @body {boolean} is_active - Status ativo (padrão: true)
 */
router.post('/', requireBootstrapAdmin, createUsuario);

export default router;
