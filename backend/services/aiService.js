import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const model = genAI?.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export const getAIResponse = async (prompt, options = {}) => {
  if (!genAI) {
    console.warn('⚠️ Gemini API key not configured');
    return null;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    return null;
  }
};

export const generateRecipeFromIngredients = async (ingredients, options = {}) => {
  const { mealType, cuisine, dietary, maxTime } = options;
  
  const prompt = `You are a professional chef. Create a detailed recipe using these ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}.
  
  ${mealType ? `Meal Type: ${mealType}` : ''}
  ${cuisine ? `Cuisine: ${cuisine}` : ''}
  ${dietary ? `Dietary Restrictions: ${dietary.join(', ')}` : ''}
  ${maxTime ? `Max Cooking Time: ${maxTime}` : ''}
  
  Respond ONLY with valid JSON (no markdown, no text before or after):
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "category": "Breakfast/Lunch/Dinner/Dessert/Snack/Salad",
    "cuisine": "Cuisine type",
    "ingredients": ["ingredient 1 with quantity", "ingredient 2"],
    "instructions": "Step 1...\nStep 2...",
    "steps": [{"order": 1, "instruction": "Do this", "duration": "5 mins", "tips": "optional tip"}],
    "cookingTime": "30 mins",
    "prepTime": "15 mins",
    "difficulty": "Easy/Medium/Hard",
    "servings": 4,
    "nutrition": {"calories": 300, "protein": 20, "carbs": 30, "fat": 10, "fiber": 5},
    "tags": ["tag1", "tag2"]
  }`;

  const response = await getAIResponse(prompt);
  if (response) {
    const match = response.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error('JSON parse error:', e);
      }
    }
  }
  return null;
};

export const generateRecipeFromImage = async (imageBuffer, mimeType) => {
  if (!genAI) return null;

  const prompt = `Analyze this food image and create a detailed recipe. 
  Respond ONLY with JSON:
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "category": "Breakfast/Lunch/Dinner/Dessert/Snack",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": "Step 1...\nStep 2...",
    "cookingTime": "30 mins",
    "difficulty": "Easy/Medium/Hard",
    "servings": 4,
    "nutrition": {"calories": 300, "protein": 20, "carbs": 30, "fat": 10}
  }`;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data: imageBuffer.toString('base64') } }
    ]);
    
    const response = await result.response.text();
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (error) {
    console.error('Image recipe generation error:', error);
  }
  return null;
};

