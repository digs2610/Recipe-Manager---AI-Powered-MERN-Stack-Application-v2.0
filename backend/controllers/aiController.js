import Recipe from '../models/Recipe.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import aiService from '../services/aiService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getMockRecipe = (ingredients, category = 'Dinner') => {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const times = ['15 mins', '25 mins', '30 mins', '45 mins', '60 mins'];
  
  return {
    title: `Delicious ${category} Recipe`,
    description: 'A wonderful recipe made with fresh ingredients',
    category,
    cuisine: 'General',
    ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(i => i.trim()),
    instructions: `1. Gather all ingredients and wash them thoroughly.\n2. Prepare the main components.\n3. Cook according to your preferred method.\n4. Let it rest for a few minutes before serving.\n5. Garnish with fresh herbs and serve hot.`,
    cookingTime: times[Math.floor(Math.random() * times.length)],
    prepTime: '15 mins',
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    servings: Math.floor(Math.random() * 4) + 2,
    nutrition: { calories: 350, protein: 20, carbs: 30, fat: 12, fiber: 5 },
    tags: ['quick', 'easy', 'healthy']
  };
};

const getMockRecipeByName = (recipeName, language = 'en') => {
  const isHindi = language === 'hi';
  
  return {
    title: isHindi ? `स्वादिष्ट ${recipeName}` : recipeName,
    description: isHindi ? 'एक स्वादिष्ट व्यंजन' : 'A delicious dish',
    category: 'Dinner',
    cuisine: 'General',
    ingredients: [
      isHindi ? '2 कप आटा' : '2 cups flour',
      isHindi ? '1 चम्मच तेल' : '1 tbsp oil',
      isHindi ? '½ चम्मच नमक' : '½ tsp salt',
      isHindi ? 'पानी आवश्यकतानुसार' : 'water as needed'
    ],
    instructions: isHindi 
      ? `1. आटे में नमक और तेल मिलाएं।\n2. पानी डालकर मुलायम आटा गूंधें।\n3. आटे को 15 मिनट छोड़ दें।\n4. बेलकर तलें।\n5. गरमा-गरम परोसें।`
      : `1. Mix salt and oil into the flour.\n2. Add water and knead into soft dough.\n3. Rest the dough for 15 minutes.\n4. Roll and cook on pan.\n5. Serve hot.`,
    cookingTime: '30 mins',
    prepTime: '15 mins',
    difficulty: 'Easy',
    servings: 4,
    tips: [
      isHindi ? 'आटा नरम होना चाहिए' : 'Dough should be soft',
      isHindi ? 'मध्यम आंच पर तलें' : 'Fry on medium flame'
    ]
  };
};

export const suggestRecipeAI = async (req, res, next) => {
  try {
    const { ingredients, mealType, cuisine, dietary, maxTime } = req.body;
    
    if (!ingredients) {
      return res.status(400).json({ message: 'Ingredients are required' });
    }

    const ingredientList = Array.isArray(ingredients) 
      ? ingredients 
      : ingredients.split(',').map(i => i.trim());

    const recipe = await aiService.generateRecipeFromIngredients(ingredientList, {
      mealType,
      cuisine,
      dietary,
      maxTime
    });

    if (recipe) {
      return res.json(recipe);
    }

    res.json(getMockRecipe(ingredientList, mealType));
  } catch (error) {
    next(error);
  }
};

export const generateRecipeFromImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    
    const recipe = await aiService.generateRecipeFromImage(imageBuffer, req.file.mimetype);

    if (recipe) {
      recipe.image = `/uploads/${req.file.filename}`;
      return res.json(recipe);
    }

    res.status(400).json({ message: 'Could not generate recipe from image' });
  } catch (error) {
    next(error);
  }
};

