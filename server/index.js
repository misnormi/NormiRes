import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.js';
import { fileRoutes } from './routes/files.js';
import { chartRoutes } from './routes/charts.js';
import { initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`NormiRes API running at http://localhost:${PORT}`);
  });
}

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/charts', chartRoutes);

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
