import express, { Response } from 'express';
import { pool } from '../server.js';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Global leaderboard
router.get('/global', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        COUNT(DISTINCT qa.quiz_id) as quizzes_attempted,
        COUNT(qa.id) as total_attempts,
        AVG(qa.percentage) as avg_score,
        MAX(qa.percentage) as best_score,
        SUM(CASE WHEN qa.percentage >= 70 THEN 1 ELSE 0 END) as quizzes_passed
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.name
      HAVING COUNT(qa.id) > 0
      ORDER BY avg_score DESC, total_attempts DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      WHERE u.role = 'user' AND qa.id IS NOT NULL
    `);

    res.json({
      leaderboard: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Quiz-specific leaderboard
router.get('/quiz/:quizId', async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);

    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        qa.score,
        qa.percentage,
        qa.time_taken,
        qa.attempted_at,
        ROW_NUMBER() OVER (ORDER BY qa.percentage DESC, qa.time_taken ASC) as rank
      FROM quiz_attempts qa
      JOIN users u ON qa.user_id = u.id
      WHERE qa.quiz_id = $1
      ORDER BY qa.percentage DESC, qa.time_taken ASC
      LIMIT $2
    `, [quizId, limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quiz leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// User's rank
router.get('/rank', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY avg_score DESC) as rank,
        COUNT(*) OVER() as total_users
      FROM (
        SELECT 
          u.id,
          AVG(qa.percentage) as avg_score
        FROM users u
        LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
        WHERE u.role = 'user'
        GROUP BY u.id
        HAVING COUNT(qa.id) > 0
      ) rankings
      WHERE id = $1
    `, [req.user!.id]);

    if (result.rows.length === 0) {
      return res.json({ rank: null, total_users: 0, message: 'No attempts yet' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rank:', error);
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});

export default router;
