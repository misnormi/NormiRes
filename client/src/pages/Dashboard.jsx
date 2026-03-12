import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useAuth } from '../hooks/useAuth';
import {
  getFiles,
  uploadFile,
  getDownloadUrl,
  getProfileImageUrl,
  deleteFile,
  getCharts,
} from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BAR_COLORS = [
  'rgba(47,181,172,0.85)',
  'rgba(52,168,83,0.85)',
  'rgba(66,133,244,0.85)',
  'rgba(251,188,5,0.85)',
  'rgba(234,67,53,0.85)',
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');

  const [files, setFiles]         = useState([]);
  const [chartData, setChartData] = useState(null);
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');

  function loadFiles() {
    getFiles()
      .then(({ files: f }) => setFiles(f))
      .catch(() => setError('Failed to load thesis submissions'));
  }
  function loadCharts() {
    getCharts().then(setChartData).catch(() => setChartData(null));
  }
  useEffect(() => { loadFiles(); loadCharts(); }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this thesis?')) return;
    try {
      await deleteFile(id);
      setMessage('Thesis deleted.');
      loadFiles(); loadCharts();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  const chartSource = chartData?.chart_labels?.length ? chartData : null;

  const barChartData = chartSource ? {
    labels: chartSource.chart_labels,
    datasets: [{
      label: 'Theses',
      data: chartSource.chart_values,
      backgroundColor: BAR_COLORS,
      borderRadius: 10,
      borderSkipped: false,
      barThickness: 32,
    }],
  } : null;

  const lineChartData = chartSource?.line_labels?.length ? {
    labels: chartSource.line_labels,
    datasets: [{
      label: 'Total submissions',
      data: chartSource.line_values,
      borderColor: '#07713c',
      backgroundColor: 'rgba(7,113,60,0.12)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#07713c',
    }],
  } : null;

  const chartOpts = () => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#6b7a6b', font: { size: 11, family: 'Arial, sans-serif' } },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7a6b', font: { size: 11, family: 'Arial, sans-serif' } },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#07713c',
        titleFont: { size: 12, family: 'Arial, sans-serif' },
        bodyFont: { size: 12, family: 'Arial, sans-serif' },
        padding: 12,
        cornerRadius: 8,
      },
    },
  });

  const userInitial = (user?.email || 'U').charAt(0).toUpperCase();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
          <path d="M3 11L12 4l9 7"/><path d="M5 10v10h14V10"/>
        </svg>
      ),
    },
    {
      to: isBSBAMember ? '/department' : '/courses',
      label: isBSBAMember ? 'Department' : 'Departments',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      to: '/published',
      label: 'Published',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
          <path d="M3 7h6l2 2h10v9H3z"/><path d="M3 7V5h6l2 2"/>
        </svg>
      ),
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
          <path d="M3 3h18v4H3z"/><path d="M7 13h3v8H7z"/><path d="M14 9h3v12h-3z"/>
        </svg>
      ),
    },
    ...(isAdmin ? [{
      to: '/users',
      label: 'Users',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="3"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    }] : []),
    {
      to: '/settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,flexShrink:0}}>
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          display: flex;
          height: 100vh;
          width: 100vw;
          font-family: Arial, sans-serif;
          background: #f0f2ed;
          overflow: hidden;
        }

        .db-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #07713c;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .db-sidebar::before {
          content: ''; position: absolute;
          width: 320px; height: 320px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05);
          top: -80px; left: -80px; pointer-events: none;
        }
        .db-sidebar::after {
          content: ''; position: absolute;
          width: 240px; height: 240px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          bottom: -60px; right: -80px; pointer-events: none;
        }

        .sidebar-logo {
          padding: 24px 20px 18px;
          display: flex; align-items: center; gap: 11px;
          position: relative; z-index: 1;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
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
          padding: 9px 20px; text-decoration: none;
          color: rgba(255,255,255,0.62); font-size: 0.86rem; font-weight: 400;
          transition: color 0.2s, background 0.2s;
          position: relative; font-family: Arial, sans-serif;
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
          font-weight: 700; font-size: 0.82rem; flex-shrink: 0; overflow: hidden;
        }
        .sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
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

        .db-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100vh;
          overflow: hidden;
        }

        .db-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }
        .db-scroll::-webkit-scrollbar { width: 6px; }
        .db-scroll::-webkit-scrollbar-track { background: transparent; }
        .db-scroll::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }
        .db-scroll::-webkit-scrollbar-thumb:hover { background: #a8c4a8; }

        .db-topbar {
          background: #fff;
          padding: 0 28px;
          height: 62px;
          min-height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid #e8ede8;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 10;
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
          font-weight: 700; font-size: 0.88rem; overflow: hidden; flex-shrink: 0;
        }
        .topbar-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .db-content {
          padding: 24px 28px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        .alert { padding: 11px 16px; border-radius: 10px; font-size: 0.84rem; display: flex; align-items: center; gap: 8px; }
        .alert-success { background: #e8f5e9; border-left: 3px solid #4cae4c; color: #1b5e20; }
        .alert-error   { background: #fdecea; border-left: 3px solid #e53935; color: #b71c1c; }

        .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .chart-card { background: #fff; border-radius: 14px; padding: 22px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .card-title { font-size: 0.92rem; font-weight: 700; color: #07713c; }
        .card-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; background: #ecfdf5; color: #07713c; border-radius: 20px; padding: 3px 10px; border: 1px solid #d1fae5; }
        .chart-wrap { position: relative; height: 195px; }
        .chart-empty { color: #bbb; font-size: 0.83rem; text-align: center; padding-top: 70px; }

        .table-card { background: #fff; border-radius: 14px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; }
        .table-card-header { padding: 18px 24px 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f0f5f0; }
        .table-head { display: grid; grid-template-columns: 2.6fr 1.4fr 1.1fr 1.4fr; padding: 9px 24px; background: #f8faf8; border-bottom: 1px solid #f0f5f0; }
        .th { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7a9a7a; }
        .th:last-child { text-align: right; }

        .table-row { display: grid; grid-template-columns: 2.6fr 1.4fr 1.1fr 1.4fr; padding: 13px 24px; align-items: center; border-bottom: 1px solid #f5f8f5; transition: background 0.15s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: #f8fdf8; }

        .row-project { display: flex; align-items: center; gap: 11px; min-width: 0; }
        .row-thumb {
          width: 36px; height: 36px; border-radius: 9px;
          background: #ecfdf5; border: 1px solid #d1fae5;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.82rem; color: #07713c;
          flex-shrink: 0; overflow: hidden; position: relative;
        }
        .row-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 9px; }
        .row-title { font-size: 0.86rem; font-weight: 600; color: #07713c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .row-desc  { font-size: 0.73rem; color: #8a9a8a; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .row-author { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .author-dot { width: 26px; height: 26px; border-radius: 50%; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
        .author-email { font-size: 0.78rem; color: #4a6a4a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .dept-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #07713c; }

        .row-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
        .row-date { font-size: 0.72rem; color: #9aaa9a; }
        .row-btns { display: flex; gap: 6px; }
        .btn-action { display: inline-flex; align-items: center; gap: 4px; padding: 4px 11px; border-radius: 7px; font-size: 0.73rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s, color 0.2s, transform 0.1s; text-decoration: none; border: 1.5px solid; }
        .btn-download { border-color: #07713c; color: #07713c; background: #fff; }
        .btn-download:hover { background: #07713c; color: #fff; transform: translateY(-1px); }
        .btn-delete { border-color: #fca5a5; color: #dc2626; background: #fff; }
        .btn-delete:hover { background: #fef2f2; transform: translateY(-1px); }

        .empty-state { padding: 44px 24px; text-align: center; color: #9aaa9a; font-size: 0.88rem; }

        @media (max-width: 900px) {
          .charts-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-root">

        {/* SIDEBAR */}
        <aside className="db-sidebar">
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
              <div className="sidebar-avatar">
                {getProfileImageUrl(user?.profile_image_path)
                  ? <img src={getProfileImageUrl(user.profile_image_path)} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                  : userInitial}
              </div>
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
        <div className="db-main">
          <div className="db-scroll">

          <header className="db-topbar">
            <div className="topbar-title">Thesis Repository</div>
            <div className="topbar-actions">
              <button className="topbar-icon-btn" type="button" aria-label="Notifications">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
              <div className="topbar-avatar">
                {getProfileImageUrl(user?.profile_image_path)
                  ? <img src={getProfileImageUrl(user.profile_image_path)} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                  : userInitial}
              </div>
            </div>
          </header>

          <main className="db-content">

            {message && <div className="alert alert-success">✓ {message}</div>}
            {error   && <div className="alert alert-error">✕ {error}</div>}

            <div className="charts-row">
              <div className="chart-card">
                <div className="card-header">
                  <div className="card-title">Theses by Department</div>
                  <span className="card-badge">Bar</span>
                </div>
                <div className="chart-wrap">
                  {barChartData
                    ? <Bar data={barChartData} options={chartOpts()} />
                    : <div className="chart-empty">No data yet</div>}
                </div>
              </div>
              <div className="chart-card">
                <div className="card-header">
                  <div className="card-title">Thesis Submissions Over Time</div>
                  <span className="card-badge">Trend</span>
                </div>
                <div className="chart-wrap">
                  {lineChartData
                    ? <Line data={lineChartData} options={chartOpts()} />
                    : <div className="chart-empty">No data yet</div>}
                </div>
              </div>
            </div>

            <div className="table-card">
              <div className="table-card-header">
                <div className="card-title">Thesis Submissions</div>
                <span className="card-badge">{files.length} total</span>
              </div>
              {files.length === 0 ? (
                <div className="empty-state">No thesis submissions yet. Uploaded theses will appear here.</div>
              ) : (
                <>
                  <div className="table-head">
                    <div className="th">Thesis Title</div>
                    <div className="th">Student / Author</div>
                    <div className="th">Department</div>
                    <div className="th" style={{ textAlign: 'right' }}>Date / Actions</div>
                  </div>
                  <div>
                    {files.map((f) => {
                      const titleInitial  = (f.display_title || 'T').charAt(0).toUpperCase();
                      const authorInitial = (f.user_email || 'S').charAt(0).toUpperCase();
                      const dateLabel = f.created_at ? new Date(f.created_at).toLocaleDateString() : '—';
                      const profileImg = getProfileImageUrl(f.profile_image_path);
                      return (
                        <div className="table-row" key={f.id}>
                          <div className="row-project">
                            <div className="row-thumb">
                              {titleInitial}
                              {profileImg && (
                                <img src={profileImg} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div className="row-title">{f.display_title}</div>
                              {f.description && <div className="row-desc">{f.description}</div>}
                            </div>
                          </div>
                          <div className="row-author">
                            <div className="author-dot">{authorInitial}</div>
                            <span className="author-email">{f.user_email || '—'}</span>
                          </div>
                          <div>
                            <span className="dept-badge">{f.department || 'N/A'}</span>
                          </div>
                          <div className="row-actions">
                            <div className="row-date">{dateLabel}</div>
                            <div className="row-btns">
                              <a
                                href={getDownloadUrl(f.id)}
                                download={f.original_name || 'download'}
                                className="btn-action btn-download"
                              >
                                ↓ Download
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDelete(f.id)}
                                className="btn-action btn-delete"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

          </main>
          </div>
        </div>
      </div>
    </>
  );
}