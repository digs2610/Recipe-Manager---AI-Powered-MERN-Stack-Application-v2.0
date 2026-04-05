import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import ShareButton from '../components/ShareButton';
import { Star, Clock, User, CheckCircle, ArrowLeft, Loader2, Send, MessageSquare, Coffee, Sun, Moon, Cake, Cookie, Salad, Heart, Edit2, Users, Gauge, Check, Circle } from 'lucide-react';

const categoryConfig = {
    Breakfast: { icon: Coffee, color: 'from-orange-400 to-amber-500' },
    Lunch: { icon: Sun, color: 'from-yellow-400 to-orange-500' },
    Dinner: { icon: Moon, color: 'from-purple-400 to-indigo-500' },
    Dessert: { icon: Cake, color: 'from-pink-400 to-rose-500' },
    Snack: { icon: Cookie, color: 'from-green-400 to-emerald-500' },
    Salad: { icon: Salad, color: 'from-emerald-400 to-green-500' },
};

const RecipeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [liking, setLiking] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [completedSteps, setCompletedSteps] = useState([]);
    
    const parseSteps = (instructionText) => {
        if (!instructionText) return [];
        const lines = instructionText.split('\n').filter(line => line.trim());
        return lines.map(line => {
            const cleaned = line.replace(/^(Step\s*\d+[:\.]?|[\d]+\.)\s*/i, '').trim();
            return cleaned || line.trim();
        }).filter(Boolean);
    };
    
    const toggleStep = (index) => {
        setCompletedSteps(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };
    
    const steps = parseSteps(recipe?.instructions);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data } = await api.get(`/recipes/${id}`);
                setRecipe(data);
                if (user) {
                    setIsOwner(data.user?._id === user._id || data.user === user._id);
                }
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setLiking(true);
        try {
            const { data } = await api.post(`/recipes/${id}/like`);
            setRecipe(prev => ({
                ...prev,
                likes: data.liked 
                    ? [...(prev.likes || []), user._id]
                    : (prev.likes || []).filter(l => l.toString() !== user._id)
            }));
        } catch (err) {
            console.error('Failed to like recipe');
        } finally {
            setLiking(false);
        }
    };

    const isLiked = user && recipe?.likes?.some(l => l.toString() === user._id);

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/recipes/${id}/reviews`, { rating, comment });
            const { data } = await api.get(`/recipes/${id}`);
            setRecipe(data);
            setComment('');
            setReviewError('');
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Could not submit review');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-cyan-500" /></div>;
    if (error) return <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm text-red-600 dark:text-red-400 p-6 rounded-2xl text-center max-w-2xl mx-auto my-10 border border-red-100/50 dark:border-red-800/50 shadow-lg">{error}</div>;

    const imageUrl = recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`;
    const config = categoryConfig[recipe.category] || { icon: Coffee, color: 'from-cyan-500 to-blue-500' };
    const CategoryIcon = config.icon;
    const colorClass = config.color;

    return (
        <div className="max-w-5xl mx-auto my-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 dark:from-slate-700 to-gray-50 dark:to-slate-800 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-semibold transition">
                        <ArrowLeft size={18} className="mr-2" /> Back to recipes
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShareButton recipe={recipe} />
                        {isOwner && (
                            <Link to={`/edit-recipe/${recipe._id}`} className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-semibold px-3 py-2 rounded-lg transition">
                                <Edit2 size={14} /> Edit
                            </Link>
                        )}
                        <div className={`bg-gradient-to-r ${colorClass} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5`}>
                            <CategoryIcon size={12} />
                            {recipe.category}
                        </div>
                    </div>
                </div>

                <div className="h-80 md:h-[450px] w-full overflow-hidden relative">
                    <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end">
                        <div className="p-8 w-full text-white">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 drop-shadow-lg">{recipe.title}</h1>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-1">
                                        <User size={14} className="text-white" />
                                    </div>
                                    <span className="font-medium">{recipe.user?.name || 'Community'}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold">{recipe.rating.toFixed(1)} ({recipe.numReviews} Reviews)</span>
                                </div>
                                <button 
                                    onClick={handleLike}
                                    disabled={liking}
                                    className={`flex items-center space-x-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 transition hover:bg-white/25 ${isLiked ? 'text-red-400' : 'text-white'}`}
                                >
                                    <Heart size={18} className={isLiked ? 'fill-red-400' : ''} />
                                    <span className="font-medium">{recipe.likes?.length || 0}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-cyan-50 dark:from-cyan-900/20 to-blue-50 dark:to-blue-900/20 border-y border-gray-100 dark:border-slate-700">
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm">
                            <Clock size={18} className="text-cyan-600 dark:text-cyan-400" />
                            <span className="text-gray-600 dark:text-gray-300">Cook Time:</span>
                            <span className="font-bold text-gray-800 dark:text-white">{recipe.cookingTime || '30 mins'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm">
                            <Gauge size={18} className="text-cyan-600 dark:text-cyan-400" />
                            <span className="text-gray-600 dark:text-gray-300">Difficulty:</span>
                            <span className="font-bold text-gray-800 dark:text-white">{recipe.difficulty || 'Easy'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm">
                            <Users size={18} className="text-cyan-600 dark:text-cyan-400" />
                            <span className="text-gray-600 dark:text-gray-300">Servings:</span>
                            <span className="font-bold text-gray-800 dark:text-white">{recipe.servings || 4} people</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-1 border-r pr-8 border-gray-100 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">1</span> 
                            Ingredients
                        </h2>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx} className="flex items-start bg-gradient-to-r from-cyan-50 dark:from-cyan-900/20 to-blue-50 dark:to-blue-900/20 p-3.5 rounded-xl border border-cyan-100/50 dark:border-cyan-800/30">
                                    <CheckCircle size={18} className="text-cyan-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{ing}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-8 h-8 rounded-full inline-flex items-center justify-center mr-3 text-sm">2</span> 
                            Instructions
                        </h2>
                        
                        {steps.length > 1 ? (
                            <div className="space-y-3">
                                {steps.map((step, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => toggleStep(idx)}
                                        className={`flex items-start p-4 rounded-2xl border transition-all cursor-pointer ${
                                            completedSteps.includes(idx)
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 opacity-60'
                                                : 'bg-gradient-to-br from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 border-gray-100 dark:border-slate-600 hover:border-cyan-300 dark:hover:border-cyan-600'
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-0.5 transition-colors ${
                                            completedSteps.includes(idx)
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                        }`}>
                                            {completedSteps.includes(idx) ? <Check size={16} /> : <span className="text-sm font-bold">{idx + 1}</span>}
                                        </div>
                                        <p className={`flex-1 leading-relaxed ${
                                            completedSteps.includes(idx)
                                                ? 'line-through text-gray-500 dark:text-gray-400'
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm">
                                {recipe.instructions}
                            </div>
                        )}

                        <hr className="my-10 border-gray-100 dark:border-slate-700" />

                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <MessageSquare size={22} className="text-cyan-600 dark:text-cyan-400 mr-2" />
                            Reviews & Ratings
                        </h2>
                        
                        {user ? (
                            <div className="bg-gradient-to-br from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 mb-8">
                                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Write a Review</h3>
                                {reviewError && <div className="text-red-500 dark:text-red-400 text-sm mb-3 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{reviewError}</div>}
                                <form onSubmit={submitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                >
                                                    <Star size={28} className={rating >= star ? 'fill-yellow-400' : ''} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                                        <textarea 
                                            required 
                                            rows="4" 
                                            value={comment} 
                                            onChange={(e) => setComment(e.target.value)}
                                            className="shadow-sm block w-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent sm:text-sm border-2 border-gray-100 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            placeholder="Share your thoughts on this recipe..."
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                                        <Send size={16} className="mr-2" /> Submit Review
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-50 dark:from-slate-700 to-slate-50 dark:to-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 mb-8 text-center text-gray-600 dark:text-gray-400">
                                Please <Link to="/login" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">login</Link> to write a review.
                            </div>
                        )}

                        <div className="space-y-4">
                            {recipe.reviews.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first!</p>}
                            {recipe.reviews.map((r, i) => (
                                <div key={i} className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <strong className="block text-gray-900 dark:text-white font-bold">{r.name}</strong>
                                            <div className="flex text-yellow-500 my-2">
                                                {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} className="fill-yellow-500"/>)}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium bg-gray-100 dark:bg-slate-600 px-3 py-1 rounded-full">{r.createdAt.substring(0, 10)}</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 bg-gray-50 dark:bg-slate-600/50 rounded-xl p-4">{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
