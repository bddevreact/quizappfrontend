# 🚀 Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Security Checklist
- [ ] All hardcoded secrets removed
- [ ] Environment variables secured
- [ ] Source maps disabled
- [ ] CSP headers configured
- [ ] Database SSL enabled
- [ ] Rate limiting configured
- [ ] Input validation enabled

### ✅ Performance Checklist
- [ ] Code splitting enabled
- [ ] Bundle optimization configured
- [ ] Database indexes added
- [ ] Caching implemented
- [ ] Compression enabled

### ✅ Monitoring Checklist
- [ ] Health checks configured
- [ ] Error logging enabled
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented

## 🔧 Environment Setup

### 1. Backend Environment
```bash
# Copy production environment template
cp backend/env.production.example backend/.env.production

# Edit with your production values
nano backend/.env.production
```

### 2. Frontend Environment
```bash
# Copy production environment template
cp env.production.example .env.production

# Edit with your production values
nano .env.production
```

## 🏗️ Build Process

### Frontend Build
```bash
# Install dependencies
npm install

# Build for production
npm run build:prod

# Preview build
npm run preview
```

### Backend Setup
```bash
# Install dependencies
cd backend
npm install

# Start production server
npm run start:prod
```

## 🐳 Docker Deployment (Optional)

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
```

## 🔒 Security Configuration

### 1. Environment Variables
```bash
# Generate secure JWT secrets
openssl rand -base64 64

# Generate secure admin password
openssl rand -base64 32
```

### 2. Database Security
```javascript
// MongoDB Atlas connection with SSL
const uri = "mongodb+srv://user:pass@cluster.mongodb.net/db?ssl=true&authSource=admin";
```

### 3. CORS Configuration
```javascript
// Only allow your production domains
origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
```

## 📊 Monitoring Setup

### 1. Health Check Endpoint
```bash
# Test health endpoint
curl https://api.yourdomain.com/health
```

### 2. Log Monitoring
```bash
# Monitor logs
tail -f backend/logs/app.log
```

### 3. Performance Monitoring
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start backend/src/app.js --name cryptoquiz-backend
```

## 🚀 Deployment Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-repo/cryptoquiz.git
cd cryptoquiz

# Install dependencies
npm install
cd backend && npm install

# Setup environment
cp env.production.example .env.production
# Edit .env.production with your values

# Build frontend
npm run build:prod

# Start backend with PM2
pm2 start backend/src/app.js --name cryptoquiz-backend
pm2 startup
pm2 save
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        root /path/to/cryptoquiz/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Post-Deployment Verification

### 1. Security Tests
```bash
# Test SSL/TLS
curl -I https://yourdomain.com

# Test security headers
curl -I https://yourdomain.com | grep -i security

# Test rate limiting
for i in {1..10}; do curl https://api.yourdomain.com/api/health; done
```

### 2. Performance Tests
```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# Test database connection
curl https://api.yourdomain.com/api/health
```

### 3. Functionality Tests
- [ ] User registration/login
- [ ] Quiz functionality
- [ ] Tournament system
- [ ] Payment processing
- [ ] Admin panel access

## 📈 Performance Optimization

### 1. Database Optimization
```javascript
// Add indexes for frequently queried fields
db.users.createIndex({ "email": 1 })
db.quizzes.createIndex({ "difficulty": 1, "category": 1 })
db.transactions.createIndex({ "userId": 1, "timestamp": -1 })
```

### 2. Caching Strategy
```javascript
// Implement Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
```

### 3. CDN Setup
- Configure CloudFlare or AWS CloudFront
- Enable gzip compression
- Set appropriate cache headers

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check SSL configuration

2. **CORS Errors**
   - Verify CORS origin configuration
   - Check frontend URL in backend config

3. **Authentication Issues**
   - Verify JWT secret configuration
   - Check token expiration settings

4. **Performance Issues**
   - Monitor database queries
   - Check server resources
   - Review error logs

## 📞 Support

For production support:
- Email: support@yourdomain.com
- Documentation: https://docs.yourdomain.com
- Status Page: https://status.yourdomain.com
