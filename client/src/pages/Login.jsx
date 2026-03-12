import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserFromLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state?.fromSignup;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login(email.trim(), password);
      setUserFromLogin(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: Arial, sans-serif;
          background: #f4f6f0;
        }

        /* ── LEFT SIDEBAR ── */
        .sidebar {
          flex: 1;
          background: #07713c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 64px;
          position: relative;
          overflow: hidden;
        }

        .sidebar::before,
        .sidebar::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sidebar::before {
          width: 480px; height: 480px;
          top: -120px; left: -120px;
        }
        .sidebar::after {
          width: 360px; height: 360px;
          bottom: -100px; right: -140px;
        }

        .sidebar-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
        }

        .logo-ring {
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 36px;
          box-shadow: 0 0 60px rgba(92,184,92,0.18);
        }

        .logo-ring img {
          width: 108px; height: 108px;
          object-fit: contain;
          filter: brightness(1.05);
        }

        .sidebar-school {
          font-family: Arial, sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
          letter-spacing: 0.01em;
          margin-bottom: 12px;
        }

        .sidebar-tagline {
          font-size: 0.82rem;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          line-height: 1.6;
          margin-bottom: 6px;
        }

        .sidebar-divider {
          width: 48px;
          height: 2px;
          background: #5cb85c;
          border-radius: 2px;
          margin: 28px auto;
          opacity: 0.7;
        }

        .sidebar-quote {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.38);
          font-style: italic;
          line-height: 1.8;
          max-width: 300px;
        }

        /* ── RIGHT PANEL ── */
        .form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 64px;
          background: #f4f6f0;
        }

        .form-card {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          margin-bottom: 36px;
        }

        .form-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #07713c;
          margin-bottom: 8px;
        }

        .form-title {
          font-family: Arial, sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #07713c;
          line-height: 1.2;
        }

        .form-subtitle {
          margin-top: 8px;
          font-size: 0.9rem;
          color: #6b7a6b;
          font-weight: 300;
        }

        .alert-success {
          padding: 12px 16px;
          border-radius: 8px;
          background: #e8f5e9;
          border-left: 3px solid #4cae4c;
          color: #1b5e20;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .alert-error {
          padding: 12px 16px;
          border-radius: 8px;
          background: #fdecea;
          border-left: 3px solid #e53935;
          color: #b71c1c;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .field {
          margin-bottom: 20px;
        }

        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #07713c;
          margin-bottom: 8px;
        }

        .field input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #d2dcd2;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: Arial, sans-serif;
          background: #ffffff;
          color: #07713c;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .field input::placeholder {
          color: #a8b8a8;
          font-style: italic;
          font-weight: 300;
        }

        .field input:focus {
          border-color: #07713c;
          box-shadow: 0 0 0 3px rgba(7,113,60,0.12);
        }

        .btn-submit {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          background: #07713c;
          color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(7,113,60,0.25);
        }

        .btn-submit:hover:not(:disabled) {
          background: #05592f;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(7,113,60,0.3);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.88rem;
          color: #7a8c7a;
        }

        .form-footer a {
          color: #07713c;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }

        .form-footer a:hover {
          border-bottom-color: #07713c;
        }

        @media (max-width: 768px) {
          .login-root { flex-direction: column; }
          .sidebar {
            width: 100%;
            padding: 36px 28px;
            flex-direction: row;
            justify-content: flex-start;
            gap: 20px;
            min-height: auto;
          }
          .sidebar::before, .sidebar::after { display: none; }
          .sidebar-inner { flex-direction: row; text-align: left; gap: 20px; align-items: center; }
          .logo-ring { width: 72px; height: 72px; margin-bottom: 0; flex-shrink: 0; }
          .logo-ring img { width: 48px; height: 48px; }
          .sidebar-divider, .sidebar-quote { display: none; }
          .sidebar-school { font-size: 1.1rem; }
          .form-panel { padding: 36px 24px; }
        }
      `}</style>

      <div className="login-root">
        <aside className="sidebar">
          <div className="sidebar-inner">
            <div className="logo-ring">
              <img src="/Normi_logo_2.png" alt="NORMI Logo" />
            </div>
            <div>
              <div className="sidebar-tagline">Welcome to</div>
              <div className="sidebar-school">Northern Mindanao<br />Colleges, Inc.</div>
              <div className="sidebar-divider" />
              <div className="sidebar-quote">
                A centralized repository for preserving and managing graduating students' thesis projects.
              </div>
            </div>
          </div>
        </aside>

        <main className="form-panel">
          <div className="form-card">
            <div className="form-header">
              <div className="form-eyebrow">Thesis Repository</div>
              <h1 className="form-title">Sign in to<br />your account</h1>
              <p className="form-subtitle">Access the thesis management system</p>
            </div>

            {fromSignup && (
              <div className="alert-success">
                ✓ Account created successfully! Please log in.
              </div>
            )}

            {error && (
              <div className="alert-error">
                ✕ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}