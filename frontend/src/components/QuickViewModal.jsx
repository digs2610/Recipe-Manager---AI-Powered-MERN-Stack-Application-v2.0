import React from 'react';
import { X, Clock, ChefHat, Users, Gauge, CheckCircle } from 'lucide-react';

const QuickViewModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    const imageUrl = recipe.image.startsWith('http') 
        ? recipe.image 
        : `http://localhost:5000${recipe.image}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                >
                    <X size={20} />
                </button>

                <div className="flex-shrink-0">
                    <div className="relative h-56 md:h-64 w-full overflow-hidden">
                        <img 
                            src={imageUrl} 
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{recipe.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 dark:from-cyan-900/20 to-blue-50 dark:to-blue-900/20 border-b border-gray-100 dark:border-slate-700">
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

                <div className="flex-1 overflow-y-auto p-5">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                            <ChefHat size={18} className="text-cyan-600 dark:text-cyan-400 mr-2" />
                            Ingredients
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex items-start bg-gray-50 dark:bg-slate-700 p-2.5 rounded-lg border border-gray-100 dark:border-slate-600">
                                    <CheckCircle size={14} className="text-cyan-500 mt-0.5 mr-2 flex-shrink-0" />
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
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;