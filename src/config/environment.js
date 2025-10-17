// Environment Configuration
// This file manages environment variables and API configuration

const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // MongoDB Configuration
  MONGODB_URI: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/cryptoquiz',
  
  // JWT Configuration
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: import.meta.env.VITE_JWT_EXPIRE || '7d',
  
  // Telegram Bot Configuration
  TELEGRAM_BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_WEBHOOK_URL: import.meta.env.VITE_TELEGRAM_WEBHOOK_URL || '',
  
  // OpenAI Configuration
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  
  // Email Configuration
  EMAIL_FROM: import.meta.env.VITE_EMAIL_FROM || 'noreply@cryptoquiz.com',
  EMAIL_SERVICE: import.meta.env.VITE_EMAIL_SERVICE || 'gmail',
  
  // SMS Configuration
  SMS_PROVIDER: import.meta.env.VITE_SMS_PROVIDER || 'twilio',
  TWILIO_ACCOUNT_SID: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  
  // File Upload Configuration
  MAX_FILE_SIZE: import.meta.env.VITE_MAX_FILE_SIZE || '5MB',
  UPLOAD_PATH: import.meta.env.VITE_UPLOAD_PATH || './uploads',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: import.meta.env.VITE_RATE_LIMIT_WINDOW_MS || '900000', // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS || '100',
  
  // Security
  BCRYPT_ROUNDS: import.meta.env.VITE_BCRYPT_ROUNDS || '12',
  SESSION_SECRET: import.meta.env.VITE_SESSION_SECRET || 'your-session-secret',
  
  // Feature Flags
  ENABLE_AI_QUESTIONS: import.meta.env.VITE_ENABLE_AI_QUESTIONS === 'true',
  ENABLE_TELEGRAM_INTEGRATION: import.meta.env.VITE_ENABLE_TELEGRAM_INTEGRATION === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_EMAIL_NOTIFICATIONS: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true',
  ENABLE_PUSH_NOTIFICATIONS: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true',
  ENABLE_SMS_NOTIFICATIONS: import.meta.env.VITE_ENABLE_SMS_NOTIFICATIONS === 'true',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Quizly',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Quizly - Crypto Quiz Telegram Mini App',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  
  // CORS Configuration
  CORS_ORIGINS: import.meta.env.VITE_CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // Database Configuration
  DB_CONNECTION_POOL_SIZE: import.meta.env.VITE_DB_CONNECTION_POOL_SIZE || '10',
  DB_CONNECTION_TIMEOUT: import.meta.env.VITE_DB_CONNECTION_TIMEOUT || '30000',
  
  // Cache Configuration
  CACHE_TTL: import.meta.env.VITE_CACHE_TTL || '300', // 5 minutes
  REDIS_URL: import.meta.env.VITE_REDIS_URL || 'redis://localhost:6379',
  
  // Logging Configuration
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  LOG_FILE: import.meta.env.VITE_LOG_FILE || './logs/app.log',
  
  // Admin Configuration
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'admin@cryptoquiz.com',
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
  ADMIN_CREDENTIALS: {
    username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
  },
  
  // Default Settings
  DEFAULT_CURRENCY: import.meta.env.VITE_DEFAULT_CURRENCY || 'USDT',
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  DEFAULT_TIMEZONE: import.meta.env.VITE_DEFAULT_TIMEZONE || 'UTC',
  
  // Quiz Configuration
  MAX_QUESTIONS_PER_QUIZ: import.meta.env.VITE_MAX_QUESTIONS_PER_QUIZ || '10',
  QUIZ_TIME_LIMIT: import.meta.env.VITE_QUIZ_TIME_LIMIT || '300', // 5 minutes
  
  // Tournament Configuration
  MAX_TOURNAMENT_PARTICIPANTS: import.meta.env.VITE_MAX_TOURNAMENT_PARTICIPANTS || '100',
  TOURNAMENT_ENTRY_FEE_MIN: import.meta.env.VITE_TOURNAMENT_ENTRY_FEE_MIN || '1',
  TOURNAMENT_ENTRY_FEE_MAX: import.meta.env.VITE_TOURNAMENT_ENTRY_FEE_MAX || '1000',
  
  // Transaction Configuration
  MIN_DEPOSIT_AMOUNT: import.meta.env.VITE_MIN_DEPOSIT_AMOUNT || '10',
  MIN_WITHDRAWAL_AMOUNT: import.meta.env.VITE_MIN_WITHDRAWAL_AMOUNT || '5',
  MAX_WITHDRAWAL_AMOUNT: import.meta.env.VITE_MAX_WITHDRAWAL_AMOUNT || '1000',
  
  // Task Configuration
  MAX_DAILY_TASKS: import.meta.env.VITE_MAX_DAILY_TASKS || '10',
  TASK_REWARD_MIN: import.meta.env.VITE_TASK_REWARD_MIN || '1',
  TASK_REWARD_MAX: import.meta.env.VITE_TASK_REWARD_MAX || '50',
  
  // Achievement Configuration
  ACHIEVEMENT_REWARD_MIN: import.meta.env.VITE_ACHIEVEMENT_REWARD_MIN || '5',
  ACHIEVEMENT_REWARD_MAX: import.meta.env.VITE_ACHIEVEMENT_REWARD_MAX || '100',
  
  // Referral Configuration
  REFERRAL_REWARD: import.meta.env.VITE_REFERRAL_REWARD || '10',
  MAX_REFERRALS_PER_USER: import.meta.env.VITE_MAX_REFERRALS_PER_USER || '10',
  
  // Daily Bonus Configuration
  DAILY_BONUS_AMOUNT: import.meta.env.VITE_DAILY_BONUS_AMOUNT || '5',
  DAILY_BONUS_COOLDOWN: import.meta.env.VITE_DAILY_BONUS_COOLDOWN || '86400', // 24 hours
};

