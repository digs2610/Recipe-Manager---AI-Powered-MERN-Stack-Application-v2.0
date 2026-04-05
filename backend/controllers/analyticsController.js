import Analytics from '../models/Analytics.js';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const recipeStats = await Recipe.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: null,
        totalRecipes: { $sum: 1 },
        totalLikes: { $sum: { $size: '$likes' } },
        totalViews: { $sum: '$viewCount' },
        totalReviews: { $sum: '$numReviews' },
        avgRating: { $avg: '$rating' }
      }}
    ]);

    const user = await User.findById(userId);
    const favoritesCount = user?.favorites?.length || 0;
    const followersCount = user?.followers?.length || 0;

    const recentRecipes = await Recipe.find({ user: userId })
      .select('title image views likes createdAt')
      .sort('-createdAt')
      .limit(5);

    const topRecipes = await Recipe.find({ user: userId })
      .select('title image likes views rating')
      .sort('-likes')
      .limit(5);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const dailyStats = await Analytics.aggregate([
      { 
        $match: { 
          user: userId, 
          timestamp: { $gte: last30Days }
        }
      },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        views: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalRecipes: recipeStats[0]?.totalRecipes || 0,
      totalLikes: recipeStats[0]?.totalLikes || 0,
      totalViews: recipeStats[0]?.totalViews || 0,
      totalReviews: recipeStats[0]?.totalReviews || 0,
      avgRating: recipeStats[0]?.avgRating?.toFixed(1) || 0,
      favoritesCount,
      followersCount,
      recentRecipes,
      topRecipes,
      dailyStats
    });
  } catch (error) {
    next(error);
  }
};

export const getUserActivity = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const activities = await Analytics.find({ user: req.user._id })
      .sort('-timestamp')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('recipe', 'title image');

    const total = await Analytics.countDocuments({ user: req.user._id });

    res.json({
      activities,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeAnalytics = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const dailyViews = await Analytics.aggregate([
      { 
        $match: { 
          recipe: recipe._id,
          type: 'recipe_view',
          timestamp: { $gte: last30Days }
        }
      },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        views: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      recipe: {
        id: recipe._id,
        title: recipe.title,
        views: recipe.viewCount,
        likes: recipe.likes.length,
        reviews: recipe.numReviews,
        rating: recipe.rating
      },
      dailyViews,
      topReferrers: [],
      devices: { mobile: 60, desktop: 40 }
    });
  } catch (error) {
    next(error);
  }
};

export const getAIUsageStats = async (req, res, next) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const usageStats = await Analytics.aggregate([
      { 
        $match: { 
          type: 'ai_usage',
          timestamp: { $gte: last30Days }
        }
      },
      { $group: {
        _id: '$metadata.feature',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    const dailyUsage = await Analytics.aggregate([
      { 
        $match: { 
          type: 'ai_usage',
          timestamp: { $gte: last30Days }
        }
      },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsage: usageStats.reduce((acc, s) => acc + s.count, 0),
      featureUsage: usageStats,
      dailyUsage
    });
  } catch (error) {
    next(error);
  }
};

export const trackAnalytics = async (type, userId, recipeId = null, metadata = {}) => {
  try {
    await Analytics.create({
      type,
      user: userId,
      recipe: recipeId,
      metadata
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};