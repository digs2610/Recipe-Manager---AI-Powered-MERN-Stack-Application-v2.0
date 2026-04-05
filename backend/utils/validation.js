import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  accessCode: Joi.string()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().max(500),
  avatar: Joi.string(),
  preferences: Joi.object({
    dietary: Joi.array().items(Joi.string()),
    cuisine: Joi.array().items(Joi.string()),
    difficulty: Joi.string()
  })
});

export const recipeSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000),
  category: Joi.string().required(),
  cuisine: Joi.string(),
  ingredients: Joi.array().items(Joi.string()).min(1).required(),
  instructions: Joi.string().min(10).required(),
  cookingTime: Joi.string(),
  prepTime: Joi.string(),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
  servings: Joi.number().min(1).max(100),
  tags: Joi.array().items(Joi.string()),
  isPublic: Joi.boolean()
});

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(3).max(500).required()
});

export const aiSuggestSchema = Joi.object({
  ingredients: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).required(),
  mealType: Joi.string(),
  cuisine: Joi.string(),
  dietary: Joi.array().items(Joi.string()),
  maxTime: Joi.string()
});

export const mealPlanSchema = Joi.object({
  days: Joi.number().min(1).max(7).default(7),
  mealsPerDay: Joi.number().min(2).max(4).default(3),
  calorieTarget: Joi.number().min(1000).max(5000),
  dietary: Joi.array().items(Joi.string()),
  excludeIngredients: Joi.array().items(Joi.string()),
  cuisine: Joi.string()
});

export const groceryListSchema = Joi.object({
  recipes: Joi.array().items(Joi.string()).min(1).required(),
  servings: Joi.number().min(1).max(20).default(1),
  groupByCategory: Joi.boolean().default(true)
});

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message).join(', ');
    return res.status(400).json({ message: messages });
  }
  next();
};