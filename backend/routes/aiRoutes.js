import express from 'express';
import { 
  suggestRecipeAI, 
  generateRecipeFromImage, 
  generateRecipeImage, 
  improveRecipe, 
  askRecipeByName,
  generateCompleteRecipe,
  generateMealPlan,
  generateGroceryList,
  analyzeNutrition,
  aiChatbot
} from '../controllers/aiController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/suggest', optionalAuth, suggestRecipeAI);
router.post('/image-recipe', upload.single('image'), generateRecipeFromImage);
router.post('/generate-image', generateRecipeImage);
router.post('/improve', improveRecipe);
router.post('/ask-by-name', optionalAuth, askRecipeByName);
router.post('/complete', optionalAuth, generateCompleteRecipe);
router.post('/meal-plan', optionalAuth, generateMealPlan);
router.post('/grocery-list', optionalAuth, generateGroceryList);
router.post('/nutrition', optionalAuth, analyzeNutrition);
router.post('/chat', optionalAuth, aiChatbot);

export default router;