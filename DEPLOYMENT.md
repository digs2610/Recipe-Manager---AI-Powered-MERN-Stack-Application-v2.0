# Recipe Manager Deployment Guide

This document outlines the steps to deploy the complete Recipe Manager MERN application.

## 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and create a new database user.
3. Go to **Network Access** and add IP address `0.0.0.0/0` (allow from anywhere).
4. Click **Connect**, choose "Connect your application", and copy the connection string.
5. Replace `<password>` with the password you created.

## 2. Backend Deployment (Render or Railway)
For Render (Recommended):
1. Push your code to a GitHub repository.
2. Sign up on [Render.com](https://render.com/).
3. Click **New > Web Service** and connect your GitHub repo.
4. Settings:
   - **Root Directory**: `backend` (if you run it from there, or modify `package.json` at root to start backend).
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default, Render sets it)
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A strong random string.
6. Note on Images: Render free tier spins down and uses ephemeral storage. For production image uploads, you should replace the Multer local storage with AWS S3 or Cloudinary.

## 3. Frontend Deployment (Vercel)
1. In the `frontend` folder, open `vite.config.js`. You will need to remove the proxy config or point the API base URL directly to your deployed backend URL in `src/utils/api.js`.
2. Push your code to GitHub.
3. Sign up on [Vercel.com](https://vercel.com/).
4. Click **Add New > Project** and select your GitHub repo.
5. In the config:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**.

## Environment Variable Setup
Before deploying, make sure you have the following ready:
**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/recipe-manager
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
```

**Frontend**
If you update `api.js` for production, you can use `.env` in the React frontend:
```env
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
```
Update `src/utils/api.js`:
```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});
```

Congratulations! Your MERN stack application is now fully deployed.
