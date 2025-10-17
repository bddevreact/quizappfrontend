import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, DollarSign, Settings, RefreshCw, CheckCircle, XCircle, Clock, BarChart3, Gift } from 'lucide-react'
import dataService from '../../services/dataService'
import referralService from '../../services/referralService'

const AdminReferrals = () => {
  const [referralStats, setReferralStats] = useState({})
  const [referralSettings, setReferralSettings] = useState({})
  const [referralLeaderboard, setReferralLeaderboard] = useState([])
  const [allReferrals, setAllReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      setLoading(true)

      // Load referral settings
      const settings = referralService.getReferralSettings()
      setReferralSettings(settings)

      // Load leaderboard
      const leaderboardResult = await referralService.getReferralLeaderboard(20)
      if (leaderboardResult.success) {
        setReferralLeaderboard(leaderboardResult.leaderboard)
      }

      // Mock data for admin overview
      const mockStats = {
        totalReferrals: Math.floor(Math.random() * 1000) + 500,
        successfulReferrals: Math.floor(Math.random() * 800) + 400,
        pendingReferrals: Math.floor(Math.random() * 100) + 50,
        totalRewardsPaid: Math.floor(Math.random() * 10000) + 5000,
        averageReferralsPerUser: Math.floor(Math.random() * 10) + 3,
        topReferrer: {
          username: 'TopUser123',
          totalReferrals: Math.floor(Math.random() * 100) + 50,
          totalEarnings: Math.floor(Math.random() * 1000) + 500
        }
      }
      setReferralStats(mockStats)

      // Mock data for all referrals
      const mockAllReferrals = Array.from({ length: 50 }, (_, index) => ({
        id: `ref_${index + 1}`,
        referrerId: `user_${Math.floor(Math.random() * 100) + 1}`,
        referrerUsername: `User${Math.floor(Math.random() * 100) + 1}`,
        referredId: `referred_${index + 1}`,
        referredUsername: `ReferredUser${index + 1}`,
        rewardAmount: 10,
        referredRewardAmount: 5,
        status: ['pending', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
        bonusSent: Math.random() > 0.5,
        createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
        processedAt: Math.random() > 0.5 ? new Date(Date.now() - (index * 24 * 60 * 60 * 1000) + 3600000).toISOString() : null
      }))
      setAllReferrals(mockAllReferrals)

    } catch (error) {
      console.error('Error loading referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processPendingReferrals = async () => {
    try {
      setProcessing(true)
      // TODO: Call backend API to process pending referrals
      console.log('Processing pending referrals...')
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reload data
      await loadReferralData()
      
      alert('Pending referrals processed successfully!')
    } catch (error) {
      console.error('Error processing referrals:', error)
      alert('Error processing referrals')
    } finally {
      setProcessing(false)
    }
  }

  const updateReferralSettings = async (newSettings) => {
    try {
      const result = referralService.updateReferralSettings(newSettings)
      if (result.success) {
        setReferralSettings(result.settings)
        alert('Referral settings updated successfully!')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Error updating settings')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-white/20 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-white/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Referral Management</h1>
            <p className="text-blue-300">Manage referral system and track performance</p>
          </div>
          <button
            onClick={processPendingReferrals}
            disabled={processing}
            className="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {processing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {processing ? 'Processing...' : 'Process Pending'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
            { id: 'referrals', label: 'All Referrals', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-500/30 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-sm text-blue-300">Total Referrals</span>
                </div>
                <div className="text-3xl font-bold text-white">{referralStats.totalReferrals}</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-sm text-green-300">Successful</span>
                </div>
                <div className="text-3xl font-bold text-white">{referralStats.successfulReferrals}</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <span className="text-sm text-yellow-300">Pending</span>
                </div>
                <div className="text-3xl font-bold text-white">{referralStats.pendingReferrals}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-purple-300">Rewards Paid</span>
                </div>
                <div className="text-3xl font-bold text-white">${referralStats.totalRewardsPaid}</div>
              </div>
            </div>

            {/* Top Referrer */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6 text-yellow-400" />
                Top Referrer
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">{referralStats.topReferrer?.username}</div>
                  <div className="text-gray-300">Most successful referrer</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">{referralStats.topReferrer?.totalReferrals} referrals</div>
                  <div className="text-gray-300">${referralStats.topReferrer?.totalEarnings} earned</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Referral Leaderboard
            </h3>
            <div className="space-y-3">
              {referralLeaderboard.map((user, index) => (
                <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500/30 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/30 text-gray-400' :
                      index === 2 ? 'bg-orange-500/30 text-orange-400' :
                      'bg-blue-500/30 text-blue-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{user.username || user.userId}</div>
                      <div className="text-gray-400 text-sm">@{user.telegramUsername || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{user.totalReferrals} referrals</div>
                    <div className="text-gray-400 text-sm">${user.totalEarnings} earned</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              All Referrals
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-300 py-3">Referrer</th>
                    <th className="text-left text-gray-300 py-3">Referred User</th>
                    <th className="text-left text-gray-300 py-3">Reward</th>
                    <th className="text-left text-gray-300 py-3">Status</th>
                    <th className="text-left text-gray-300 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allReferrals.slice(0, 20).map((referral) => (
                    <tr key={referral.id} className="border-b border-white/10">
                      <td className="py-3">
                        <div>
                          <div className="text-white font-medium">{referral.referrerUsername}</div>
                          <div className="text-gray-400 text-sm">{referral.referrerId}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="text-white font-medium">{referral.referredUsername}</div>
                          <div className="text-gray-400 text-sm">{referral.referredId}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-green-400 font-semibold">${referral.rewardAmount}</div>
                      </td>
                      <td className="py-3">
                        <div className={`flex items-center gap-2 ${getStatusColor(referral.status)}`}>
                          {getStatusIcon(referral.status)}
                          <span className="capitalize">{referral.status}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              Referral Settings
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Referral Reward (USDT)
                  </label>
                  <input
                    type="number"
                    value={referralSettings.referralReward || 10}
                    onChange={(e) => setReferralSettings({
                      ...referralSettings,
                      referralReward: parseFloat(e.target.value)
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Referred User Reward (USDT)
                  </label>
                  <input
                    type="number"
                    value={referralSettings.referredReward || 5}
                    onChange={(e) => setReferralSettings({
                      ...referralSettings,
                      referredReward: parseFloat(e.target.value)
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Max Referrals Per User
                  </label>
                  <input
                    type="number"
                    value={referralSettings.maxReferralsPerUser || 50}
                    onChange={(e) => setReferralSettings({
                      ...referralSettings,
                      maxReferralsPerUser: parseInt(e.target.value)
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Bot Username
                  </label>
                  <input
                    type="text"
                    value={referralSettings.botUsername || 'quizly_bot'}
                    onChange={(e) => setReferralSettings({
                      ...referralSettings,
                      botUsername: e.target.value
                    })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={() => updateReferralSettings(referralSettings)}
                className="px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReferrals