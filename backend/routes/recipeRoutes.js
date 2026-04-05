import express from 'express';
import {
  getRecipes,
  getRecipeById,
  getFeaturedRecipes,
  getRecipeOfTheDay,
  getTopRatedRecipes,
  getTrendingRecipes,
  searchByIngredients,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLikeRecipe,
  createRecipeReview,
  getUserRecipeStats,
  getRelatedRecipes
} from '../controllers/recipeController.js';
import { protect, optionalAuth, isAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getRecipes)
  .post(protect, upload.single('image'), createRecipe);

router.get('/featured', getFeaturedRecipes);
router.get('/recipe-of-day', getRecipeOfTheDay);
router.get('/top-rated', getTopRatedRecipes);
router.get('/trending', getTrendingRecipes);
router.get('/search/ingredients', searchByIngredients);
router.get('/stats', protect, getUserRecipeStats);
router.get('/related/:id', getRelatedRecipes);

router.post('/:id/ai-suggest', async (req, res) => {
  res.json({ message: 'Use /api/ai endpoints instead' });
});

router.route('/:id')
  .get(optionalAuth, getRecipeById)
  .put(protect, upload.single('image'), updateRecipe)
  .delete(protect, deleteRecipe);

router.post('/:id/like', protect, toggleLikeRecipe);
router.post('/:id/reviews', protect, createRecipeReview);

export default router;