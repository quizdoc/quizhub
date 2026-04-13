import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface LeaderboardEntry {
  id: string;
  name: string;
  quizzes_attempted?: number;
  total_attempts?: number;
  avg_score: number;
  best_score?: number;
  quizzes_passed?: number;
  rank?: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const [leaderboardRes, rankRes] = await Promise.all([
        axios.get(`${apiUrl}/api/leaderboard/global?limit=50`),
        axios.get(`${apiUrl}/api/leaderboard/rank`),
      ]);

      setLeaderboard(leaderboardRes.data.leaderboard);
      setUserRank(rankRes.data);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
              <p className="text-sm text-gray-400">Global Rankings</p>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Your Rank Card */}
        {userRank && userRank.rank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-xl mb-8 border-2 border-cyan-400/50"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 mb-2">Your Rank</p>
                <p className="text-5xl font-bold gradient-text">#{userRank.rank}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Total Players</p>
                <p className="text-5xl font-bold text-cyan-400">{userRank.total_users}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Percentile</p>
                <p className="text-5xl font-bold text-green-400">
                  {Math.round((userRank.rank / userRank.total_users) * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Quizzes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Attempts</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Avg Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Best Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Passed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leaderboard.map((entry, idx) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {idx < 3 ? (
                          <span className="text-2xl">{getRankMedal(idx + 1)}</span>
                        ) : (
                          <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{entry.name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{entry.quizzes_attempted || 0}</td>
                    <td className="px-6 py-4 text-gray-300">{entry.total_attempts || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-cyan-400">
                          {Math.round(entry.avg_score)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-400">{entry.best_score || 0}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-semibold">
                        {entry.quizzes_passed || 0}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No leaderboard data yet</p>
            <p className="text-gray-500 text-sm">Start taking quizzes to appear on the leaderboard!</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
