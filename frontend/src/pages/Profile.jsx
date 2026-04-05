import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { User, Settings, LogOut, Heart, BookOpen, PlusCircle, Loader2, Edit2, Trash2 } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('myRecipes');
    const [myRecipes, setMyRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [recipesRes, profileRes] = await Promise.all([
                api.get('/recipes?keyword='),
                api.get('/auth/profile')
            ]);
            
            const allRecipes = recipesRes.data.recipes;
            const userRecipes = allRecipes.filter(r => r.user?._id === user._id || r.user === user._id);
            const favIds = profileRes.data.favorites || [];
            
            setMyRecipes(userRecipes);
            
            if (favIds.length > 0) {
                const favRecipes = await Promise.all(
                    favIds.map(id => api.get(`/recipes/${id}`).catch(() => null))
                );
                setFavorites(favRecipes.filter(r => r).map(r => r.data));
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (recipeId) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;
        
        setDeleting(recipeId);
        try {
            await api.delete(`/recipes/${recipeId}`);
            setMyRecipes(myRecipes.filter(r => r._id !== recipeId));
        } catch (error) {
            alert('Failed to delete recipe');
        } finally {
            setDeleting(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 size={48} className="animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl shadow-2xl mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl">
                        <User size={48} className="text-white" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{user.name}</h1>
                        <p className="text-gray-300 dark:text-gray-400 text-lg">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                <span className="text-cyan-400 font-bold text-xl">{myRecipes.length}</span>
                                <span className="text-gray-300 ml-2">Recipes</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                <span className="text-pink-400 font-bold text-xl">{favorites.length}</span>
                                <span className="text-gray-300 ml-2">Favorites</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/create-recipe"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25"
                        >
                            <PlusCircle size={20} />
                            Create Recipe
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/20"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
                <button
                    onClick={() => setActiveTab('myRecipes')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        activeTab === 'myRecipes'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                >
                    <BookOpen size={18} />
                    My Recipes
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        activeTab === 'favorites'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                >
                    <Heart size={18} />
                    Favorites
                    {favorites.length > 0 && (
                        <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{favorites.length}</span>
                    )}
                </button>
            </div>

            {activeTab === 'myRecipes' && (
                <div>
                    {myRecipes.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                            <div className="bg-gray-100 dark:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={40} className="text-gray-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No recipes yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Start sharing your culinary creations!</p>
                            <Link
                                to="/create-recipe"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl"
                            >
                                <PlusCircle size={20} />
                                Create Your First Recipe
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {myRecipes.map((recipe) => (
                                <div key={recipe._id} className="relative">
                                    <RecipeCard recipe={recipe} />
                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                        <Link
                                            to={`/edit-recipe/${recipe._id}`}
                                            className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors text-cyan-600 dark:text-cyan-400"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(recipe._id)}
                                            disabled={deleting === recipe._id}
                                            className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-red-500 disabled:opacity-50"
                                        >
                                            {deleting === recipe._id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'favorites' && (
                <div>
                    {favorites.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                            <div className="bg-gray-100 dark:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart size={40} className="text-gray-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No favorites yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Save recipes you love for easy access!</p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl"
                            >
                                Explore Recipes
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map((recipe) => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
