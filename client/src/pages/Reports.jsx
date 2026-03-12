import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Reports() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  const isBSBAMember = (user?.department || '').toUpperCase().includes('BSBA');

  return (
    <div className="h-screen bg-[#e8e8e8] flex">
      <aside className="h-full w-60 min-w-[240px] bg-[#2d5a2d] text-white py-6 flex flex-col">
        <div className="mb-8 w-full flex justify-center">
          <img
            src="/Normi_logo_2.png"
            alt="Northern Mindanao Colleges, Inc. - NORMI"
            className="w-20 h-20 object-contain rounded-full bg-white"
          />
        </div>
        <nav className="w-full flex flex-col flex-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-5 py-3 no-underline transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-black/15 hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 11L12 4l9 7" />
              <path d="M5 10v10h14V10" />
            </svg>
            <span>Home</span>
          </Link>
          <Link
            to={isBSBAMember ? '/department' : '/courses'}
            className={`flex items-center gap-3 px-5 py-3 no-underline transition-colors ${
              (isBSBAMember
                ? location.pathname === '/department' || location.pathname.startsWith('/courses/cba')
                : location.pathname.startsWith('/courses'))
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-black/15 hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="3" />
              <circle cx="16" cy="8" r="3" />
              <path d="M3 20c0-3 2-5 5-5" />
              <path d="M13 15c3 0 5 2 5 5" />
            </svg>
            <span>{isBSBAMember ? 'Department' : 'Courses'}</span>
          </Link>
          <Link
            to="/published"
            className={`flex items-center gap-3 px-5 py-3 no-underline transition-colors ${
              location.pathname === '/published'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-black/15 hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7h6l2 2h10v9H3z" />
              <path d="M3 7V5h6l2 2" />
            </svg>
            <span>Published</span>
          </Link>
          <Link
            to="/reports"
            className={`flex items-center gap-3 px-5 py-3 no-underline transition-colors ${
              location.pathname === '/reports'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-black/15 hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h18v4H3z" />
              <path d="M7 13h3v8H7z" />
              <path d="M14 9h3v12h-3z" />
            </svg>
            <span>Reports</span>
          </Link>
          {isAdmin && (
            <Link
              to="/users"
              className={`flex items-center gap-3 px-5 py-3 no-underline transition-colors ${
                location.pathname === '/users'
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:bg-black/15 hover:text-white'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="3" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>User</span>
            </Link>
          )}
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-5 py-3 no-underline transition-colors ${
              location.pathname === '/settings'
                ? 'bg-white/20 text-white'
                : 'text-white/90 hover:bg-black/15 hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" />
            </svg>
            <span>Settings</span>
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-5 py-3 text-white/90 bg-transparent border-none cursor-pointer hover:bg-black/15 hover:text-white transition-colors text-left"
        >
          Log out
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="m-0 text-xl font-bold text-[rgba(62,126,42,1)] tracking-wide">
            REPORTS
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="bg-transparent border-none cursor-pointer p-1.5 text-xl"
              aria-label="Notifications"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500"
              >
                <path
                  d="M15 17H20L18.6 15.6C18.2173 15.2173 18 14.6972 18 14.1569V11C18 8.23858 15.7614 6 13 6H12C9.23858 6 7 8.23858 7 11V14.1569C7 14.6972 6.78266 15.2173 6.4 15.6L5 17H10M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className="w-10 h-10 rounded-full bg-[#5cb85c] text-white flex items-center justify-center font-bold text-base"
              aria-label="Profile"
            >
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-4xl">
            <h2 className="text-lg font-semibold text-[rgba(62,126,42,1)] mb-1">
              Reports Overview
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              This page is a placeholder for analytics and reporting (per department, per year,
              per role, etc.). You can extend it later with real charts or tables.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

