# Recipe Manager - AI-Powered MERN Stack Application v2.0

A full-stack recipe management application built with the MERN stack (MongoDB, Express, React, Node.js). Features include recipe creation, AI-powered recipe suggestions, user authentication, meal planning, grocery lists, and more.

## ⭐ New Features v2.0

- **AI Chef Chatbot** - Interactive cooking assistant
- **Meal Planner** - Weekly diet plans with AI
- **Smart Grocery List** - Auto-generate shopping lists
- **Nutrition Analysis** - Calories, protein, macros
- **User Dashboard** - Analytics and insights
- **Access Codes** - Invite system
- **3D Animations** - Three.js hero sections
- **Glassmorphism UI** - Modern futuristic design
- **PWA Support** - Installable app

## Project Structure

```
recipe-manager/
├── backend/                    # Node.js/Express server
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── recipeController.js # Recipe CRUD
│   │   ├── aiController.js    # AI features
│   │   ├── analyticsController.js # Analytics
│   │   └── accessCodeController.js # Access codes
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT auth
│   │   ├── cacheMiddleware.js  # Redis caching
│   │   ├── errorMiddleware.js  # Error handling
│   │   └── uploadMiddleware.js # File upload
│   ├── models/
│   │   ├── Recipe.js          # Recipe schema
│   │   ├── User.js            # User schema
│   │   ├── Analytics.js       # Analytics schema
│   │   └── AccessCode.js      # Access codes
│   ├── routes/
│   │   ├── authRoutes.js      # Auth API
│   │   ├── recipeRoutes.js    # Recipe API
│   │   ├── aiRoutes.js        # AI API
│   │   ├── analyticsRoutes.js # Analytics API
│   │   └── accessCodeRoutes.js # Access code API
│   ├── services/
│   │   └── aiService.js       # Gemini AI integration
│   ├── utils/
│   │   ├── generateToken.js   # JWT tokens
│   │   ├── validation.js      # Joi validation
│   │   └── instructionParser.js
│   ├── uploads/               # Image uploads
│   ├── .env                   # Environment config
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/                  # React/Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation
│   │   │   ├── Footer.jsx           # Footer
│   │   │   ├── RecipeCard.jsx       # Recipe card
│   │   │   ├── LoadingSpinner.jsx  # Loading
│   │   │   ├── HeroScene.jsx        # 3D scene
│   │   │   ├── QuickViewModal.jsx   # Quick view
│   │   │   ├── SearchIngredients.jsx
│   │   │   ├── AskRecipeModal.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Home with 3D hero
│   │   │   ├── Dashboard.jsx        # User analytics
│   │   │   ├── MealPlanner.jsx      # AI meal plans
│   │   │   ├── GroceryList.jsx      # Smart shopping
│   │   │   ├── AIChat.jsx           # Chef chatbot
│   │   │   ├── SearchResults.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── CreateRecipe.jsx
│   │   │   ├── EditRecipe.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── RecipeContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/
│   │   │   ├── api.js              # Axios + interceptors
│   │   │   └── recipeApi.js
│   │   ├── App.jsx                 # Main + lazy loading
│   │   ├── main.jsx                # Entry + React Query
│   │   └── index.css               # Tailwind + glassmorphism
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js              # PWA config
│   └── index.html
│
├── package.json             # Root scripts
└── README.md
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Three.js |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Database | MongoDB, Mongoose |
| AI | Google Gemini 2.5 Flash API |
| Caching | Redis (optional) |
| File Upload | Multer |
| State | React Query, Context API |
| PWA | vite-plugin-pwa |

## ✨ Features

### Backend
- MongoDB with Mongoose ODM
- JWT Authentication with role-based access
- RESTful API with CRUD operations
- **AI Integration (Gemini API):**
  - Recipe suggestions from ingredients
  - Recipe generation from images
  - AI image generation for recipes
  - Recipe improvement suggestions
  - Ask recipe by name (Hindi/English)
  - **AI Meal Planner** - Weekly diet plans
  - **Smart Grocery List** generator
  - **Nutrition Analysis** (calories, protein, etc.)
  - **AI Chef Chatbot** - Interactive cooking assistant
- File upload with Multer
- Redis caching (optional)
- Rate limiting & Helmet security
- Pagination, search, filters
- Access code / invite system
- Analytics tracking

### Frontend
- React 18 with Vite
- React Router for navigation
- **Framer Motion** animations
- **Three.js** 3D hero sections
- **Glassmorphism** UI design
- Dark theme by default
- React Query for API caching
- Lazy loading components
- PWA support (installable)
- Responsive design

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API key (optional for AI features)

### Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install --legacy-peer-deps
```

### Environment Variables

Create `backend/.env`:
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/recipe-manager
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
REDIS_URL=redis://localhost:6379  # optional
```

### Run the Application

```bash
# Development (both frontend & backend)
npm run dev

# Or separately:
npm run server   # Backend on port 5001
npm run client   # Frontend on port 5173
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register (with optional access code) |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/favorites/:id | Toggle favorite |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | List (with search, filter, pagination) |
| GET | /api/recipes/featured | Featured recipes |
| GET | /api/recipes/trending | Trending recipes |
| GET | /api/recipes/top-rated | Top rated |
| GET | /api/recipes/:id | Get by ID |
| POST | /api/recipes | Create (auth) |
| PUT | /api/recipes/:id | Update (auth) |
| DELETE | /api/recipes/:id | Delete (auth) |
| POST | /api/recipes/:id/like | Like/unlike |
| POST | /api/recipes/:id/reviews | Add review |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/suggest | Recipe from ingredients |
| POST | /api/ai/image-recipe | Recipe from image |
| POST | /api/ai/generate-image | Generate recipe image |
| POST | /api/ai/improve | Improve recipe |
| POST | /api/ai/ask-by-name | Get recipe by name |
| POST | /api/ai/meal-plan | Generate meal plan |
| POST | /api/ai/grocery-list | Generate shopping list |
| POST | /api/ai/nutrition | Analyze nutrition |
| POST | /api/ai/chat | AI Chef Chatbot |

### Analytics & Access
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/dashboard | User dashboard stats |
| POST | /api/access/validate | Validate access code |
| POST | /api/access | Create access code (admin) |

## 📁 Key Files

- `backend/server.js` - Express app entry
- `backend/services/aiService.js` - Gemini AI integration
- `frontend/src/App.jsx` - Main app with routing
- `frontend/src/components/HeroScene.jsx` - Three.js 3D scene
- `frontend/src/pages/AIChat.jsx` - Chef chatbot
- `frontend/src/pages/MealPlanner.jsx` - AI meal planner
- `frontend/src/pages/GroceryList.jsx` - Smart grocery list

## 🎨 UI Features

- Glassmorphism cards with backdrop blur
- Animated gradient backgrounds
- 3D floating elements in hero
- Smooth page transitions
- Skeleton loading states
- Responsive grid layouts
- Custom scrollbars
- Glowing effects

## 📦 Scripts

```bash
npm start       # Production server
npm run dev     # Development (both)
npm run server  # Backend only
npm run client  # Frontend only
npm run build   # Build frontend
```