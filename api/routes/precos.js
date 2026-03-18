import express from 'express';
import { atualizarPrecos, statusPrecos } from '../controllers/priceController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route POST /api/precos/atualizar
 * @description Aciona manualmente a atualização de preços
 * @body {object} body - Dados opcionais
 * @body {number} product_id - ID do produto para atualizar (opcional, atualiza todos se não informado)
 */
router.post('/atualizar', requireAuth, requireAdmin, atualizarPrecos);
router.post('/update', requireAuth, requireAdmin, atualizarPrecos);

/**
 * @route GET /api/precos/status
 * @description Retorna o status do serviço de atualização automática
 * @returns {object} status - Status do serviço
 */
router.get('/status', statusPrecos);

export default router;
