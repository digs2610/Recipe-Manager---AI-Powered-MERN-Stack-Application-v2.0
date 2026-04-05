import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChefHat, Clock, Users, Gauge, Lightbulb, Loader2, Save, Image } from 'lucide-react';
import { generateCompleteRecipe } from '../utils/recipeApi';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const AskRecipeModal = ({ isOpen, onClose }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recipeName, setRecipeName] = useState('');
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipeName.trim()) return;

        setLoading(true);
        setError('');
        setRecipe(null);

        try {
            // Call new combined API - generates BOTH image AND steps
            const result = await generateCompleteRecipe(recipeName, language);
            setRecipe(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to generate recipe');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRecipe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!recipe) return;
        
        setSaving(true);
        setError('');
        
        try {
            const { data } = await api.post('/recipes/ai-save-from-name', {
                title: recipe.title,
                category: recipe.category,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                cookingTime: recipe.cookingTime,
                difficulty: recipe.difficulty,
                servings: recipe.servings
            });
            onClose();
            navigate(`/recipe/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save recipe');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                    <X size={20} />
                </button>

                <div className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
                    <div className="flex items-center gap-3">
                        <ChefHat size={28} className="text-white" />
                        <h2 className="text-2xl font-bold text-white">Ask for Recipe</h2>
                    </div>
                    <p className="text-cyan-100 mt-2">Enter any recipe name and get instant instructions</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Recipe Name
                            </label>
                            <input
                                type="text"
                                value={recipeName}
                                onChange={(e) => setRecipeName(e.target.value)}
                                placeholder="e.g., Biryani, Pasta, Paneer..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !recipeName.trim()}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Generating Image + Steps...
                                </>
                            ) : (
                                <>
                                    <ChefHat size={20} />
                                    Generate Recipe
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                            {error}
                        </div>
                    )}

                    {recipe && (
                        <div className="mt-6 space-y-4">
                            {/* RECIPE IMAGE - NEW FEATURE */}
                            {recipe.image && (
                                <div className="relative h-48 rounded-xl overflow-hidden border-2 border-cyan-200 dark:border-cyan-700">
                                    <img 
                                        src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 dark:from-cyan-900/20 to-blue-50 dark:to-blue-900/20 rounded-xl border border-cyan-100 dark:border-cyan-800">
                                    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                        <Clock size={16} className="text-cyan-600 dark:text-cyan-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{recipe.cookingTime || '30 mins'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                        <Gauge size={16} className="text-cyan-600 dark:text-cyan-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{recipe.difficulty || 'Easy'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                                        <Users size={16} className="text-cyan-600 dark:text-cyan-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{recipe.servings || 4} people</span>
                                    </div>
                                </div>
                                {user && (
                                    <button
                                        onClick={handleSaveRecipe}
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save</>}
                                    </button>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                                    <ChefHat size={18} className="text-cyan-600 dark:text-cyan-400 mr-2" />
                                    Ingredients
                                </h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {recipe.ingredients?.map((ing, idx) => (
                                        <li key={idx} className="flex items-start bg-gray-50 dark:bg-slate-700 p-2.5 rounded-lg border border-gray-100 dark:border-slate-600">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{ing}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">How to Make It</h3>
                                <div className="bg-gradient-to-br from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-600 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                                    {recipe.instructions}
                                </div>
                            </div>

                            {recipe.tips && recipe.tips.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <Lightbulb size={18} className="text-yellow-500 mr-2" />
                                        Tips
                                    </h3>
                                    <ul className="space-y-2">
                                        {recipe.tips.map((tip, idx) => (
                                            <li key={idx} className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">💡 {tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AskRecipeModal;
