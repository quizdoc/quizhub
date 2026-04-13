import express, { Response } from 'express';
import { pool } from '../server.js';
import { AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAdmin middleware to all routes
router.use(requireAdmin);

// Get all users
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        COUNT(DISTINCT qa.id) as total_attempts,
        AVG(qa.percentage) as avg_score,
        u.created_at
      FROM users u
      LEFT JOIN quiz_attempts qa ON u.id = qa.user_id
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['user']);

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all quizzes
router.get('/quizzes', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await pool.query(`
      SELECT 
        q.id,
        q.title,
        q.description,
        u.name as creator_name,
        COUNT(DISTINCT qa.id) as total_attempts,
        AVG(qa.percentage) as avg_score,
        q.is_published,
        q.created_at
      FROM quizzes q
      LEFT JOIN users u ON q.created_by = u.id
      LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
      GROUP BY q.id, u.name
      ORDER BY q.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) as total FROM quizzes');

    res.json({
      quizzes: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get dashboard statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM quizzes) as total_quizzes,
        (SELECT COUNT(*) FROM quiz_attempts) as total_attempts,
        (SELECT AVG(percentage) FROM quiz_attempts) as avg_score,
        (SELECT COUNT(DISTINCT user_id) FROM quiz_attempts) as active_users
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get quiz performance details
router.get('/quiz-performance/:quizId', async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;

    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT qa.user_id) as unique_attempts,
        COUNT(qa.id) as total_attempts,
        AVG(qa.percentage) as avg_score,
        MIN(qa.percentage) as min_score,
        MAX(qa.percentage) as max_score,
        SUM(CASE WHEN qa.percentage >= 70 THEN 1 ELSE 0 END) as passed,
        SUM(CASE WHEN qa.percentage < 70 THEN 1 ELSE 0 END) as failed,
        AVG(qa.time_taken) as avg_time
      FROM quiz_attempts qa
      WHERE qa.quiz_id = $1
    `, [quizId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

// Delete user
router.delete('/users/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    await pool.query('BEGIN');
    await pool.query('DELETE FROM quiz_attempts WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    await pool.query('COMMIT');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
