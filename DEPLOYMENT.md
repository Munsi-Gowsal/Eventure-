# Eventure Deployment Guide

## 1. Deployment Architecture
- **Frontend**: React + Vite SPA, hosted on Vercel. Vercel acts as a CDN and static file server. SPA routing is handled via `vercel.json` rewrites.
- **Backend**: Node.js + Express API, hosted on Render or Railway. Responsible for all business logic, authentication, and database interaction.
- **Database**: MongoDB Atlas (M0/shared cluster).

## 2. MongoDB Atlas Setup
1. Create an M0/shared cluster in MongoDB Atlas.
2. Under "Database Access", create a dedicated database user (e.g., `eventure_prod_user`). Do not use your organization admin account.
3. Generate a strong, random password.
4. Restrict permissions to "Read and write to any database" (or restrict specifically to the Eventure database).
5. Under "Network Access", allowlist the static outbound IPs of your backend deployment platform. If static IPs are unavailable, allow `0.0.0.0/0` (allow access from anywhere) but ensure your database user has a very strong password.
6. Copy the production `MONGODB_URI` string. **Do not commit this to Git.**

## 3. Backend Deployment
1. Deploy the `backend/` directory to Render or Railway.
2. **Build Command**: `npm ci && npm run build`
3. **Start Command**: `node dist/server.js`
4. Configure the following environment variables in the deployment platform dashboard:
   - `NODE_ENV=production`
   - `PORT=5001` (or let the platform inject it)
   - `MONGODB_URI=<Your Atlas URI>`
   - `JWT_ACCESS_SECRET=<Strong Random String>`
   - `JWT_REFRESH_SECRET=<Different Strong Random String>`
   - `JWT_ACCESS_EXPIRES_IN=15m`
   - `JWT_REFRESH_EXPIRES_IN=7d`
   - `CLIENT_URL=https://your-eventure.vercel.app` (Placeholder for now)
   - `CORS_ORIGINS=https://your-eventure.vercel.app` (Placeholder for now)
5. Ensure the platform provides an HTTPS endpoint.

## 4. Frontend Deployment
1. Deploy the `frontend/` directory to Vercel.
2. **Framework**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Configure the environment variable in the Vercel dashboard:
   - `VITE_API_BASE_URL=https://<YOUR-BACKEND-DOMAIN>/api/v1`
6. Deploy to receive your final production Vercel URL.

## 5. Environment Variable Names
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL`
- `CORS_ORIGINS`
- `VITE_API_BASE_URL`

## 6. Deployment Order
1. Provision MongoDB Atlas.
2. Deploy Backend (placeholder CORS/CLIENT_URL).
3. Deploy Frontend (with actual backend API URL).
4. Update Backend CORS (with actual frontend URL).

## 7. CORS Configuration
After Vercel provides the final production URL (e.g., `https://eventure-prod.vercel.app`), update the backend environment variables `CLIENT_URL` and `CORS_ORIGINS` to match exactly. Do not use a trailing slash. Redeploy the backend.

## 8. Production Cookie Verification
Log in as an admin on the production frontend. Open browser DevTools -> Application -> Cookies. Verify the `refreshToken` cookie is present and has the following flags checked:
- `HttpOnly`
- `Secure`
- `SameSite=Strict`

## 9. Production E2E Verification
(See the checklist below for required verification steps).

## 10. Security Verification
- Ensure `credentials: true` in CORS does not use `*`.
- Access tokens must never be visible in localStorage/sessionStorage.
- Ensure no secrets (`.env`) are committed to Git.

## 11. Rollback/Basic Troubleshooting
- If the frontend fails to log in, check the Network tab. If CORS fails, verify `CORS_ORIGINS` on the backend matches the Vercel URL exactly.
- If SPA routes return 404 on refresh, ensure `vercel.json` is present in the frontend root.
- If the database fails to connect, verify Network Access rules in MongoDB Atlas.

---

## Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Production database user created
- [ ] Network access configured
- [ ] MONGODB_URI configured on backend
- [ ] Backend deployed
- [ ] /health returns 200
- [ ] /ready returns 200
- [ ] HTTPS confirmed
- [ ] Frontend deployed
- [ ] VITE_API_BASE_URL configured
- [ ] Final Vercel URL obtained
- [ ] Backend CLIENT_URL updated
- [ ] Backend CORS_ORIGINS updated
- [ ] Backend redeployed
- [ ] Refresh cookie verified
- [ ] Public browsing verified
- [ ] Search verified
- [ ] Filtering verified
- [ ] Event registration verified
- [ ] Attendee count verified
- [ ] Admin login verified
- [ ] Admin create verified
- [ ] Admin update verified
- [ ] Admin soft delete verified
- [ ] Logout verified
- [ ] Protected routes verified
- [ ] Production frontend bundle inspected
- [ ] No secrets exposed
- [ ] SPA route refresh verified
