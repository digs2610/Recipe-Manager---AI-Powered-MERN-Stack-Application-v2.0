import Redis from 'ioredis';

const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : null;

const DEFAULT_TTL = 300;

const cacheMiddleware = async (req, res, next) => {
  if (!redis || process.env.NODE_ENV === 'development') {
    return next();
  }

  if (req.method !== 'GET') {
    return next();
  }

  const key = `cache:${req.originalUrl}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch (error) {
    console.error('Redis cache error:', error);
  }

  const originalJson = res.json.bind(res);
  
  res.json = async (data) => {
    try {
      if (res.statusCode === 200) {
        await redis.setex(key, DEFAULT_TTL, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Redis cache set error:', error);
    }
    return originalJson(data);
  };

  next();
};

export const clearCache = async (pattern) => {
  if (!redis) return;
  const keys = await redis.keys(`cache:${pattern}`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

export const invalidateRecipeCache = async (recipeId) => {
  if (!redis) return;
  await clearCache(`/api/recipes*`);
};

export default cacheMiddleware;