import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { Search, Loader2, ChefHat } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', keyword, category],
    queryFn: () => api.get(`/recipes?keyword=${keyword}&category=${category}`).then(res => res.data),
    enabled: !!keyword || !!category
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Search Results
            </h1>
            <p className="text-gray-400">
              {keyword && `Showing results for "${keyword}"`}
              {category && ` in ${category}`}
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        </div>
      ) : data?.recipes?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {data.recipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
          <p className="text-gray-400">Try different keywords or browse categories</p>
        </motion.div>
      )}

      {data?.total > 12 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: data.pages }, (_, i) => (
              <button
                key={i + 1}
                className={`w-10 h-10 rounded-xl ${
                  data.page === i + 1
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;