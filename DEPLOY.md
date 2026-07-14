# Production Deployment Guide

Follow these steps to deploy your MERN application to production.

## 1. MongoDB Atlas Configuration
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster.
3. Under **Network Access**, add IP `0.0.0.0/0` (or add specific deployment server IPs) to whitelist connections.
4. Under **Database Access**, create a user with read/write privileges.
5. Extract the Connection URI and substitute your `<username>` and `<password>`. Use this string in your backend `.env` variables (`MONGODB_URI`).

## 2. Backend Deployment on Render (or Railway)
1. Log in to [Render](https://render.com/).
2. Create a new **Web Service** and link your Git repository.
3. Configure the following parameters:
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add all environment variables (copied from `backend/.env.example`) under **Environment Variables** in Render's dashboard.
5. Deploy and copy the backend URL (e.g. `https://your-api.onrender.com`).

## 3. Frontend Deployment on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** > **Project** and select your repository.
3. Configure project options:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables under Vercel project configurations:
   - Ensure the proxy in `vite.config.js` is updated or your API helper `api.js` points directly to your deployed backend URL for production builds. 
5. Click **Deploy**. Copy the frontend URL (e.g. `https://your-app.vercel.app`).
6. Remember to update the `FRONTEND_URL` environment variable on Render with this Vercel address to avoid CORS blocks.
