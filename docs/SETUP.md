# QuizHub - Setup Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm or pnpm
- PostgreSQL 12 or higher
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd QuizHub-Platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

**Configure .env:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/quizhub
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

```bash
# Create database
createdb quizhub

# Run migrations
psql -U postgres -d quizhub -f scripts/init-db.sql

# (Optional) Seed sample data
pnpm run db:seed
```

### 4. Start Backend Server

```bash
pnpm run dev
```

Backend will run on `http://localhost:3001`

### 5. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:3001" > .env.local
```

### 6. Start Frontend Development Server

```bash
pnpm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Application

### Demo Accounts

**Admin Account:**
- Email: `admin@quizhub.com`
- Password: `Admin@123456`
- Role: Admin

**User Account:**
- Email: `user@quizhub.com`
- Password: `User@123456`
- Role: User

Or use the "Demo Login" buttons on the login page.

### Admin Features to Test

1. **Dashboard** - View platform statistics
2. **Quiz Management** - Create, edit, delete quizzes
3. **User Management** - View and manage users
4. **Analytics** - View detailed performance metrics

### User Features to Test

1. **Browse Quizzes** - View available quizzes
2. **Take Quiz** - Attempt a quiz with timer
3. **View Results** - See detailed feedback
4. **Leaderboard** - Check global rankings

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database
dropdb quizhub
createdb quizhub
psql -U postgres -d quizhub -f scripts/init-db.sql
```

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

### CORS Errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Development Tips

### Hot Reload

Both frontend and backend support hot reload during development:
- Frontend: Changes to React components auto-refresh
- Backend: Changes to Express routes auto-restart server

### Database Inspection

```bash
# Connect to database
psql -U postgres -d quizhub

# List tables
\dt

# View users
SELECT * FROM users;

# View quizzes
SELECT * FROM quizzes;
```

### API Testing

Use Postman or curl to test API endpoints:

```bash
# Get all quizzes
curl http://localhost:3001/api/quizzes

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## Next Steps

1. Customize the branding (logo, colors, fonts)
2. Add more quiz questions and categories
3. Configure email notifications (optional)
4. Set up monitoring and logging
5. Deploy to production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.
