import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');
  const userInitial = (user?.email || 'U').charAt(0).toUpperCase();

  const [profile, setProfile] = useState({
    firstName: user?.first_name || '',
    lastName:  user?.last_name  || '',
    email:     user?.email      || '',
    username:  user?.username   || '',
  });
  const [profileMsg, setProfileMsg] = useState('');

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg]   = useState('');
  const [passErr, setPassErr]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifs, setNotifs] = useState({
    emailOnUpload: true, emailOnDelete: false, emailDigest: true, browserAlerts: true,
  });
  const [notifMsg, setNotifMsg] = useState('');

  const [appearance, setAppearance] = useState({ compactMode: false, language: 'en' });
  const [appearMsg, setAppearMsg] = useState('');

  const [tab, setTab] = useState('profile');

  function handleProfileSave(e) {
    e.preventDefault();
    setProfileMsg('Profile updated successfully.');
    setTimeout(() => setProfileMsg(''), 3000);
  }
  function handlePasswordSave(e) {
    e.preventDefault();
    setPassErr(''); setPassMsg('');
    if (!passwords.current) { setPassErr('Current password is required.'); return; }
    if (passwords.newPass.length < 8) { setPassErr('New password must be at least 8 characters.'); return; }
    if (passwords.newPass !== passwords.confirm) { setPassErr('Passwords do not match.'); return; }
    setPassMsg('Password changed successfully.');
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassMsg(''), 3000);
  }
  function handleNotifSave(e) {
    e.preventDefault();
    setNotifMsg('Notification preferences saved.');
    setTimeout(() => setNotifMsg(''), 3000);
  }
  function handleAppearSave(e) {
    e.preventDefault();
    setAppearMsg('Appearance settings saved.');
    setTimeout(() => setAppearMsg(''), 3000);
  }

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

  const TABS = [
    { id: 'profile',       label: 'Profile',       icon: '👤' },
    { id: 'security',      label: 'Security',      icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance',    label: 'Appearance',    icon: '🎨' },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .st-root { display: flex; height: 100vh; font-family: Arial, sans-serif; background: #f0f2ed; overflow: hidden; }

        /* SIDEBAR */
        .st-sidebar { width: 240px; flex-shrink: 0; background: #07713c; display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; }
        .st-sidebar::before { content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); top: -80px; left: -80px; pointer-events: none; }
        .st-sidebar::after  { content: ''; position: absolute; width: 240px; height: 240px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.04); bottom: -60px; right: -80px; pointer-events: none; }

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
        .st-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* TOPBAR */
        .st-topbar { background: #fff; padding: 0 28px; height: 62px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8ede8; flex-shrink: 0; }
        .topbar-title { font-size: 1.1rem; font-weight: 700; color: #07713c; font-family: Arial, sans-serif; }
        .topbar-actions { display: flex; align-items: center; gap: 10px; }
        .topbar-icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid #e4ece4; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7a6b; transition: background 0.2s, border-color 0.2s, color 0.2s; }
        .topbar-icon-btn:hover { background: #f0fdf4; border-color: #5cb85c; color: #07713c; }
        .topbar-avatar { width: 36px; height: 36px; border-radius: 9px; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.88rem; }

        /* CONTENT */
        .st-content { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
        .st-content::-webkit-scrollbar { width: 5px; }
        .st-content::-webkit-scrollbar-track { background: transparent; }
        .st-content::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }

        /* SETTINGS LAYOUT */
        .settings-layout { display: flex; gap: 20px; align-items: flex-start; }

        /* TAB NAV */
        .settings-tabs { width: 200px; flex-shrink: 0; background: #fff; border-radius: 14px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; }
        .settings-tabs-header { padding: 14px 16px 10px; border-bottom: 1px solid #f0f5f0; }
        .settings-tabs-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7a9a7a; }

        .tab-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 16px; border: none; background: transparent; cursor: pointer; font-family: Arial, sans-serif; font-size: 0.84rem; color: #4a6a4a; font-weight: 400; transition: background 0.15s, color 0.15s; text-align: left; position: relative; }
        .tab-btn:hover { background: #f5fdf5; color: #07713c; }
        .tab-btn.active { background: #f0fdf4; color: #07713c; font-weight: 700; }
        .tab-btn.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #5cb85c; border-radius: 0 2px 2px 0; }
        .tab-icon { font-size: 0.9rem; flex-shrink: 0; }

        /* SETTINGS PANEL */
        .settings-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }

        .panel-card { background: #fff; border-radius: 14px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; }
        .panel-header { padding: 18px 24px 14px; border-bottom: 1px solid #f0f5f0; display: flex; align-items: center; gap: 12px; }
        .panel-header-icon { width: 38px; height: 38px; border-radius: 10px; background: #ecfdf5; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: center; color: #07713c; flex-shrink: 0; }
        .panel-title { font-size: 0.92rem; font-weight: 700; color: #07713c; }
        .panel-sub   { font-size: 0.75rem; color: #7a8c7a; margin-top: 2px; }
        .panel-body  { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }

        /* USER AVATAR DISPLAY */
        .profile-avatar-row { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f5f0; margin-bottom: 4px; }
        .profile-avatar-big { width: 60px; height: 60px; border-radius: 50%; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 700; flex-shrink: 0; }
        .profile-avatar-info { flex: 1; }
        .profile-avatar-name { font-size: 0.92rem; font-weight: 700; color: #07713c; }
        .profile-avatar-role { font-size: 0.75rem; color: #7a8c7a; margin-top: 2px; }

        /* FORM */
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 0.73rem; font-weight: 700; color: #07713c; }
        .field-input { width: 100%; padding: 9px 12px; border: 1.5px solid #d2dcd2; border-radius: 8px; font-size: 0.86rem; font-family: Arial, sans-serif; background: #fff; color: #07713c; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .field-input::placeholder { color: #a8b8a8; }
        .field-input:focus { border-color: #5cb85c; box-shadow: 0 0 0 3px rgba(92,184,92,0.1); }
        .field-input:disabled { background: #f5f8f5; color: #8a9a8a; cursor: not-allowed; }
        select.field-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7a6b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 11px center; padding-right: 30px; cursor: pointer; }

        /* PASSWORD FIELD WITH TOGGLE */
        .pass-wrap { position: relative; }
        .pass-toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9aaa9a; display: flex; align-items: center; padding: 2px; transition: color 0.2s; }
        .pass-toggle:hover { color: #4a6a4a; }

        /* ALERTS */
        .alert { padding: 10px 14px; border-radius: 9px; font-size: 0.82rem; display: flex; align-items: center; gap: 8px; }
        .alert-success { background: #e8f5e9; border-left: 3px solid #4cae4c; color: #1b5e20; }
        .alert-error   { background: #fdecea; border-left: 3px solid #e53935; color: #b71c1c; }

        /* TOGGLE SWITCH */
        .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f8f5; }
        .toggle-row:last-child { border-bottom: none; }
        .toggle-label { font-size: 0.86rem; font-weight: 600; color: #07713c; }
        .toggle-desc  { font-size: 0.73rem; color: #8a9a8a; margin-top: 2px; }

        .toggle-switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-track { position: absolute; inset: 0; cursor: pointer; background: #d2dcd2; border-radius: 22px; transition: background 0.2s; }
        .toggle-track::before { content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%; background: #fff; left: 3px; top: 3px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
        .toggle-switch input:checked + .toggle-track { background: #5cb85c; }
        .toggle-switch input:checked + .toggle-track::before { transform: translateX(18px); }

        /* BUTTONS */
        .panel-footer { padding: 14px 24px; border-top: 1px solid #f0f5f0; display: flex; justify-content: flex-end; gap: 10px; }
        .btn-save { padding: 8px 22px; border-radius: 8px; background: #07713c; color: #fff; border: none; font-size: 0.82rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s, transform 0.15s; box-shadow: 0 2px 6px rgba(7,113,60,0.2); }
        .btn-save:hover { background: #05592f; transform: translateY(-1px); }

        /* DANGER ZONE */
        .danger-card { background: #fff; border-radius: 14px; border: 1.5px solid #fca5a5; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; }
        .danger-header { padding: 16px 24px; border-bottom: 1px solid #fef2f2; display: flex; align-items: center; gap: 10px; }
        .danger-title { font-size: 0.88rem; font-weight: 700; color: #dc2626; }
        .danger-body  { padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .danger-desc  { font-size: 0.82rem; color: #6b7a6b; }
        .btn-danger { padding: 8px 18px; border-radius: 8px; border: 1.5px solid #fca5a5; background: #fff; color: #dc2626; font-size: 0.8rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s; }
        .btn-danger:hover { background: #fef2f2; }

        @media (max-width: 900px) {
          .settings-layout { flex-direction: column; }
          .settings-tabs { width: 100%; }
          .form-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="st-root">

        {/* SIDEBAR */}
        <aside className="st-sidebar">
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
        <div className="st-main">
          <header className="st-topbar">
            <div className="topbar-title">Settings</div>
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

          <main className="st-content">
            <div className="settings-layout">

              <div className="settings-tabs">
                <div className="settings-tabs-header">
                  <div className="settings-tabs-title">Settings</div>
                </div>
                {TABS.map((t) => (
                  <button key={t.id} type="button" className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                    <span className="tab-icon">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="settings-panel">

                {tab === 'profile' && (
                  <div className="panel-card">
                    <div className="panel-header">
                      <div className="panel-header-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div>
                        <div className="panel-title">Profile Information</div>
                        <div className="panel-sub">Update your name, email, and username</div>
                      </div>
                    </div>
                    <form onSubmit={handleProfileSave}>
                      <div className="panel-body">
                        <div className="profile-avatar-row">
                          <div className="profile-avatar-big">{userInitial}</div>
                          <div className="profile-avatar-info">
                            <div className="profile-avatar-name">{user?.first_name || user?.email || 'User'}</div>
                            <div className="profile-avatar-role">{(user?.role || 'student').charAt(0).toUpperCase() + (user?.role || 'student').slice(1)} · {user?.department || 'No Department'}</div>
                          </div>
                        </div>
                        {profileMsg && <div className="alert alert-success">✓ {profileMsg}</div>}
                        <div className="form-grid-2">
                          <div className="field">
                            <label className="field-label">First Name</label>
                            <input className="field-input" type="text" value={profile.firstName} onChange={(e) => setProfile(p => ({...p, firstName: e.target.value}))} placeholder="First name" />
                          </div>
                          <div className="field">
                            <label className="field-label">Last Name</label>
                            <input className="field-input" type="text" value={profile.lastName} onChange={(e) => setProfile(p => ({...p, lastName: e.target.value}))} placeholder="Last name" />
                          </div>
                        </div>
                        <div className="form-grid-2">
                          <div className="field">
                            <label className="field-label">Email Address</label>
                            <input className="field-input" type="email" value={profile.email} onChange={(e) => setProfile(p => ({...p, email: e.target.value}))} placeholder="email@example.com" />
                          </div>
                          <div className="field">
                            <label className="field-label">Username</label>
                            <input className="field-input" type="text" value={profile.username} onChange={(e) => setProfile(p => ({...p, username: e.target.value}))} placeholder="@username" />
                          </div>
                        </div>
                      </div>
                      <div className="panel-footer">
                        <button type="submit" className="btn-save">Save Changes</button>
                      </div>
                    </form>
                  </div>
                )}

                {tab === 'security' && (
                  <>
                    <div className="panel-card">
                      <div className="panel-header">
                        <div className="panel-header-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <div>
                          <div className="panel-title">Change Password</div>
                          <div className="panel-sub">Keep your account secure with a strong password</div>
                        </div>
                      </div>
                      <form onSubmit={handlePasswordSave}>
                        <div className="panel-body">
                          {passMsg && <div className="alert alert-success">✓ {passMsg}</div>}
                          {passErr && <div className="alert alert-error">✕ {passErr}</div>}
                          <div className="field">
                            <label className="field-label">Current Password</label>
                            <div className="pass-wrap">
                              <input className="field-input" type={showCurrent ? 'text' : 'password'} value={passwords.current} onChange={(e) => setPasswords(p => ({...p, current: e.target.value}))} placeholder="Enter current password" style={{paddingRight:36}} />
                              <button type="button" className="pass-toggle" onClick={() => setShowCurrent(v => !v)}>
                                {showCurrent
                                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                              </button>
                            </div>
                          </div>
                          <div className="form-grid-2">
                            <div className="field">
                              <label className="field-label">New Password</label>
                              <div className="pass-wrap">
                                <input className="field-input" type={showNew ? 'text' : 'password'} value={passwords.newPass} onChange={(e) => setPasswords(p => ({...p, newPass: e.target.value}))} placeholder="Min. 8 characters" style={{paddingRight:36}} />
                                <button type="button" className="pass-toggle" onClick={() => setShowNew(v => !v)}>
                                  {showNew
                                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                                </button>
                              </div>
                            </div>
                            <div className="field">
                              <label className="field-label">Confirm New Password</label>
                              <div className="pass-wrap">
                                <input className="field-input" type={showConfirm ? 'text' : 'password'} value={passwords.confirm} onChange={(e) => setPasswords(p => ({...p, confirm: e.target.value}))} placeholder="Repeat new password" style={{paddingRight:36}} />
                                <button type="button" className="pass-toggle" onClick={() => setShowConfirm(v => !v)}>
                                  {showConfirm
                                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="panel-footer">
                          <button type="submit" className="btn-save">Update Password</button>
                        </div>
                      </form>
                    </div>

                    <div className="danger-card">
                      <div className="danger-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div className="danger-title">Danger Zone</div>
                      </div>
                      <div className="danger-body">
                        <div className="danger-desc">Signing out will end your current session. All unsaved changes will be lost.</div>
                        <button type="button" className="btn-danger" onClick={() => logout()}>Sign Out</button>
                      </div>
                    </div>
                  </>
                )}

                {tab === 'notifications' && (
                  <div className="panel-card">
                    <div className="panel-header">
                      <div className="panel-header-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                      <div>
                        <div className="panel-title">Notification Preferences</div>
                        <div className="panel-sub">Control when and how you receive alerts</div>
                      </div>
                    </div>
                    <form onSubmit={handleNotifSave}>
                      <div className="panel-body">
                        {notifMsg && <div className="alert alert-success">✓ {notifMsg}</div>}
                        {[
                          { key: 'emailOnUpload', label: 'Email on new thesis upload',   desc: 'Get notified when a new thesis is submitted to the repository.' },
                          { key: 'emailOnDelete', label: 'Email on thesis deletion',     desc: 'Get notified when a thesis is removed from the system.' },
                          { key: 'emailDigest',   label: 'Weekly digest email',          desc: 'Receive a weekly summary of new submissions and activity.' },
                          { key: 'browserAlerts', label: 'In-app notifications',         desc: 'Show alerts inside the portal for important actions.' },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="toggle-row">
                            <div>
                              <div className="toggle-label">{label}</div>
                              <div className="toggle-desc">{desc}</div>
                            </div>
                            <label className="toggle-switch">
                              <input type="checkbox" checked={notifs[key]} onChange={() => setNotifs(n => ({...n, [key]: !n[key]}))} />
                              <span className="toggle-track" />
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="panel-footer">
                        <button type="submit" className="btn-save">Save Preferences</button>
                      </div>
                    </form>
                  </div>
                )}

                {tab === 'appearance' && (
                  <div className="panel-card">
                    <div className="panel-header">
                      <div className="panel-header-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/>
                        </svg>
                      </div>
                      <div>
                        <div className="panel-title">Appearance & Language</div>
                        <div className="panel-sub">Customize how the portal looks and feels</div>
                      </div>
                    </div>
                    <form onSubmit={handleAppearSave}>
                      <div className="panel-body">
                        {appearMsg && <div className="alert alert-success">✓ {appearMsg}</div>}
                        <div className="toggle-row">
                          <div>
                            <div className="toggle-label">Compact Mode</div>
                            <div className="toggle-desc">Reduce spacing and padding across the interface.</div>
                          </div>
                          <label className="toggle-switch">
                            <input type="checkbox" checked={appearance.compactMode} onChange={() => setAppearance(a => ({...a, compactMode: !a.compactMode}))} />
                            <span className="toggle-track" />
                          </label>
                        </div>
                        <div className="field" style={{marginTop: 4}}>
                          <label className="field-label">Language</label>
                          <select className="field-input" value={appearance.language} onChange={(e) => setAppearance(a => ({...a, language: e.target.value}))}>
                            <option value="en">English</option>
                            <option value="fil">Filipino</option>
                          </select>
                        </div>
                      </div>
                      <div className="panel-footer">
                        <button type="submit" className="btn-save">Save Settings</button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}