import React, { useState, useEffect } from 'react'
import { Copy, Users, TrendingUp, Gift, Share2, CheckCircle, AlertCircle } from 'lucide-react'
import referralService from '../services/referralService'
import dataService from '../services/dataService'

const ReferralCard = () => {
  const [referralStats, setReferralStats] = useState(null)
  const [referralHistory, setReferralHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get referral stats
      const statsResult = await referralService.getUserReferralStats(dataService.getCurrentUserId())
      if (statsResult.success) {
        setReferralStats(statsResult.stats)
      }

      // Get referral history
      const historyResult = await referralService.getReferralHistory(dataService.getCurrentUserId(), 10)
      if (historyResult.success) {
        setReferralHistory(historyResult.history)
      }

    } catch (err) {
      console.error('Error loading referral data:', err)
      setError('Failed to load referral data')
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    try {
      if (referralStats && referralStats.referralLink) {
        await navigator.clipboard.writeText(referralStats.referralLink)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (err) {
      console.error('Error copying referral link:', err)
    }
  }

  const shareReferralLink = async () => {
    try {
      if (referralStats && referralStats.referralLink) {
        if (navigator.share) {
          await navigator.share({
            title: 'Join Quizly and Earn Crypto!',
            text: 'Join me on Quizly - Answer crypto quiz questions and earn USDT rewards!',
            url: referralStats.referralLink
          })
        } else {
          // Fallback to copy
          copyReferralLink()
        }
      }
    } catch (err) {
      console.error('Error sharing referral link:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded-lg mb-4"></div>
          <div className="h-4 bg-white/20 rounded-lg mb-2"></div>
          <div className="h-4 bg-white/20 rounded-lg mb-4"></div>
          <div className="h-10 bg-white/20 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Referral Error</h3>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={loadReferralData}
          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/30 rounded-lg">
          <Users className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Invite Friends</h3>
          <p className="text-blue-300 text-sm">Earn USDT for every friend you invite</p>
        </div>
      </div>

      {/* Referral Stats */}
      {referralStats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{referralStats.totalReferrals}</div>
            <div className="text-sm text-gray-300">Total Invites</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">${referralStats.totalEarnings}</div>
            <div className="text-sm text-gray-300">Total Earnings</div>
          </div>
        </div>
      )}

      {/* Referral Link */}
      {referralStats && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Referral Link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 rounded-lg p-3 border border-white/20">
              <code className="text-blue-300 text-sm break-all">
                {referralStats.referralLink}
              </code>
            </div>
            <button
              onClick={copyReferralLink}
              className={`px-4 py-3 rounded-lg transition-colors ${
                copySuccess
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
              }`}
            >
              {copySuccess ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={shareReferralLink}
              className="px-4 py-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Rewards Info */}
      <div className="bg-white/10 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-yellow-400" />
          <h4 className="font-semibold text-white">Referral Rewards</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">You earn:</span>
            <span className="text-green-400 font-semibold">${referralStats?.referralReward || 10} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Friend earns:</span>
            <span className="text-blue-400 font-semibold">${referralStats?.referredReward || 5} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Max referrals:</span>
            <span className="text-purple-400 font-semibold">{referralStats?.maxReferrals || 50}</span>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      {referralHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Recent Referrals
          </h4>
          <div className="space-y-2">
            {referralHistory.slice(0, 5).map((referral, index) => (
              <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                <div>
                  <div className="text-white text-sm font-medium">
                    {referral.referredUsername || `User ${referral.referredUserId}`}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    referral.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    ${referral.rewardAmount}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {referral.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <h4 className="font-semibold text-blue-300 mb-2">How it works:</h4>
        <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
          <li>Share your referral link with friends</li>
          <li>Friends join using your link</li>
          <li>You both earn USDT rewards automatically</li>
          <li>Track your earnings in real-time</li>
        </ol>
      </div>
    </div>
  )
}

export default ReferralCard