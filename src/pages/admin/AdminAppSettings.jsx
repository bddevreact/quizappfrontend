import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  Palette, 
  ToggleLeft,
  ToggleRight,
  Info,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Users,
  Trophy,
  Target,
  DollarSign,
  Gift,
  Bell,
  Globe,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import dataService from '../../services/dataService'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminAppSettings = () => {
  const [settings, setSettings] = useState({
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
    
    // App Configuration
    appConfig: {
      appName: 'CryptoQuiz',
      appVersion: '1.0.0',
      maintenanceMessage: 'App is under maintenance. Please try again later.',
      welcomeMessage: 'Welcome to CryptoQuiz! Test your crypto knowledge and win USDT!',
      supportEmail: 'support@cryptoquiz.com',
      supportTelegram: '@cryptoquiz_support'
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
    },
    
    // Daily Bonus Settings
    dailyBonus: {
      enabled: true,
      baseAmount: 1.0,
      maxAmount: 10.0,
      cooldownHours: 24,
      streakEnabled: true,
      streakMultipliers: {
        '1-2': 1.0,
        '3-6': 1.5,
        '7-13': 2.0,
        '14-29': 2.5,
        '30+': 3.0
      },
      conditions: {
        requireQuiz: false,
        requireDeposit: false,
        requireVerification: false,
        minLevel: 1,
        maxClaimsPerDay: 1
      },
      notifications: {
        enabled: true,
        reminderHours: 2,
        streakMilestone: true
      }
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('theme')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const appSettings = await dataService.read('settings', 'appSettings')
      if (appSettings) {
        setSettings(prev => ({
          ...prev,
          ...appSettings
        }))
      }
    } catch (error) {
      console.error('Error loading app settings:', error)
      setMessage('Error loading settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')
      
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      }
      
      await dataService.update('settings', 'appSettings', updatedSettings)
      setMessage('App settings updated successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving app settings:', error)
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleFeatureToggle = (feature) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }))
  }

  const handleColorChange = (colorType, color) => {
    setSettings(prev => ({
      ...prev,
      [colorType]: color
    }))
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        theme: 'dark',
        primaryColor: '#00BFFF',
        secondaryColor: '#FFD700',
        accentColor: '#10b981',
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
        appConfig: {
          appName: 'CryptoQuiz',
          appVersion: '1.0.0',
          maintenanceMessage: 'App is under maintenance. Please try again later.',
          welcomeMessage: 'Welcome to CryptoQuiz! Test your crypto knowledge and win USDT!',
          supportEmail: 'support@cryptoquiz.com',
          supportTelegram: '@cryptoquiz_support'
        },
        layout: {
          showHeader: true,
          showBottomNav: true,
          showSidebar: false,
          compactMode: false,
          showAnimations: true,
          showSounds: false
        },
        content: {
          homePageTitle: 'Crypto Master',
          homePageSubtitle: 'Test your crypto knowledge and win USDT!',
          quizPageTitle: 'Crypto Challenge',
          tournamentPageTitle: 'Tournament Battles',
          earnPageTitle: 'Earn More USDT',
          profilePageTitle: 'Your Profile'
        },
        security: {
          maxDailyQuizzes: 10,
          maxHourlyQuizzes: 3,
          minTimeBetweenQuizzes: 30000,
          suspiciousScoreThreshold: 95,
          enableFraudDetection: true,
          enableRateLimiting: true
        },
        notifications: {
          enablePushNotifications: true,
          enableEmailNotifications: false,
          enableSMSNotifications: false,
          notificationSound: true,
          notificationVibration: true
        }
      })
    }
  }

  const tabs = [
    { id: 'theme', label: 'Theme & Colors', icon: Palette },
    { id: 'features', label: 'Feature Toggles', icon: Zap },
    { id: 'layout', label: 'Layout Settings', icon: Monitor },
    { id: 'content', label: 'Content Management', icon: Globe },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" text="Loading app settings..." />
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">App Settings</h1>
                <p className="text-gray-600">Comprehensive control over user interface and app behavior</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Defaults
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Theme & Colors Tab */}
          {activeTab === 'theme' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Palette className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Theme & Color Settings</h2>
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">App Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'auto', label: 'Auto', icon: Monitor }
                  ].map((theme) => {
                    const Icon = theme.icon
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.theme === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Color Customization</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                        className="w-12 h-12 rounded-lg border border-gray-300"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                <div className="p-4 rounded-lg border border-gray-200" style={{ backgroundColor: settings.theme === 'dark' ? '#1a1a1a' : '#ffffff' }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      U
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: settings.theme === 'dark' ? '#ffffff' : '#000000' }}>
                        User Name
                      </div>
                      <div className="text-xs" style={{ color: settings.secondaryColor }}>
                        Level 5 • 1,250 XP
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      Accent Button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Toggles Tab */}
          {activeTab === 'features' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Feature Toggles</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {Object.entries(settings.features).map(([feature, enabled]) => {
                  const featureInfo = {
                    tournaments: { label: 'Tournament System', icon: Trophy, description: 'Enable tournament battles and competitions' },
                    tasks: { label: 'Task System', icon: Target, description: 'Enable daily tasks and earning opportunities' },
                    referrals: { label: 'Referral System', icon: Users, description: 'Enable user referrals and bonuses' },
                    dailyBonus: { label: 'Daily Bonus', icon: Gift, description: 'Enable daily bonus claims' },
                    achievements: { label: 'Achievements', icon: Trophy, description: 'Enable achievement system' },
                    leaderboard: { label: 'Leaderboard', icon: Trophy, description: 'Enable global leaderboard' },
                    chat: { label: 'Chat System', icon: Users, description: 'Enable user chat functionality' },
                    notifications: { label: 'Notifications', icon: Bell, description: 'Enable push notifications' },
                    maintenanceMode: { label: 'Maintenance Mode', icon: AlertCircle, description: 'Put app in maintenance mode' }
                  }
                  
                  const info = featureInfo[feature]
                  const Icon = info.icon
                  
                  return (
                    <div key={feature} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{info.label}</h3>
                          <p className="text-sm text-gray-500">{info.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFeatureToggle(feature)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Daily Bonus Detailed Settings */}
              {settings.features.dailyBonus && (
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Gift className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Daily Bonus Configuration</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Basic Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900">Basic Settings</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Amount (USDT)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="100"
                          value={settings.dailyBonus.baseAmount}
                          onChange={(e) => handleSettingChange('dailyBonus', 'baseAmount', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Amount (USDT)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="1000"
                          value={settings.dailyBonus.maxAmount}
                          onChange={(e) => handleSettingChange('dailyBonus', 'maxAmount', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cooldown Period (Hours)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="48"
                          value={settings.dailyBonus.cooldownHours}
                          onChange={(e) => handleSettingChange('dailyBonus', 'cooldownHours', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {/* Streak Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Streak Multipliers</h4>
                        <button
                          onClick={() => handleSettingChange('dailyBonus', 'streakEnabled', !settings.dailyBonus.streakEnabled)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.dailyBonus.streakEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.dailyBonus.streakEnabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(settings.dailyBonus.streakMultipliers).map(([range, multiplier]) => (
                          <div key={range} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{range} days</span>
                            <input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              value={multiplier}
                              onChange={(e) => {
                                const newMultipliers = { ...settings.dailyBonus.streakMultipliers }
                                newMultipliers[range] = parseFloat(e.target.value)
                                handleSettingChange('dailyBonus', 'streakMultipliers', newMultipliers)
                              }}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              disabled={!settings.dailyBonus.streakEnabled}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bonus Conditions */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Bonus Conditions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Require Quiz Completion</span>
                        <button
                          onClick={() => handleSettingChange('dailyBonus', 'conditions', {
                            ...settings.dailyBonus.conditions,
                            requireQuiz: !settings.dailyBonus.conditions.requireQuiz
                          })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.dailyBonus.conditions.requireQuiz ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.dailyBonus.conditions.requireQuiz ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Require Deposit</span>
                        <button
                          onClick={() => handleSettingChange('dailyBonus', 'conditions', {
                            ...settings.dailyBonus.conditions,
                            requireDeposit: !settings.dailyBonus.conditions.requireDeposit
                          })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.dailyBonus.conditions.requireDeposit ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.dailyBonus.conditions.requireDeposit ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Require Verification</span>
                        <button
                          onClick={() => handleSettingChange('dailyBonus', 'conditions', {
                            ...settings.dailyBonus.conditions,
                            requireVerification: !settings.dailyBonus.conditions.requireVerification
                          })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            settings.dailyBonus.conditions.requireVerification ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              settings.dailyBonus.conditions.requireVerification ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Level Required
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={settings.dailyBonus.conditions.minLevel}
                          onChange={(e) => handleSettingChange('dailyBonus', 'conditions', {
                            ...settings.dailyBonus.conditions,
                            minLevel: parseInt(e.target.value)
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Mode Warning */}
              {settings.features.maintenanceMode && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <h4 className="font-medium mb-1">Maintenance Mode Active</h4>
                      <p>Users will see the maintenance message and won't be able to use the app normally.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Layout Settings Tab */}
          {activeTab === 'layout' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Monitor className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Layout Settings</h2>
              </div>

              <div className="space-y-6">
                {Object.entries(settings.layout).map(([key, value]) => {
                  const layoutInfo = {
                    showHeader: { label: 'Show Header', description: 'Display the top header with user info' },
                    showBottomNav: { label: 'Show Bottom Navigation', description: 'Display bottom navigation bar' },
                    showSidebar: { label: 'Show Sidebar', description: 'Display sidebar navigation' },
                    compactMode: { label: 'Compact Mode', description: 'Use compact layout for smaller screens' },
                    showAnimations: { label: 'Show Animations', description: 'Enable UI animations and transitions' },
                    showSounds: { label: 'Enable Sounds', description: 'Play sounds for interactions' }
                  }
                  
                  const info = layoutInfo[key]
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{info.label}</h3>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('layout', key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Content Management Tab */}
          {activeTab === 'content' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Content Management</h2>
              </div>

              <div className="space-y-6">
                {/* App Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">App Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                      <input
                        type="text"
                        value={settings.appConfig.appName}
                        onChange={(e) => handleSettingChange('appConfig', 'appName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">App Version</label>
                      <input
                        type="text"
                        value={settings.appConfig.appVersion}
                        onChange={(e) => handleSettingChange('appConfig', 'appVersion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                    <textarea
                      value={settings.appConfig.welcomeMessage}
                      onChange={(e) => handleSettingChange('appConfig', 'welcomeMessage', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                    <textarea
                      value={settings.appConfig.maintenanceMessage}
                      onChange={(e) => handleSettingChange('appConfig', 'maintenanceMessage', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Page Titles */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Page Titles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(settings.content).map(([key, value]) => {
                      const pageInfo = {
                        homePageTitle: 'Home Page Title',
                        homePageSubtitle: 'Home Page Subtitle',
                        quizPageTitle: 'Quiz Page Title',
                        tournamentPageTitle: 'Tournament Page Title',
                        earnPageTitle: 'Earn Page Title',
                        profilePageTitle: 'Profile Page Title'
                      }
                      
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{pageInfo[key]}</label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleSettingChange('content', key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Support Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Support Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={settings.appConfig.supportEmail}
                        onChange={(e) => handleSettingChange('appConfig', 'supportEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Telegram</label>
                      <input
                        type="text"
                        value={settings.appConfig.supportTelegram}
                        onChange={(e) => handleSettingChange('appConfig', 'supportTelegram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              </div>

              <div className="space-y-6">
                {Object.entries(settings.security).map(([key, value]) => {
                  const securityInfo = {
                    maxDailyQuizzes: { label: 'Max Daily Quizzes', type: 'number', description: 'Maximum quizzes per day per user' },
                    maxHourlyQuizzes: { label: 'Max Hourly Quizzes', type: 'number', description: 'Maximum quizzes per hour per user' },
                    minTimeBetweenQuizzes: { label: 'Min Time Between Quizzes (ms)', type: 'number', description: 'Minimum time between quiz attempts' },
                    suspiciousScoreThreshold: { label: 'Suspicious Score Threshold', type: 'number', description: 'Score threshold for fraud detection' },
                    enableFraudDetection: { label: 'Enable Fraud Detection', type: 'boolean', description: 'Enable automatic fraud detection' },
                    enableRateLimiting: { label: 'Enable Rate Limiting', type: 'boolean', description: 'Enable API rate limiting' }
                  }
                  
                  const info = securityInfo[key]
                  
                  if (info.type === 'boolean') {
                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{info.label}</h3>
                          <p className="text-sm text-gray-500">{info.description}</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('security', key, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            value ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    )
                  } else {
                    return (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{info.label}</label>
                        <input
                          type={info.type}
                          value={value}
                          onChange={(e) => handleSettingChange('security', key, info.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
              </div>

              <div className="space-y-6">
                {Object.entries(settings.notifications).map(([key, value]) => {
                  const notificationInfo = {
                    enablePushNotifications: { label: 'Enable Push Notifications', description: 'Send push notifications to users' },
                    enableEmailNotifications: { label: 'Enable Email Notifications', description: 'Send email notifications to users' },
                    enableSMSNotifications: { label: 'Enable SMS Notifications', description: 'Send SMS notifications to users' },
                    notificationSound: { label: 'Notification Sound', description: 'Play sound for notifications' },
                    notificationVibration: { label: 'Notification Vibration', description: 'Vibrate device for notifications' }
                  }
                  
                  const info = notificationInfo[key]
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{info.label}</h3>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          value ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminAppSettings
