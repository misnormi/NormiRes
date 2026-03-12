import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createUser, getUsers, updateUser, deleteUser } from '../api';

const DEPARTMENTS = ['BSIT', 'BSHM', 'BSBA', 'BSCRIM', 'BSED', 'MAED'];
const ROLES = ['student', 'dean', 'admin'];

const ROLE_COLORS = {
  admin:   { bg: '#fef3c7', border: '#fde68a', color: '#92400e' },
  dean:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af' },
  student: { bg: '#ecfdf5', border: '#bbf7d0', color: '#07713c' },
};

export default function Users() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');
  const userInitial = (user?.email || 'U').charAt(0).toUpperCase();

  const [users, setUsers]               = useState([]);
  const [message, setMessage]           = useState('');
  const [error, setError]               = useState('');
  const [saving, setSaving]             = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalMode, setModalMode]       = useState('add');
  const [editingUserId, setEditingUserId] = useState(null);
  const [search, setSearch]             = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '',
    email: '', role: 'student', department: '',
    password: '', passwordConfirm: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!isAdmin) return;
    getUsers()
      .then(({ users: list }) => setUsers(list || []))
      .catch((err) => setError(err.message || 'Failed to load users.'));
  }, [isAdmin]);

  function openAddModal() {
    if (!isAdmin) return;
    setModalMode('add'); setEditingUserId(null);
    setForm({ firstName: '', lastName: '', username: '', email: '', role: 'student', department: '', password: '', passwordConfirm: '' });
    setMessage(''); setError(''); setModalOpen(true);
  }

  function openEditModal(u) {
    if (!isAdmin || !u) return;
    setModalMode('edit'); setEditingUserId(u.id);
    setForm({ firstName: u.first_name || '', lastName: u.last_name || '', username: u.username || '', email: u.email || '', role: u.role || 'student', department: u.department || '', password: '', passwordConfirm: '' });
    setMessage(''); setError(''); setModalOpen(true);
  }

  async function handleDeleteUser(id) {
    if (!isAdmin || !id) return;
    if (!window.confirm('Delete this user account?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(''); setError('');
    if (!isAdmin) { setError('You do not have permission to manage users.'); return; }
    const { firstName, lastName, username, email, role, department, password, passwordConfirm } = form;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !role) {
      setError('First name, last name, email, and role are required.'); return;
    }
    if (modalMode === 'add') {
      if (!password) { setError('Password is required for new users.'); return; }
      if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
      if (password !== passwordConfirm) { setError('Passwords do not match.'); return; }
    }
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const { user: created } = await createUser({ firstName: firstName.trim(), lastName: lastName.trim(), username: username.trim(), email: email.trim(), role, department, password, passwordConfirm });
        setUsers((prev) => [created, ...prev]);
        setMessage('User account created successfully.');
      } else if (modalMode === 'edit' && editingUserId) {
        const { user: updated } = await updateUser(editingUserId, { firstName: firstName.trim(), lastName: lastName.trim(), username: username.trim(), role, department });
        setUsers((prev) => prev.map((u) => (u.id === editingUserId ? { ...u, ...updated } : u)));
        setMessage('User account updated successfully.');
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (u.first_name || '').toLowerCase().includes(q) ||
      (u.last_name  || '').toLowerCase().includes(q) ||
      (u.email      || '').toLowerCase().includes(q) ||
      (u.role       || '').toLowerCase().includes(q) ||
      (u.department || '').toLowerCase().includes(q)
    );
  });

  const navItems = [
    { to: '/dashboard', label: 'Home',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/></svg> },
    { to: isBSBAMember ? '/department' : '/courses', label: isBSBAMember ? 'Department' : 'Departments',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { to: '/published', label: 'Published',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 7h6l2 2h10v9H3z"/><path d="M3 7V5h6l2 2"/></svg> },
    { to: '/reports', label: 'Reports',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 3h18v4H3z"/><path d="M7 13h3v8H7z"/><path d="M14 9h3v12h-3z"/></svg> },
    ...(isAdmin ? [{ to: '/users', label: 'Users',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }] : []),
    { to: '/settings', label: 'Settings',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .us-root { display: flex; height: 100vh; font-family: Arial, sans-serif; background: #f0f2ed; overflow: hidden; }

        /* SIDEBAR */
        .us-sidebar { width: 240px; flex-shrink: 0; background: #07713c; display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; }
        .us-sidebar::before { content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); top: -80px; left: -80px; pointer-events: none; }
        .us-sidebar::after  { content: ''; position: absolute; width: 240px; height: 240px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.04); bottom: -60px; right: -80px; pointer-events: none; }
        .sidebar-logo { padding: 24px 20px 18px; display: flex; align-items: center; gap: 11px; position: relative; z-index: 1; border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0; }
        .sidebar-logo img { width: 42px; height: 42px; object-fit: contain; border-radius: 50%; background: rgba(255,255,255,0.1); padding: 4px; flex-shrink: 0; }
        .sidebar-logo-name { font-size: 0.88rem; font-weight: 700; color: #fff; line-height: 1.2; }
        .sidebar-logo-sub  { font-size: 0.67rem; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }
        .sidebar-nav { flex: 1; padding: 12px 0; display: flex; flex-direction: column; gap: 1px; position: relative; z-index: 1; overflow-y: auto; }
        .sidebar-nav::-webkit-scrollbar { width: 0; }
        .nav-section-label { font-size: 0.63rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 8px 20px 4px; font-weight: 700; }
        .nav-link { display: flex; align-items: center; gap: 10px; padding: 9px 20px; text-decoration: none; color: rgba(255,255,255,0.62); font-size: 0.86rem; font-weight: 400; transition: color 0.2s, background 0.2s; position: relative; font-family: Arial, sans-serif; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .nav-link.active { color: #fff; background: rgba(255,255,255,0.11); font-weight: 600; }
        .nav-link.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #5cb85c; border-radius: 0 2px 2px 0; }
        .sidebar-footer { padding: 14px 16px; border-top: 1px solid rgba(255,255,255,0.07); position: relative; z-index: 1; flex-shrink: 0; }
        .sidebar-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,0.06); }
        .sidebar-avatar { width: 32px; height: 32px; border-radius: 50%; background: #5cb85c; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.82rem; flex-shrink: 0; }
        .sidebar-user-email { flex: 1; font-size: 0.73rem; color: rgba(255,255,255,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .sidebar-logout { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.32); padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: color 0.2s, background 0.2s; flex-shrink: 0; }
        .sidebar-logout:hover { color: #fff; background: rgba(255,255,255,0.1); }

        /* MAIN */
        .us-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
        .us-topbar { background: #fff; padding: 0 28px; height: 62px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8ede8; flex-shrink: 0; }
        .topbar-title { font-size: 1.1rem; font-weight: 700; color: #07713c; font-family: Arial, sans-serif; }
        .topbar-actions { display: flex; align-items: center; gap: 10px; }
        .topbar-icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid #e4ece4; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7a6b; transition: background 0.2s, border-color 0.2s, color 0.2s; }
        .topbar-icon-btn:hover { background: #f0fdf4; border-color: #5cb85c; color: #07713c; }
        .topbar-avatar { width: 36px; height: 36px; border-radius: 9px; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.88rem; }

        /* CONTENT */
        .us-content { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
        .us-content::-webkit-scrollbar { width: 5px; }
        .us-content::-webkit-scrollbar-track { background: transparent; }
        .us-content::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }

        .alert { padding: 11px 16px; border-radius: 10px; font-size: 0.84rem; display: flex; align-items: center; gap: 8px; }
        .alert-success { background: #e8f5e9; border-left: 3px solid #4cae4c; color: #1b5e20; }
        .alert-error   { background: #fdecea; border-left: 3px solid #e53935; color: #b71c1c; }

        /* TABLE CARD */
        .table-card { background: #fff; border-radius: 14px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; }
        .table-card-header { padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f5f0; gap: 16px; flex-wrap: wrap; }
        .table-card-header-left { display: flex; flex-direction: column; gap: 2px; }
        .card-title { font-size: 0.92rem; font-weight: 700; color: #07713c; }
        .card-sub   { font-size: 0.75rem; color: #7a8c7a; }
        .table-card-header-right { display: flex; align-items: center; gap: 10px; }

        .search-box { display: flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1.5px solid #d2dcd2; border-radius: 8px; background: #f8faf8; transition: border-color 0.2s; }
        .search-box:focus-within { border-color: #5cb85c; background: #fff; }
        .search-box svg { color: #9aaa9a; flex-shrink: 0; }
        .search-box input { border: none; outline: none; background: transparent; font-size: 0.82rem; color: #07713c; width: 160px; font-family: Arial, sans-serif; }
        .search-box input::placeholder { color: #a8b8a8; }

        .btn-add { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; background: #07713c; color: #fff; border: none; font-size: 0.8rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s, transform 0.15s; box-shadow: 0 2px 6px rgba(7,113,60,0.2); }
        .btn-add:hover { background: #05592f; transform: translateY(-1px); }

        /* TABLE */
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        .t-head { background: #f8faf8; border-bottom: 1px solid #f0f5f0; }
        .t-head th { padding: 10px 20px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7a9a7a; text-align: left; white-space: nowrap; }
        .t-head th:last-child { text-align: right; }
        .t-row { border-bottom: 1px solid #f5f8f5; transition: background 0.15s; }
        .t-row:last-child { border-bottom: none; }
        .t-row:hover { background: #f8fdf8; }
        .t-row td { padding: 12px 20px; font-size: 0.82rem; color: #3a5a3a; vertical-align: middle; }
        .t-row td:last-child { text-align: right; }

        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-dot { width: 32px; height: 32px; border-radius: 50%; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; flex-shrink: 0; }
        .user-name  { font-weight: 600; color: #07713c; font-size: 0.84rem; }
        .user-uname { font-size: 0.72rem; color: #8a9a8a; margin-top: 1px; }

        .role-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid; }
        .dept-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #07713c; }

        .row-btns { display: inline-flex; gap: 6px; }
        .btn-edit   { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 7px; border: 1.5px solid #07713c; color: #07713c; background: #fff; font-size: 0.72rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .btn-edit:hover   { background: #07713c; color: #fff; }
        .btn-delete { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 7px; border: 1.5px solid #fca5a5; color: #dc2626; background: #fff; font-size: 0.72rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s; }
        .btn-delete:hover { background: #fef2f2; }

        .empty-state { padding: 44px 24px; text-align: center; color: #9aaa9a; font-size: 0.88rem; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); }
        .modal-box { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); width: 100%; max-width: 520px; margin: 0 16px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column; }
        .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid #f0f5f0; display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0; }
        .modal-title { font-size: 0.95rem; font-weight: 700; color: #07713c; }
        .modal-sub   { font-size: 0.75rem; color: #7a9a7a; margin-top: 2px; }
        .modal-close { background: none; border: none; cursor: pointer; color: #aaa; font-size: 1.3rem; line-height: 1; padding: 2px 6px; border-radius: 6px; transition: color 0.2s, background 0.2s; }
        .modal-close:hover { color: #333; background: #f5f5f5; }

        .modal-body { padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .modal-footer { padding: 16px 24px; border-top: 1px solid #f0f5f0; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }

        .section-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #5a7a5a; padding-bottom: 8px; border-bottom: 1px solid #f0f5f0; margin-bottom: 2px; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 0.73rem; font-weight: 700; color: #07713c; }
        .field-input { width: 100%; padding: 8px 11px; border: 1.5px solid #d2dcd2; border-radius: 8px; font-size: 0.84rem; font-family: Arial, sans-serif; background: #fff; color: #07713c; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .field-input::placeholder { color: #a8b8a8; }
        .field-input:focus { border-color: #5cb85c; box-shadow: 0 0 0 3px rgba(92,184,92,0.1); }
        select.field-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7a6b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 11px center; padding-right: 30px; }
        .field-hint { font-size: 0.68rem; color: #9aaa9a; }

        .btn-cancel  { padding: 8px 18px; border-radius: 8px; border: 1.5px solid #d2dcd2; background: #fff; color: #4a6a4a; font-size: 0.8rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s; }
        .btn-cancel:hover { background: #f0f5f0; }
        .btn-save { padding: 8px 22px; border-radius: 8px; background: #07713c; color: #fff; border: none; font-size: 0.8rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; box-shadow: 0 2px 8px rgba(7,113,60,0.2); transition: background 0.2s, transform 0.15s; display: flex; align-items: center; gap: 6px; }
        .btn-save:hover:not(:disabled) { background: #05592f; transform: translateY(-1px); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) { .form-grid-2 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="us-root">

        {/* SIDEBAR */}
        <aside className="us-sidebar">
          <div className="sidebar-logo">
            <img src="/Normi_logo_2.png" alt="NORMI" />
            <div>
              <div className="sidebar-logo-name">NORMI</div>
              <div className="sidebar-logo-sub">Thesis Repository</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Menu</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
              return (
                <Link key={item.label} to={item.to} className={`nav-link${isActive ? ' active' : ''}`}>
                  {item.icon}{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">{userInitial}</div>
              <div className="sidebar-user-email">{user?.email || 'User'}</div>
              <button className="sidebar-logout" onClick={() => logout()} title="Log out" type="button">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="us-main">
          <header className="us-topbar">
            <div className="topbar-title">User Management</div>
            <div className="topbar-actions">
              <button className="topbar-icon-btn" type="button" aria-label="Notifications">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
              <div className="topbar-avatar">{userInitial}</div>
            </div>
          </header>

          <main className="us-content">
            {message && <div className="alert alert-success">✓ {message}</div>}
            {error   && <div className="alert alert-error">✕ {error}</div>}

            <div className="table-card">
              <div className="table-card-header">
                <div className="table-card-header-left">
                  <div className="card-title">User Accounts</div>
                  <div className="card-sub">View, edit, and manage all registered users — {users.length} total</div>
                </div>
                <div className="table-card-header-right">
                  <div className="search-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input type="text" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  {isAdmin && (
                    <button type="button" onClick={openAddModal} className="btn-add">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                      Add User
                    </button>
                  )}
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead className="t-head">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={isAdmin ? 5 : 4}>
                          <div className="empty-state">
                            {search ? `No users match "${search}"` : 'No user accounts found.'}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const fullName = [(u.first_name || ''), (u.last_name || '')].filter(Boolean).join(' ') || '—';
                        const initial  = (u.first_name || u.email || 'U').charAt(0).toUpperCase();
                        const roleKey  = (u.role || 'student').toLowerCase();
                        const roleStyle = ROLE_COLORS[roleKey] || ROLE_COLORS.student;
                        return (
                          <tr key={u.id} className="t-row">
                            <td>
                              <div className="user-cell">
                                <div className="user-dot">{initial}</div>
                                <div>
                                  <div className="user-name">{fullName}</div>
                                  {u.username && <div className="user-uname">@{u.username}</div>}
                                </div>
                              </div>
                            </td>
                            <td>{u.email || '—'}</td>
                            <td>
                              <span className="role-badge" style={{ background: roleStyle.bg, borderColor: roleStyle.border, color: roleStyle.color }}>
                                {(u.role || 'student').toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {u.department
                                ? <span className="dept-badge">{u.department}</span>
                                : <span style={{color:'#c0c8c0'}}>—</span>}
                            </td>
                            {isAdmin && (
                              <td>
                                <div className="row-btns">
                                  <button type="button" onClick={() => openEditModal(u)} className="btn-edit">Edit</button>
                                  <button type="button" onClick={() => handleDeleteUser(u.id)} className="btn-delete">Delete</button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="modal-title">{modalMode === 'add' ? 'Add New User' : 'Edit User Account'}</div>
                  <div className="modal-sub">{modalMode === 'add' ? 'Fill in the details to create a new account.' : 'Update the details for this user.'}</div>
                </div>
                <button type="button" className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
              </div>

              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
                <div className="modal-body">
                  <div>
                    <div className="section-label">Personal Information</div>
                    <div className="form-grid-2">
                      <div className="field">
                        <label className="field-label">First Name</label>
                        <input className="field-input" type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
                      </div>
                      <div className="field">
                        <label className="field-label">Last Name</label>
                        <input className="field-input" type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="section-label">Account Details</div>
                    <div className="form-grid-2">
                      <div className="field">
                        <label className="field-label">Username</label>
                        <input className="field-input" type="text" name="username" value={form.username} onChange={handleChange} placeholder="@username" />
                      </div>
                      <div className="field">
                        <label className="field-label">Email</label>
                        <input className="field-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="section-label">Role & Department</div>
                    <div className="form-grid-2">
                      <div className="field">
                        <label className="field-label">Role</label>
                        <select className="field-input" name="role" value={form.role} onChange={handleChange}>
                          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label className="field-label">Department</label>
                        <select className="field-input" name="department" value={form.department} onChange={handleChange}>
                          <option value="">Select department</option>
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  {modalMode === 'add' && (
                    <div>
                      <div className="section-label">Set Password</div>
                      <div className="form-grid-2">
                        <div className="field">
                          <label className="field-label">Password</label>
                          <input className="field-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
                          <span className="field-hint">At least 8 characters.</span>
                        </div>
                        <div className="field">
                          <label className="field-label">Confirm Password</label>
                          <input className="field-input" type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} placeholder="Repeat password" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={saving || !isAdmin}>
                    {saving && <span className="btn-spinner" />}
                    {saving
                      ? (modalMode === 'add' ? 'Creating…' : 'Saving…')
                      : (modalMode === 'add' ? 'Create User' : 'Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}