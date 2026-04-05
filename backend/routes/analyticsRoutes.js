import express from 'express';
import { getDashboardStats, getUserActivity, getRecipeAnalytics, getAIUsageStats } from '../controllers/analyticsController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/activity', protect, getUserActivity);
router.get('/recipe/:id', protect, getRecipeAnalytics);
router.get('/ai-usage', protect, isAdmin, getAIUsageStats);

export default router;