@echo off
REM 🚀 Production Deployment Script for Quiz App (Windows)
REM This script automates the deployment process on Windows

echo 🚀 Starting Production Deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18+
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm
    pause
    exit /b 1
)

echo [SUCCESS] All dependencies are installed

REM Setup backend for production
echo [INFO] Setting up backend for production...
cd backend

REM Install dependencies
echo [INFO] Installing backend dependencies...
call npm install --production

REM Create production environment file
if not exist .env.production (
    echo [INFO] Creating production environment file...
    copy env.example .env.production
    echo [WARNING] Please update .env.production with your production values
)

echo [INFO] Backend setup complete
cd ..

REM Setup frontend for production
echo [INFO] Setting up frontend for production...

REM Install dependencies
echo [INFO] Installing frontend dependencies...
call npm install

REM Create production environment file
if not exist .env.production (
    echo [INFO] Creating production environment file...
    copy env.example .env.production
    echo [WARNING] Please update .env.production with your production values
)

REM Build frontend
echo [INFO] Building frontend for production...
call npm run build:prod

if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    pause
    exit /b 1
)

echo [SUCCESS] Frontend build successful

REM Test production build
echo [INFO] Testing production build...

REM Test if dist folder exists
if exist dist (
    echo [SUCCESS] Frontend build directory exists
) else (
    echo [ERROR] Frontend build directory not found
    pause
    exit /b 1
)

REM Test backend
echo [INFO] Testing backend...
cd backend
if exist package.json (
    echo [SUCCESS] Backend package.json found
) else (
    echo [ERROR] Backend package.json not found
    pause
    exit /b 1
)
cd ..

REM Generate deployment files
echo [INFO] Generating deployment files...

REM Create Railway configuration
(
echo {
echo   "build": {
echo     "builder": "NIXPACKS"
echo   },
echo   "deploy": {
echo     "startCommand": "npm run start:prod",
echo     "restartPolicyType": "ON_FAILURE"
echo   }
echo }
) > railway.json

REM Create Netlify configuration
(
echo [build]
echo   command = "npm run build:prod"
echo   publish = "dist"
echo.
echo [build.environment]
echo   NODE_VERSION = "18"
echo.
echo [[redirects]]
echo   from = "/*"
echo   to = "/index.html"
echo   status = 200
echo.
echo [[headers]]
echo   for = "/*"
echo   [headers.values]
echo     X-Frame-Options = "DENY"
echo     X-XSS-Protection = "1; mode=block"
echo     X-Content-Type-Options = "nosniff"
echo     Referrer-Policy = "strict-origin-when-cross-origin"
) > netlify.toml

REM Create Vercel configuration
(
echo {
echo   "buildCommand": "npm run build:prod",
echo   "outputDirectory": "dist",
echo   "framework": "vite",
echo   "rewrites": [
echo     {
echo       "source": "/(.*)",
echo       "destination": "/index.html"
echo     }
echo   ]
echo }
) > vercel.json

echo [SUCCESS] Deployment files generated

echo.
echo 🎉 Production setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.production files with your production values
echo 2. Deploy backend to Railway/Render
echo 3. Deploy frontend to Netlify/Vercel
echo 4. Update CORS settings in backend
echo 5. Test your deployed application
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE_COMPLETE.md
echo.

pause
