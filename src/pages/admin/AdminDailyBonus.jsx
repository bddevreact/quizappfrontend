import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Settings, 
  Save, 
  RefreshCw, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  Award,
  BarChart3,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import dailyBonusService from '../../services/dailyBonusService';
import appSettingsService from '../../services/appSettingsService';

const AdminDailyBonus = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Daily Bonus Settings
    enabled: true,
    baseAmount: 1.0,
    maxAmount: 10.0,
    cooldownHours: 24,
    
    // Streak Settings
    streakEnabled: true,
    streakMultipliers: {
      '1-2': 1.0,
      '3-6': 1.5,
      '7-13': 2.0,
      '14-29': 2.5,
      '30+': 3.0
    },
    
    // Bonus Conditions
    conditions: {
      requireQuiz: false,
      requireDeposit: false,
      requireVerification: false,
      minLevel: 1,
      maxClaimsPerDay: 1
    },
    
    // Notification Settings
    notifications: {
      enabled: true,
      reminderHours: 2,
      streakMilestone: true
    }
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalClaimsToday: 0,
    totalRewardsDistributed: 0,
    averageStreak: 0,
    topStreak: 0,
    totalClaimsThisWeek: 0,
    totalClaimsThisMonth: 0
  });

  const [recentClaims, setRecentClaims] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load current settings
      const currentSettings = await appSettingsService.getAppSettings();
      if (currentSettings?.dailyBonus) {
        setSettings(prev => ({
          ...prev,
          ...currentSettings.dailyBonus
        }));
      }
      
      // Load statistics
      const bonusStats = await dailyBonusService.getAllUsersDailyBonusData();
      setStats(bonusStats);
      
      // Load recent claims (mock data for now)
      setRecentClaims([
        {
          id: 1,
          userId: 'user123',
          username: 'crypto_trader',
          amount: 2.5,
          streak: 5,
          timestamp: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          userId: 'user456',
          username: 'quiz_master',
          amount: 1.0,
          streak: 1,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'completed'
        },
        {
          id: 3,
          userId: 'user789',
          username: 'daily_player',
          amount: 3.0,
          streak: 15,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'completed'
        }
      ]);
      
    } catch (error) {
      console.error('Error loading daily bonus data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Update app settings
      await appSettingsService.updateSetting('dailyBonus', settings);
      
      // Show success message
      alert('Daily bonus settings saved successfully!');
      
    } catch (error) {
      console.error('Error saving daily bonus settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (feature) => {
    setSettings(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (parentKey, childKey, value) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  const resetAllStreaks = async () => {
    if (confirm('Are you sure you want to reset all user streaks? This action cannot be undone.')) {
      try {
        // This would typically call a backend API
        alert('All user streaks have been reset.');
        await loadData();
      } catch (error) {
        console.error('Error resetting streaks:', error);
        alert('Error resetting streaks. Please try again.');
      }
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'User ID', 'Username', 'Amount', 'Streak', 'Status'],
      ...recentClaims.map(claim => [
        new Date(claim.timestamp).toLocaleDateString(),
        claim.userId,
        claim.username,
        claim.amount,
        claim.streak,
        claim.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_bonus_claims.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStreakMultiplierText = (streak) => {
    const multipliers = settings.streakMultipliers;
    if (streak >= 30) return `${multipliers['30+']}x (30+ days)`;
    if (streak >= 14) return `${multipliers['14-29']}x (14-29 days)`;
    if (streak >= 7) return `${multipliers['7-13']}x (7-13 days)`;
    if (streak >= 3) return `${multipliers['3-6']}x (3-6 days)`;
    return `${multipliers['1-2']}x (1-2 days)`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daily Bonus Management</h1>
              <p className="text-gray-600">Configure daily bonus settings and monitor user activity</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Data
              </button>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Claims Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClaimsToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rewards Distributed</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRewardsDistributed.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageStreak.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Daily Bonus Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Enable Daily Bonus</h4>
                  <p className="text-sm text-gray-500">Allow users to claim daily bonuses</p>
                </div>
                <button
                  onClick={() => toggleFeature('enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Base Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Bonus Amount (USDT)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={settings.baseAmount}
                  onChange={(e) => updateSetting('baseAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Bonus Amount (USDT)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="1000"
                  value={settings.maxAmount}
                  onChange={(e) => updateSetting('maxAmount', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Cooldown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooldown Period (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={settings.cooldownHours}
                  onChange={(e) => updateSetting('cooldownHours', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Streak Multipliers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Streak Multipliers</h4>
                  <button
                    onClick={() => toggleFeature('streakEnabled')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.streakEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.streakEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(settings.streakMultipliers).map(([range, multiplier]) => (
                    <div key={range} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{range} days</span>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={multiplier}
                        onChange={(e) => updateNestedSetting('streakMultipliers', range, parseFloat(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        disabled={!settings.streakEnabled}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus Conditions */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Bonus Conditions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Require Quiz Completion</span>
                    <button
                      onClick={() => updateNestedSetting('conditions', 'requireQuiz', !settings.conditions.requireQuiz)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.conditions.requireQuiz ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.conditions.requireQuiz ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Require Deposit</span>
                    <button
                      onClick={() => updateNestedSetting('conditions', 'requireDeposit', !settings.conditions.requireDeposit)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.conditions.requireDeposit ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.conditions.requireDeposit ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Require Verification</span>
                    <button
                      onClick={() => updateNestedSetting('conditions', 'requireVerification', !settings.conditions.requireVerification)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings.conditions.requireVerification ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings.conditions.requireVerification ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Claims</h3>
                <button
                  onClick={resetAllStreaks}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Reset All Streaks
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Gift className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">@{claim.username}</div>
                        <div className="text-xs text-gray-500">
                          {getStreakMultiplierText(claim.streak)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        +${claim.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(claim.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDailyBonus;