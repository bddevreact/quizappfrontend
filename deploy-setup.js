#!/usr/bin/env node

/**
 * 🚀 Deployment Setup Script
 * Automates the production deployment preparation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logStep(message) {
  log(`\n🚀 ${message}`, 'cyan');
}

// Check if required tools are installed
function checkDependencies() {
  logStep('Checking dependencies...');
  
  const tools = ['node', 'npm', 'git'];
  const missing = [];
  
  for (const tool of tools) {
    try {
      execSync(`${tool} --version`, { stdio: 'ignore' });
      logSuccess(`${tool} is installed`);
    } catch (error) {
      missing.push(tool);
      logError(`${tool} is not installed`);
    }
  }
  
  if (missing.length > 0) {
    logError(`Please install: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// Setup backend for production
function setupBackend() {
  logStep('Setting up backend for production...');
  
  const backendPath = path.join(__dirname, 'backend');
  
  if (!fs.existsSync(backendPath)) {
    logError('Backend directory not found');
    return false;
  }
  
  try {
    // Install dependencies
    logInfo('Installing backend dependencies...');
    execSync('npm install --production', { 
      cwd: backendPath, 
      stdio: 'inherit' 
    });
    
    // Create production environment file
    const envProdPath = path.join(backendPath, '.env.production');
    const envExamplePath = path.join(backendPath, 'env.example');
    
    if (!fs.existsSync(envProdPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envProdPath);
      logWarning('Created .env.production - please update with your production values');
    }
    
    logSuccess('Backend setup complete');
    return true;
  } catch (error) {
    logError(`Backend setup failed: ${error.message}`);
    return false;
  }
}

// Setup frontend for production
function setupFrontend() {
  logStep('Setting up frontend for production...');
  
  try {
    // Install dependencies
    logInfo('Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Create production environment file
    const envProdPath = '.env.production';
    const envExamplePath = 'env.example';
    
    if (!fs.existsSync(envProdPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envProdPath);
      logWarning('Created .env.production - please update with your production values');
    }
    
    // Build frontend
    logInfo('Building frontend for production...');
    execSync('npm run build:prod', { stdio: 'inherit' });
    
    logSuccess('Frontend build successful');
    return true;
  } catch (error) {
    logError(`Frontend setup failed: ${error.message}`);
    return false;
  }
}

// Test production build
function testProduction() {
  logStep('Testing production build...');
  
  // Test if dist folder exists
  if (fs.existsSync('dist')) {
    logSuccess('Frontend build directory exists');
  } else {
    logError('Frontend build directory not found');
    return false;
  }
  
  // Test backend
  const backendPath = path.join(__dirname, 'backend');
  if (fs.existsSync(path.join(backendPath, 'package.json'))) {
    logSuccess('Backend package.json found');
  } else {
    logError('Backend package.json not found');
    return false;
  }
  
  return true;
}

// Generate deployment files
function generateDeploymentFiles() {
  logStep('Generating deployment files...');
  
  // Railway configuration
  const railwayConfig = {
    build: {
      builder: "NIXPACKS"
    },
    deploy: {
      startCommand: "npm run start:prod",
      restartPolicyType: "ON_FAILURE"
    }
  };
  
  fs.writeFileSync('railway.json', JSON.stringify(railwayConfig, null, 2));
  
  // Netlify configuration
  const netlifyConfig = `[build]
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
    Referrer-Policy = "strict-origin-when-cross-origin"`;
  
  fs.writeFileSync('netlify.toml', netlifyConfig);
  
  // Vercel configuration
  const vercelConfig = {
    buildCommand: "npm run build:prod",
    outputDirectory: "dist",
    framework: "vite",
    rewrites: [
      {
        source: "/(.*)",
        destination: "/index.html"
      }
    ]
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  
  logSuccess('Deployment files generated');
}

// Generate deployment checklist
function generateChecklist() {
  logStep('Generating deployment checklist...');
  
  const checklist = `# 🚀 Deployment Checklist

## Pre-Deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Security settings reviewed
- [ ] Performance optimization completed
- [ ] Error handling tested

## Backend Deployment
- [ ] Railway/Render account created
- [ ] Environment variables added
- [ ] MongoDB Atlas configured
- [ ] CORS settings updated
- [ ] Health check endpoint working

## Frontend Deployment
- [ ] Netlify/Vercel account created
- [ ] Environment variables added
- [ ] Build successful
- [ ] API URL updated
- [ ] All features tested

## Post-Deployment
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Documentation updated

## Testing
- [ ] User registration/login
- [ ] Quiz functionality
- [ ] Daily bonus system
- [ ] Admin panel access
- [ ] Payment system (if applicable)
- [ ] Mobile responsiveness

## Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication secure

## Performance
- [ ] Page load times < 3 seconds
- [ ] Database queries optimized
- [ ] CDN configured (if applicable)
- [ ] Caching implemented
- [ ] Error monitoring active

---

**🎉 Your app is ready for production!**`;
  
  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
  logSuccess('Deployment checklist generated');
}

// Main function
function main() {
  log('\n🎯 Quiz App Production Deployment Setup', 'bright');
  log('==========================================', 'bright');
  
  try {
    checkDependencies();
    
    const backendSuccess = setupBackend();
    const frontendSuccess = setupFrontend();
    
    if (!backendSuccess || !frontendSuccess) {
      logError('Setup failed. Please fix the errors above.');
      process.exit(1);
    }
    
    const testSuccess = testProduction();
    if (!testSuccess) {
      logError('Production test failed. Please fix the errors above.');
      process.exit(1);
    }
    
    generateDeploymentFiles();
    generateChecklist();
    
    log('\n🎉 Production setup complete!', 'green');
    log('\n📋 Next steps:', 'cyan');
    log('1. Update .env.production files with your production values');
    log('2. Deploy backend to Railway/Render');
    log('3. Deploy frontend to Netlify/Vercel');
    log('4. Update CORS settings in backend');
    log('5. Test your deployed application');
    log('\n📖 For detailed instructions, see DEPLOYMENT_GUIDE_COMPLETE.md', 'blue');
    log('📝 Use DEPLOYMENT_CHECKLIST.md to track your progress', 'blue');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  setupBackend,
  setupFrontend,
  testProduction,
  generateDeploymentFiles
};
