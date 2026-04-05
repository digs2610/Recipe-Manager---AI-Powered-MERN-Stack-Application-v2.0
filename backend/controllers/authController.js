import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import AccessCode from '../models/AccessCode.js';
import generateToken from '../utils/generateToken.js';
import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  accessCode: Joi.string()
});

export const registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, accessCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let userAccessCode = null;
    if (accessCode) {
      const codeDoc = await AccessCode.findOne({ code: accessCode.toUpperCase(), isActive: true });
      if (!codeDoc) {
        return res.status(400).json({ message: 'Invalid access code' });
      }
      if (codeDoc.expiresAt && new Date(codeDoc.expiresAt) < new Date()) {
        return res.status(400).json({ message: 'Access code has expired' });
      }
      if (codeDoc.usedBy.length >= codeDoc.maxUses) {
        return res.status(400).json({ message: 'Access code usage limit reached' });
      }
      userAccessCode = codeDoc._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      accessCode: userAccessCode
    });

    if (accessCode) {
      await AccessCode.findByIdAndUpdate(userAccessCode, {
        $push: { usedBy: { user: user._id } }
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (user) {
      const recipeStats = await Recipe.aggregate([
        { $match: { user: user._id } },
        { $group: { 
          _id: null,
          totalLikes: { $sum: { $size: '$likes' } },
          totalViews: { $sum: '$viewCount' },
          totalReviews: { $sum: '$numReviews' }
        }}
      ]);

      res.json({
        ...user.toObject(),
        recipeStats: recipeStats[0] || { totalLikes: 0, totalViews: 0, totalReviews: 0 }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, preferences } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.bio = bio !== undefined ? bio : user.bio;
      user.avatar = avatar || user.avatar;
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        preferences: updatedUser.preferences,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;

    if (user) {
      const isFav = user.favorites.includes(recipeId);
      if (isFav) {
        user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
      } else {
        user.favorites.push(recipeId);
      }
      await user.save();
      res.json({ favorites: user.favorites, isFavorite: !isFav });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserRecipes = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const recipes = await Recipe.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Recipe.countDocuments({ user: req.user._id });

    res.json({
      recipes,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Current password is incorrect' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    await Recipe.deleteMany({ user: req.user._id });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user._id);
    
    if (currentUser.following.includes(req.params.id)) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'Follow updated' });
  } catch (error) {
    next(error);
  }
};