// App Settings Service for managing comprehensive app configuration
import dataService from './dataService'

class AppSettingsService {
  constructor() {
    this.cache = {
      settings: null,
      lastFetch: null,
      cacheDuration: 30 * 1000 // 30 seconds
    }
    this.listeners = []
  }

  // Get app settings with caching
  async getAppSettings() {
    try {
      // Check cache first
      if (this.cache.settings && this.cache.lastFetch && 
          (Date.now() - this.cache.lastFetch) < this.cache.cacheDuration) {
        return this.cache.settings
      }

      // For now, return default settings since we don't have backend API yet
      const defaultSettings = this.getDefaultSettings()

      // Update cache
      this.cache.settings = defaultSettings
      this.cache.lastFetch = Date.now()

      return defaultSettings
    } catch (error) {
      console.error('Error getting app settings:', error)
      return this.getDefaultSettings()
    }
  }

  // Get default settings
  getDefaultSettings() {
    return {
      // UI Theme Settings
      theme: 'dark',
      primaryColor: '#00BFFF',
      secondaryColor: '#FFD700',
      accentColor: '#10b981',
      
      // Feature Toggles
      features: {
        tournaments: true,
        tasks: true,
        referrals: true,
        dailyBonus: true,
        achievements: true,
        leaderboard: true,
        chat: false,
        notifications: true,
        maintenanceMode: false
      },
      
      // Daily Bonus Settings
      dailyBonus: {
        amount: 1.0,
        maxStreak: 30,
        streakMultipliers: {
          1: 1.0,
          3: 1.5,
          7: 2.0,
          14: 2.5,
          30: 3.0
        }
      },
      
      // App Configuration
      appConfig: {
        appName: 'Quizly',
        appVersion: '1.0.0',
        maintenanceMessage: 'App is under maintenance. Please try again later.',
        welcomeMessage: 'Welcome to Quizly! Test your crypto knowledge and win USDT!',
        supportEmail: 'support@quizly.com',
        supportTelegram: '@quizly_support'
      },
      
      // UI Layout Settings
      layout: {
        showHeader: true,
        showBottomNav: true,
        showSidebar: false,
        compactMode: false,
        showAnimations: true,
        showSounds: false
      },
      
      // Content Settings
      content: {
        homePageTitle: 'Crypto Master',
        homePageSubtitle: 'Test your crypto knowledge and win USDT!',
        quizPageTitle: 'Crypto Challenge',
        tournamentPageTitle: 'Tournament Battles',
        earnPageTitle: 'Earn More USDT',
        profilePageTitle: 'Your Profile'
      },
      
      // Security Settings
      security: {
        maxDailyQuizzes: 10,
        maxHourlyQuizzes: 3,
        minTimeBetweenQuizzes: 30000,
        suspiciousScoreThreshold: 95,
        enableFraudDetection: true,
        enableRateLimiting: true
      },
      
      // Notification Settings
      notifications: {
        enablePushNotifications: true,
        enableEmailNotifications: false,
        enableSMSNotifications: false,
        notificationSound: true,
        notificationVibration: true
      }
    }
  }

