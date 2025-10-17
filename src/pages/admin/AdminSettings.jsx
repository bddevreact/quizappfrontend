import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Bell, 
  Shield, 
  Database,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      appName: 'CryptoQuiz',
      appVersion: '1.0.0',
      maintenanceMode: false,
      maintenanceMessage: 'We are currently under maintenance. Please check back later.',
      defaultLanguage: 'en',
      timezone: 'UTC',
      currency: 'USDT',
      decimalPlaces: 2
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      enableCaptcha: false,
      enableRateLimit: true,
      rateLimitWindow: 15,
      rateLimitMax: 100,
      enableAuditLog: true,
      enableIPWhitelist: false,
      allowedIPs: []
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableSMSNotifications: false,
      emailFrom: 'noreply@cryptoquiz.com',
      smsProvider: 'twilio',
      notificationRetention: 30
    },
    api: {
      enableAPI: true,
      apiVersion: 'v1',
      enableCORS: true,
      corsOrigins: ['*'],
      enableSwagger: true,
      apiRateLimit: 1000,
      apiRateWindow: 60
    },
    database: {
      enableBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      enableReplication: false,
      enableSharding: false,
      connectionPoolSize: 10
    },
    features: {
      enableQuiz: true,
      enableTournaments: true,
      enableReferrals: true,
      enableTasks: true,
      enableAchievements: true,
      enableLeaderboard: true,
      enableChat: false,
      enableSocialLogin: true,
      enableTelegramIntegration: true
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      // const response = await fetch('/api/admin/settings');
      // const data = await response.json();
      // setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Mock save - replace with actual API call
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      setHasChanges(false);
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (category, key, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    handleSettingChange(category, key, array);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'api', name: 'API', icon: Globe },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'features', name: 'Features', icon: CheckCircle }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-gray-400">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={!hasChanges || saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  value={settings.general.appName}
                  onChange={(e) => handleSettingChange('general', 'appName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">App Version</label>
                <input
                  type="text"
                  value={settings.general.appVersion}
                  onChange={(e) => handleSettingChange('general', 'appVersion', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Default Language</label>
                <select
                  value={settings.general.defaultLanguage}
                  onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Timezone</label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Currency</label>
                <select
                  value={settings.general.currency}
                  onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Decimal Places</label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={settings.general.decimalPlaces}
                  onChange={(e) => handleSettingChange('general', 'decimalPlaces', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.general.maintenanceMode}
                onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="maintenanceMode" className="text-white text-sm">Enable Maintenance Mode</label>
            </div>
            
            {settings.general.maintenanceMode && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">Maintenance Message</label>
                <textarea
                  value={settings.general.maintenanceMessage}
                  onChange={(e) => handleSettingChange('general', 'maintenanceMessage', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Password Min Length</label>
                <input
                  type="number"
                  min="6"
                  max="32"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Rate Limit Window (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.security.rateLimitWindow}
                  onChange={(e) => handleSettingChange('security', 'rateLimitWindow', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Rate Limit Max Requests</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.security.rateLimitMax}
                  onChange={(e) => handleSettingChange('security', 'rateLimitMax', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Notification Retention (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.notifications.notificationRetention}
                  onChange={(e) => handleSettingChange('notifications', 'notificationRetention', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableTwoFactor"
                  checked={settings.security.enableTwoFactor}
                  onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableTwoFactor" className="text-white text-sm">Enable Two-Factor Authentication</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableCaptcha"
                  checked={settings.security.enableCaptcha}
                  onChange={(e) => handleSettingChange('security', 'enableCaptcha', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableCaptcha" className="text-white text-sm">Enable CAPTCHA</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableRateLimit"
                  checked={settings.security.enableRateLimit}
                  onChange={(e) => handleSettingChange('security', 'enableRateLimit', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableRateLimit" className="text-white text-sm">Enable Rate Limiting</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableAuditLog"
                  checked={settings.security.enableAuditLog}
                  onChange={(e) => handleSettingChange('security', 'enableAuditLog', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableAuditLog" className="text-white text-sm">Enable Audit Logging</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableIPWhitelist"
                  checked={settings.security.enableIPWhitelist}
                  onChange={(e) => handleSettingChange('security', 'enableIPWhitelist', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableIPWhitelist" className="text-white text-sm">Enable IP Whitelist</label>
              </div>
            </div>
            
            {settings.security.enableIPWhitelist && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">Allowed IPs (comma-separated)</label>
                <textarea
                  value={settings.security.allowedIPs.join(', ')}
                  onChange={(e) => handleArrayChange('security', 'allowedIPs', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
                  placeholder="192.168.1.1, 10.0.0.1, 172.16.0.1"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email From Address</label>
                <input
                  type="email"
                  value={settings.notifications.emailFrom}
                  onChange={(e) => handleSettingChange('notifications', 'emailFrom', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">SMS Provider</label>
                <select
                  value={settings.notifications.smsProvider}
                  onChange={(e) => handleSettingChange('notifications', 'smsProvider', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="twilio">Twilio</option>
                  <option value="aws">AWS SNS</option>
                  <option value="firebase">Firebase</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableEmailNotifications"
                  checked={settings.notifications.enableEmailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'enableEmailNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableEmailNotifications" className="text-white text-sm">Enable Email Notifications</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enablePushNotifications"
                  checked={settings.notifications.enablePushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'enablePushNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enablePushNotifications" className="text-white text-sm">Enable Push Notifications</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableSMSNotifications"
                  checked={settings.notifications.enableSMSNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'enableSMSNotifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableSMSNotifications" className="text-white text-sm">Enable SMS Notifications</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">API Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">API Version</label>
                <select
                  value={settings.api.apiVersion}
                  onChange={(e) => handleSettingChange('api', 'apiVersion', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="v1">v1</option>
                  <option value="v2">v2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">API Rate Limit</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={settings.api.apiRateLimit}
                  onChange={(e) => handleSettingChange('api', 'apiRateLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">API Rate Window (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="3600"
                  value={settings.api.apiRateWindow}
                  onChange={(e) => handleSettingChange('api', 'apiRateWindow', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">CORS Origins (comma-separated)</label>
              <textarea
                value={settings.api.corsOrigins.join(', ')}
                onChange={(e) => handleArrayChange('api', 'corsOrigins', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                rows="3"
                placeholder="https://example.com, https://app.example.com"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableAPI"
                  checked={settings.api.enableAPI}
                  onChange={(e) => handleSettingChange('api', 'enableAPI', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableAPI" className="text-white text-sm">Enable API</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableCORS"
                  checked={settings.api.enableCORS}
                  onChange={(e) => handleSettingChange('api', 'enableCORS', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableCORS" className="text-white text-sm">Enable CORS</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableSwagger"
                  checked={settings.api.enableSwagger}
                  onChange={(e) => handleSettingChange('api', 'enableSwagger', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableSwagger" className="text-white text-sm">Enable Swagger Documentation</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Database Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Backup Frequency</label>
                <select
                  value={settings.database.backupFrequency}
                  onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Backup Retention (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.database.backupRetention}
                  onChange={(e) => handleSettingChange('database', 'backupRetention', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Connection Pool Size</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.database.connectionPoolSize}
                  onChange={(e) => handleSettingChange('database', 'connectionPoolSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableBackup"
                  checked={settings.database.enableBackup}
                  onChange={(e) => handleSettingChange('database', 'enableBackup', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableBackup" className="text-white text-sm">Enable Automatic Backups</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableReplication"
                  checked={settings.database.enableReplication}
                  onChange={(e) => handleSettingChange('database', 'enableReplication', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableReplication" className="text-white text-sm">Enable Database Replication</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableSharding"
                  checked={settings.database.enableSharding}
                  onChange={(e) => handleSettingChange('database', 'enableSharding', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableSharding" className="text-white text-sm">Enable Database Sharding</label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Toggles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableQuiz"
                    checked={settings.features.enableQuiz}
                    onChange={(e) => handleSettingChange('features', 'enableQuiz', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableQuiz" className="text-white text-sm">Enable Quiz System</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableTournaments"
                    checked={settings.features.enableTournaments}
                    onChange={(e) => handleSettingChange('features', 'enableTournaments', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableTournaments" className="text-white text-sm">Enable Tournaments</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableReferrals"
                    checked={settings.features.enableReferrals}
                    onChange={(e) => handleSettingChange('features', 'enableReferrals', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableReferrals" className="text-white text-sm">Enable Referral System</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableTasks"
                    checked={settings.features.enableTasks}
                    onChange={(e) => handleSettingChange('features', 'enableTasks', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableTasks" className="text-white text-sm">Enable Tasks</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableAchievements"
                    checked={settings.features.enableAchievements}
                    onChange={(e) => handleSettingChange('features', 'enableAchievements', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableAchievements" className="text-white text-sm">Enable Achievements</label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableLeaderboard"
                    checked={settings.features.enableLeaderboard}
                    onChange={(e) => handleSettingChange('features', 'enableLeaderboard', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableLeaderboard" className="text-white text-sm">Enable Leaderboard</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableChat"
                    checked={settings.features.enableChat}
                    onChange={(e) => handleSettingChange('features', 'enableChat', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableChat" className="text-white text-sm">Enable Chat</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableSocialLogin"
                    checked={settings.features.enableSocialLogin}
                    onChange={(e) => handleSettingChange('features', 'enableSocialLogin', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableSocialLogin" className="text-white text-sm">Enable Social Login</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableTelegramIntegration"
                    checked={settings.features.enableTelegramIntegration}
                    onChange={(e) => handleSettingChange('features', 'enableTelegramIntegration', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableTelegramIntegration" className="text-white text-sm">Enable Telegram Integration</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
