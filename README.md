# QuizHub - Modern Web-Based Quiz Platform

A beautiful, feature-rich quiz platform built with modern web technologies. Create, manage, and take quizzes with real-time scoring, leaderboards, and comprehensive analytics.

## 🎨 Design Philosophy

**Modern Gradient Glassmorphism** - A vibrant, contemporary design featuring:
- Purple-to-Blue gradient backgrounds with glassmorphic cards
- Smooth animations and micro-interactions
- Teal accents and neon cyan CTAs
- Premium, tech-forward aesthetic
- Fully responsive mobile-first design

## ✨ Key Features

### For Users
- 🎯 **Browse & Take Quizzes** - Discover and attempt quizzes with live countdown timers
- 📊 **Real-time Scoring** - Instant feedback with detailed result breakdowns
- 🏆 **Leaderboards** - Compete with other users and track rankings
- 📈 **Progress Tracking** - View attempt history and performance analytics
- 🔐 **Secure Authentication** - OAuth integration with profile management

### For Admins
- 📝 **Quiz Management** - Create, edit, and delete quizzes with rich question editor
- 👥 **User Management** - Monitor users, view statistics, and manage permissions
- 📊 **Analytics Dashboard** - Comprehensive insights into quiz performance and user engagement
- 🎨 **Content Moderation** - Review and approve user-generated content
- 📤 **Data Export** - Export quiz results and analytics in multiple formats

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API server
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation

### Deployment
- **Frontend**: Vercel, Netlify, or any static host
- **Backend**: Railway, Render, Heroku, or AWS
- **Database**: PostgreSQL on cloud (AWS RDS, Railway, Supabase)

## 📦 Project Structure

```
QuizHub-Platform/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── styles/          # Global styles
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/      # Request handlers
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Auth, validation
│   │   ├── config/          # Configuration
│   │   └── server.ts        # Express app
│   ├── package.json
│   └── .env.example
├── docs/                     # Documentation
│   ├── API.md               # API documentation
│   ├── SETUP.md             # Setup guide
│   └── DEPLOYMENT.md        # Deployment guide
└── README.md

```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL 12+ (local or cloud)
- Git

### Local Development Setup

#### 1. Clone and Install Dependencies

```bash
cd QuizHub-Platform

# Frontend setup
cd frontend
pnpm install

# Backend setup (in new terminal)
cd backend
pnpm install
```

#### 2. Configure Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/quizhub
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=QuizHub
```

#### 3. Initialize Database

```bash
cd backend
pnpm run db:migrate
pnpm run db:seed  # Optional: seed with sample data
```

#### 4. Start Development Servers

```bash
# Terminal 1: Frontend
cd frontend
pnpm run dev
# Opens at http://localhost:5173

# Terminal 2: Backend
cd backend
pnpm run dev
# Runs at http://localhost:3001
```

## 🔐 Authentication

The platform uses JWT-based authentication with the following roles:

- **User** - Can take quizzes, view results, and access leaderboards
- **Admin** - Full access to quiz management, user management, and analytics

### Default Admin Credentials (Development)
- Email: `admin@quizhub.com`
- Password: `Admin@123456`

**⚠️ Change these immediately in production!**

## 📚 API Documentation

See [API.md](./docs/API.md) for complete API documentation including:
- Authentication endpoints
- Quiz management endpoints
- User endpoints
- Leaderboard endpoints
- Analytics endpoints

## 🌐 Deployment

### Deploy Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

### Deploy Backend (Railway)

```bash
cd backend
railway link
railway deploy
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions for multiple platforms.

## 🎯 Features Roadmap

- [ ] Real-time multiplayer quizzes
- [ ] Question bank templates
- [ ] Advanced analytics with AI insights
- [ ] Mobile app (React Native)
- [ ] Quiz sharing and collaboration
- [ ] Gamification (badges, achievements)
- [ ] Integration with LMS platforms

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -d quizhub

# Reset database
cd backend
pnpm run db:reset
```

### Port Already in Use
```bash
# Change port in backend/.env
PORT=3002

# Or kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### CORS Errors
Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL.

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support@quizhub.com

---

**Built with ❤️ using modern web technologies**