export const generateRecipeImage = async (req, res, next) => {
  try {
    const { title, ingredients, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide recipe title' });
    }

    const imageData = await aiService.generateRecipeImage(title, ingredients, category);

    if (imageData) {
      const filename = `ai-gen-${Date.now()}.png`;
      const uploadDir = path.join(__dirname, '..', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, Buffer.from(imageData.data, 'base64'));

      return res.json({ 
        image: `/uploads/${filename}`,
        message: 'Image generated successfully'
      });
    }

    res.status(400).json({ message: 'Could not generate image' });
  } catch (error) {
    next(error);
  }
};

export const improveRecipe = async (req, res, next) => {
  try {
    const { title, ingredients, instructions } = req.body;

    if (!title || !instructions) {
      return res.status(400).json({ message: 'Title and instructions are required' });
    }

    const improved = await aiService.improveRecipe({ title, ingredients, instructions });

    if (improved) {
      return res.json(improved);
    }

    res.status(400).json({ message: 'Could not improve recipe' });
  } catch (error) {
    next(error);
  }
};

export const askRecipeByName = async (req, res, next) => {
  try {
    const { recipeName, language = 'en' } = req.body;

    if (!recipeName) {
      return res.status(400).json({ message: 'Please provide a recipe name' });
    }

    const recipe = await aiService.askRecipeByName(recipeName, language);

    if (recipe) {
      return res.json(recipe);
    }

    res.json(getMockRecipeByName(recipeName, language));
  } catch (error) {
    next(error);
  }
};

export const generateCompleteRecipe = async (req, res, next) => {
  try {
    const { recipeName, language = 'en' } = req.body;

    if (!recipeName) {
      return res.status(400).json({ message: 'Please provide a recipe name' });
    }

    const recipe = await aiService.askRecipeByName(recipeName, language);

    if (recipe) {
      const imageData = await aiService.generateRecipeImage(recipe.title, recipe.ingredients, recipe.category);
      if (imageData) {
        const filename = `complete-${Date.now()}.png`;
        const uploadDir = path.join(__dirname, '..', 'uploads');
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, Buffer.from(imageData.data, 'base64'));
        recipe.image = `/uploads/${filename}`;
      }
      return res.json(recipe);
    }

    res.json(getMockRecipeByName(recipeName, language));
  } catch (error) {
    next(error);
  }
};

export const generateMealPlan = async (req, res, next) => {
  try {
    const { days = 7, mealsPerDay = 3, calorieTarget, dietary, excludeIngredients, cuisine } = req.body;

    const mealPlan = await aiService.generateMealPlan({
      days,
      mealsPerDay,
      calorieTarget,
      dietary,
      excludeIngredients,
      cuisine
    });

    if (mealPlan) {
      return res.json(mealPlan);
    }

    res.status(400).json({ message: 'Could not generate meal plan' });
  } catch (error) {
    next(error);
  }
};

export const generateGroceryList = async (req, res, next) => {
  try {
    const { recipes, servings = 1, groupByCategory = true } = req.body;

    if (!recipes || !recipes.length) {
      return res.status(400).json({ message: 'Please provide at least one recipe' });
    }

    const groceryList = await aiService.generateGroceryList(recipes, {
      servings,
      groupByCategory
    });

    if (groceryList) {
      return res.json(groceryList);
    }

    res.status(400).json({ message: 'Could not generate grocery list' });
  } catch (error) {
    next(error);
  }
};

export const analyzeNutrition = async (req, res, next) => {
  try {
    const { ingredients, servings = 1 } = req.body;

    if (!ingredients || !ingredients.length) {
      return res.status(400).json({ message: 'Please provide ingredients' });
    }

    const nutrition = await aiService.analyzeNutrition(ingredients, servings);

    if (nutrition) {
      return res.json(nutrition);
    }

    res.status(400).json({ message: 'Could not analyze nutrition' });
  } catch (error) {
    next(error);
  }
};

export const aiChatbot = async (req, res, next) => {
  try {
    const { messages, query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a query' });
    }

    const response = await aiService.aiChatbot(messages || [], query);

    if (response) {
      return res.json({ response });
    }

    res.json({ response: 'I apologize, but I\'m having trouble processing your request right now. Please try again.' });
  } catch (error) {
    next(error);
  }
};