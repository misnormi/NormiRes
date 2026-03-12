import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const sub = path.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'));
    const dir = path.join(uploadsDir, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const base = Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    cb(null, base + ext);
  },
});
const upload = multer({ storage });

export const fileRoutes = Router();
fileRoutes.use(authMiddleware);

const DEPARTMENTS = ['BSED', 'BSHM', 'BSBA', 'BSCRIM', 'BSIT', 'MAED'];

fileRoutes.get('/', async (req, res) => {
  const user = await db.users.getById(req.userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const isAdmin =
    (user.role && user.role.toLowerCase() === 'admin') ||
    (user.email || '').toLowerCase().startsWith('admin');
  const isDean = user.role && user.role.toLowerCase() === 'dean';

  let rows;
  if (isAdmin) {
    rows = await db.files.listAll();
  } else if (isDean && user.department) {
    rows = await db.files.listByDepartment(user.department);
  } else {
    rows = await db.files.listByUser(req.userId);
  }

  const fileList = rows.map((r) => ({
    id: r.id,
    file_path: r.file_path,
    profile_image_path: r.profile_image_path || '',
    original_name: r.original_name,
    project_title: r.project_title,
    description: r.description,
    department: r.department,
    author_name: r.author_name || '',
    author_email: r.author_email || user?.email || '',
    advisor: r.advisor || '',
    major: r.major || '',
    published_date: r.published_date,
    created_at: r.created_at,
    display_title: r.project_title || r.original_name || 'Untitled',
    user_email: r.author_email || user?.email || '',
  }));
  return res.json({ files: fileList });
});

fileRoutes.post('/', upload.fields([
  { name: 'document', maxCount: 1 },
  { name: 'profile', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]), async (req, res) => {
  const user = await db.users.getById(req.userId);
  const documentFile = req.files?.document?.[0] || req.files?.file?.[0] || req.file;
  if (!documentFile) {
    return res.status(400).json({ error: 'Document file is required.' });
  }
  const documentPath = path.relative(uploadsDir, documentFile.path).replace(/\\/g, '/');
  let profilePath = '';
  const profileFile = req.files?.profile?.[0];
  if (profileFile) {
    profilePath = path.relative(uploadsDir, profileFile.path).replace(/\\/g, '/');
  }
  const requestedDepartment = req.body.department;
  let department = DEPARTMENTS.includes(requestedDepartment) ? requestedDepartment : 'BSIT';
  const isDean = user?.role && user.role.toLowerCase() === 'dean';
  if (isDean && user.department) {
    const deanDept = String(user.department).toUpperCase();
    if (DEPARTMENTS.includes(deanDept)) {
      department = deanDept;
    }
  }
  const publishedDate = req.body.date ? new Date(req.body.date) : null;
  await db.files.add({
    user_id: req.userId,
    file_path: documentPath,
    profile_image_path: profilePath,
    original_name: documentFile.originalname || '',
    project_title: (req.body.project_title || req.body.title || '').trim().slice(0, 300),
    description: (req.body.description || '').trim().slice(0, 500),
    department,
    author_name: (req.body.author_name || req.body.authorName || '').trim().slice(0, 200),
    author_email: (req.body.author_email || req.body.authorEmail || '').trim().slice(0, 200),
    advisor: (req.body.advisor || '').trim().slice(0, 200),
    major: (req.body.major || '').trim().slice(0, 200),
    published_date: publishedDate,
  });
  return res.json({ message: 'Project published successfully.' });
});

fileRoutes.get('/:id/download', async (req, res) => {
  const row = await db.files.getByIdAndUser(req.params.id, req.userId);
  if (!row) return res.status(404).json({ error: 'File not found.' });
  const fullPath = path.join(uploadsDir, row.file_path);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'File not found.' });
  const name = row.original_name || path.basename(row.file_path);
  return res.download(fullPath, name);
});

fileRoutes.delete('/:id', async (req, res) => {
  const user = await db.users.getById(req.userId);
  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email || '').toLowerCase().startsWith('admin');

  let row;
  if (isAdmin) {
    row = await db.files.getById(req.params.id);
  } else {
    row = await db.files.getByIdAndUser(req.params.id, req.userId);
  }

  if (!row) return res.status(404).json({ error: 'File not found.' });

  const fullPath = path.join(uploadsDir, row.file_path);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

  if (row.profile_image_path) {
    const profilePath = path.join(uploadsDir, row.profile_image_path);
    if (fs.existsSync(profilePath)) fs.unlinkSync(profilePath);
  }

  if (isAdmin) {
    await db.files.deleteAny(req.params.id);
  } else {
    await db.files.delete(req.params.id, req.userId);
  }
  return res.json({ message: 'File deleted.' });
});
