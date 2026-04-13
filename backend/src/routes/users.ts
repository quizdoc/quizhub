import express, { Response } from 'express';
import { pool } from '../server.js';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [req.user!.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user's quiz attempts
router.get('/attempts', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT qa.id, qa.quiz_id, q.title, qa.score, qa.percentage, qa.time_taken, qa.attempted_at
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.user_id = $1
      ORDER BY qa.attempted_at DESC
    `, [req.user!.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// Get user's statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT qa.quiz_id) as quizzes_attempted,
        COUNT(qa.id) as total_attempts,
        AVG(qa.percentage) as avg_score,
        MAX(qa.percentage) as best_score,
        SUM(qa.time_taken) as total_time
      FROM quiz_attempts qa
      WHERE qa.user_id = $1
    `, [req.user!.id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
