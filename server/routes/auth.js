import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { authMiddleware, signToken } from '../middleware/auth.js';

export const authRoutes = Router();

function isAdminEmail(email) {
  if (!email) return false;
  return email.toLowerCase().startsWith('admin');
}

async function requireAdmin(req, res) {
  const user = await db.users.getById(req.userId);
  const isRoleAdmin = user?.role && user.role.toLowerCase() === 'admin';
  const isEmailAdmin = isAdminEmail(req.userEmail || user?.email);
  if (!isRoleAdmin && !isEmailAdmin) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return user;
}

authRoutes.post('/signup', async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;
    const emailNorm = (email || '').trim().toLowerCase();
    if (!emailNorm || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (await db.users.getByEmail(emailNorm)) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.users.create(emailNorm, password_hash);
    return res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNorm = (email || '').trim().toLowerCase();
    if (!emailNorm || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await db.users.getByEmail(emailNorm);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role || 'user' });
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        role: user.role || 'user',
        department: user.department || '',
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

authRoutes.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ ok: true });
});

authRoutes.get('/me', authMiddleware, async (req, res) => {
  const user = await db.users.getById(req.userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      role: user.role || 'user',
      department: user.department || '',
    },
  });
});

authRoutes.post('/admin/users', authMiddleware, async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const {
      email,
      password,
      passwordConfirm,
      firstName,
      lastName,
      username,
      role,
      department,
    } = req.body;
    const emailNorm = (email || '').trim().toLowerCase();
    if (!emailNorm || !password || !passwordConfirm || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (await db.users.getByEmail(emailNorm)) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.users.create(emailNorm, password_hash, {
      first_name: firstName,
      last_name: lastName,
      username,
      role,
      department,
    });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

authRoutes.get('/admin/users', authMiddleware, async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const users = await db.users.listAll();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

authRoutes.patch('/admin/users/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const { id } = req.params;
    const { firstName, lastName, username, role, department } = req.body;
    const updated = await db.users.update(id, {
      first_name: firstName,
      last_name: lastName,
      username,
      role,
      department,
    });
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ user: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});

authRoutes.delete('/admin/users/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const { id } = req.params;
    const ok = await db.users.delete(id);
    if (!ok) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
});
