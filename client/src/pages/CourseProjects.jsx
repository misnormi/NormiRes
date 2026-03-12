import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFiles, getDownloadUrl, deleteFile, getProfileImageUrl } from '../api';

const LOGO_BASE = '/images/logo';

const COURSE_CONFIG = {
  ccje: { id: 'ccje', code: 'CCJE', name: 'College of Criminal Justice Education', departmentCode: 'BSCRIM', logo: `${LOGO_BASE}/ccje.png` },
  bshm: { id: 'bshm', code: 'BSHM', name: 'College of Hospitality Management',    departmentCode: 'BSHM',   logo: `${LOGO_BASE}/bshm.png` },
  cit:  { id: 'cit',  code: 'CIT',  name: 'College of Information Technology',     departmentCode: 'BSIT',   logo: `${LOGO_BASE}/cit.png`  },
  cba:  { id: 'cba',  code: 'CBA',  name: 'College of Business Administration',    departmentCode: 'BSBA',   logo: `${LOGO_BASE}/cba.png`  },
  ceas: { id: 'ceas', code: 'CEAS', name: 'College of Education, Arts, and Sciences', departmentCode: 'BSED', logo: `${LOGO_BASE}/ceas.png` },
  maed: { id: 'maed', code: 'MAED', name: 'Master of Arts in Education',           departmentCode: 'MAED',   logo: `${LOGO_BASE}/maed.png` },
};

