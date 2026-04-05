import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import api from '../utils/api';
import { Calendar, ChefHat, Loader2, Utensils, Coffee, Moon, Sun, Leaf, Flame, Droplets } from 'lucide-react';

const mealTypes = [
  { key: 'Breakfast', icon: Coffee, color: 'from-orange-400 to-amber-500' },
  { key: 'Lunch', icon: Sun, color: 'from-yellow-400 to-green-500' },
  { key: 'Dinner', icon: Moon, color: 'from-purple-400 to-indigo-500' },
  { key: 'Snack', icon: Flame, color: 'from-red-400 to-rose-500' },
];

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb', 'Dairy-Free'
];

const MealPlanner = () => {
  const [plan, setPlan] = useState(null);
  const [options, setOptions] = useState({
    days: 7,
    mealsPerDay: 3,
    calorieTarget: '',
    dietary: [],
    excludeIngredients: '',
    cuisine: ''
  });

  const generatePlan = useMutation({
    mutationFn: () => api.post('/ai/meal-plan', options),
    onSuccess: (res) => setPlan(res.data),
  });

  const toggleDietary = (diet) => {
    setOptions(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          AI <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Meal Planner</span>
        </h1>
        <p className="text-gray-400">Get a personalized weekly meal plan</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 mb-8"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Days</label>
            <select
              value={options.days}
              onChange={(e) => setOptions({ ...options, days: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              {[3, 5, 7].map(d => <option key={d} value={d}>{d} Days</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Calorie Target (optional)</label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={options.calorieTarget}
              onChange={(e) => setOptions({ ...options, calorieTarget: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Cuisine</label>
            <select
              value={options.cuisine}
              onChange={(e) => setOptions({ ...options, cuisine: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              <option value="">Any</option>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Mexican">Mexican</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Exclude Ingredients</label>
            <input
              type="text"
              placeholder="e.g. nuts, shellfish"
              value={options.excludeIngredients}
              onChange={(e) => setOptions({ ...options, excludeIngredients: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-3">Dietary Preferences</label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map(diet => (
              <button
                key={diet}
                onClick={() => toggleDietary(diet)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  options.dietary.includes(diet)
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => generatePlan.mutate()}
          disabled={generatePlan.isPending}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generatePlan.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <ChefHat size={20} />
              Generate Meal Plan
            </>
          )}
        </motion.button>
      </motion.div>

      {plan && (
        <div className="space-y-6">
          {plan.days?.map((day, dayIndex) => (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{day.day}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Flame size={14} /> {day.totalCalories} cal
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Droplets size={14} /> {day.totalProtein}g protein
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {day.meals?.map((meal, mealIndex) => {
                  const mealConfig = mealTypes.find(m => m.key === meal.type);
                  const Icon = mealConfig?.icon || Utensils;
                  
                  return (
                    <div
                      key={mealIndex}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mealConfig?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-white font-medium mb-1">{meal.type}</h4>
                      <p className="text-gray-300 text-sm">{meal.name}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-400">
                        <span>{meal.calories} cal</span>
                        <span>{meal.protein}g protein</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {plan.shoppingList && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Leaf className="text-green-400" />
                Shopping List
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(plan.shoppingList).map(([category, items]) => (
                  <div key={category} className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-cyan-400 font-medium mb-2 capitalize">{category}</h4>
                    <ul className="space-y-1">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-300 text-sm">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;