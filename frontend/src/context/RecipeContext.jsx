import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecipes = useCallback(async (keyword = '', category = '', page = 1) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/recipes?keyword=${keyword}&category=${category}&pageNumber=${page}`);
            setRecipes(data.recipes);
            setError(null);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createRecipe = async (recipeData) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/recipes', recipeData, config);
            return data;
        } catch (err) {
            throw new Error(err.response?.data?.message || err.message);
        }
    };

    return (
        <RecipeContext.Provider value={{ recipes, loading, error, fetchRecipes, createRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};
