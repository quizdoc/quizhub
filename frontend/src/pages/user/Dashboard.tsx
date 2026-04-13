import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Clock, BarChart3, LogOut, Search, Play } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
  description: string;
  time_limit: number;
  total_attempts: number;
  avg_score: number;
  created_at: string;
}

interface Attempt {
  id: string;
  quiz_id: string;
  title: string;
  score: number;
  percentage: number;
  time_taken: number;
  attempted_at: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [quizzesRes, attemptsRes, statsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/quizzes`),
        axios.get(`${apiUrl}/api/users/attempts`),
        axios.get(`${apiUrl}/api/users/stats`),
      ]);

      setQuizzes(quizzesRes.data);
      setAttempts(attemptsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
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
              <p className="text-xs text-gray-400">User Dashboard</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
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
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-400">Continue your learning journey and master new topics</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Quizzes Attempted', value: stats.quizzes_attempted || 0, icon: BookOpen },
              { label: 'Total Attempts', value: stats.total_attempts || 0, icon: Play },
              { label: 'Average Score', value: `${Math.round(stats.avg_score || 0)}%`, icon: BarChart3 },
              { label: 'Best Score', value: `${stats.best_score || 0}%`, icon: Clock },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-cyan-400 opacity-50" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8">
          <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold">
            Available Quizzes
          </button>
          <button
            onClick={() => navigate('/leaderboard')}
            className="px-4 py-2 glass text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
          >
            Leaderboard
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredQuizzes.map((quiz, idx) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-6 rounded-xl hover:bg-white/20 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate(`/quiz/${quiz.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{quiz.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(quiz.time_limit / 60)}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  <span>{quiz.total_attempts} attempts</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-gray-400">Avg Score</p>
                  <p className="text-lg font-bold text-cyan-400">{Math.round(quiz.avg_score)}%</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/quiz/${quiz.id}`);
                  }}
                  className="btn-primary text-sm"
                >
                  Start Quiz
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Attempts</h2>
            <div className="space-y-3">
              {attempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/results/${attempt.id}`)}
                >
                  <div>
                    <p className="font-semibold text-white">{attempt.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(attempt.attempted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Score</p>
                      <p className="text-lg font-bold text-white">{attempt.score}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-semibold ${
                      attempt.percentage >= 70
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {attempt.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
