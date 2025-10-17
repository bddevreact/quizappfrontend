# 🚀 Complete Deployment Guide - Quiz App

## 📋 Prerequisites

### Required Accounts:
- **MongoDB Atlas** (Database)
- **Railway/Render/Heroku** (Backend Hosting)
- **Netlify/Vercel** (Frontend Hosting)
- **Domain Name** (Optional)

### Required Tools:
- Git
- Node.js (v18+)
- MongoDB Compass (Optional)

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create new cluster

### 1.2 Configure Database
```bash
# Your connection string will look like:
mongodb+srv://cryptoquiz-cluster:cryptoquiz-cluster2025@cluster0.bh469j2.mongodb.net/cryptoquiz?retryWrites=true&w=majority&appName=Cluster0
```

### 1.3 Network Access
1. Go to "Network Access" in Atlas
2. Add IP Address: `0.0.0.0/0` (Allow all IPs for production)

### 1.4 Database User
1. Go to "Database Access"
2. Create user: `cryptoquiz-cluster`
3. Password: `cryptoquiz-cluster2025`
4. Role: `Atlas admin`

---

## 🖥️ Step 2: Backend Deployment

### Option A: Railway (Recommended)

#### 2.1 Prepare Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create production environment file
cp env.example .env.production
```

#### 2.2 Configure Production Environment
Edit `.env.production`:
```env
# Production Environment Variables
PORT=5000
NODE_ENV=production

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://cryptoquiz-cluster:cryptoquiz-cluster2025@cluster0.bh469j2.mongodb.net/cryptoquiz?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration - CHANGE THESE SECRETS
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits-minimum-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-256-bits-minimum-production

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-admin-password-2025
ADMIN_EMAIL=admin@cryptoquiz.com
```

#### 2.3 Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select backend folder
7. Add environment variables from `.env.production`
8. Deploy

#### 2.4 Railway Configuration
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Option B: Render

#### 2.1 Deploy to Render
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm run start:prod`
   - **Environment**: Node
6. Add environment variables
7. Deploy

---

## 🌐 Step 3: Frontend Deployment

### Option A: Netlify (Recommended)

#### 3.1 Prepare Frontend
```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Create production environment file
cp env.example .env.production
```

#### 3.2 Configure Frontend Environment
Edit `.env.production`:
```env
# Frontend Production Environment
VITE_API_URL=https://your-backend-url.railway.app
VITE_API_TOKEN=your-production-api-token
VITE_TELEGRAM_BOT_TOKEN=your-telegram-bot-token
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### 3.3 Build Frontend
```bash
# Build for production
npm run build:prod

# Test build locally
npm run preview
```

#### 3.4 Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Configure:
   - **Build Command**: `npm run build:prod`
   - **Publish Directory**: `dist`
   - **Base Directory**: `/` (root)
6. Add environment variables
7. Deploy

#### 3.5 Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Option B: Vercel

#### 3.1 Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist`
6. Add environment variables
7. Deploy

---

## 🔧 Step 4: Production Configuration

### 4.1 Update CORS Settings
Update `backend/src/app.js`:
```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-domain.netlify.app',
    'https://your-frontend-domain.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 4.2 Update Frontend API URL
Update `src/services/mongoDBService.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app';
```

### 4.3 Security Headers
Update `backend/src/app.js`:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://your-backend-url.railway.app"]
    }
  }
}));
```

---

## 🧪 Step 5: Testing Production

### 5.1 Backend Testing
```bash
# Test health endpoint
curl https://your-backend-url.railway.app/api/health

# Test user profile
curl -H "Authorization: Bearer your-token" https://your-backend-url.railway.app/api/users/profile
```

### 5.2 Frontend Testing
1. Open your deployed frontend URL
2. Test all features:
   - User registration/login
   - Quiz functionality
   - Daily bonus
   - Admin panel
   - Deposit system

### 5.3 Database Testing
1. Check MongoDB Atlas dashboard
2. Verify collections are created
3. Test data insertion/retrieval

---

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Monitoring Tools
- **Railway**: Built-in monitoring
- **Netlify**: Analytics dashboard
- **MongoDB Atlas**: Database monitoring

### 6.2 Log Management
```bash
# View backend logs
railway logs

# View frontend build logs
netlify logs
```

### 6.3 Backup Strategy
- MongoDB Atlas automatic backups
- Code repository on GitHub
- Environment variables backup

---

## 🔐 Step 7: Security Checklist

### 7.1 Environment Variables
- [ ] All secrets are in environment variables
- [ ] No hardcoded credentials
- [ ] Production secrets are different from development

### 7.2 Database Security
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database user has minimal required permissions
- [ ] Connection string uses SSL

### 7.3 Application Security
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers
- [ ] JWT secrets are strong

---

## 🚨 Troubleshooting

### Common Issues:

#### Backend Won't Start
```bash
# Check logs
railway logs

# Common fixes:
# 1. Check environment variables
# 2. Verify MongoDB connection
# 3. Check port configuration
```

#### Frontend Build Fails
```bash
# Check build logs
npm run build:prod

# Common fixes:
# 1. Check environment variables
# 2. Verify API URL
# 3. Check for TypeScript errors
```

#### Database Connection Issues
```bash
# Test connection
mongosh "your-connection-string"

# Common fixes:
# 1. Check IP whitelist
# 2. Verify credentials
# 3. Check network access
```

---

## 📈 Performance Optimization

### 7.1 Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### 7.2 Backend Optimization
- Enable database indexing
- Implement caching
- Use connection pooling
- Monitor memory usage

---

## 🎯 Final Checklist

### Before Going Live:
- [ ] All tests pass
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Documentation updated

### Post-Deployment:
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all features work
- [ ] Test admin panel
- [ ] Check database performance

---

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Test database connection
4. Check CORS settings
5. Review security configuration

---

**🎉 Congratulations! Your Quiz App is now live in production!**
