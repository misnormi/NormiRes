import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DEFAULT_LOGO = '/Normi_logo_2.png';
const LOGO_BASE = '/images/logo';

const COURSES = [
  {
    id: 'ccje',
    code: 'CCJE',
    name: 'College of Criminal Justice Education',
    bullets: ['BSCRIM - Criminal Justice', 'BSCRIM - Criminology'],
    logo: `${LOGO_BASE}/ccje.png`,
  },
  {
    id: 'bshm',
    code: 'BSHM',
    name: 'College of Hospitality Management',
    bullets: ['BSHM - Hotel Management', 'BSHM - Tourism Management'],
    logo: `${LOGO_BASE}/bshm.png`,
  },
  {
    id: 'cit',
    code: 'CIT',
    name: 'College of Information Technology',
    bullets: ['BSIT - Software Development', 'BSIT - Network Administration', 'BSIT - Data Science'],
    logo: `${LOGO_BASE}/cit.png`,
  },
  {
    id: 'cba',
    code: 'CBA',
    name: 'College of Business Administration',
    bullets: ['BSBA - Financial Management', 'BSBA - Marketing Management', 'BSBA - Human Resources'],
    logo: `${LOGO_BASE}/cba.png`,
  },
  {
    id: 'ceas',
    code: 'CEAS',
    name: 'College of Education, Arts, and Sciences',
    bullets: ['BEED', 'BSED - Filipino', 'BSED - Math', 'BSED - English'],
    logo: `${LOGO_BASE}/ceas.png`,
  },
  {
    id: 'maed',
    code: 'MAED',
    name: 'Master of Arts in Education',
    bullets: ['MAED - Educational Management', 'MAED - Guidance and Counseling'],
    logo: `${LOGO_BASE}/maed.png`,
  },
];

