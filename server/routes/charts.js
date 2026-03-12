import { Router } from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const DEPARTMENTS = ['BSED', 'BSHM', 'BSBA', 'BSCRIM', 'BSIT', 'MAED'];

export const chartRoutes = Router();
chartRoutes.use(authMiddleware);

chartRoutes.get('/', async (req, res) => {
  const user = await db.users.getById(req.userId);
  const isDean = user?.role && user.role.toLowerCase() === 'dean';

  let departments = DEPARTMENTS;
  if (isDean && user.department) {
    const deanDept = String(user.department).toUpperCase();
    departments = [deanDept];
  }

  const deptCounts = await db.files.countByDepartment(departments);
  const chart_labels = departments;
  const chart_values = departments.map((d) => deptCounts[d] || 0);

  const now = new Date();
  const monthStarts = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    monthStarts.push({ start: d.getTime(), end: next.getTime() });
  }
  const counts = isDean && user?.department
    ? await db.files.countByMonthRangeForDepartment(monthStarts, user.department)
    : await db.files.countByMonthRange(monthStarts);
  let cumulative = 0;
  const line_values = counts.map((c) => (cumulative += c));
  const line_labels = monthStarts.map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  return res.json({
    chart_labels,
    chart_values,
    line_labels,
    line_values,
  });
});
