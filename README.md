# Eventure

## Testing with Postman

1. Import `backend/postman/collection.json`.
2. Import `backend/postman/environment.json`.
3. Select **Eventure Local** environment in the top right.
4. Start MongoDB (ensure it's running locally).
5. Start the Eventure backend (`npm run dev` or `npm run start`).
6. Run the **Register Admin (Dev Only)** request in the Authentication folder. *Note: Admin registration is for development/provisioning only and is blocked in production.*
7. Run **Login** to automatically save your access token and refresh cookie.
8. Continue executing requests in the numbered order to explore the complete Eventure API.
