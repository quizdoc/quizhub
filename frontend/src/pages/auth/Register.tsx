import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ x: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">QuizHub</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join QuizHub and start learning today</p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-lg p-8 space-y-5 mb-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'} {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </motion.form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-400"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
