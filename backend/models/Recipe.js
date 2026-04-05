import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const nutritionSchema = mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 }
}, { _id: false });

const recipeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a recipe title']
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  cuisine: {
    type: String,
    default: 'General'
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: {
    type: String,
    required: [true, 'Please add instructions']
  },
  steps: [{
    order: { type: Number, required: true },
    instruction: { type: String, required: true },
    duration: { type: String },
    tips: { type: String }
  }],
  nutrition: {
    type: nutritionSchema,
    default: () => ({})
  },
  tags: [{ type: String }],
  cookingTime: {
    type: String,
    default: '30 mins'
  },
  prepTime: {
    type: String,
    default: '15 mins'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  servings: {
    type: Number,
    default: 4
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

recipeSchema.index({ title: 'text', description: 'text', ingredients: 'text' });
recipeSchema.index({ category: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ likes: -1 });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;