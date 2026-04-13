import express, { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../server.js';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT q.*, u.name as creator_name, 
             COUNT(DISTINCT qa.id) as total_attempts,
             AVG(qa.score) as avg_score
      FROM quizzes q
      LEFT JOIN users u ON q.created_by = u.id
      LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
      WHERE q.is_published = true
      GROUP BY q.id, u.name
      ORDER BY q.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT q.*, u.name as creator_name
      FROM quizzes q
      LEFT JOIN users u ON q.created_by = u.id
      WHERE q.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = result.rows[0];

    // Get questions
    const questionsResult = await pool.query(`
      SELECT id, question_text, options, correct_answer, explanation
      FROM questions
      WHERE quiz_id = $1
      ORDER BY order_index
    `, [id]);

    quiz.questions = questionsResult.rows;
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create quiz (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, time_limit, questions } = req.body;
    const quizId = uuidv4();

    await pool.query('BEGIN');

    // Create quiz
    await pool.query(`
      INSERT INTO quizzes (id, title, description, time_limit, created_by, is_published, created_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW())
    `, [quizId, title, description, time_limit, req.user!.id]);

    // Add questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await pool.query(`
        INSERT INTO questions (id, quiz_id, question_text, options, correct_answer, explanation, order_index)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        uuidv4(),
        quizId,
        q.question_text,
        JSON.stringify(q.options),
        q.correct_answer,
        q.explanation || null,
        i,
      ]);
    }

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz_id: quizId,
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update quiz (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, time_limit, questions } = req.body;

    await pool.query('BEGIN');

    // Update quiz
    await pool.query(`
      UPDATE quizzes
      SET title = $1, description = $2, time_limit = $3, updated_at = NOW()
      WHERE id = $4
    `, [title, description, time_limit, id]);

    // Delete old questions
    await pool.query('DELETE FROM questions WHERE quiz_id = $1', [id]);

    // Add new questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await pool.query(`
        INSERT INTO questions (id, quiz_id, question_text, options, correct_answer, explanation, order_index)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        uuidv4(),
        id,
        q.question_text,
        JSON.stringify(q.options),
        q.correct_answer,
        q.explanation || null,
        i,
      ]);
    }

    await pool.query('COMMIT');

    res.json({ message: 'Quiz updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete quiz (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('BEGIN');
    await pool.query('DELETE FROM questions WHERE quiz_id = $1', [id]);
    await pool.query('DELETE FROM quiz_attempts WHERE quiz_id = $1', [id]);
    await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);
    await pool.query('COMMIT');

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Submit quiz attempt
router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { answers, time_taken } = req.body;

    // Get quiz and questions
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questionsResult = await pool.query(`
      SELECT id, correct_answer FROM questions WHERE quiz_id = $1 ORDER BY order_index
    `, [id]);

    // Calculate score
    let score = 0;
    questionsResult.rows.forEach((q, index) => {
      if (answers[index] === q.correct_answer) {
        score++;
      }
    });

    const percentage = Math.round((score / questionsResult.rows.length) * 100);
    const attemptId = uuidv4();

    // Save attempt
    await pool.query(`
      INSERT INTO quiz_attempts (id, quiz_id, user_id, answers, score, percentage, time_taken, attempted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `, [
      attemptId,
      id,
      req.user!.id,
      JSON.stringify(answers),
      score,
      percentage,
      time_taken,
    ]);

    res.json({
      attempt_id: attemptId,
      score,
      percentage,
      total_questions: questionsResult.rows.length,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's attempt
router.get('/:id/attempt/:attemptId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id, attemptId } = req.params;

    const attemptResult = await pool.query(`
      SELECT qa.*, q.title as quiz_title
      FROM quiz_attempts qa
      JOIN quizzes q ON qa.quiz_id = q.id
      WHERE qa.id = $1 AND qa.quiz_id = $2 AND qa.user_id = $3
    `, [attemptId, id, req.user!.id]);

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    const attempt = attemptResult.rows[0];

    // Get questions with answers
    const questionsResult = await pool.query(`
      SELECT id, question_text, options, correct_answer, explanation
      FROM questions
      WHERE quiz_id = $1
      ORDER BY order_index
    `, [id]);

    attempt.questions = questionsResult.rows;
    res.json(attempt);
  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

export default router;
