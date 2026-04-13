# QuizHub - Deployment Guide

## Deployment Architecture

QuizHub consists of two separate deployments:
- **Frontend**: Static React app (Vercel, Netlify, GitHub Pages)
- **Backend**: Node.js API (Railway, Render, Heroku, AWS)
- **Database**: PostgreSQL (AWS RDS, Railway, Supabase, Heroku)

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your repository

2. **Configure**
   - Root Directory: `frontend`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` pointing to your backend URL

4. **Deploy**
   - Click "Deploy"
   - Your frontend is live!

### Option 2: Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Configure**
   - Base directory: `frontend`
   - Build command: `pnpm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` in Site settings → Build & deploy

4. **Deploy**
   - Netlify auto-deploys on push

### Option 3: GitHub Pages

```bash
cd frontend
npm run build
# Push dist folder to gh-pages branch
```

## Backend Deployment

### Option 1: Railway (Recommended)

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository

3. **Configure**
   - Root directory: `backend`
   - Build command: `pnpm run build`
   - Start command: `pnpm run start`

4. **Add Database**
   - Click "Add Service"
   - Select "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`

5. **Environment Variables**
   - `JWT_SECRET`: Generate a strong random string
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your deployed frontend URL

6. **Deploy**
   - Railway auto-deploys on push

### Option 2: Render

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your repository

3. **Configure**
   - Root directory: `backend`
   - Build command: `pnpm run build`
   - Start command: `pnpm run start`

4. **Add PostgreSQL**
   - Create new PostgreSQL database
   - Copy connection string to `DATABASE_URL`

5. **Environment Variables**
   - Add all required variables

6. **Deploy**
   - Click "Create Web Service"

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main
```

## Database Deployment

### Option 1: Railway PostgreSQL (Included)

Railway automatically provisions PostgreSQL when you add it to your project.

### Option 2: AWS RDS

1. **Create RDS Instance**
   - Go to AWS Console
   - RDS → Create database
   - Select PostgreSQL
   - Configure instance size and storage

2. **Get Connection String**
   ```
   postgresql://user:password@endpoint:5432/quizhub
   ```

3. **Update Backend**
   - Set `DATABASE_URL` environment variable

### Option 3: Supabase

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Configure database

2. **Get Connection String**
   - Project Settings → Database
   - Copy connection string

3. **Run Migrations**
   ```bash
   psql <connection-string> -f scripts/init-db.sql
   ```

## Environment Variables Checklist

### Frontend
- [ ] `VITE_API_URL` - Backend API URL

### Backend
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Strong random string (min 32 chars)
- [ ] `NODE_ENV` - `production`
- [ ] `PORT` - Usually auto-set by platform (3001)
- [ ] `FRONTEND_URL` - Deployed frontend URL

## Post-Deployment

### 1. Verify Deployment

```bash
# Test frontend
curl https://your-frontend.com

# Test backend health
curl https://your-api.com/api/health

# Test login endpoint
curl -X POST https://your-api.com/api/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"role":"user"}'
```

### 2. Database Initialization

If database wasn't auto-initialized:

```bash
# Connect to remote database
psql <DATABASE_URL> -f scripts/init-db.sql
```

### 3. Custom Domain (Optional)

**Vercel:**
- Project Settings → Domains
- Add your custom domain

**Netlify:**
- Site settings → Domain management
- Add custom domain

**Railway:**
- Project → Settings → Domains
- Add custom domain

### 4. SSL/HTTPS

Most platforms auto-enable HTTPS. Verify:
- Frontend loads over HTTPS
- API requests use HTTPS
- CORS headers are correct

### 5. Monitoring & Logs

**Railway:**
- Deployments → View logs
- Metrics → Monitor performance

**Render:**
- Logs tab shows real-time logs
- Metrics tab shows performance

**Vercel:**
- Analytics → View traffic
- Logs → View deployment logs

## Scaling Considerations

### Database
- Start with hobby tier
- Monitor connection limits
- Upgrade to production tier if needed

### Backend
- Start with smallest instance
- Monitor CPU and memory
- Scale horizontally if needed

### Frontend
- CDN auto-scales (no action needed)
- Monitor build times

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS everywhere
- [ ] Set CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Regular security updates

## Troubleshooting Deployment

### 502 Bad Gateway

```
Backend is down or not responding
- Check backend logs
- Verify database connection
- Restart backend service
```

### CORS Errors

```
Frontend can't reach backend
- Verify FRONTEND_URL in backend env
- Check backend CORS configuration
- Ensure API URL is correct in frontend
```

### Database Connection Failed

```
Can't connect to database
- Verify DATABASE_URL format
- Check database is running
- Verify network/firewall rules
- Test connection locally first
```

## Rollback Procedure

If deployment fails:

```bash
# Railway
railway down

# Render
# Redeploy previous commit

# Vercel
# Deployments → Select previous → Promote to Production
```

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Test locally first
4. Contact platform support if needed
