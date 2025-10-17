// Telegram WebApp Service
// This service handles Telegram WebApp initialization and user data management

class TelegramWebAppService {
  constructor() {
    this.isInitialized = false;
    this.user = null;
    this.error = null;
    this.callbacks = {
      onUserData: null,
      onError: null,
      onInitialized: null
    };
  }

  // Initialize Telegram WebApp
  async initialize() {
    try {
      // Check if running in Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Initialize Telegram WebApp
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();

        // Get user data from Telegram
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        const initData = window.Telegram.WebApp.initData;

        if (telegramUser) {
          try {
            // Get user data from backend
            const response = await fetch('/api/telegram-webapp/webapp-init', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                initData: initData,
                user: telegramUser,
                referralCode: this.getReferralCode()
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
              this.user = result.data.user;
              
              // Store tokens
              if (result.data.tokens) {
                localStorage.setItem('accessToken', result.data.tokens.accessToken);
                localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
              }

              // Configure UI
              window.Telegram.WebApp.headerColor = '#1a1a2e';
              window.Telegram.WebApp.backgroundColor = '#16213e';
              
              // Show welcome message for new users
              if (result.data.isNewUser) {
                window.Telegram.WebApp.showAlert(`🎉 Welcome to CryptoQuiz, ${result.data.user.fullName}!`);
              }

              // Set up main button
              window.Telegram.WebApp.MainButton.setText('🎮 Start Quiz');
              window.Telegram.WebApp.MainButton.show();
              window.Telegram.WebApp.MainButton.onClick(() => {
                window.location.href = '/quiz';
              });

              this.isInitialized = true;
              
              // Call callback if set
              if (this.callbacks.onUserData) {
                this.callbacks.onUserData(result.data);
              }
              
              if (this.callbacks.onInitialized) {
                this.callbacks.onInitialized(true);
              }

              return result.data;
            } else {
              throw new Error(result.error?.message || 'Failed to initialize user');
            }
          } catch (apiError) {
            console.error('API Error:', apiError);
            // Fallback: show error but don't block the app
            window.Telegram.WebApp.showAlert('Error loading user data. Please try again.');
            this.isInitialized = true; // Allow app to continue
            
            if (this.callbacks.onError) {
              this.callbacks.onError(apiError);
            }
            
            if (this.callbacks.onInitialized) {
              this.callbacks.onInitialized(true);
            }
            
            return null;
          }
        } else {
          // No Telegram user data, but don't throw error - allow normal app usage
          console.warn('No Telegram user data found, using fallback mode');
          this.isInitialized = true;
          
          if (this.callbacks.onInitialized) {
            this.callbacks.onInitialized(true);
          }
          
          return null;
        }
      } else {
        // Not running in Telegram WebApp, allow normal app usage
        this.isInitialized = true;
        
        if (this.callbacks.onInitialized) {
          this.callbacks.onInitialized(true);
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
      this.error = error.message;
      
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
      
      // Don't block the app, just show error
      this.isInitialized = true;
      
      if (this.callbacks.onInitialized) {
        this.callbacks.onInitialized(true);
      }
      
      return null;
    }
  }

  // Get referral code from URL
  getReferralCode() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('ref') || urlParams.get('referral');
    } catch (error) {
      return null;
    }
  }

  // Get user data
  getUserData() {
    return this.user;
  }

  // Check if Telegram WebApp is available
  isTelegramWebApp() {
    return typeof window !== 'undefined' && window.Telegram?.WebApp;
  }

  // Check if initialized
  getInitializationStatus() {
    return this.isInitialized;
  }

  // Get error
  getError() {
    return this.error;
  }

  // Set callbacks
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Sync user data with backend
  async syncUserWithBackend(userData) {
    try {
      const response = await fetch('/api/telegram-webapp/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error syncing user data:', error);
      return null;
    }
  }

  // Update user data
  updateUserData(newUserData) {
    this.user = { ...this.user, ...newUserData };
    
    if (this.callbacks.onUserData) {
      this.callbacks.onUserData({ user: this.user });
    }
  }

  // Show Telegram alert
  showAlert(message) {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  }

  // Show Telegram confirm
  showConfirm(message, callback) {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      if (callback) callback(result);
    }
  }

  // Close Telegram WebApp
  close() {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.close();
    }
  }

  // Expand Telegram WebApp
  expand() {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.expand();
    }
  }

  // Set main button
  setMainButton(text, onClick) {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.setText(text);
      window.Telegram.WebApp.MainButton.show();
      window.Telegram.WebApp.MainButton.onClick(onClick);
    }
  }

  // Hide main button
  hideMainButton() {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }

  // Set back button
  setBackButton(onClick) {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(onClick);
    }
  }

  // Hide back button
  hideBackButton() {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.BackButton.hide();
    }
  }

  // Set header color
  setHeaderColor(color) {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.headerColor = color;
    }
  }

  // Set background color
  setBackgroundColor(color) {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.backgroundColor = color;
    }
  }

  // Get theme params
  getThemeParams() {
    if (this.isTelegramWebApp()) {
      return window.Telegram.WebApp.themeParams;
    }
    return null;
  }

  // Get platform
  getPlatform() {
    if (this.isTelegramWebApp()) {
      return window.Telegram.WebApp.platform;
    }
    return 'unknown';
  }

  // Get version
  getVersion() {
    if (this.isTelegramWebApp()) {
      return window.Telegram.WebApp.version;
    }
    return 'unknown';
  }

  // Check if dark theme
  isDarkTheme() {
    if (this.isTelegramWebApp()) {
      return window.Telegram.WebApp.colorScheme === 'dark';
    }
    return true; // Default to dark theme
  }

  // Haptic feedback
  impactOccurred(style = 'medium') {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  }

  // Notification occurred
  notificationOccurred(type = 'success') {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
    }
  }

  // Selection changed
  selectionChanged() {
    if (this.isTelegramWebApp()) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
  }
}

// Create singleton instance
const telegramWebAppService = new TelegramWebAppService();

export default telegramWebAppService;