import express from 'express';
import { getClicksByDay } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route GET /api/dashboard/clicks
 * @description Retorna cliques agrupados por dia (últimos 7 dias)
 */
router.get('/clicks', requireAuth, getClicksByDay);

export default router;