  // Update app settings
  async updateAppSettings(settings) {
    try {
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      }

      // For now, just update cache since we don't have backend API yet
      // TODO: Implement API call when backend is ready
      
      // Update cache
      this.cache.settings = updatedSettings
      this.cache.lastFetch = Date.now()

      // Notify listeners
      this.notifyListeners(updatedSettings)

      return updatedSettings
    } catch (error) {
      console.error('Error updating app settings:', error)
      throw error
    }
  }

  // Get specific setting category
  async getSettingCategory(category) {
    try {
      const settings = await this.getAppSettings()
      return settings[category] || {}
    } catch (error) {
      console.error(`Error getting ${category} settings:`, error)
      return {}
    }
  }

  // Get daily bonus settings
  async getDailyBonusSettings() {
    try {
      const settings = await this.getAppSettings()
      return settings.dailyBonus || {
        amount: 1.0,
        maxStreak: 30,
        streakMultipliers: {
          1: 1.0,
          3: 1.5,
          7: 2.0,
          14: 2.5,
          30: 3.0
        }
      }
    } catch (error) {
      console.error('Error getting daily bonus settings:', error)
      return {
        amount: 1.0,
        maxStreak: 30,
        streakMultipliers: {
          1: 1.0,
          3: 1.5,
          7: 2.0,
          14: 2.5,
          30: 3.0
        }
      }
    }
  }

  // Check if feature is enabled
  async isFeatureEnabled(feature) {
    try {
      const settings = await this.getAppSettings()
      return settings.features?.[feature] || false
    } catch (error) {
      console.error(`Error checking feature ${feature}:`, error)
      return false
    }
  }

  // Check if maintenance mode is active
  async isMaintenanceMode() {
    try {
      const settings = await this.getAppSettings()
      return settings.features?.maintenanceMode || false
    } catch (error) {
      console.error('Error checking maintenance mode:', error)
      return false
    }
  }

  // Get maintenance message
  async getMaintenanceMessage() {
    try {
      const settings = await this.getAppSettings()
      return settings.appConfig?.maintenanceMessage || 'App is under maintenance. Please try again later.'
    } catch (error) {
      console.error('Error getting maintenance message:', error)
      return 'App is under maintenance. Please try again later.'
    }
  }

  // Get theme settings
  async getThemeSettings() {
    try {
      const settings = await this.getAppSettings()
      return {
        theme: settings.theme || 'dark',
        primaryColor: settings.primaryColor || '#00BFFF',
        secondaryColor: settings.secondaryColor || '#FFD700',
        accentColor: settings.accentColor || '#10b981'
      }
    } catch (error) {
      console.error('Error getting theme settings:', error)
      return {
        theme: 'dark',
        primaryColor: '#00BFFF',
        secondaryColor: '#FFD700',
        accentColor: '#10b981'
      }
    }
  }

  // Get layout settings
  async getLayoutSettings() {
    try {
      const settings = await this.getAppSettings()
      return settings.layout || {
        showHeader: true,
        showBottomNav: true,
        showSidebar: false,
        compactMode: false,
        showAnimations: true,
        showSounds: false
      }
    } catch (error) {
      console.error('Error getting layout settings:', error)
      return {
        showHeader: true,
        showBottomNav: true,
        showSidebar: false,
        compactMode: false,
        showAnimations: true,
        showSounds: false
      }
    }
  }

  // Get content settings
  async getContentSettings() {
    try {
      const settings = await this.getAppSettings()
      return settings.content || {
        homePageTitle: 'Crypto Master',
        homePageSubtitle: 'Test your crypto knowledge and win USDT!',
        quizPageTitle: 'Crypto Challenge',
        tournamentPageTitle: 'Tournament Battles',
        earnPageTitle: 'Earn More USDT',
        profilePageTitle: 'Your Profile'
      }
    } catch (error) {
      console.error('Error getting content settings:', error)
      return {
        homePageTitle: 'Crypto Master',
        homePageSubtitle: 'Test your crypto knowledge and win USDT!',
        quizPageTitle: 'Crypto Challenge',
        tournamentPageTitle: 'Tournament Battles',
        earnPageTitle: 'Earn More USDT',
        profilePageTitle: 'Your Profile'
      }
    }
  }

  // Get security settings
  async getSecuritySettings() {
    try {
      const settings = await this.getAppSettings()
      return settings.security || {
        maxDailyQuizzes: 10,
        maxHourlyQuizzes: 3,
        minTimeBetweenQuizzes: 30000,
        suspiciousScoreThreshold: 95,
        enableFraudDetection: true,
        enableRateLimiting: true
      }
    } catch (error) {
      console.error('Error getting security settings:', error)
      return {
        maxDailyQuizzes: 10,
        maxHourlyQuizzes: 3,
        minTimeBetweenQuizzes: 30000,
        suspiciousScoreThreshold: 95,
        enableFraudDetection: true,
        enableRateLimiting: true
      }
    }
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const settings = await this.getAppSettings()
      return settings.notifications || {
        enablePushNotifications: true,
        enableEmailNotifications: false,
        enableSMSNotifications: false,
        notificationSound: true,
        notificationVibration: true
      }
    } catch (error) {
      console.error('Error getting notification settings:', error)
      return {
        enablePushNotifications: true,
        enableEmailNotifications: false,
        enableSMSNotifications: false,
        notificationSound: true,
        notificationVibration: true
      }
    }
  }

  // Subscribe to settings changes
  subscribeToSettings(callback) {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notify all listeners
  notifyListeners(settings) {
    this.listeners.forEach(listener => {
      try {
        listener(settings)
      } catch (error) {
        console.error('Error notifying settings listener:', error)
      }
    })
  }

  // Clear cache
  clearCache() {
    this.cache.settings = null
    this.cache.lastFetch = null
  }

  // Apply theme to document
  async applyTheme() {
    try {
      const themeSettings = await this.getThemeSettings()
      
      // Apply CSS custom properties
      const root = document.documentElement
      root.style.setProperty('--primary-color', themeSettings.primaryColor)
      root.style.setProperty('--secondary-color', themeSettings.secondaryColor)
      root.style.setProperty('--accent-color', themeSettings.accentColor)
      
      // Apply theme class
      root.className = root.className.replace(/theme-\w+/g, '')
      root.classList.add(`theme-${themeSettings.theme}`)
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themeSettings.primaryColor)
      }
    } catch (error) {
      console.error('Error applying theme:', error)
    }
  }

  // Check if user should see maintenance mode
  async shouldShowMaintenanceMode() {
    try {
      const isMaintenance = await this.isMaintenanceMode()
      const isAdmin = localStorage.getItem('adminAuthenticated') === 'true'
      
      // Don't show maintenance mode to admins
      return isMaintenance && !isAdmin
    } catch (error) {
      console.error('Error checking maintenance mode:', error)
      return false
    }
  }

  // Get app configuration
  async getAppConfig() {
    try {
      const settings = await this.getAppSettings()
      return settings.appConfig || {
        appName: 'Quizly',
        appVersion: '1.0.0',
        maintenanceMessage: 'App is under maintenance. Please try again later.',
        welcomeMessage: 'Welcome to CryptoQuiz! Test your crypto knowledge and win USDT!',
        supportEmail: 'support@cryptoquiz.com',
        supportTelegram: '@cryptoquiz_support'
      }
    } catch (error) {
      console.error('Error getting app config:', error)
      return {
        appName: 'Quizly',
        appVersion: '1.0.0',
        maintenanceMessage: 'App is under maintenance. Please try again later.',
        welcomeMessage: 'Welcome to CryptoQuiz! Test your crypto knowledge and win USDT!',
        supportEmail: 'support@cryptoquiz.com',
        supportTelegram: '@cryptoquiz_support'
      }
    }
  }

  // Initialize settings
  async initializeSettings() {
    try {
      // Load settings
      await this.getAppSettings()
      
      // Apply theme
      await this.applyTheme()
      
      // Set up real-time listener
      this.setupRealtimeListener()
      
      console.log('App settings initialized successfully')
    } catch (error) {
      console.error('Error initializing app settings:', error)
    }
  }

  // Set up real-time listener for settings changes
  setupRealtimeListener() {
    try {
      // TODO: Implement real-time listener when backend WebSocket is ready
      console.log('Real-time listener setup placeholder')
    } catch (error) {
      console.error('Error setting up real-time listener:', error)
    }
  }
}

// Create singleton instance
const appSettingsService = new AppSettingsService()

export default appSettingsService
