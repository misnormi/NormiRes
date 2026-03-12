import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signup(email.trim(), password, passwordConfirm);
      navigate('/', { state: { fromSignup: true } });
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#5cb85c] flex items-center justify-center p-6">
      <main className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)] w-full max-w-[400px] p-8">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img
              src="/normi-logo.png"
              alt="Northern Mindanao Colleges, Inc. - NORMI"
              className="w-[120px] h-[120px] object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#5cb85c] uppercase tracking-wide mb-6">Create Account</h1>

          {error && (
            <ul className="w-full list-none p-0 m-0 mb-4">
              <li className="py-2 px-3 rounded bg-[#f8d7da] text-[#721c24] text-sm">{error}</li>
            </ul>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2.5 border border-gray-300 rounded text-base bg-white placeholder:text-gray-500 placeholder:italic focus:outline-none focus:border-[#5cb85c] focus:ring-2 focus:ring-[#5cb85c]/20"
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                minLength={8}
                className="w-full px-3 py-2.5 border border-gray-300 rounded text-base bg-white placeholder:text-gray-500 placeholder:italic focus:outline-none focus:border-[#5cb85c] focus:ring-2 focus:ring-[#5cb85c]/20"
                required
                autoComplete="new-password"
              />
              <span className="block text-xs text-gray-500 mt-1">At least 8 characters.</span>
            </div>
            <div className="mb-5">
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-800 mb-1.5">Confirm password</label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded text-base bg-white placeholder:text-gray-500 placeholder:italic focus:outline-none focus:border-[#5cb85c] focus:ring-2 focus:ring-[#5cb85c]/20"
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5cb85c] text-white font-semibold uppercase tracking-wide rounded hover:bg-[#4cae4c] disabled:opacity-70 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-5 text-[0.95rem] text-gray-500">
            Already have an account?{' '}
            <Link to="/" className="text-[#5cb85c] font-semibold no-underline hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
