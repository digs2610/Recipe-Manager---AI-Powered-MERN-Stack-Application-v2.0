import jwt from 'jsonwebtoken';

const generateToken = (id, options = {}) => {
  const defaultOptions = {
    expiresIn: options.expiresIn || '30d'
  };
  
  return jwt.sign({ id }, process.env.JWT_SECRET || 'recipe-secret-key-2024', defaultOptions);
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id, type: 'refresh' }, process.env.JWT_SECRET || 'recipe-secret-key-2024', {
    expiresIn: '7d'
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'recipe-secret-key-2024');
  } catch (error) {
    return null;
  }
};

export default generateToken;