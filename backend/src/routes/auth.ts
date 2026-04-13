import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../server.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    await pool.query(
      'INSERT INTO users (id, email, password, name, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [userId, email, hashedPassword, name, 'user']
    );

    const token = generateToken(userId, email, 'user');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email, name, role: 'user' },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Demo login (for testing)
router.post('/demo-login', async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const demoRole = role === 'admin' ? 'admin' : 'user';
    const demoEmail = demoRole === 'admin' ? 'admin@quizhub.com' : 'user@quizhub.com';
    const demoId = demoRole === 'admin' ? 'demo-admin-001' : 'demo-user-001';

    const token = generateToken(demoId, demoEmail, demoRole);

    res.json({
      message: 'Demo login successful',
      token,
      user: {
        id: demoId,
        email: demoEmail,
        name: demoRole === 'admin' ? 'Demo Admin' : 'Demo User',
        role: demoRole,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Demo login failed' });
  }
});

export default router;
