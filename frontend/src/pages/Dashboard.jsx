import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { 
  LayoutDashboard, ChefHat, Heart, Eye, Star, TrendingUp, 
  Plus, Calendar, Users, MessageCircle, Activity
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass-card rounded-2xl p-6"
  >
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change && (
        <span className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/analytics/dashboard').then(res => res.data)
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { icon: ChefHat, label: 'Total Recipes', value: data?.totalRecipes || 0, color: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
    { icon: Heart, label: 'Total Likes', value: data?.totalLikes || 0, color: 'bg-gradient-to-br from-pink-500 to-rose-500' },
    { icon: Eye, label: 'Total Views', value: data?.totalViews || 0, color: 'bg-gradient-to-br from-violet-500 to-purple-500' },
    { icon: MessageCircle, label: 'Reviews', value: data?.totalReviews || 0, color: 'bg-gradient-to-br from-amber-500 to-orange-500' },
    { icon: Star, label: 'Avg Rating', value: data?.avgRating || '0.0', color: 'bg-gradient-to-br from-yellow-500 to-amber-500' },
    { icon: Users, label: 'Followers', value: data?.followersCount || 0, color: 'bg-gradient-to-br from-emerald-500 to-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Overview</span>
        </h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your recipes.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-cyan-400" />
              Recent Recipes
            </h2>
            <Link to="/create-recipe" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {data?.recentRecipes?.length > 0 ? (
              data.recentRecipes.map((recipe) => (
                <div key={recipe._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-700">
                    <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium truncate">{recipe.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Eye size={14} /> {recipe.views || 0}</span>
                      <span className="flex items-center gap-1"><Heart size={14} /> {recipe.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ChefHat className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No recipes yet</p>
                <Link to="/create-recipe" className="text-cyan-400 text-sm mt-2 inline-block">
                  Create your first recipe
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="text-purple-400" />
              Activity Overview
            </h2>
          </div>
          {data?.dailyStats?.length > 0 ? (
            <div className="space-y-3">
              {data.dailyStats.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm w-20">{day._id}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.views / Math.max(...data.dailyStats.map(d => d.views))) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <span className="text-white text-sm w-8">{day.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No activity data available
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Link
          to="/create-recipe"
          className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <Plus size={24} />
          Create New Recipe
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;