export default function CourseProjects() {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();

  const [files, setFiles]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [query, setQuery]               = useState('');
  const [yearFilter, setYearFilter]     = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const major    = searchParams.get('major') || '';
  const course   = COURSE_CONFIG[courseId] || null;
  const isAdmin  = (user?.role && user.role.toLowerCase() === 'admin') || (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');
  const userInitial  = (user?.email || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    setLoading(true); setError('');
    getFiles()
      .then(({ files: f }) => setFiles(f || []))
      .catch(() => setError('Failed to load theses.'))
      .finally(() => setLoading(false));
  }, []);

  const yearOptions = useMemo(() => {
    const years = new Set();
    files.forEach((f) => {
      const d = f.published_date || f.created_at;
      if (!d) return;
      const y = new Date(d).getFullYear();
      if (!Number.isNaN(y)) years.add(String(y));
    });
    return Array.from(years).sort().reverse();
  }, [files]);

  const filteredFiles = useMemo(() => {
    if (!course) return [];
    const deptCode = course.departmentCode?.toUpperCase() || '';
    let result = files.filter((f) => (f.department || '').toUpperCase().includes(deptCode));
    if (major) {
      const m = major.toLowerCase();
      result = result.filter((f) => (f.major || '').toLowerCase().includes(m) || (f.description || '').toLowerCase().includes(m));
    }
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((f) =>
        (f.display_title || '').toLowerCase().includes(q) ||
        (f.description   || '').toLowerCase().includes(q) ||
        (f.author_name   || '').toLowerCase().includes(q) ||
        (f.user_email    || '').toLowerCase().includes(q) ||
        (f.department    || '').toLowerCase().includes(q)
      );
    }
    if (yearFilter) {
      result = result.filter((f) => {
        const d = f.published_date || f.created_at;
        if (!d) return false;
        return String(new Date(d).getFullYear()) === yearFilter;
      });
    }
    return result;
  }, [course, files, major, query, yearFilter]);

  async function handleAdminDelete(project) {
    if (!project || !isAdmin) return;
    if (!window.confirm('Delete this thesis?')) return;
    setDeleting(true); setError('');
    try {
      await deleteFile(project.id);
      setFiles((prev) => prev.filter((f) => f.id !== project.id));
      setSelectedProject(null);
    } catch (err) {
      setError(err.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
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

  if (!course) {
    return (
      <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f2ed',fontFamily:'Arial,sans-serif'}}>
        <div style={{background:'#fff',borderRadius:14,padding:'32px 40px',textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
          <p style={{color:'#4a6a4a',marginBottom:16,fontSize:'0.9rem'}}>Unknown department or course.</p>
          <button type="button" onClick={() => navigate('/courses')} style={{padding:'8px 20px',borderRadius:8,background:'#07713c',color:'#fff',border:'none',fontWeight:700,cursor:'pointer',fontFamily:'Arial,sans-serif'}}>
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  const titleParts = [course.code, ...(major ? [major] : [])];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .cp-root { display: flex; height: 100vh; font-family: Arial, sans-serif; background: #f0f2ed; overflow: hidden; }

        /* SIDEBAR */
        .cp-sidebar { width: 240px; flex-shrink: 0; background: #07713c; display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; }
        .cp-sidebar::before { content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05); top: -80px; left: -80px; pointer-events: none; }
        .cp-sidebar::after  { content: ''; position: absolute; width: 240px; height: 240px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.04); bottom: -60px; right: -80px; pointer-events: none; }
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
        .cp-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* TOPBAR */
        .cp-topbar { background: #fff; padding: 0 28px; height: 62px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8ede8; flex-shrink: 0; }
        .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 700; }
        .breadcrumb-btn { background: none; border: none; cursor: pointer; color: #07713c; font-weight: 700; font-size: 0.88rem; padding: 0; font-family: Arial, sans-serif; transition: color 0.2s; }
        .breadcrumb-btn:hover { color: #05592f; }
        .breadcrumb-sep { color: #c4d4c4; font-size: 0.8rem; }
        .breadcrumb-current { color: #07713c; font-weight: 700; }
        .breadcrumb-major { color: #5a7a5a; font-weight: 400; }
        .topbar-actions { display: flex; align-items: center; gap: 10px; }
        .topbar-icon-btn { width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid #e4ece4; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7a6b; transition: background 0.2s, border-color 0.2s, color 0.2s; }
        .topbar-icon-btn:hover { background: #f0fdf4; border-color: #5cb85c; color: #07713c; }
        .topbar-avatar { width: 36px; height: 36px; border-radius: 9px; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.88rem; }

        /* CONTENT */
        .cp-content { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
        .cp-content::-webkit-scrollbar { width: 5px; }
        .cp-content::-webkit-scrollbar-track { background: transparent; }
        .cp-content::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 10px; }

        .alert-error { padding: 11px 16px; border-radius: 10px; font-size: 0.84rem; background: #fdecea; border-left: 3px solid #e53935; color: #b71c1c; display: flex; align-items: center; gap: 8px; }

        /* DEPT BANNER */
        .dept-banner { background: #fff; border-radius: 14px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); padding: 18px 22px; display: flex; align-items: center; gap: 16px; }
        .dept-logo-wrap { width: 52px; height: 52px; border-radius: 12px; background: #ecfdf5; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
        .dept-logo-wrap img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
        .dept-banner-code { font-size: 1rem; font-weight: 700; color: #07713c; }
        .dept-banner-name { font-size: 0.78rem; color: #5a7a5a; margin-top: 2px; }
        .dept-banner-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .count-badge { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; background: #ecfdf5; color: #07713c; border: 1px solid #d1fae5; border-radius: 20px; padding: 4px 12px; }

        /* TABLE CARD */
        .table-card { background: #fff; border-radius: 14px; border: 1px solid #eaf0ea; box-shadow: 0 1px 4px rgba(0,0,0,0.04); overflow: hidden; flex: 1; display: flex; flex-direction: column; }

        /* TOOLBAR */
        .toolbar { padding: 16px 22px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; border-bottom: 1px solid #f0f5f0; }
        .search-box { display: flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1.5px solid #d2dcd2; border-radius: 8px; background: #f8faf8; flex: 1; min-width: 160px; transition: border-color 0.2s; }
        .search-box:focus-within { border-color: #5cb85c; background: #fff; }
        .search-box svg { color: #9aaa9a; flex-shrink: 0; }
        .search-box input { border: none; outline: none; background: transparent; font-size: 0.82rem; color: #07713c; width: 100%; font-family: Arial, sans-serif; }
        .search-box input::placeholder { color: #a8b8a8; }
        .filter-select { padding: 7px 28px 7px 11px; border: 1.5px solid #d2dcd2; border-radius: 8px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7a6b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center; font-size: 0.82rem; color: #3a5a3a; font-family: Arial, sans-serif; outline: none; appearance: none; cursor: pointer; transition: border-color 0.2s; }
        .filter-select:focus { border-color: #5cb85c; }
        .btn-add-thesis { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; background: #07713c; color: #fff; border: none; font-size: 0.8rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s, transform 0.15s; box-shadow: 0 2px 6px rgba(7,113,60,0.2); white-space: nowrap; }
        .btn-add-thesis:hover { background: #05592f; transform: translateY(-1px); }

        /* TABLE HEAD */
        .table-head { display: grid; grid-template-columns: 2.6fr 1.4fr 1.1fr 1.2fr; padding: 10px 22px; background: #f8faf8; border-bottom: 1px solid #f0f5f0; }
        .th { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #7a9a7a; }
        .th:last-child { text-align: right; }

        /* TABLE ROWS */
        .table-body { overflow-y: auto; flex: 1; }
        .table-body::-webkit-scrollbar { width: 4px; }
        .table-body::-webkit-scrollbar-thumb { background: #d1e4d1; border-radius: 10px; }

        .t-row { display: grid; grid-template-columns: 2.6fr 1.4fr 1.1fr 1.2fr; padding: 13px 22px; align-items: center; border-bottom: 1px solid #f5f8f5; transition: background 0.15s; cursor: pointer; }
        .t-row:last-child { border-bottom: none; }
        .t-row:hover { background: #f5fdf5; }

        .row-title-cell { display: flex; align-items: center; gap: 11px; min-width: 0; }
        .row-thumb { width: 38px; height: 38px; border-radius: 9px; background: #ecfdf5; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.84rem; color: #07713c; flex-shrink: 0; overflow: hidden; position: relative; }
        .row-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 9px; }
        .row-title { font-size: 0.86rem; font-weight: 600; color: #07713c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .row-desc  { font-size: 0.73rem; color: #8a9a8a; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .row-author { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .author-dot { width: 26px; height: 26px; border-radius: 50%; background: #07713c; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
        .author-email { font-size: 0.78rem; color: #4a6a4a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .dept-pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #07713c; }

        .row-date { font-size: 0.78rem; color: #6a8a6a; font-weight: 500; text-align: right; }

        .empty-state { padding: 56px 24px; text-align: center; color: #9aaa9a; font-size: 0.88rem; }
        .loading-state { padding: 56px 24px; text-align: center; color: #9aaa9a; font-size: 0.88rem; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); }
        .modal-box { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); width: 100%; max-width: 560px; margin: 0 16px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column; }
        .modal-header { padding: 20px 24px 16px; border-bottom: 1px solid #f0f5f0; display: flex; align-items: flex-start; gap: 14px; flex-shrink: 0; }
        .modal-thumb { width: 52px; height: 52px; border-radius: 12px; background: #ecfdf5; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; color: #07713c; flex-shrink: 0; overflow: hidden; position: relative; }
        .modal-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
        .modal-title { font-size: 1rem; font-weight: 700; color: #07713c; line-height: 1.3; }
        .modal-desc  { font-size: 0.8rem; color: #5a7a5a; margin-top: 4px; line-height: 1.5; }
        .modal-close { margin-left: auto; background: none; border: none; cursor: pointer; color: #aaa; font-size: 1.3rem; line-height: 1; padding: 2px 6px; border-radius: 6px; flex-shrink: 0; transition: color 0.2s, background 0.2s; }
        .modal-close:hover { color: #333; background: #f5f5f5; }

        .modal-body { padding: 20px 24px; overflow-y: auto; }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .meta-item {}
        .meta-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7a9a7a; margin-bottom: 3px; }
        .meta-value { font-size: 0.84rem; color: #07713c; font-weight: 500; }

        .modal-footer { padding: 16px 24px; border-top: 1px solid #f0f5f0; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; gap: 10px; }
        .modal-filename { font-size: 0.73rem; color: #8a9a8a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .modal-btns { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .btn-close  { padding: 7px 16px; border-radius: 8px; border: 1.5px solid #d2dcd2; background: #fff; color: #4a6a4a; font-size: 0.78rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s; }
        .btn-close:hover { background: #f0f5f0; }
        .btn-del    { padding: 7px 14px; border-radius: 8px; border: 1.5px solid #fca5a5; background: #fff; color: #dc2626; font-size: 0.78rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; transition: background 0.2s; }
        .btn-del:hover:not(:disabled) { background: #fef2f2; }
        .btn-del:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-download { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; background: #07713c; color: #fff; border: none; font-size: 0.78rem; font-weight: 700; font-family: Arial, sans-serif; cursor: pointer; text-decoration: none; transition: background 0.2s; }
        .btn-download:hover { background: #05592f; }
      `}</style>

      <div className="cp-root">

        {/* SIDEBAR */}
        <aside className="cp-sidebar">
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
        <div className="cp-main">
          <header className="cp-topbar">
            <div className="topbar-breadcrumb">
              <button type="button" className="breadcrumb-btn" onClick={() => navigate(isBSBAMember ? '/department' : '/courses')}>
                Departments
              </button>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">{course.code}</span>
              {major && <>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-major">{major}</span>
              </>}
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

          <main className="cp-content">
            {error && <div className="alert-error">✕ {error}</div>}

            <div className="dept-banner">
              <div className="dept-logo-wrap">
                <img src={course.logo} alt={course.code} onError={(e) => { e.target.src = '/Normi_logo_2.png'; }} />
              </div>
              <div>
                <div className="dept-banner-code">{course.code}{major ? ` — ${major}` : ''}</div>
                <div className="dept-banner-name">{course.name}</div>
              </div>
              <div className="dept-banner-right">
                <span className="count-badge">{filteredFiles.length} {filteredFiles.length === 1 ? 'thesis' : 'theses'}</span>
              </div>
            </div>

            <div className="table-card">
              <div className="toolbar">
                <div className="search-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input type="text" placeholder="Search theses, authors…" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <select className="filter-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                  <option value="">All Years</option>
                  {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <button type="button" className="btn-add-thesis" onClick={() => navigate('/published')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  Add Thesis
                </button>
              </div>

              <div className="table-head">
                <div className="th">Thesis Title</div>
                <div className="th">Author</div>
                <div className="th">Department</div>
                <div className="th" style={{textAlign:'right'}}>Date Published</div>
              </div>

              <div className="table-body">
                {loading ? (
                  <div className="loading-state">Loading theses…</div>
                ) : filteredFiles.length === 0 ? (
                  <div className="empty-state">
                    No theses found for {course.code}{major ? ` — ${major}` : ''}{query ? ` matching "${query}"` : ''}.
                  </div>
                ) : (
                  filteredFiles.map((f) => {
                    const titleInitial  = (f.display_title || 'T').charAt(0).toUpperCase();
                    const authorInitial = (f.user_email || 'S').charAt(0).toUpperCase();
                    const dateSource    = f.published_date || f.created_at;
                    const dateLabel     = dateSource ? new Date(dateSource).toLocaleDateString() : '—';
                    const profileImg    = getProfileImageUrl(f.profile_image_path);
                    return (
                      <div key={f.id} className="t-row" onClick={() => setSelectedProject(f)}>
                        <div className="row-title-cell">
                          <div className="row-thumb">
                            {titleInitial}
                            {profileImg && <img src={profileImg} alt="" onError={(e) => { e.target.style.display = 'none'; }} />}
                          </div>
                          <div style={{minWidth:0}}>
                            <div className="row-title">{f.display_title}</div>
                            {f.description && <div className="row-desc">{f.description}</div>}
                          </div>
                        </div>
                        <div className="row-author">
                          <div className="author-dot">{authorInitial}</div>
                          <span className="author-email">{f.user_email || '—'}</span>
                        </div>
                        <div><span className="dept-pill">{f.department || '—'}</span></div>
                        <div className="row-date">{dateLabel}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </main>
        </div>

        {/* DETAIL MODAL */}
        {selectedProject && (
          <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-thumb">
                  {(selectedProject.display_title || 'T').charAt(0).toUpperCase()}
                  {getProfileImageUrl(selectedProject.profile_image_path) && (
                    <img src={getProfileImageUrl(selectedProject.profile_image_path)} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="modal-title">{selectedProject.display_title}</div>
                  {selectedProject.description && <div className="modal-desc">{selectedProject.description}</div>}
                </div>
                <button type="button" className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close">×</button>
              </div>

              <div className="modal-body">
                <div className="modal-grid">
                  <div className="meta-item">
                    <div className="meta-label">Author</div>
                    <div className="meta-value">{selectedProject.author_name || '—'}</div>
                    {selectedProject.user_email && <div style={{fontSize:'0.73rem',color:'#8a9a8a',marginTop:2}}>{selectedProject.user_email}</div>}
                  </div>
                  <div className="meta-item">
                    <div className="meta-label">Department</div>
                    <div className="meta-value">{selectedProject.department || '—'}</div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-label">Thesis Advisor</div>
                    <div className="meta-value">{selectedProject.advisor || '—'}</div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-label">Major / Program</div>
                    <div className="meta-value">{selectedProject.major || '—'}</div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-label">Date Published</div>
                    <div className="meta-value">
                      {(selectedProject.published_date || selectedProject.created_at)
                        ? new Date(selectedProject.published_date || selectedProject.created_at).toLocaleDateString()
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="modal-filename">
                  📄 {selectedProject.original_name || 'thesis-document'}
                </div>
                <div className="modal-btns">
                  <button type="button" className="btn-close" onClick={() => setSelectedProject(null)}>Close</button>
                  {isAdmin && (
                    <button type="button" className="btn-del" onClick={() => handleAdminDelete(selectedProject)} disabled={deleting}>
                      {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                  )}
                  <a
                    href={getDownloadUrl(selectedProject.id)}
                    download={selectedProject.original_name || 'download'}
                    className="btn-download"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}