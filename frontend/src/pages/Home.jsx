import React, { useEffect, useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import SearchIngredients from '../components/SearchIngredients';
import QuickViewModal from '../components/QuickViewModal';
import AskRecipeModal from '../components/AskRecipeModal';
import HeroScene from '../components/HeroScene';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, ChefHat, Star, Users, Sparkles, Award, TrendingUp, Loader2, MessageCircle, ArrowRight } from 'lucide-react';

const categoryConfig = {
  All: { icon: Sparkles, color: 'from-cyan-500 to-blue-500' },
  Breakfast: { icon: Star, color: 'from-orange-400 to-amber-500' },
  Lunch: { icon: Star, color: 'from-yellow-400 to-orange-500' },
  Dinner: { icon: Star, color: 'from-purple-400 to-indigo-500' },
  Dessert: { icon: Star, color: 'from-pink-400 to-rose-500' },
  Snack: { icon: Star, color: 'from-green-400 to-emerald-500' },
  Salad: { icon: Star, color: 'from-emerald-400 to-green-500' },
};

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAskRecipe, setShowAskRecipe] = useState(false);
  const [showFeatured, setShowFeatured] = useState(true);

  const { data: recipesData, isLoading } = useQuery({
    queryKey: ['recipes', keyword, category],
    queryFn: () => api.get(`/recipes?keyword=${keyword}&category=${category}`).then(res => res.data),
  });

  const { data: recipeOfDay } = useQuery({
    queryKey: ['recipeOfDay'],
    queryFn: () => api.get('/recipes/recipe-of-day').then(res => res.data),
    enabled: showFeatured
  });

  const { data: topRated } = useQuery({
    queryKey: ['topRated'],
    queryFn: () => api.get('/recipes/top-rated').then(res => res.data),
    enabled: showFeatured
  });

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.get('/recipes/trending').then(res => res.data),
    enabled: showFeatured
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Salad'];

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm mb-6">
              <Sparkles size={16} />
              AI-Powered Recipe Discovery
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            Discover <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Delicious</span>
            <br />
            Recipes with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Explore thousands of recipes, get AI-powered suggestions, and create your own culinary masterpieces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, cuisines..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-14 pr-32 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-lg transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6 mt-8 flex-wrap"
          >
            <div className="flex items-center glass px-5 py-2.5 rounded-full">
              <Users size={18} className="mr-2 text-cyan-400" />
              <span className="text-gray-200 font-medium">500+ Recipes</span>
            </div>
            <div className="flex items-center glass px-5 py-2.5 rounded-full">
              <Star size={18} className="mr-2 text-yellow-400" />
              <span className="text-gray-200 font-medium">4.9 Avg Rating</span>
            </div>
            <div className="flex items-center glass px-5 py-2.5 rounded-full">
              <ChefHat size={18} className="mr-2 text-purple-400" />
              <span className="text-gray-200 font-medium">AI Powered</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat, index) => {
            const config = categoryConfig[cat];
            const Icon = config.icon;
            const colorClass = config.color;
            const isActive = category === cat || (category === '' && cat === 'All');
            
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-lg shadow-cyan-500/25`
                    : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                {cat}
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {recipeOfDay && (
        <section className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="flex items-center gap-2">
              <Award size={24} className="text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">Recipe of the Day</h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={recipeOfDay.image?.startsWith('http') ? recipeOfDay.image : `${recipeOfDay.image}`}
                  alt={recipeOfDay.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/50" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">
                    Featured
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">
                    {recipeOfDay.category}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{recipeOfDay.title}</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">{recipeOfDay.description || recipeOfDay.instructions?.substring(0, 200)}...</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                    <Star size={18} className="text-yellow-400" />
                    <span className="text-white font-semibold">{recipeOfDay.rating?.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                    <span className="text-gray-400">{recipeOfDay.cookingTime || '30 mins'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5">
                    <span className="text-gray-400">{recipeOfDay.difficulty}</span>
                  </div>
                </div>
                <Link 
                  to={`/recipe/${recipeOfDay._id}`}
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  View Full Recipe <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {trending && trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            </div>
            <Link to="/search?sort=trending" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View All
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.slice(0, 4).map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <RecipeCard recipe={recipe} onQuickView={setSelectedRecipe} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <SearchIngredients />

      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <ChefHat size={24} className="text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              {category ? `${category} Recipes` : 'All Recipes'}
            </h2>
          </div>
          <span className="text-gray-400">{recipesData?.total || 0} recipes</span>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
          </div>
        ) : recipesData?.recipes?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipesData.recipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeCard recipe={recipe} onQuickView={setSelectedRecipe} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No recipes found</h3>
            <p className="text-gray-400">Try adjusting your search or category filters.</p>
          </motion.div>
        )}

        {recipesData?.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              {Array.from({ length: recipesData.pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => {}}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    recipesData.page === i + 1
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      : 'glass text-gray-400 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedRecipe && (
          <QuickViewModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAskRecipe(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/30 flex items-center justify-center"
        title="Ask for any recipe"
      >
        <MessageCircle size={28} className="text-white" />
      </motion.button>

      <AskRecipeModal isOpen={showAskRecipe} onClose={() => setShowAskRecipe(false)} />
    </div>
  );
};

export default Home;