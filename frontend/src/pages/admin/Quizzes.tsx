import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
  description: string;
  total_attempts: number;
  avg_score: number;
  is_published: boolean;
  created_at: string;
}

export default function AdminQuizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/quizzes`);
      setQuizzes(response.data.quizzes);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await axios.delete(`${apiUrl}/api/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q.id !== id));
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Quiz Management</h1>
          </div>
          <button
            onClick={() => navigate('/admin/quizzes/create')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quizzes Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Attempts</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Avg Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {quizzes.map((quiz, idx) => (
                  <motion.tr
                    key={quiz.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{quiz.title}</p>
                        <p className="text-sm text-gray-400 line-clamp-1">{quiz.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{quiz.total_attempts}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-cyan-400">{Math.round(quiz.avg_score)}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        quiz.is_published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {quiz.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {quizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg mb-4">No quizzes yet</p>
            <button
              onClick={() => navigate('/admin/quizzes/create')}
              className="btn-primary"
            >
              Create Your First Quiz
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
