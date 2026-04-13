import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, BookOpen, BarChart3 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Stats {
  total_users: number;
  total_quizzes: number;
  total_attempts: number;
  avg_score: number;
  active_users: number;
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
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
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
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

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Engagement Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-8 rounded-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Engagement Metrics</h2>
            <div className="space-y-4">
              {stats && [
                { label: 'User Engagement Rate', value: `${Math.round((stats.active_users / stats.total_users) * 100)}%` },
                { label: 'Avg Attempts per User', value: (stats.total_attempts / stats.total_users).toFixed(1) },
                { label: 'Quizzes per User', value: (stats.total_quizzes / stats.total_users).toFixed(1) },
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400">{metric.label}</p>
                  <p className="text-lg font-bold text-cyan-400">{metric.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-8 rounded-xl"
          >
            <h2 className="text-xl font-bold text-white mb-6">Performance Metrics</h2>
            <div className="space-y-4">
              {stats && [
                { label: 'Platform Avg Score', value: `${Math.round(stats.avg_score)}%` },
                { label: 'Total Quiz Content', value: `${stats.total_quizzes} quizzes` },
                { label: 'Total User Attempts', value: `${stats.total_attempts} attempts` },
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400">{metric.label}</p>
                  <p className="text-lg font-bold text-green-400">{metric.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-8 rounded-xl mt-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
          <div className="space-y-3">
            {stats && [
              {
                title: 'Platform Health',
                value: stats.active_users > stats.total_users * 0.5 ? 'Excellent' : 'Good',
                color: stats.active_users > stats.total_users * 0.5 ? 'green' : 'yellow',
              },
              {
                title: 'Content Coverage',
                value: stats.total_quizzes > 10 ? 'Comprehensive' : 'Growing',
                color: stats.total_quizzes > 10 ? 'green' : 'yellow',
              },
              {
                title: 'User Performance',
                value: stats.avg_score >= 70 ? 'Strong' : 'Moderate',
                color: stats.avg_score >= 70 ? 'green' : 'yellow',
              },
            ].map((insight, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <p className="font-semibold text-white">{insight.title}</p>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold bg-${insight.color}-500/20 text-${insight.color}-400`}>
                  {insight.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
