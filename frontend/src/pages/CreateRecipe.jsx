import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { RecipeContext } from '../context/RecipeContext';
import { UploadCloud, Plus, X, List, AlignLeft, Utensils, Tag, Loader2, Sparkles, Wand2, Clock, Users, Gauge, Camera, Sparkle, ImageIcon } from 'lucide-react';
import api from '../utils/api';

const CreateRecipe = () => {
    const { user } = useContext(AuthContext);
    const { createRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();
    const imageInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [instructions, setInstructions] = useState('');
    const [ingredientList, setIngredientList] = useState(['']);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [cookingTime, setCookingTime] = useState('30 mins');
    const [difficulty, setDifficulty] = useState('Easy');
    const [servings, setServings] = useState(4);
    
    const [aiIngredients, setAiIngredients] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    
    const [aiImage, setAiImage] = useState(null);
    const [aiImagePreview, setAiImagePreview] = useState(null);
    const [aiImageLoading, setAiImageLoading] = useState(false);
    
    const [imageGenLoading, setImageGenLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

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
        } else {
            setPreview(null);
        }
    };
    
    const handleAiSuggest = async () => {
        if (!aiIngredients.trim()) return;
        setAiLoading(true);
        setAiError('');
        try {
            console.log('Sending request to AI with ingredients:', aiIngredients);
            const { data } = await api.post('/recipes/ai-suggest', { 
                ingredients: aiIngredients, 
                mealType: category || undefined 
            });
            console.log('AI Response:', data);
            setTitle(data.title || '');
            setCategory(data.category || '');
            setIngredientList(data.ingredients || ['']);
            setInstructions(data.instructions || '');
            if (data.cookingTime) setCookingTime(data.cookingTime);
            if (data.difficulty) setDifficulty(data.difficulty);
            if (data.servings) setServings(data.servings);
        } catch (err) {
            console.error('AI Error:', err);
            setAiError(err.response?.data?.message || 'Failed to generate recipe from ingredients.');
        } finally {
            setAiLoading(false);
        }
    }

    const handleAiImageGenerate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setAiImage(file);
        setAiImagePreview(URL.createObjectURL(file));
        
        setAiImageLoading(true);
        
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            const { data } = await api.post('/recipes/ai-image-recipe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setTitle(data.title || 'AI Generated Recipe');
            setCategory(data.category || 'Dinner');
            setIngredientList(data.ingredients || ['']);
            setInstructions(data.instructions || '');
            if (data.cookingTime) setCookingTime(data.cookingTime);
            if (data.difficulty) setDifficulty(data.difficulty);
            if (data.servings) setServings(data.servings);
            if (data.image) {
                setPreview(data.image);
            }
        } catch (err) {
            setAiError('Failed to generate recipe from image. Make sure API key is configured.');
        } finally {
            setAiImageLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!title.trim() || ingredientList.filter(i => i.trim()).length === 0) return;
        
        setImageGenLoading(true);
        
        try {
            const filteredIngredients = ingredientList.filter(i => i.trim() !== '');
            const { data } = await api.post('/recipes/ai-generate-image', {
                title,
                ingredients: filteredIngredients,
                category
            });
            
            if (data.image) {
                setPreview(data.image);
            }
        } catch (err) {
            console.error('Image generation error:', err);
            setAiError('Failed to generate image. Make sure API key is configured.');
        } finally {
            setImageGenLoading(false);
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
        } else if (preview && preview.startsWith('/uploads/')) {
            formData.append('imageUrl', preview);
        }

        try {
            const newRecipe = await createRecipe(formData);
            navigate(`/recipe/${newRecipe._id}`);
        } catch (err) {
            alert(err.message);
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <div className="bg-gradient-to-r from-cyan-100 dark:from-cyan-900/50 to-blue-100 dark:to-blue-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Utensils size={40} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Create New Recipe</h1>
                <p className="text-gray-500 dark:text-gray-400">Share your culinary masterpiece with the world</p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 dark:from-violet-900/20 via-purple-50 dark:via-purple-900/20 to-fuchsia-50 dark:to-fuchsia-900/20 rounded-2xl p-6 mb-8 border border-violet-100 dark:border-violet-800/30 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-fuchsia-200/30 dark:bg-fuchsia-500/10 rounded-full blur-2xl"></div>
                <h2 className="flex items-center text-lg font-bold text-violet-900 dark:text-violet-300 mb-3 relative z-10">
                    <Sparkles className="text-yellow-500 mr-2" size={20} />
                    AI Recipe Generator
                </h2>
                <p className="text-sm text-violet-700 dark:text-violet-400 mb-4 relative z-10">Have some ingredients but don't know what to make? Let AI write the recipe for you!</p>
                <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                    <input 
                        type="text" 
                        value={aiIngredients}
                        onChange={(e) => setAiIngredients(e.target.value)}
                        placeholder="e.g. Chicken, rice, broccoli, soy sauce..."
                        className="flex-grow px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-violet-200 dark:border-violet-700 rounded-xl focus:ring-2 focus:ring-violet-400 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button 
                        type="button"
                        onClick={handleAiSuggest}
                        disabled={aiLoading || !aiIngredients.trim()}
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center min-w-[160px] shadow-lg hover:shadow-violet-500/25"
                    >
                        {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <><Wand2 size={18} className="mr-2" /> Generate</>}
                    </button>
                </div>
                {aiError && <p className="text-red-500 dark:text-red-400 text-sm mt-3 relative z-10">{aiError}</p>}
            </div>

            <div className="bg-gradient-to-br from-cyan-50 dark:from-cyan-900/20 via-blue-50 dark:via-blue-900/20 to-indigo-50 dark:to-indigo-900/20 rounded-2xl p-6 mb-8 border border-cyan-100 dark:border-cyan-800/30 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-2xl"></div>
                <h2 className="flex items-center text-lg font-bold text-cyan-900 dark:text-cyan-300 mb-3 relative z-10">
                    <Camera className="text-cyan-500 mr-2" size={20} />
                    AI Recipe from Image
                </h2>
                <p className="text-sm text-cyan-700 dark:text-cyan-400 mb-4 relative z-10">Upload a photo of any dish and let AI create the recipe for you!</p>
                <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={handleAiImageGenerate}
                        className="flex-grow px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-cyan-200 dark:border-cyan-700 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
                        ref={imageInputRef}
                    />
                    <button 
                        type="button"
                        disabled={aiImageLoading || !aiImage}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center min-w-[160px] shadow-lg hover:shadow-cyan-500/25"
                    >
                        {aiImageLoading ? <Loader2 size={18} className="animate-spin" /> : <><Sparkle size={18} className="mr-2" /> Analyze</>}
                    </button>
                </div>
                {aiImagePreview && (
                    <div className="mt-4 relative z-10">
                        <p className="text-sm text-cyan-600 dark:text-cyan-400 mb-2">Preview:</p>
                        <img src={aiImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-cyan-200 dark:border-cyan-700" />
                    </div>
                )}
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
                                    placeholder="Grandma's Secret Lasagna"
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
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-semibold bg-black/70 px-4 py-2 rounded-lg backdrop-blur">Click to change image</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1 text-center flex flex-col items-center justify-center">
                                        <div className="bg-gradient-to-r from-cyan-100 dark:from-cyan-900/50 to-blue-100 dark:to-blue-900/50 text-cyan-600 dark:text-cyan-400 rounded-2xl p-4 mb-3">
                                            <UploadCloud size={32} />
                                        </div>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500">
                                                <span>Upload a file</span>
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleGenerateImage}
                                disabled={imageGenLoading || !title.trim() || ingredientList.filter(i => i.trim()).length === 0}
                                className="mt-3 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-amber-500/25"
                            >
                                {imageGenLoading ? <Loader2 size={18} className="animate-spin" /> : <><ImageIcon size={18} className="mr-2" /> Generate AI Image</>}
                            </button>
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
                                placeholder="Step 1: Preheat oven to 350°F...
Step 2: Mix dry ingredients...
Step 3: Combine with wet ingredients..."
                            />
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 border-t border-gray-100 dark:border-slate-600 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-white dark:bg-slate-700 py-3 px-6 border-2 border-gray-200 dark:border-slate-600 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-300 dark:hover:border-slate-500 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex justify-center items-center py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-70 min-w-[160px]"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Publish Recipe'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipe;
