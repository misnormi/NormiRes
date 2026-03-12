import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    first_name: { type: String, default: '' },
    last_name: { type: String, default: '' },
    username: { type: String, default: '' },
    role: { type: String, default: 'user' },
    department: { type: String, default: '' },
  },
  { timestamps: true }
);

const fileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    file_path: { type: String, required: true },
    profile_image_path: { type: String, default: '' },
    original_name: { type: String, default: '' },
    project_title: { type: String, default: '' },
    description: { type: String, default: '' },
    department: { type: String, required: true, default: 'BSIT' },
    author_name: { type: String, default: '' },
    author_email: { type: String, default: '' },
    advisor: { type: String, default: '' },
    major: { type: String, default: '' },
    published_date: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const UploadedFile = mongoose.model('UploadedFile', fileSchema);

export const db = {
  users: {
    async listAll() {
      const docs = await User.find().sort({ createdAt: -1 }).lean();
      return docs.map((doc) => ({
        id: doc._id.toString(),
        email: doc.email,
        first_name: doc.first_name || '',
        last_name: doc.last_name || '',
        username: doc.username || '',
        role: doc.role || 'user',
        department: doc.department || '',
        created_at: doc.createdAt,
      }));
    },
    async getByEmail(email) {
      const doc = await User.findOne({ email: (email || '').trim().toLowerCase() }).lean();
      return doc ? { id: doc._id.toString(), ...doc } : null;
    },
    async getById(id) {
      if (!id) return null;
      const doc = await User.findById(id).lean();
      return doc ? { id: doc._id.toString(), ...doc } : null;
    },
    async create(email, passwordHash, extra = {}) {
      const doc = await User.create({
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        first_name: (extra.first_name || '').trim(),
        last_name: (extra.last_name || '').trim(),
        username: (extra.username || '').trim(),
        role: (extra.role || 'user').trim() || 'user',
        department: (extra.department || '').trim(),
      });
      return {
        id: doc._id.toString(),
        email: doc.email,
        first_name: doc.first_name,
        last_name: doc.last_name,
        username: doc.username,
        role: doc.role,
        department: doc.department,
      };
    },
    async update(id, updates = {}) {
      if (!id) return null;
      const allowed = {
        first_name: (updates.first_name ?? '').trim?.() ?? updates.first_name,
        last_name: (updates.last_name ?? '').trim?.() ?? updates.last_name,
        username: (updates.username ?? '').trim?.() ?? updates.username,
        role: (updates.role ?? '').trim?.() ?? updates.role,
        department: (updates.department ?? '').trim?.() ?? updates.department,
      };
      const toSet = {};
      Object.entries(allowed).forEach(([key, value]) => {
        if (typeof value === 'string') {
          toSet[key] = value;
        }
      });
      const doc = await User.findByIdAndUpdate(
        id,
        { $set: toSet },
        { new: true, runValidators: true }
      ).lean();
      return doc
        ? {
            id: doc._id.toString(),
            email: doc.email,
            first_name: doc.first_name || '',
            last_name: doc.last_name || '',
            username: doc.username || '',
            role: doc.role || 'user',
            department: doc.department || '',
            created_at: doc.createdAt,
          }
        : null;
    },
    async delete(id) {
      if (!id) return false;
      const result = await User.deleteOne({ _id: id });
      return result.deletedCount > 0;
    },
  },
  files: {
    async listAll() {
      const docs = await UploadedFile.find().sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({
        id: d._id.toString(),
        user_id: d.user_id.toString(),
        file_path: d.file_path,
        profile_image_path: d.profile_image_path || '',
        original_name: d.original_name,
        project_title: d.project_title,
        description: d.description,
        department: d.department,
        author_name: d.author_name || '',
        author_email: d.author_email || '',
        advisor: d.advisor || '',
        major: d.major || '',
        published_date: d.published_date,
        created_at: d.createdAt,
      }));
    },
    async listByDepartment(department) {
      if (!department) return [];
      const dept = String(department).toUpperCase();
      const docs = await UploadedFile.find({ department: dept }).sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({
        id: d._id.toString(),
        user_id: d.user_id.toString(),
        file_path: d.file_path,
        profile_image_path: d.profile_image_path || '',
        original_name: d.original_name,
        project_title: d.project_title,
        description: d.description,
        department: d.department,
        author_name: d.author_name || '',
        author_email: d.author_email || '',
        advisor: d.advisor || '',
        major: d.major || '',
        published_date: d.published_date,
        created_at: d.createdAt,
      }));
    },
    async listByUser(userId) {
      const docs = await UploadedFile.find({ user_id: userId }).sort({ createdAt: -1 }).lean();
      return docs.map((d) => ({
        id: d._id.toString(),
        user_id: d.user_id.toString(),
        file_path: d.file_path,
        profile_image_path: d.profile_image_path || '',
        original_name: d.original_name,
        project_title: d.project_title,
        description: d.description,
        department: d.department,
        author_name: d.author_name || '',
        author_email: d.author_email || '',
        advisor: d.advisor || '',
        major: d.major || '',
        published_date: d.published_date,
        created_at: d.createdAt,
      }));
    },
    async add(record) {
      const doc = await UploadedFile.create({
        ...record,
        user_id: record.user_id,
      });
      return {
        id: doc._id.toString(),
        ...record,
        created_at: doc.createdAt,
      };
    },
    async getById(id) {
      if (!id) return null;
      const doc = await UploadedFile.findById(id).lean();
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        user_id: doc.user_id.toString(),
        file_path: doc.file_path,
        profile_image_path: doc.profile_image_path || '',
        original_name: doc.original_name,
        project_title: doc.project_title,
        description: doc.description,
        department: doc.department,
        author_name: doc.author_name || '',
        author_email: doc.author_email || '',
        advisor: doc.advisor || '',
        major: doc.major || '',
        published_date: doc.published_date,
        created_at: doc.createdAt,
      };
    },
    async getByIdAndUser(id, userId) {
      const doc = await UploadedFile.findOne({ _id: id, user_id: userId }).lean();
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        user_id: doc.user_id.toString(),
        file_path: doc.file_path,
        profile_image_path: doc.profile_image_path || '',
        original_name: doc.original_name,
        project_title: doc.project_title,
        description: doc.description,
        department: doc.department,
        author_name: doc.author_name || '',
        author_email: doc.author_email || '',
        advisor: doc.advisor || '',
        major: doc.major || '',
        published_date: doc.published_date,
        created_at: doc.createdAt,
      };
    },
    async delete(id, userId) {
      const doc = await UploadedFile.findOneAndDelete({ _id: id, user_id: userId });
      return doc != null;
    },
    async deleteAny(id) {
      const doc = await UploadedFile.findByIdAndDelete(id);
      return doc != null;
    },
    async countByDepartment(departments) {
      const counts = await UploadedFile.aggregate([
        { $match: { department: { $in: departments } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]);
      const map = {};
      departments.forEach((d) => (map[d] = 0));
      counts.forEach((c) => (map[c._id] = c.count));
      return map;
    },
    async countByMonthRange(monthStarts) {
      return Promise.all(
        monthStarts.map(async ({ start, end }) => {
          const count = await UploadedFile.countDocuments({
            createdAt: { $gte: new Date(start), $lt: new Date(end) },
          });
          return count;
        })
      );
    },
    async countByMonthRangeForDepartment(monthStarts, department) {
      if (!department) {
        return monthStarts.map(() => 0);
      }
      const dept = String(department).toUpperCase();
      return Promise.all(
        monthStarts.map(async ({ start, end }) => {
          const count = await UploadedFile.countDocuments({
            department: dept,
            createdAt: { $gte: new Date(start), $lt: new Date(end) },
          });
          return count;
        })
      );
    },
  },
};

export async function initDb() {
  await mongoose.connect(MONGODB_URI);
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
}