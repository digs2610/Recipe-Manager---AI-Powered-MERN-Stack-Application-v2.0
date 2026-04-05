import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, UtensilsCrossed } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || err.message || err.data?.message || 'Login Failed';
            setErrorMsg(msg);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4">
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 text-center">
                        <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <UtensilsCrossed size={32} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
                        <p className="text-gray-300 dark:text-gray-400 mt-2">Sign in to continue cooking</p>
                    </div>
                    
                    <div className="p-8">
                        {errorMsg && (
                            <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-center text-sm font-medium border border-red-100/50 dark:border-red-800/50">
                                {errorMsg}
                            </div>
                        )}
                        <form onSubmit={submitHandler} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-xl focus:bg-white dark:focus:bg-slate-600 focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-0 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                            >
                                <LogIn size={18} className="mr-2" />
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                            New to RecipeHub?{' '}
                            <Link to="/register" className="font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
