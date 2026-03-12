import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { uploadFile } from '../api';

const DEPARTMENTS = ['BSIT', 'BSHM', 'BSBA', 'BSCRIM', 'BSED'];
const MAJORS_BY_DEPT = {
  BSED: ['BEED', 'FILIPINO', 'ENGLISH', 'MATH'],
  BSBA: ['FM', 'MM', 'HRDM'],
};
const PROFILE_ACCEPT = 'image/jpeg,image/png,image/gif,image/webp';
const DOCUMENT_ACCEPT = '.docx,.pdf,.zip,.xls,.xlsx';

export default function Published() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');
  const userInitial = (user?.email || 'U').charAt(0).toUpperCase();

  const [form, setForm] = useState({
    title: '', authorName: '', authorEmail: '',
    advisor: '', department: '', major: '', date: '', description: '',
  });
  const [profileFile, setProfileFile]   = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [message, setMessage]           = useState('');
  const [error, setError]               = useState('');
  const [uploading, setUploading]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset major when department changes
    if (name === 'department') {
      setForm((prev) => ({ ...prev, department: value, major: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const availableMajors = MAJORS_BY_DEPT[form.department] || null;

  async function handleSubmit(e, isDraft = false) {
    e.preventDefault();
    setError(''); setMessage('');
    if (!form.title?.trim()) { setError('Thesis title is required.'); return; }
    if (!documentFile) { setError('Thesis document file is required.'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('project_title', form.title.trim());
    fd.append('title', form.title.trim());
    fd.append('author_name', form.authorName.trim());
    fd.append('authorName', form.authorName.trim());
    fd.append('author_email', form.authorEmail.trim());
    fd.append('authorEmail', form.authorEmail.trim());
    fd.append('advisor', form.advisor);
    fd.append('department', form.department || 'BSIT');
    fd.append('major', form.major);
    fd.append('date', form.date);
    fd.append('description', form.description.trim());
    if (profileFile) fd.append('profile', profileFile);
    if (documentFile) fd.append('document', documentFile);
    try {
      await uploadFile(fd);
      setMessage('Thesis submitted successfully.');
      setForm({ title: '', authorName: '', authorEmail: '', advisor: '', department: '', major: '', date: '', description: '' });
      setProfileFile(null); setDocumentFile(null);
      const profileEl = document.getElementById('profile-upload');
      const docEl     = document.getElementById('document-upload');
      if (profileEl) profileEl.value = '';
      if (docEl) docEl.value = '';
    } catch (err) {
      setError(err.message || 'Failed to submit thesis.');
    } finally {
      setUploading(false);
    }
  }

  const navItems = [
    {
      to: '/dashboard', label: 'Home',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/></svg>,
    },
    {
      to: isBSBAMember ? '/department' : '/courses',
      label: isBSBAMember ? 'Department' : 'Departments',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    },
    {
      to: '/published', label: 'Published',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 7h6l2 2h10v9H3z"/><path d="M3 7V5h6l2 2"/></svg>,
    },
    {
      to: '/reports', label: 'Reports',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 3h18v4H3z"/><path d="M7 13h3v8H7z"/><path d="M14 9h3v12h-3z"/></svg>,
    },
    ...(isAdmin ? [{
      to: '/users', label: 'Users',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    }] : []),
    {
      to: '/settings', label: 'Settings',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pub-root {
          display: flex; height: 100vh;
          font-family: Arial, sans-serif;
          background: #f0f2ed; overflow: hidden;
        }

        /* SIDEBAR */
        .pub-sidebar {
          width: 240px; flex-shrink: 0;
          background: #07713c;
          display: flex; flex-direction: column;
          height: 100%; position: relative; overflow: hidden;
        }
        .pub-sidebar::before {
          content: ''; position: absolute;
          width: 320px; height: 320px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          top: -80px; left: -80px; pointer-events: none;
        }
        .pub-sidebar::after {
          content: ''; position: absolute;
          width: 240px; height: 240px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          bottom: -60px; right: -80px; pointer-events: none;
        }
        .sidebar-logo {
          padding: 24px 20px 18px;
          display: flex; align-items: center; gap: 11px;
          position: relative; z-index: 1;
          border-bottom: 1px solid rgba(255,255,255,0.07); flex-shrink: 0;
        }
        .sidebar-logo img {
          width: 42px; height: 42px; object-fit: contain;
          border-radius: 50%; background: rgba(255,255,255,0.1);
          padding: 4px; flex-shrink: 0;
        }
        .sidebar-logo-name { font-size: 0.88rem; font-weight: 700; color: #fff; line-height: 1.2; }
        .sidebar-logo-sub  { font-size: 0.67rem; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }
        .sidebar-nav {
          flex: 1; padding: 12px 0;
          display: flex; flex-direction: column; gap: 1px;
          position: relative; z-index: 1; overflow-y: auto;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }
        .nav-section-label {
          font-size: 0.63rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.25); padding: 8px 20px 4px; font-weight: 700;
        }
        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 20px; text-decoration: none;
          color: rgba(255,255,255,0.62); font-size: 0.86rem; font-weight: 400;
          transition: color 0.2s, background 0.2s; position: relative;
          font-family: Arial, sans-serif;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .nav-link.active { color: #fff; background: rgba(255,255,255,0.11); font-weight: 600; }
        .nav-link.active::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: #5cb85c; border-radius: 0 2px 2px 0;
        }
        .sidebar-footer {
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative; z-index: 1; flex-shrink: 0;
        }
        .sidebar-user {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,0.06);
        }
        .sidebar-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: #5cb85c; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.82rem; flex-shrink: 0;
        }
        .sidebar-user-email {
          flex: 1; font-size: 0.73rem; color: rgba(255,255,255,0.5);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
        }
        .sidebar-logout {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.32); padding: 4px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s, background 0.2s; flex-shrink: 0;
        }
        .sidebar-logout:hover { color: #fff; background: rgba(255,255,255,0.1); }

        /* MAIN */
        .pub-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* TOPBAR */
        .pub-topbar {
          background: #fff; padding: 0 28px; height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #e8ede8; flex-shrink: 0;
        }
        .topbar-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.88rem; font-weight: 700; color: #07713c;
        }
        .breadcrumb-sep { color: #c4d4c4; font-size: 0.75rem; }
        .breadcrumb-sub { font-weight: 400; color: #6b7a6b; }
        .topbar-actions { display: flex; align-items: center; gap: 10px; }
        .topbar-icon-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1.5px solid #e4ece4; background: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #6b7a6b; transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .topbar-icon-btn:hover { background: #f0fdf4; border-color: #5cb85c; color: #07713c; }
        .topbar-avatar {
          width: 36px; height: 36px; border-radius: 9px;
          background: #07713c; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.88rem;
        }

        /* CONTENT */
        .pub-content { flex: 1; overflow-y: auto; padding: 24px 28px; }
        .pub-content::-webkit-scrollbar { width: 5px; }
        .pub-content::-webkit-scrollbar-track { background: transparent; }
        .pub-content::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }

        .content-heading { margin-bottom: 20px; }
        .content-title { font-size: 1rem; font-weight: 700; color: #07713c; }
        .content-sub { font-size: 0.78rem; color: #7a8c7a; margin-top: 3px; }

        .alert { padding: 11px 16px; border-radius: 10px; font-size: 0.84rem; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .alert-success { background: #e8f5e9; border-left: 3px solid #4cae4c; color: #1b5e20; }
        .alert-error   { background: #fdecea; border-left: 3px solid #e53935; color: #b71c1c; }

        /* FORM CARD */
        .form-card {
          background: #fff; border-radius: 14px;
          border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .form-card-header {
          padding: 18px 24px; border-bottom: 1px solid #f0f5f0;
          display: flex; align-items: center; gap: 12px;
        }
        .form-card-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #ecfdf5; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          color: #07713c; flex-shrink: 0;
        }
        .form-card-title { font-size: 0.92rem; font-weight: 700; color: #07713c; }
        .form-card-sub   { font-size: 0.75rem; color: #7a8c7a; margin-top: 2px; }

        .form-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

        /* SECTION */
        .form-section { display: flex; flex-direction: column; gap: 4px; }
        .section-label {
          font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: #5a7a5a; padding-bottom: 10px;
          border-bottom: 1px solid #f0f5f0; margin-bottom: 4px;
        }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

        /* FIELD */
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label {
          font-size: 0.75rem; font-weight: 700; color: #2e4a2e;
          display: flex; align-items: center; gap: 4px;
        }
        .field-required { color: #e53935; }
        .field-input {
          width: 100%; padding: 9px 12px;
          border: 1.5px solid #d2dcd2; border-radius: 8px;
          font-size: 0.86rem; font-family: Arial, sans-serif;
          background: #fff; color: #07713c;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .field-input::placeholder { color: #a8b8a8; }
        .field-input:focus { border-color: #5cb85c; box-shadow: 0 0 0 3px rgba(92,184,92,0.1); }
        .field-input[type="date"] { color: #07713c; }
        select.field-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7a6b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
        select.field-input:disabled { background-color: #f5f5f5; color: #aaa; cursor: not-allowed; border-color: #e0e0e0; }
        textarea.field-input { resize: none; line-height: 1.5; }

        /* UPLOAD ZONES */
        .upload-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .upload-zone {
          border: 1.5px dashed #c8d8c8; border-radius: 12px;
          padding: 20px 16px; display: flex; flex-direction: column;
          align-items: center; text-align: center; background: #fafcfa;
          transition: border-color 0.2s, background 0.2s; gap: 8px;
        }
        .upload-zone:hover { border-color: #5cb85c; background: #f5fdf5; }
        .upload-zone.has-file { border-color: #5cb85c; background: #f0fdf4; border-style: solid; }

        .upload-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .upload-icon.image-icon { background: #eff6ff; color: #2563eb; }
        .upload-icon.doc-icon   { background: #ecfdf5; color: #07713c; }

        .upload-label { font-size: 0.78rem; font-weight: 700; color: #07713c; }
        .upload-hint  { font-size: 0.7rem; color: #9aaa9a; }
        .upload-filename {
          font-size: 0.72rem; color: #07713c; font-weight: 600;
          max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .btn-upload-trigger {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 7px;
          font-size: 0.75rem; font-weight: 700;
          font-family: Arial, sans-serif; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          border: 1.5px solid;
        }
        .btn-upload-image { border-color: #bfdbfe; color: #2563eb; background: #eff6ff; }
        .btn-upload-image:hover { background: #dbeafe; transform: translateY(-1px); }
        .btn-upload-doc   { border-color: #07713c; color: #fff; background: #07713c; }
        .btn-upload-doc:hover { background: #05592f; transform: translateY(-1px); }

        /* FORM FOOTER */
        .form-footer {
          padding: 18px 24px; border-top: 1px solid #f0f5f0;
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
        }
        .btn-draft {
          padding: 9px 20px; border-radius: 8px;
          border: 1.5px solid #d2dcd2; background: #fff;
          color: #4a6a4a; font-size: 0.82rem; font-weight: 700;
          font-family: Arial, sans-serif; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .btn-draft:hover { background: #f0f5f0; border-color: #b2c8b2; }
        .btn-publish {
          padding: 9px 24px; border-radius: 8px;
          background: #07713c; color: #fff; border: none;
          font-size: 0.82rem; font-weight: 700;
          font-family: Arial, sans-serif; cursor: pointer;
          box-shadow: 0 2px 8px rgba(7,113,60,0.2);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .btn-publish:hover:not(:disabled) { background: #05592f; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(7,113,60,0.25); }
        .btn-publish:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .form-grid-2, .form-grid-3, .upload-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pub-root">

        {/* SIDEBAR */}
        <aside className="pub-sidebar">
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
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
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
        <div className="pub-main">
          <header className="pub-topbar">
            <div className="topbar-breadcrumb">
              <span>Published</span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-sub">Submit New Thesis</span>
            </div>
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

          <main className="pub-content">
            <div className="content-heading">
              <div className="content-title">Submit New Thesis</div>
              <div className="content-sub">Fill in the details below to add a thesis to the repository</div>
            </div>

            {message && <div className="alert alert-success">✓ {message}</div>}
            {error   && <div className="alert alert-error">✕ {error}</div>}

            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <div>
                  <div className="form-card-title">Thesis Information</div>
                  <div className="form-card-sub">All fields marked with * are required</div>
                </div>
              </div>

              <form onSubmit={(e) => handleSubmit(e, false)}>
                <div className="form-body">

                  {/* Section 1 — Basic Info */}
                  <div className="form-section">
                    <div className="section-label">Basic Information</div>
                    <div className="form-grid-2">
                      <div className="field">
                        <label className="field-label">Thesis Title <span className="field-required">*</span></label>
                        <input className="field-input" type="text" name="title" value={form.title} onChange={handleChange} placeholder="Enter thesis title" />
                      </div>
                      <div className="field">
                        <label className="field-label">Presented By</label>
                        <input className="field-input" type="text" name="authorName" value={form.authorName} onChange={handleChange} placeholder="Enter presenter / author name" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 — Author & Dept */}
                  <div className="form-section">
                    <div className="section-label">Author & Academic Details</div>
                    <div className="form-grid-3">
                      <div className="field">
                        <label className="field-label">Author Email</label>
                        <input className="field-input" type="email" name="authorEmail" value={form.authorEmail} onChange={handleChange} placeholder="author@email.com" />
                      </div>
                      <div className="field">
                        <label className="field-label">Department</label>
                        <select className="field-input" name="department" value={form.department} onChange={handleChange}>
                          <option value="">Select department</option>
                          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label className="field-label">Major</label>
                        <select
                          className="field-input"
                          name="major"
                          value={form.major}
                          onChange={handleChange}
                          disabled={!availableMajors}
                        >
                          <option value="">
                            {!availableMajors ? 'N/A for this department' : 'Select major'}
                          </option>
                          {availableMajors && availableMajors.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-grid-2" style={{ marginTop: 16 }}>
                      <div className="field">
                        <label className="field-label">Thesis Advisor</label>
                        <input
                          className="field-input"
                          type="text"
                          name="advisor"
                          value={form.advisor}
                          onChange={handleChange}
                          placeholder="Enter advisor name"
                        />
                      </div>
                      <div className="field">
                        <label className="field-label">Submission Date</label>
                        <input className="field-input" type="date" name="date" value={form.date} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  {/* Section 3 — Description */}
                  <div className="form-section">
                    <div className="section-label">Abstract / Description</div>
                    <div className="field">
                      <label className="field-label">Thesis Abstract</label>
                      <textarea className="field-input" name="description" value={form.description} onChange={handleChange} placeholder="Enter a brief abstract or description of the thesis..." rows={4} />
                    </div>
                  </div>

                  {/* Section 4 — File Uploads */}
                  <div className="form-section">
                    <div className="section-label">File Uploads</div>
                    <div className="upload-row">

                      {/* Profile image */}
                      <div className={`upload-zone${profileFile ? ' has-file' : ''}`}>
                        <div className="upload-icon image-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                          </svg>
                        </div>
                        <div className="upload-label">Profile Image <span style={{color:'#9aaa9a',fontWeight:400}}>(optional)</span></div>
                        <div className="upload-hint">Thumbnail or author photo</div>
                        {profileFile
                          ? <div className="upload-filename">✓ {profileFile.name}</div>
                          : <div className="upload-hint">.jpg .png .gif .webp · Max 10MB</div>
                        }
                        <input type="file" accept={PROFILE_ACCEPT} onChange={(e) => setProfileFile(e.target.files?.[0] || null)} className="hidden" id="profile-upload" style={{display:'none'}} />
                        <label htmlFor="profile-upload" className="btn-upload-trigger btn-upload-image">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          {profileFile ? 'Change Image' : 'Choose Image'}
                        </label>
                      </div>

                      {/* Document */}
                      <div className={`upload-zone${documentFile ? ' has-file' : ''}`}>
                        <div className="upload-icon doc-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                        <div className="upload-label">Thesis Document <span className="field-required">*</span></div>
                        <div className="upload-hint">Upload the full thesis file</div>
                        {documentFile
                          ? <div className="upload-filename">✓ {documentFile.name}</div>
                          : <div className="upload-hint">.docx .pdf .zip .xls .xlsx · Max 50MB</div>
                        }
                        <input type="file" accept={DOCUMENT_ACCEPT} onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} className="hidden" id="document-upload" style={{display:'none'}} />
                        <label htmlFor="document-upload" className="btn-upload-trigger btn-upload-doc">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          {documentFile ? 'Change File' : 'Browse Files'}
                        </label>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="form-footer">
                  <button type="button" className="btn-draft" onClick={(e) => handleSubmit(e, true)}>
                    Save as Draft
                  </button>
                  <button type="submit" className="btn-publish" disabled={uploading}>
                    {uploading && <span className="btn-spinner" />}
                    {uploading ? 'Submitting…' : 'Submit Thesis'}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}