export default function Courses() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');
  const [majorModalCourse, setMajorModalCourse] = useState(null);
  const userInitial = (user?.email || 'U').charAt(0).toUpperCase();

  if (isBSBAMember) return <Navigate to="/department" replace />;

  function handleViewProjects(course) {
    if (course.id === 'cba' || course.id === 'ceas') {
      setMajorModalCourse(course);
    } else {
      navigate(`/courses/${course.id}/projects`);
    }
  }

  function handleSelectMajor(course, major) {
    navigate(`/courses/${course.id}/projects?major=${encodeURIComponent(major)}`);
    setMajorModalCourse(null);
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/></svg>,
    },
    {
      to: isBSBAMember ? '/department' : '/courses',
      label: isBSBAMember ? 'Department' : 'Departments',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    },
    {
      to: '/published',
      label: 'Published',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 7h6l2 2h10v9H3z"/><path d="M3 7V5h6l2 2"/></svg>,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M3 3h18v4H3z"/><path d="M7 13h3v8H7z"/><path d="M14 9h3v12h-3z"/></svg>,
    },
    ...(isAdmin ? [{
      to: '/users',
      label: 'Users',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    }] : []),
    {
      to: '/settings',
      label: 'Settings',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cr-root {
          display: flex;
          height: 100vh;
          font-family: Arial, sans-serif;
          background: #f0f2ed;
          overflow: hidden;
        }

        /* ── SIDEBAR ── */
        .cr-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #07713c;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .cr-sidebar::before {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          top: -80px; left: -80px;
          pointer-events: none;
        }
        .cr-sidebar::after {
          content: '';
          position: absolute;
          width: 240px; height: 240px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          bottom: -60px; right: -80px;
          pointer-events: none;
        }

        .sidebar-logo {
          padding: 24px 20px 18px;
          display: flex;
          align-items: center;
          gap: 11px;
          position: relative;
          z-index: 1;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .sidebar-logo img {
          width: 42px; height: 42px;
          object-fit: contain;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          padding: 4px;
          flex-shrink: 0;
        }
        .sidebar-logo-name { font-size: 0.88rem; font-weight: 700; color: #fff; line-height: 1.2; }
        .sidebar-logo-sub  { font-size: 0.67rem; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }

        .sidebar-nav {
          flex: 1; padding: 12px 0;
          display: flex; flex-direction: column; gap: 1px;
          position: relative; z-index: 1;
          overflow-y: auto;
        }
        .sidebar-nav::-webkit-scrollbar { width: 0; }

        .nav-section-label {
          font-size: 0.63rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.25); padding: 8px 20px 4px; font-weight: 700;
        }

        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 20px;
          text-decoration: none;
          color: rgba(255,255,255,0.62);
          font-size: 0.86rem; font-weight: 400;
          transition: color 0.2s, background 0.2s;
          position: relative;
          font-family: Arial, sans-serif;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .nav-link.active { color: #fff; background: rgba(255,255,255,0.11); font-weight: 600; }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px; background: #5cb85c;
          border-radius: 0 2px 2px 0;
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

        /* ── MAIN ── */
        .cr-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* ── TOPBAR ── */
        .cr-topbar {
          background: #fff; padding: 0 28px; height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #e8ede8; flex-shrink: 0;
        }
        .topbar-title { font-size: 1.1rem; font-weight: 700; color: #07713c; font-family: Arial, sans-serif; }
        .topbar-actions { display: flex; align-items: center; gap: 10px; }
        .topbar-icon-btn {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1.5px solid #e4ece4; background: #fff;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #6b7a6b; transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .topbar-icon-btn:hover { background: #f0fdf4; border-color: #5cb85c; color: #07713c; }
        .topbar-avatar {
          width: 36px; height: 36px; border-radius: 9px;
          background: #07713c; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.88rem;
        }

        /* ── CONTENT ── */
        .cr-content {
          flex: 1; overflow-y: auto;
          padding: 18px 22px;
        }
        .cr-content::-webkit-scrollbar { width: 5px; }
        .cr-content::-webkit-scrollbar-track { background: transparent; }
        .cr-content::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }

        .content-heading {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .content-title { font-size: 1rem; font-weight: 700; color: #07713c; }
        .content-count {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; background: #ecfdf5; color: #07713c;
          border-radius: 20px; padding: 3px 10px; border: 1px solid #d1fae5;
        }

        /* ── COURSE GRID ── */
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          align-items: stretch;
        }

        .course-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eaf0ea;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .course-card:hover {
          box-shadow: 0 4px 14px rgba(7,113,60,0.1);
          transform: translateY(-2px);
        }

        .course-card-body {
          padding: 14px 16px 10px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
          min-height: 96px;
        }

        .course-logo-wrap {
          width: 52px; height: 52px;
          border-radius: 10px;
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .course-logo-wrap img {
          width: 100%; height: 100%;
          object-fit: contain;
          padding: 5px;
        }

        .course-info { flex: 1; min-width: 0; }

        .course-code {
          font-size: 0.95rem; font-weight: 700; color: #07713c;
          line-height: 1.2; margin-bottom: 2px;
        }
        .course-name {
          font-size: 0.76rem; color: #5a7a5a;
          line-height: 1.4;
        }

        .course-bullets {
          margin-top: 7px;
          display: flex; flex-wrap: wrap; gap: 4px;
        }
        .course-bullet {
          font-size: 0.65rem; font-weight: 600;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #07713c; border-radius: 20px;
          padding: 2px 8px; letter-spacing: 0.03em;
        }

        .course-card-footer {
          padding: 9px 16px;
          border-top: 1px solid #f0f5f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .bullet-count {
          font-size: 0.71rem; color: #9aaa9a;
        }

        .btn-view {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 7px;
          background: #07713c; color: #fff;
          font-size: 0.75rem; font-weight: 700;
          font-family: Arial, sans-serif;
          border: none; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .btn-view:hover { background: #05592f; transform: translateY(-1px); }

        /* ── MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(2px);
        }
        .modal-box {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          width: 100%; max-width: 420px;
          margin: 0 16px;
          overflow: hidden;
        }
        .modal-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f0f5f0;
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .modal-title { font-size: 0.95rem; font-weight: 700; color: #07713c; }
        .modal-sub { font-size: 0.75rem; color: #7a9a7a; margin-top: 2px; }
        .modal-close {
          background: none; border: none; cursor: pointer;
          color: #aaa; font-size: 1.3rem; line-height: 1;
          padding: 2px 6px; border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .modal-close:hover { color: #333; background: #f5f5f5; }

        .modal-body { padding: 16px 24px; display: flex; flex-direction: column; gap: 8px; }

        .modal-option {
          width: 100%; text-align: left;
          padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e4ede4;
          background: #fff; color: #07713c;
          font-size: 0.86rem; font-weight: 500;
          font-family: Arial, sans-serif;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          display: flex; align-items: center; justify-content: space-between;
        }
        .modal-option:hover { background: #f0fdf4; border-color: #07713c; }
        .modal-option-arrow { color: #07713c; font-size: 0.85rem; }

        .modal-footer {
          padding: 12px 24px 20px;
          display: flex; justify-content: flex-end;
        }
        .btn-cancel {
          padding: 7px 18px; border-radius: 8px;
          border: 1.5px solid #d8e4d8; background: #fff;
          color: #6b7a6b; font-size: 0.8rem; font-weight: 600;
          font-family: Arial, sans-serif;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-cancel:hover { background: #f5f8f5; }

        @media (max-width: 768px) {
          .courses-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cr-root">

        {/* SIDEBAR */}
        <aside className="cr-sidebar">
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
                <Link
                  key={item.label}
                  to={item.to}
                  className={`nav-link${isActive ? ' active' : ''}`}
                >
                  {item.icon}
                  {item.label}
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
        <div className="cr-main">
          <header className="cr-topbar">
            <div className="topbar-title">Departments</div>
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

          <main className="cr-content">
            <div className="content-heading">
              <div className="content-title">All Departments</div>
              <span className="content-count">{COURSES.length} departments</span>
            </div>

            <div className="courses-grid">
              {COURSES.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-card-body">
                    <div className="course-logo-wrap">
                      <img
                        src={course.logo}
                        alt={`${course.name} logo`}
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_LOGO; }}
                      />
                    </div>
                    <div className="course-info">
                      <div className="course-code">{course.code}</div>
                      <div className="course-name">{course.name}</div>
                      {(course.id === 'cba' || course.id === 'ceas') && (
                        <div className="course-bullets">
                          {course.bullets.map((b) => (
                            <span key={b} className="course-bullet">{b}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="course-card-footer">
                    {(course.id === 'cba' || course.id === 'ceas') ? (
                      <span className="bullet-count">{course.bullets.length} program{course.bullets.length !== 1 ? 's' : ''}</span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => handleViewProjects(course)}
                      className="btn-view"
                    >
                      View Theses
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* MODAL */}
        {majorModalCourse && (
          <div className="modal-overlay" onClick={() => setMajorModalCourse(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="modal-title">Select a Program</div>
                  <div className="modal-sub">{majorModalCourse.name} · {majorModalCourse.code}</div>
                </div>
                <button className="modal-close" type="button" onClick={() => setMajorModalCourse(null)} aria-label="Close">×</button>
              </div>
              <div className="modal-body">
                {(majorModalCourse.bullets || []).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleSelectMajor(majorModalCourse, b)}
                    className="modal-option"
                  >
                    <span>{b}</span>
                    <span className="modal-option-arrow">→</span>
                  </button>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setMajorModalCourse(null)} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}