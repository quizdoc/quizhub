import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
import userRoutes from './routes/users.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Database connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✓ Database connected successfully');
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 QuizHub API Server`);
  console.log(`📍 Running on http://localhost:${port}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'local'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
