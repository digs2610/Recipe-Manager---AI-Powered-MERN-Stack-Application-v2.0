import React, { useEffect, useRef } from 'react';
import { Printer, Clock, Users, Gauge, Star } from 'lucide-react';

const PrintRecipe = ({ recipe }) => {
    const printRef = useRef();

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                .printable-area, .printable-area * { visibility: visible; }
                .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
                .no-print { display: none !important; }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const imageUrl = recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`;

    return (
        <div className="printable-area bg-white p-8 max-w-3xl mx-auto">
            <div className="no-print mb-4 flex justify-end">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                >
                    <Printer size={18} /> Print Recipe
                </button>
            </div>

            <div className="border-b-2 border-cyan-600 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" /> {recipe.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={16} /> {recipe.cookingTime || '30 mins'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Gauge size={16} /> {recipe.difficulty || 'Easy'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={16} /> {recipe.servings || 4} servings
                    </span>
                </div>
                <p className="text-gray-500 mt-2">Category: {recipe.category} | By: {recipe.user?.name || 'Chef'}</p>
            </div>

            <img src={imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-6" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Ingredients</h2>
                <ul className="grid grid-cols-2 gap-2">
                    {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                            <span className="text-gray-700">{ing}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Instructions</h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {recipe.instructions}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
                <p>Printed from RecipeHub | {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default PrintRecipe;