export const generateRecipeImage = async (title, ingredients, category) => {
  if (!genAI) return null;

  const prompt = `Generate a realistic, appetizing food photography image of ${title}.
  Category: ${category || 'food'}.
  Ingredients: ${Array.isArray(ingredients) ? ingredients.join(', ') : ingredients}.
  Style: Professional food photography, bright, clean background, high quality, 4K.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          return {
            mimeType: part.inlineData.mimeType || 'image/png',
            data: part.inlineData.data
          };
        }
      }
    }
  } catch (error) {
    console.error('Image generation error:', error);
  }
  return null;
};

export const improveRecipe = async (recipe) => {
  const prompt = `Improve this recipe with better instructions, tips, and enhanced nutrition info:
  ${JSON.stringify(recipe)}
  
  Return JSON:
  {
    "title": "Improved name",
    "instructions": "Enhanced instructions with tips",
    "tips": ["tip1", "tip2"],
    "improvements": ["improvement1"],
    "cookingTime": "optimized time",
    "nutrition": {"calories": optimized, "protein": optimized, "carbs": optimized, "fat": optimized}
  }`;

  const response = await getAIResponse(prompt);
  if (response) {
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  }
  return null;
};

export const askRecipeByName = async (recipeName, language = 'en') => {
  const isHindi = language === 'hi';
  const lang = isHindi ? 'Hindi' : 'English';
  
  const prompt = `Provide a complete recipe for "${recipeName}" in ${lang}.
  Respond ONLY with JSON:
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "category": "Breakfast/Lunch/Dinner/Dessert/Snack",
    "cuisine": "Cuisine type",
    "ingredients": ["ingredient with quantity"],
    "instructions": "Step 1...\nStep 2...",
    "cookingTime": "30 mins",
    "prepTime": "15 mins",
    "difficulty": "Easy/Medium/Hard",
    "servings": 4,
    "tips": ["tip1", "tip2"],
    "nutritionalInfo": {"calories": 300, "protein": 20, "carbs": 30, "fat": 10}
  }`;

  const response = await getAIResponse(prompt);
  if (response) {
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  }
  return null;
};

export const generateMealPlan = async (options) => {
  const { days = 7, mealsPerDay = 3, calorieTarget, dietary, excludeIngredients, cuisine } = options;
  
  const prompt = `Create a ${days}-day meal plan with ${mealsPerDay} meals per day.
  ${calorieTarget ? `Target: ${calorieTarget} calories per day` : ''}
  ${dietary ? `Dietary: ${dietary.join(', ')}` : ''}
  ${excludeIngredients ? `Exclude: ${excludeIngredients.join(', ')}` : ''}
  ${cuisine ? `Cuisine: ${cuisine}` : ''}
  
  Return ONLY JSON:
  {
    "days": [
      {
        "day": "Day 1",
        "meals": [
          {"type": "Breakfast", "name": "Recipe name", "calories": 400, "protein": 20},
          {"type": "Lunch", "name": "Recipe name", "calories": 600, "protein": 30},
          {"type": "Dinner", "name": "Recipe name", "calories": 500, "protein": 25}
        ],
        "totalCalories": 1500,
        "totalProtein": 75
      }
    ],
    "shoppingList": {"proteins": [], "vegetables": [], "dairy": [], "grains": [], "other": []},
    "tips": ["tip1", "tip2"]
  }`;

  const response = await getAIResponse(prompt);
  if (response) {
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  }
  return null;
};

export const generateGroceryList = async (recipes, options = {}) => {
  const { servings = 1, groupByCategory = true } = options;
  
  const prompt = `Generate a smart grocery list for these recipes: ${recipes.join(', ')}.
  ${servings !== 1 ? `Scale to ${servings} servings` : ''}
  
  Return ONLY JSON:
  {
    "items": [
      {"name": "Ingredient", "quantity": "2 cups", "category": "Produce", "recipes": ["Recipe1"]}
    ],
    "grouped": {
      "Produce": ["item1", "item2"],
      "Proteins": ["item3"],
      "Dairy": ["item4"],
      "Grains": ["item5"],
      "Spices": ["item6"],
      "Other": ["item7"]
    },
    "estimatedCost": "$50-70",
    "tips": ["Buy seasonal", "Check sales"]
  }`;

  const response = await getAIResponse(prompt);
  if (response) {
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  }
  return null;
};

export const analyzeNutrition = async (ingredients, servings = 1) => {
  const prompt = `Analyze nutrition for these ingredients (serves ${servings}):
  ${ingredients.join(', ')}
  
  Return ONLY JSON:
  {
    "servingSize": "1 cup",
    "calories": 350,
    "macros": {"protein": 25, "carbs": 40, "fat": 12, "fiber": 8},
    "micronutrients": {"vitaminA": "10%", "vitaminC": "15%", "iron": "20%", "calcium": "10%"},
    "dailyValue": {"calories": "17%", "protein": "50%"},
    "warnings": ["high sodium", "high sugar"],
    "benefits": ["high protein", "rich in fiber"]
  }`;

  const response = await getAIResponse(prompt);
  if (response) {
    const match = response.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  }
  return null;
};

export const aiChatbot = async (messages, userQuery) => {
  const conversation = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  const prompt = `You are a friendly, knowledgeable AI Chef Assistant. Help users with cooking questions, recipe advice, and kitchen tips.
  
  Conversation:
  ${conversation}
  User: ${userQuery}
  
  Respond in a helpful, conversational manner. If asking about a specific recipe, provide detailed cooking advice.
  Include tips when relevant. Keep responses concise but informative (max 200 words).`;

  return await getAIResponse(prompt);
};

export default {
  getAIResponse,
  generateRecipeFromIngredients,
  generateRecipeFromImage,
  generateRecipeImage,
  improveRecipe,
  askRecipeByName,
  generateMealPlan,
  generateGroceryList,
  analyzeNutrition,
  aiChatbot
};