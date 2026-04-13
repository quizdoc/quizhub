-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  time_limit INTEGER DEFAULT 600,
  created_by UUID REFERENCES users(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES users(id),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_attempted_at ON quiz_attempts(attempted_at);

-- Insert sample admin user (password: Admin@123456)
INSERT INTO users (id, email, password, name, role, created_at)
VALUES (
  'admin-001',
  'admin@quizhub.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin User',
  'admin',
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
