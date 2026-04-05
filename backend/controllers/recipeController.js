import Recipe from '../models/Recipe.js';
import { parseInstructions } from '../utils/instructionParser.js';
import { invalidateRecipeCache } from '../middlewares/cacheMiddleware.js';

export const getRecipes = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword ? {
      $or: [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { ingredients: { $regex: req.query.keyword, $options: 'i' } }
      ]
    } : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const cuisine = req.query.cuisine ? { cuisine: req.query.cuisine } : {};
    const difficulty = req.query.difficulty ? { difficulty: req.query.difficulty } : {};
    const isPublic = req.query.all === 'true' ? {} : { isPublic: true };

    const sortOption = req.query.sort || '-createdAt';
    const sortMap = {
      'newest': '-createdAt',
      'oldest': 'createdAt',
      'rating': '-rating',
      'popular': '-likes',
      'trending': '-viewCount'
    };

    const query = { ...keyword, ...category, ...cuisine, ...difficulty, ...isPublic };
    
    const count = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('user', 'name avatar')
      .select('-__v')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortMap[sortOption] || sortOption);

    res.json({
      recipes,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user', 'name avatar bio')
      .populate('reviews.user', 'name avatar');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.viewCount = (recipe.viewCount || 0) + 1;
    await recipe.save();

    if (req.user) {
      const isLiked = recipe.likes.includes(req.user._id);
      const isFavorite = req.user.favorites?.includes(recipe._id);
      return res.json({ ...recipe.toObject(), isLiked, isFavorite });
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ featured: true, isPublic: true })
      .populate('user', 'name avatar')
      .limit(10)
      .sort('-rating');

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const getRecipeOfTheDay = async (req, res, next) => {
  try {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    const count = await Recipe.countDocuments({ isPublic: true });
    if (count === 0) return res.json(null);

    const randomIndex = seed % count;
    const recipe = await Recipe.findOne({ isPublic: true })
      .populate('user', 'name avatar')
      .skip(randomIndex)
      .sort('-rating');

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const getTopRatedRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ isPublic: true, numReviews: { $gt: 0 } })
      .populate('user', 'name avatar')
      .limit(10)
      .sort('-rating -numReviews');

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const getTrendingRecipes = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recipes = await Recipe.find({
      isPublic: true,
      createdAt: { $gte: sevenDaysAgo }
    })
      .populate('user', 'name avatar')
      .limit(10)
      .sort('-likes -viewCount -rating');

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const searchByIngredients = async (req, res, next) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.status(400).json({ message: 'Please provide ingredients' });
    }

    const ingredientList = ingredients.split(',').map(i => i.trim());
    const regexPatterns = ingredientList.map(ing => new RegExp(ing, 'i'));

    const recipes = await Recipe.find({
      ingredients: { $all: regexPatterns },
      isPublic: true
    })
      .populate('user', 'name avatar')
      .limit(20)
      .sort('-rating -numReviews');

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const { title, description, category, cuisine, ingredients, instructions, cookingTime, prepTime, difficulty, servings, tags, isPublic, imageUrl } = req.body;
    
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try { parsedIngredients = JSON.parse(ingredients); } 
      catch { parsedIngredients = ingredients.split(',').map(i => i.trim()); }
    }

    let recipeImage = '/uploads/sample.jpg';
    if (req.file) {
      recipeImage = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      recipeImage = imageUrl;
    }

    const recipe = new Recipe({
      title,
      description,
      category,
      cuisine: cuisine || 'General',
      ingredients: parsedIngredients,
      instructions,
      steps: parseInstructions(instructions),
      image: recipeImage,
      user: req.user._id,
      cookingTime: cookingTime || '30 mins',
      prepTime: prepTime || '15 mins',
      difficulty: difficulty || 'Easy',
      servings: servings || 4,
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      numReviews: 0,
      rating: 0
    });

    const createdRecipe = await recipe.save();
    await invalidateRecipeCache();
    
    res.status(201).json(createdRecipe);
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const { title, description, category, cuisine, ingredients, instructions, cookingTime, prepTime, difficulty, servings, tags, featured, isPublic } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    let parsedIngredients = ingredients || recipe.ingredients;
    if (ingredients && typeof ingredients === 'string') {
      try { parsedIngredients = JSON.parse(ingredients); } 
      catch { parsedIngredients = ingredients.split(',').map(i => i.trim()); }
    }

    recipe.title = title || recipe.title;
    recipe.description = description !== undefined ? description : recipe.description;
    recipe.category = category || recipe.category;
    recipe.cuisine = cuisine || recipe.cuisine;
    recipe.ingredients = parsedIngredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.steps = instructions ? parseInstructions(instructions) : recipe.steps;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.prepTime = prepTime || recipe.prepTime;
    recipe.difficulty = difficulty || recipe.difficulty;
    recipe.servings = servings || recipe.servings;
    recipe.tags = tags || recipe.tags;
    if (featured !== undefined && req.user.role === 'admin') recipe.featured = featured;
    if (isPublic !== undefined) recipe.isPublic = isPublic;

    if (req.file) {
      recipe.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecipe = await recipe.save();
    await invalidateRecipeCache();
    
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    await invalidateRecipeCache();
    
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const likeIndex = recipe.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      recipe.likes.splice(likeIndex, 1);
    } else {
      recipe.likes.push(req.user._id);
    }
    await recipe.save();

    res.json({ likes: recipe.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    next(error);
  }
};

export const createRecipeReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const alreadyReviewed = recipe.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Recipe already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    recipe.reviews.push(review);
    recipe.numReviews = recipe.reviews.length;
    recipe.rating = recipe.reviews.reduce((acc, item) => item.rating + acc, 0) / recipe.reviews.length;

    await recipe.save();
    await invalidateRecipeCache();
    
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

export const getUserRecipeStats = async (req, res, next) => {
  try {
    const stats = await Recipe.aggregate([
      { $match: { user: req.user._id } },
      { $group: {
        _id: null,
        totalRecipes: { $sum: 1 },
        totalLikes: { $sum: { $size: '$likes' } },
        totalViews: { $sum: '$viewCount' },
        totalReviews: { $sum: '$numReviews' },
        avgRating: { $avg: '$rating' },
        categories: { $addToSet: '$category' }
      }}
    ]);

    const published = await Recipe.countDocuments({ user: req.user._id, isPublic: true });
    const drafts = await Recipe.countDocuments({ user: req.user._id, isPublic: false });

    res.json({
      ...stats[0],
      published,
      drafts,
      totalFavorites: req.user.favorites?.length || 0
    });
  } catch (error) {
    next(error);
  }
};

export const getRelatedRecipes = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const recipes = await Recipe.find({
      _id: { $ne: recipe._id },
      category: recipe.category,
      isPublic: true
    })
      .populate('user', 'name avatar')
      .limit(5)
      .sort('-rating');

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Recipe.distinct('category', { isPublic: true });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};