import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const BSBA_MAJORS = [
  { label: 'Financial Management', value: 'BSBA - Financial Management' },
  { label: 'Marketing Management', value: 'BSBA - Marketing Management' },
  { label: 'Human Resources',      value: 'BSBA - Human Resources' },
];

export default function Department() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');
  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const userInitial = (user?.email || 'U').charAt(0).toUpperCase();

  if (!user) return <Navigate to="/" replace />;
  if (!isBSBAMember) return <Navigate to="/courses" replace />;

  const navItems = [
    { to: '/dashboard', label: 'Home',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/></svg> },
    { to: '/department', label: 'Department',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { to: '/published', label: 'Thesis Archive',
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

        .dept-root {
          display: flex; height: 100vh;
          font-family: Arial, sans-serif;
          background: #f0f2ed; overflow: hidden;
        }

        /* SIDEBAR */
        .dept-sidebar {
          width: 240px; flex-shrink: 0;
          background: #07713c;
          display: flex; flex-direction: column;
          height: 100%; position: relative; overflow: hidden;
        }
        .dept-sidebar::before {
          content: ''; position: absolute;
          width: 320px; height: 320px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          top: -80px; left: -80px; pointer-events: none;
        }
        .dept-sidebar::after {
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
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px; background: #5cb85c; border-radius: 0 2px 2px 0;
        }

        .sidebar-footer {
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative; z-index: 1; flex-shrink: 0;
        }
        .sidebar-user {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
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
        .dept-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* TOPBAR */
        .dept-topbar {
          background: #fff; padding: 0 28px; height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #e8ede8; flex-shrink: 0;
        }
        .topbar-title { font-size: 1.1rem; font-weight: 700; color: #07713c; font-family: Arial, sans-serif; }
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
        .dept-content {
          flex: 1; overflow-y: auto; padding: 24px 28px;
        }
        .dept-content::-webkit-scrollbar { width: 5px; }
        .dept-content::-webkit-scrollbar-track { background: transparent; }
        .dept-content::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }

        /* BANNER */
        .dept-banner {
          background: #fff; border-radius: 14px;
          border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 20px 24px; margin-bottom: 24px;
          display: flex; align-items: center; gap: 16px;
        }
        .dept-banner-icon {
          width: 52px; height: 52px; border-radius: 12px;
          background: #ecfdf5; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          color: #07713c; flex-shrink: 0;
        }
        .dept-banner-title { font-size: 1rem; font-weight: 700; color: #07713c; }
        .dept-banner-sub   { font-size: 0.78rem; color: #5a7a5a; margin-top: 3px; }
        .dept-badge {
          margin-left: auto;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; background: #ecfdf5; color: #07713c;
          border-radius: 20px; padding: 4px 12px; border: 1px solid #d1fae5;
        }

        /* HEADING */
        .section-heading { margin-bottom: 16px; }
        .section-title { font-size: 0.92rem; font-weight: 700; color: #07713c; }
        .section-sub   { font-size: 0.78rem; color: #7a8c7a; margin-top: 3px; }

        /* MAJOR CARDS */
        .majors-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .major-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #eaf0ea;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 22px 18px 18px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 10px;
          text-decoration: none; color: inherit;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .major-card:hover {
          box-shadow: 0 6px 20px rgba(7,113,60,0.12);
          transform: translateY(-3px);
          border-color: #a8d4b4;
        }

        .major-icon {
          width: 56px; height: 56px; border-radius: 14px;
          background: #ecfdf5; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 700; color: #07713c;
          flex-shrink: 0;
        }

        .major-label {
          font-size: 0.9rem; font-weight: 700; color: #07713c;
          line-height: 1.3;
        }

        .major-cta {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.73rem; font-weight: 700; color: #07713c;
          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .majors-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dept-root">

        {/* SIDEBAR */}
        <aside className="dept-sidebar">
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
        <div className="dept-main">
          <header className="dept-topbar">
            <div className="topbar-title">Department — BSBA</div>
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

          <main className="dept-content">

            <div className="dept-banner">
              <div className="dept-banner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <div className="dept-banner-title">College of Business Administration</div>
                <div className="dept-banner-sub">Bachelor of Science in Business Administration</div>
              </div>
              <span className="dept-badge">BSBA</span>
            </div>

            <div className="section-heading">
              <div className="section-title">Select a Major</div>
              <div className="section-sub">Choose a major to browse and manage its thesis submissions.</div>
            </div>

            <div className="majors-grid">
              {BSBA_MAJORS.map((major) => (
                <Link
                  key={major.value}
                  to={`/courses/cba/projects?major=${encodeURIComponent(major.value)}`}
                  className="major-card"
                >
                  <div className="major-icon">
                    {major.label.charAt(0)}
                  </div>
                  <div className="major-label">{major.label}</div>
                  <span className="major-cta">
                    View Theses
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </Link>
              ))}
            </div>

          </main>
        </div>
      </div>
    </>
  );
}