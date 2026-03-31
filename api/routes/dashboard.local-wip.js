import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', requireAuth, getDashboardStats);

export default router;
