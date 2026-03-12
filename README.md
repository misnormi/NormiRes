# NormiRes – React + Express

Research project upload app for **Northern Mindanao College, Inc. (NORMI)** with login, dashboard, file upload, and charts.

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Chart.js
- **Backend:** Node.js, Express.js, MongoDB (database: **normi**), Mongoose, JWT (cookie), Multer

## Setup

### Backend

```bash
cd server
npm install
npm run dev
```

API runs at **http://localhost:5000**.

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs at **http://localhost:5173** and proxies `/api` to the backend.

## Features

- **Login / Signup:** Email + password; JWT stored in httpOnly cookie.
- **Dashboard:** Bar chart (published research by department), line chart (total projects over last 6 months).
- **Upload:** Project title, department (BSED, BSHM, BSBA, BSCRIM, BSIT), file, optional description.
- **Projects table:** List, download, delete your uploads.

## Project layout

- `client/` – React + Vite + Tailwind (pages: Login, Signup, Dashboard).
- `server/` – Express API: `routes/auth.js`, `routes/files.js`, `routes/charts.js`, MongoDB (db **normi**), uploads in `uploads/`.

## Environment (optional)

- `server`: `PORT=5000`, `MONGODB_URI=mongodb://127.0.0.1:27017/normi`, `JWT_SECRET=your-secret` (defaults work for dev; ensure MongoDB is running and use connection name **normi** in Compass).
"# THESIS-REPO" 
