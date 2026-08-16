# Eventure Deployment Guide (Render + Vercel)

This document provides step-by-step instructions for deploying the Eventure application.
The backend will be deployed as a Render Web Service, and the frontend will be deployed on Vercel later.

## 1. MongoDB Atlas Setup
1. Create a free MongoDB Atlas cluster.
2. Under "Database Access", create a dedicated database user with a **strong generated password**.
3. Under "Network Access", add `0.0.0.0/0` (Allow access from anywhere) so Render can connect.
4. Copy your connection string (it should look like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventure?retryWrites=true&w=majority`).

## 2. Render Backend Setup
1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure the following settings EXACTLY as follows:

- **Root Directory**: `backend/`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `node dist/server.js`

## 3. Render Health Check
Render requires a health check endpoint to know when your service is live and ready to receive traffic.
- **Health Check Path**: `/health`

## 4. Environment Variables
Add the following required environment variables to your Render Web Service dashboard under "Environment".
*(Never commit these secrets to GitHub!)*

- `NODE_ENV`: `production`
- `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
- `JWT_ACCESS_SECRET`: `<Generate a random string of at least 32 characters>`
- `JWT_REFRESH_SECRET`: `<Generate a DIFFERENT random string of at least 32 characters>`
- `JWT_ACCESS_EXPIRES_IN`: `15m`
- `JWT_REFRESH_EXPIRES_IN`: `7d`
- `CLIENT_URL`: `https://your-eventure-frontend.vercel.app` (Placeholder until Vercel is deployed)
- `CORS_ORIGINS`: `https://your-eventure-frontend.vercel.app` (Placeholder until Vercel is deployed)

*(Note: Render automatically injects a `PORT` environment variable. The backend uses `process.env.PORT` to bind to the correct port safely. Locally, it defaults to 5001).*

## 5. Security & Networking
- **Local vs Production PORT behavior**: Locally, the server binds to port 5001. On Render, it dynamically binds to the port provided by Render (via `process.env.PORT`) and listens on `0.0.0.0`.
- **CORS Configuration**: CORS explicitly rejects any origin not defined in `CORS_ORIGINS`. It is configured strictly.
- **HTTPS Expectation**: Render provides automatic HTTPS out of the box.

## 6. Vercel Frontend Deployment
*Frontend deployment instructions will be added here during the frontend deployment phase.*

---

## 7. Render Deployment Checklist

[ ] MongoDB Atlas database created
[ ] Dedicated MongoDB database user created
[ ] Strong database password generated
[ ] Atlas network access configured
[ ] MONGODB_URI added to Render environment
[ ] JWT_ACCESS_SECRET added to Render
[ ] JWT_REFRESH_SECRET added to Render
[ ] CLIENT_URL configured
[ ] CORS_ORIGINS configured
[ ] Render root directory set to backend/
[ ] Render build command configured
[ ] Render start command configured
[ ] Render health check configured as /health
[ ] HTTPS verified
[ ] GET /health returns 200
[ ] GET /ready returns 200
[ ] Public GET /api/v1/events works
[ ] Admin login works
[ ] Event creation works
[ ] Event update works
[ ] Event registration works
[ ] Soft delete works
[ ] Refresh-token cookie has Secure
[ ] Refresh-token cookie has HttpOnly
[ ] Refresh-token cookie has SameSite=Strict
[ ] Production CORS verified
[ ] No secrets in frontend bundle
[ ] No secrets committed to git
