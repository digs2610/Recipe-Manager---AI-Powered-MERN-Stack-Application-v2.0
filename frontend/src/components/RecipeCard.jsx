import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Heart, Eye, Bookmark, Share2 } from 'lucide-react';

const RecipeCard = ({ recipe, onQuickView }) => {
  const imageUrl = recipe.image?.startsWith('http') 
    ? recipe.image 
    : recipe.image;

  const handleQuickView = (e) => {
    if (onQuickView) {
      e.preventDefault();
      e.stopPropagation();
      onQuickView(recipe);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="recipe-card group"
    >
      <div className="relative h-56 overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500'}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass backdrop-blur-sm">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">{recipe.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/80 to-purple-500/80 text-white text-xs font-semibold backdrop-blur-sm">
            {recipe.category || 'Recipe'}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickView}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20"
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20"
            >
              <Heart size={16} />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20"
          >
            <Share2 size={16} />
          </motion.button>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {recipe.description || recipe.instructions?.substring(0, 100)}...
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              {recipe.user?.name?.charAt(0).toUpperCase() || 'C'}
            </div>
            <span className="text-gray-300 text-sm font-medium truncate max-w-[80px]">
              {recipe.user?.name || 'Chef'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <Clock size={14} />
            <span>{recipe.cookingTime || '30 min'}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {onQuickView && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuickView}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 font-semibold text-sm hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
            >
              Quick View
            </motion.button>
          )}
          <Link
            to={`/recipe/${recipe._id}`}
            className="flex-1 py-2.5 text-center rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;