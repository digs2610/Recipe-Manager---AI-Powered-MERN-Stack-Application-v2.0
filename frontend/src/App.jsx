import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const CreateRecipe = lazy(() => import('./pages/CreateRecipe'));
const EditRecipe = lazy(() => import('./pages/EditRecipe'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MealPlanner = lazy(() => import('./pages/MealPlanner'));
const GroceryList = lazy(() => import('./pages/GroceryList'));
const AIChat = lazy(() => import('./pages/AIChat'));
const SearchResults = lazy(() => import('./pages/SearchResults'));

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col relative overflow-hidden">
          <Navbar />
          <main className="flex-grow relative z-10">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/create-recipe" element={<CreateRecipe />} />
                <Route path="/edit-recipe/:id" element={<EditRecipe />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                <Route path="/grocery-list" element={<GroceryList />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/search" element={<SearchResults />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;