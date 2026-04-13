import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import UserDashboard from '@/pages/user/Dashboard';
import QuizTake from '@/pages/user/QuizTake';
import Results from '@/pages/user/Results';
import Leaderboard from '@/pages/user/Leaderboard';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminQuizzes from '@/pages/admin/Quizzes';
import AdminUsers from '@/pages/admin/Users';
import AdminAnalytics from '@/pages/admin/Analytics';
import NotFound from '@/pages/NotFound';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'user' | 'admin' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Register />} />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <QuizTake />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:attemptId"
        element={
          <ProtectedRoute requiredRole="user">
            <Results />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute requiredRole="user">
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quizzes"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminQuizzes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" theme="dark" />
      </AuthProvider>
    </Router>
  );
}
