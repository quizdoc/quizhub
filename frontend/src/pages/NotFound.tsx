import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl font-bold gradient-text mb-4"
        >
          404
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Oops! The page you're looking for doesn't exist. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 btn-primary"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
