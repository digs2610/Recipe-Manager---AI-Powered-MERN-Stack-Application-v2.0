import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader2, ChefHat } from 'lucide-react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';

const SearchIngredients = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!ingredients.trim()) return;

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const { data } = await api.get(`/recipes/search/ingredients?ingredients=${encodeURIComponent(ingredients)}`);
            setRecipes(data);
        } catch (err) {
            setError('Failed to search recipes');
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setIngredients('');
        setRecipes([]);
        setSearched(false);
        setError('');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                    <ChefHat size={24} className="mr-2 text-cyan-600 dark:text-cyan-400" />
                    Search by Ingredients
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Enter ingredients you have, and we'll find recipes for you!</p>
            </div>

            <form onSubmit={handleSearch} className="p-6 pt-0">
                <div className="flex gap-3">
                    <div className="flex-grow relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g. chicken, rice, tomato..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !ingredients.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
                    </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Separate multiple ingredients with commas</p>
            </form>

            {searched && (
                <div className="px-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {loading ? 'Searching...' : `${recipes.length} recipes found`}
                        </p>
                        {recipes.length > 0 && (
                            <button onClick={clearSearch} className="text-cyan-600 dark:text-cyan-400 text-sm hover:underline flex items-center">
                                <X size={14} className="mr-1" /> Clear
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-center py-4">{error}</div>
                    )}

                    {!loading && recipes.length === 0 && searched && !error && (
                        <div className="text-center py-8 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                            <ChefHat size={40} className="text-gray-300 dark:text-slate-500 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No recipes found with those ingredients.</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm">Try different ingredients!</p>
                        </div>
                    )}

                    {!loading && recipes.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchIngredients;
