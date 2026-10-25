# Nexora — Full-stack Sign Up, Login & Dashboard

Beginner-friendly React + Vite frontend and Node.js + Express backend. User registration is stored by the backend in a local JSON file (`backend/data/users.json`), and the user is redirected to the dashboard after successful sign-up or login.

## Requirements
- Node.js 20+ recommended (Node.js 18+ may work with current package versions)
- npm

## Run locally
Open two terminal windows.

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend API: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite, usually http://localhost:5173.

## How to test
1. Open the frontend.
2. Choose **Create account**.
3. Enter your name, email, and password (password must be at least 8 characters).
4. On successful sign-up, the backend stores the account in `backend/data/users.json` and the frontend opens the dashboard.
5. Sign out, then log in using the same credentials.

## API endpoints
- `GET /api/health` — server health
- `POST /api/auth/signup` — validate and create account
- `POST /api/auth/login` — check existing account

## Data storage and security
This educational project stores account records in a local JSON file so you can see backend persistence without installing a database. Passwords are hashed with Node.js `scrypt` before storage; plain-text passwords are never written to the file. The API returns a demo token and user profile, but this token is not a production-grade session implementation. The dashboard is a learning demo, not secure access control. For production, use a proper database, hardened session/token handling, HTTPS, rate limiting, validation, and server-side authorization. Do not use this demo to store real or sensitive user information.