// Validation function
export const validateConfig = () => {
  const requiredFields = [
    'API_BASE_URL',
    'MONGODB_URI',
    'JWT_SECRET'
  ];
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.warn('Missing required configuration fields:', missingFields);
    return false;
  }
  
  return true;
};

// Get configuration value
export const getConfig = (key, defaultValue = null) => {
  return config[key] !== undefined ? config[key] : defaultValue;
};

// Set configuration value (for runtime updates)
export const setConfig = (key, value) => {
  config[key] = value;
};

// Get all configuration
export const getAllConfig = () => {
  return { ...config };
};

// Check if feature is enabled
export const isFeatureEnabled = (feature) => {
  return config[`ENABLE_${feature.toUpperCase()}`] === true;
};

// Get API URL
export const getApiUrl = (endpoint = '') => {
  const baseUrl = config.API_BASE_URL.endsWith('/') 
    ? config.API_BASE_URL.slice(0, -1) 
    : config.API_BASE_URL;
  
  const cleanEndpoint = endpoint.startsWith('/') 
    ? endpoint 
    : `/${endpoint}`;
  
  return `${baseUrl}${cleanEndpoint}`;
};

// Get MongoDB connection string
export const getMongoUri = () => {
  return config.MONGODB_URI;
};

// Get JWT configuration
export const getJwtConfig = () => {
  return {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRE
  };
};

// Get Telegram configuration
export const getTelegramConfig = () => {
  return {
    botToken: config.TELEGRAM_BOT_TOKEN,
    webhookUrl: config.TELEGRAM_WEBHOOK_URL
  };
};

// Get OpenAI configuration
export const getOpenAIConfig = () => {
  return {
    apiKey: config.OPENAI_API_KEY
  };
};

// Get email configuration
export const getEmailConfig = () => {
  return {
    from: config.EMAIL_FROM,
    service: config.EMAIL_SERVICE
  };
};

// Get SMS configuration
export const getSMSConfig = () => {
  return {
    provider: config.SMS_PROVIDER,
    twilio: {
      accountSid: config.TWILIO_ACCOUNT_SID,
      authToken: config.TWILIO_AUTH_TOKEN
    }
  };
};

// Get security configuration
export const getSecurityConfig = () => {
  return {
    bcryptRounds: parseInt(config.BCRYPT_ROUNDS),
    sessionSecret: config.SESSION_SECRET,
    rateLimit: {
      windowMs: parseInt(config.RATE_LIMIT_WINDOW_MS),
      maxRequests: parseInt(config.RATE_LIMIT_MAX_REQUESTS)
    }
  };
};

// Get database configuration
export const getDatabaseConfig = () => {
  return {
    uri: config.MONGODB_URI,
    poolSize: parseInt(config.DB_CONNECTION_POOL_SIZE),
    timeout: parseInt(config.DB_CONNECTION_TIMEOUT)
  };
};

// Get cache configuration
export const getCacheConfig = () => {
  return {
    ttl: parseInt(config.CACHE_TTL),
    redisUrl: config.REDIS_URL
  };
};

// Get app configuration
export const getAppConfig = () => {
  return {
    name: config.APP_NAME,
    version: config.APP_VERSION,
    description: config.APP_DESCRIPTION,
    environment: config.NODE_ENV,
    isProduction: config.IS_PRODUCTION,
    isDevelopment: config.IS_DEVELOPMENT
  };
};

// Get quiz configuration
export const getQuizConfig = () => {
  return {
    maxQuestions: parseInt(config.MAX_QUESTIONS_PER_QUIZ),
    timeLimit: parseInt(config.QUIZ_TIME_LIMIT)
  };
};

// Get tournament configuration
export const getTournamentConfig = () => {
  return {
    maxParticipants: parseInt(config.MAX_TOURNAMENT_PARTICIPANTS),
    entryFeeMin: parseFloat(config.TOURNAMENT_ENTRY_FEE_MIN),
    entryFeeMax: parseFloat(config.TOURNAMENT_ENTRY_FEE_MAX)
  };
};

// Get transaction configuration
export const getTransactionConfig = () => {
  return {
    minDeposit: parseFloat(config.MIN_DEPOSIT_AMOUNT),
    minWithdrawal: parseFloat(config.MIN_WITHDRAWAL_AMOUNT),
    maxWithdrawal: parseFloat(config.MAX_WITHDRAWAL_AMOUNT)
  };
};

// Get task configuration
export const getTaskConfig = () => {
  return {
    maxDaily: parseInt(config.MAX_DAILY_TASKS),
    rewardMin: parseFloat(config.TASK_REWARD_MIN),
    rewardMax: parseFloat(config.TASK_REWARD_MAX)
  };
};

// Get achievement configuration
export const getAchievementConfig = () => {
  return {
    rewardMin: parseFloat(config.ACHIEVEMENT_REWARD_MIN),
    rewardMax: parseFloat(config.ACHIEVEMENT_REWARD_MAX)
  };
};

// Get referral configuration
export const getReferralConfig = () => {
  return {
    reward: parseFloat(config.REFERRAL_REWARD),
    maxPerUser: parseInt(config.MAX_REFERRALS_PER_USER)
  };
};

// Get daily bonus configuration
export const getDailyBonusConfig = () => {
  return {
    amount: parseFloat(config.DAILY_BONUS_AMOUNT),
    cooldown: parseInt(config.DAILY_BONUS_COOLDOWN)
  };
};

// Get admin configuration
export const getAdminConfig = () => {
  return {
    email: config.ADMIN_EMAIL,
    password: config.ADMIN_PASSWORD,
    credentials: config.ADMIN_CREDENTIALS
  };
};

export default config;