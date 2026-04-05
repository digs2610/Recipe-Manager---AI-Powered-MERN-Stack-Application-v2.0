import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { ShoppingCart, Loader2, Plus, Trash2, Check, Leaf, DollarSign, Package } from 'lucide-react';

const GroceryList = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState('');
  const [groceryList, setGroceryList] = useState(null);
  const [servings, setServings] = useState(1);
  const [groupByCategory, setGroupByCategory] = useState(true);

  const { data: userRecipes } = useQuery({
    queryKey: ['userRecipes'],
    queryFn: () => api.get('/auth/my-recipes').then(res => res.data),
    enabled: false
  });

  const generateList = useMutation({
    mutationFn: () => api.post('/ai/grocery-list', {
      recipes: recipes.map(r => typeof r === 'string' ? r : r.title),
      servings,
      groupByCategory
    }),
    onSuccess: (res) => setGroceryList(res.data),
  });

  const addRecipe = () => {
    if (newRecipe.trim()) {
      setRecipes([...recipes, { title: newRecipe.trim(), id: Date.now() }]);
      setNewRecipe('');
    }
  };

  const removeRecipe = (index) => {
    setRecipes(recipes.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-4">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Smart <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Grocery List</span>
        </h1>
        <p className="text-gray-400">Generate a smart shopping list from your recipes</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Add Recipes</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newRecipe}
              onChange={(e) => setNewRecipe(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addRecipe()}
              placeholder="Enter recipe name..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addRecipe}
              className="px-5 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>

        {recipes.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {recipes.map((recipe, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white flex items-center gap-2"
                >
                  {typeof recipe === 'string' ? recipe : recipe.title}
                  <button onClick={() => removeRecipe(index)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Servings Multiplier</label>
            <select
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              {[1, 2, 3, 4, 5, 10].map(s => <option key={s} value={s}>{s}x</option>)}
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={groupByCategory}
                onChange={(e) => setGroupByCategory(e.target.checked)}
                className="w-5 h-5 rounded bg-white/5 border-white/10"
              />
              <span className="text-gray-300">Group by Category</span>
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => generateList.mutate()}
          disabled={recipes.length === 0 || generateList.isPending}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generateList.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <ShoppingCart size={20} />
              Generate Grocery List
            </>
          )}
        </motion.button>
      </motion.div>

      {groceryList && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Shopping List</h2>
            {groceryList.estimatedCost && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/30">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">{groceryList.estimatedCost}</span>
              </div>
            )}
          </div>

          {groupByCategory && groceryList.grouped ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groceryList.grouped).map(([category, items]) => (
                <div key={category} className="p-4 rounded-xl bg-white/5">
                  <h3 className="text-cyan-400 font-semibold mb-3 capitalize flex items-center gap-2">
                    <Package size={16} />
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <span className="w-4 h-4 rounded-full border border-gray-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {groceryList.items?.map((item, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                    <Check size={12} className="text-cyan-400 opacity-0" />
                  </span>
                  <span className="text-white flex-1">{item.name}</span>
                  <span className="text-gray-400 text-sm">{item.quantity}</span>
                </li>
              ))}
            </ul>
          )}

          {groceryList.tips && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                <Leaf size={16} />
                Tips
              </h4>
              <ul className="space-y-1">
                {groceryList.tips.map((tip, i) => (
                  <li key={i} className="text-gray-300 text-sm">• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GroceryList;