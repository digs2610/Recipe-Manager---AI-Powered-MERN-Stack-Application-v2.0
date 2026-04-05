import api from './api';

export const askRecipeByName = async (recipeName, language = 'en') => {
    const { data } = await api.post('/recipes/ask-by-name', { recipeName, language });
    return data;
};

export const generateCompleteRecipe = async (recipeName, language = 'en') => {
    const { data } = await api.post('/recipes/generate-complete', { recipeName, language });
    return data;
};

export const generateRecipeImage = async (title, ingredients, category) => {
    const { data } = await api.post('/recipes/ai-generate-image', { title, ingredients, category });
    return data;
};
