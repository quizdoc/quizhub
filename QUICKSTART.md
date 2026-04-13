# QuizHub - Quick Start Guide

Get QuizHub running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- pnpm (or npm)

## 1. Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd QuizHub-Platform

# Install backend
cd backend
pnpm install

# Install frontend (new terminal)
cd frontend
pnpm install
```

## 2. Configure Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@localhost:5432/quizhub
JWT_SECRET=your_super_secret_key_change_in_production_12345
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
EOF

# Create database
createdb quizhub

# Initialize schema
psql -U postgres -d quizhub -f scripts/init-db.sql
```

## 3. Start Backend

```bash
cd backend
pnpm run dev
```

✅ Backend running on `http://localhost:3001`

## 4. Start Frontend

In a new terminal:

```bash
cd frontend
echo "VITE_API_URL=http://localhost:3001" > .env.local
pnpm run dev
```

✅ Frontend running on `http://localhost:5173`

## 5. Login & Explore

Open `http://localhost:5173` in your browser:

### Demo Accounts
- **Admin**: Click "Demo as Admin" button
- **User**: Click "Demo as User" button

Or register a new account.

## What to Try

### As Admin
1. Go to `/admin` dashboard
2. Create a new quiz
3. Add questions with multiple choices
4. View analytics and user stats

### As User
1. Go to `/dashboard`
2. Browse available quizzes
3. Take a quiz with timer
4. View results and leaderboard

## Project Structure

```
QuizHub-Platform/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & validation
│   │   └── server.ts    # Express app
│   └── scripts/         # Database scripts
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── pages/       # Route components
│   │   ├── contexts/    # Auth context
│   │   └── styles/      # Global CSS
│   └── index.html
└── docs/               # Documentation
```

## Common Commands

```bash
# Backend
cd backend
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run db:reset     # Reset database

# Frontend
cd frontend
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
```

## Troubleshooting

### Database Error
```bash
# Check PostgreSQL
psql -U postgres -c "SELECT version();"

# Reset database
dropdb quizhub
createdb quizhub
psql -U postgres -d quizhub -f backend/scripts/init-db.sql
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Or kill process: lsof -ti:3001 | xargs kill -9
```

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Restart backend after changing `.env`

## Next Steps

1. **Customize**: Edit colors, fonts, and branding
2. **Deploy**: Follow [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
3. **Extend**: Add more features and quiz types
4. **Scale**: Set up monitoring and analytics

## Documentation

- [Full Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Main README](./README.md)

## Support

Need help? Check the docs or open an issue on GitHub.

---

**Happy quizzing! 🎉**
