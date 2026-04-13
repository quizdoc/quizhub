import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  time_limit: number;
  questions: Question[];
}

export default function QuizTake() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/quizzes/${id}`);
      setQuiz(response.data);
      setTimeLeft(response.data.time_limit);
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  const handleSubmit = async () => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${apiUrl}/api/quizzes/${id}/submit`, {
        answers,
        time_taken: quiz.time_limit - timeLeft,
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/results/${response.data.attempt_id}`);
    } catch (error) {
      toast.error('Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <p className="text-gray-400">Quiz not found</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeWarning = timeLeft < 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
            <p className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
            isTimeWarning
              ? 'bg-red-500/20 text-red-400 animate-pulse'
              : 'bg-cyan-500/20 text-cyan-400'
          }`}>
            <Clock className="w-5 h-5" />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-cyan-400">
              {answers.filter(a => a !== null).length}/{quiz.questions.length} answered
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass p-8 rounded-xl mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8">{question.question_text}</h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestion] = idx;
                  setAnswers(newAnswers);
                }}
                className={`w-full p-4 rounded-lg text-left font-semibold transition-all duration-200 ${
                  answers[currentQuestion] === idx
                    ? 'bg-gradient-primary text-white ring-2 ring-cyan-400'
                    : 'glass text-gray-300 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === idx
                      ? 'border-cyan-400 bg-cyan-400'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQuestion] === idx && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {/* Answered Indicator */}
          {answers[currentQuestion] !== null && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-8">
              <AlertCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Answer selected</span>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {/* Question Indicators */}
          <div className="flex gap-2 flex-wrap justify-center">
            {quiz.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  idx === currentQuestion
                    ? 'bg-gradient-primary text-white ring-2 ring-cyan-400'
                    : answers[idx] !== null
                    ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                    : 'glass text-gray-400 hover:bg-white/20'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="flex items-center gap-2 px-4 py-2 btn-primary hover:bg-gradient-to-r from-primary-700 to-blue-600 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
