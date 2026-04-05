import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { RecipeContext } from '../context/RecipeContext';
import { UploadCloud, Plus, X, List, AlignLeft, Utensils, Tag, Loader2, Sparkles, Wand2, Clock, Users, Gauge } from 'lucide-react';
import api from '../utils/api';

const EditRecipe = () => {
    const { user } = useContext(AuthContext);
    const { updateRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredientList, setIngredientList] = useState(['']);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    
    const [cookingTime, setCookingTime] = useState('30 mins');
    const [difficulty, setDifficulty] = useState('Easy');
    const [servings, setServings] = useState(4);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchRecipe();
        }
    }, [user, navigate, id]);

    const fetchRecipe = async () => {
        try {
            const { data } = await api.get(`/recipes/${id}`);
            setTitle(data.title);
            setCategory(data.category);
            setInstructions(data.instructions);
            setIngredientList(data.ingredients);
            setExistingImage(data.image.startsWith('http') ? data.image : `http://localhost:5000${data.image}`);
            setCookingTime(data.cookingTime || '30 mins');
            setDifficulty(data.difficulty || 'Easy');
            setServings(data.servings || 4);
            setLoading(false);
        } catch (err) {
            setError('Failed to load recipe');
            setLoading(false);
        }
    };

    const handleIngredientChange = (index, value) => {
        const updated = [...ingredientList];
        updated[index] = value;
        setIngredientList(updated);
    };

    const addIngredientField = () => {
        setIngredientList([...ingredientList, '']);
    };

    const removeIngredientField = (index) => {
        const updated = ingredientList.filter((_, i) => i !== index);
        setIngredientList(updated);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('instructions', instructions);
        formData.append('cookingTime', cookingTime);
        formData.append('difficulty', difficulty);
        formData.append('servings', servings);
        const filteredIngredients = ingredientList.filter(i => i.trim() !== '');
        formData.append('ingredients', JSON.stringify(filteredIngredients));
        if (image) {
            formData.append('image', image);
        }

        try {
            const { data } = await api.put(`/recipes/${id}`, formData);
            navigate(`/recipe/${data._id}`);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 size={48} className="animate-spin text-cyan-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <div className="bg-gradient-to-r from-cyan-100 dark:from-cyan-900/50 to-blue-100 dark:to-blue-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Utensils size={40} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Edit Recipe</h1>
                <p className="text-gray-500 dark:text-gray-400">Update your culinary masterpiece</p>
            </div>

            <form onSubmit={submitHandler} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    <Utensils size={18} className="mr-2 text-cyan-500" />
                                    Recipe Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Recipe name"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        <Clock size={16} className="mr-2 text-cyan-500" />
                                        Time
                                    </label>
                                    <select
                                        value={cookingTime}
                                        onChange={(e) => setCookingTime(e.target.value)}
                                        className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 text-sm text-gray-900 dark:text-white"
                                    >
                                        <option value="15 mins">15 mins</option>
                                        <option value="25 mins">25 mins</option>
                                        <option value="30 mins">30 mins</option>
                                        <option value="45 mins">45 mins</option>
                                        <option value="60 mins">60 mins</option>
                                        <option value="90 mins">90 mins</option>
                                        <option value="120 mins">120 mins</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        <Gauge size={16} className="mr-2 text-cyan-500" />
                                        Level
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 text-sm text-gray-900 dark:text-white"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        <Users size={16} className="mr-2 text-cyan-500" />
                                        Servings
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={servings}
                                        onChange={(e) => setServings(Number(e.target.value))}
                                        className="block w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 text-sm text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    <Tag size={18} className="mr-2 text-cyan-500" />
                                    Category
                                </label>
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 transition-all appearance-none text-gray-900 dark:text-white"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Snack">Snack</option>
                                    <option value="Salad">Salad</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                <UploadCloud size={18} className="mr-2 text-cyan-500" />
                                Recipe Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden relative group h-[220px] hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors cursor-pointer">
                                {preview || existingImage ? (
                                    <>
                                        <img src={preview || existingImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-semibold bg-black/70 px-4 py-2 rounded-lg backdrop-blur">Click to change image</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1 text-center flex flex-col items-center justify-center">
                                        <div className="bg-gradient-to-r from-cyan-100 dark:from-cyan-900/50 to-blue-100 dark:to-blue-900/50 text-cyan-600 dark:text-cyan-400 rounded-2xl p-4 mb-3">
                                            <UploadCloud size={32} />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-slate-700" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                                <List size={18} className="mr-2 text-cyan-500" />
                                Ingredients
                            </label>
                            <div className="space-y-3 bg-gradient-to-br from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-600">
                                {ingredientList.map((ingredient, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            required
                                            value={ingredient}
                                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            className="block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-lg focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 text-sm transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            placeholder="e.g. 2 cups flour"
                                        />
                                        {ingredientList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredientField(index)}
                                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addIngredientField}
                                    className="flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors mt-4 bg-cyan-50 dark:bg-cyan-900/30 px-4 py-2.5 rounded-lg"
                                >
                                    <Plus size={16} className="mr-2" /> Add Ingredient
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                                <AlignLeft size={18} className="mr-2 text-cyan-500" />
                                Instructions
                            </label>
                            <textarea
                                required
                                rows="12"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="Step 1: Preheat oven to 350°F..."
                            />
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 border-t border-gray-100 dark:border-slate-600 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/recipe/${id}`)}
                        className="bg-white dark:bg-slate-700 py-3 px-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex justify-center items-center py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-70 min-w-[160px]"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;
