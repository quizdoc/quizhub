import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, BarChart3, TrendingUp, LogOut, Settings } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Stats {
  total_users: number;
  total_quizzes: number;
  total_attempts: number;
  avg_score: number;
  active_users: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">QuizHub</span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage quizzes, users, and view platform analytics</p>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.total_users, icon: Users, color: 'cyan' },
              { label: 'Total Quizzes', value: stats.total_quizzes, icon: BookOpen, color: 'purple' },
              { label: 'Total Attempts', value: stats.total_attempts, icon: BarChart3, color: 'blue' },
              { label: 'Avg Score', value: `${Math.round(stats.avg_score)}%`, icon: TrendingUp, color: 'green' },
              { label: 'Active Users', value: stats.active_users, icon: Users, color: 'pink' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Quiz Management',
              description: 'Create, edit, and manage quizzes',
              icon: BookOpen,
              path: '/admin/quizzes',
              color: 'from-purple-600 to-blue-600',
            },
            {
              title: 'User Management',
              description: 'View and manage user accounts',
              icon: Users,
              path: '/admin/users',
              color: 'from-blue-600 to-cyan-600',
            },
            {
              title: 'Analytics',
              description: 'View detailed performance analytics',
              icon: BarChart3,
              path: '/admin/analytics',
              color: 'from-cyan-600 to-teal-600',
            },
          ].map((card, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              onClick={() => navigate(card.path)}
              className="glass p-8 rounded-xl hover:bg-white/20 transition-all duration-300 group text-left"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-400">{card.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-8 rounded-xl mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/quizzes')}
              className="p-4 glass rounded-lg hover:bg-white/20 transition-colors text-left group"
            >
              <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                + Create New Quiz
              </p>
              <p className="text-sm text-gray-400">Add a new quiz to the platform</p>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="p-4 glass rounded-lg hover:bg-white/20 transition-colors text-left group"
            >
              <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                View All Users
              </p>
              <p className="text-sm text-gray-400">Manage user accounts and permissions</p>
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
