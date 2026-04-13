import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Home, Clock, Award } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Attempt {
  id: string;
  quiz_title: string;
  score: number;
  percentage: number;
  time_taken: number;
  attempted_at: string;
  questions: Question[];
  answers: number[];
}

export default function Results() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      // Get quiz ID from URL or attempt data
      const response = await axios.get(`${apiUrl}/api/quizzes`);
      const quizzes = response.data;
      
      // For now, we'll fetch the attempt details
      // In a real app, you'd have a dedicated endpoint
      setAttempt({
        id: attemptId || '',
        quiz_title: 'Quiz Results',
        score: 0,
        percentage: 0,
        time_taken: 0,
        attempted_at: new Date().toISOString(),
        questions: [],
        answers: [],
      });
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <p className="text-gray-400">Results not found</p>
        </div>
      </div>
    );
  }

  const isPassed = attempt.percentage >= 70;
  const minutes = Math.floor(attempt.time_taken / 60);
  const seconds = attempt.time_taken % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-xl text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            {isPassed ? (
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
            ) : (
              <XCircle className="w-24 h-24 text-red-400 mx-auto" />
            )}
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-2">
            {isPassed ? 'Great Job! 🎉' : 'Keep Practicing! 💪'}
          </h1>
          <p className="text-gray-400 mb-8">{attempt.quiz_title}</p>

          {/* Score Display */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white/5 rounded-lg">
              <p className="text-gray-400 mb-2">Score</p>
              <p className="text-4xl font-bold gradient-text">{attempt.score}</p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <p className="text-gray-400 mb-2">Percentage</p>
              <p className={`text-4xl font-bold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                {attempt.percentage}%
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-lg">
              <p className="text-gray-400 mb-2">Time Taken</p>
              <p className="text-4xl font-bold text-cyan-400">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`inline-block px-6 py-2 rounded-lg font-bold mb-8 ${
            isPassed
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isPassed ? '✓ PASSED' : '✗ FAILED'}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center justify-center gap-2 px-6 py-3 btn-primary"
            >
              <Award className="w-5 h-5" />
              View Leaderboard
            </button>
          </div>
        </motion.div>

        {/* Question Review */}
        {attempt.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Question Review</h2>
            <div className="space-y-6">
              {attempt.questions.map((question, idx) => {
                const userAnswer = attempt.answers[idx];
                const isCorrect = userAnswer === question.correct_answer;

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-lg border-2 ${
                      isCorrect
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-2">
                          Question {idx + 1}: {question.question_text}
                        </p>
                        <p className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </p>
                      </div>
                    </div>

                    {/* Answer Display */}
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optIdx) => {
                        const isUserAnswer = userAnswer === optIdx;
                        const isCorrectAnswer = optIdx === question.correct_answer;

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg ${
                              isCorrectAnswer
                                ? 'bg-green-500/20 border border-green-500/50'
                                : isUserAnswer && !isCorrect
                                ? 'bg-red-500/20 border border-red-500/50'
                                : 'bg-white/5 border border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-400" />}
                              {isUserAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                              <span className="text-gray-300">{option}</span>
                              {isCorrectAnswer && <span className="text-xs text-green-400 ml-auto">Correct</span>}
                              {isUserAnswer && !isCorrect && <span className="text-xs text-red-400 ml-auto">Your answer</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-300">
                          <span className="font-semibold">Explanation: </span>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
