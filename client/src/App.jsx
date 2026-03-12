import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseProjects from './pages/CourseProjects';
import Department from './pages/Department';
import Published from './pages/Published';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-normi-green">
        <p className="text-white font-medium">Loading...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-normi-green">
        <p className="text-white font-medium">Loading...</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  const isAdmin =
    (user?.role && user.role.toLowerCase() === 'admin') ||
    (user?.email && user.email.toLowerCase().startsWith('admin'));
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-normi-green">
        <p className="text-white font-medium">Loading...</p>
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/department"
        element={
          <ProtectedRoute>
            <Department />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/projects"
        element={
          <ProtectedRoute>
            <CourseProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/published"
        element={
          <ProtectedRoute>
            <Published />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
