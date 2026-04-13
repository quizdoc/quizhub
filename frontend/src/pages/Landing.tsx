import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Trophy, BarChart3, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Landing() {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    try {
      await demoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
      toast.success(`Welcome, ${role === 'admin' ? 'Admin' : 'User'}!`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">QuizHub</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost text-gray-300 hover:text-white"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary"
            >
              Sign Up
            </button>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Create & Master <br />
            <span className="gradient-text">Quizzes Effortlessly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            QuizHub is a modern, feature-rich platform for creating, managing, and taking quizzes. 
            Perfect for educators, trainers, and learners worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => navigate('/register')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDemoLogin('user')}
              className="btn-secondary"
            >
              Demo as User
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="btn-secondary"
            >
              Demo as Admin
            </button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 gradient-text"
          >
            Powerful Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Easy Quiz Creation',
                description: 'Create beautiful quizzes with multiple-choice questions, time limits, and detailed explanations.',
              },
              {
                icon: Zap,
                title: 'Real-time Scoring',
                description: 'Get instant feedback with detailed result breakdowns and question-by-question reviews.',
              },
              {
                icon: Trophy,
                title: 'Leaderboards',
                description: 'Compete with other users and track your ranking on global and quiz-specific leaderboards.',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Comprehensive insights into quiz performance, user engagement, and learning trends.',
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Admin controls for managing users, quizzes, and monitoring platform activity.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Built with modern technologies for optimal performance and seamless user experience.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 hover:bg-white/20 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-lg p-12"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Join thousands of educators and learners using QuizHub today.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary flex items-center justify-center gap-2 mx-auto"
            >
              Create Your Account <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20 py-8 text-center text-gray-500">
          <p>&copy; 2026 QuizHub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
