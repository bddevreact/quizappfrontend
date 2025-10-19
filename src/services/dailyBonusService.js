import dataService from './dataService'
import appSettingsService from './appSettingsService'
import telegramWebAppService from './telegramWebAppService'

class DailyBonusService {
  constructor() {
    // No localStorage needed - using MongoDB database only
  }

  // Check if daily bonus is available
  async checkDailyBonusAvailability() {
    try {
      // Get daily bonus settings from admin
      const settings = await appSettingsService.getAppSettings()
      
      // If daily bonus is disabled by admin, return null
      if (!settings?.features?.dailyBonus) {
        return null
      }

      // Get user data to check last claim
      let userData = telegramWebAppService.getUserData()
      if (!userData) {
        userData = dataService.getUserData()
      }

      const today = new Date().toDateString()
      const lastClaimDate = userData?.lastBonusClaim ? new Date(userData.lastBonusClaim).toDateString() : null
      
      // Check if user already claimed today
      if (lastClaimDate === today) {
        const dailyBonusSettings = await appSettingsService.getDailyBonusSettings()
        return {
          available: false,
          reward: dailyBonusSettings.amount || 1.0,
          cooldown: this.getCooldownTime(),
          streak: this.getCurrentStreak(),
          nextAvailable: this.getNextAvailableTime()
        }
      }

      // Calculate streak bonus
      const streak = this.getCurrentStreak()
      const dailyBonusSettings = await appSettingsService.getDailyBonusSettings()
      const baseReward = dailyBonusSettings.amount || 1.0
      const streakMultiplier = this.getStreakMultiplier(streak)
      const totalReward = baseReward * streakMultiplier

      return {
        available: true,
        reward: totalReward,
        baseReward: baseReward,
        streakMultiplier: streakMultiplier,
        streak: streak,
        cooldown: null,
        nextAvailable: null
      }
    } catch (error) {
      console.error('Error checking daily bonus availability:', error)
      return null
    }
  }

  // Claim daily bonus
  async claimDailyBonus() {
    try {
      const bonusInfo = await this.checkDailyBonusAvailability()
      
      if (!bonusInfo || !bonusInfo.available) {
        return {
          success: false,
          message: 'Daily bonus is not available'
        }
      }

      // Get user data - prioritize Telegram user data
      let userData = telegramWebAppService.getUserData()
      if (!userData) {
        userData = dataService.getUserData()
      }
      
      if (!userData) {
        return {
          success: false,
          message: 'User data not found. Please refresh and try again.'
        }
      }

      console.log('🎁 Claiming daily bonus for user:', userData)

      // Update user balance
      const newBalance = (userData.availableBalance || 0) + bonusInfo.reward
      const newPlayableBalance = (userData.playableBalance || 0) + bonusInfo.reward
      const newTotalEarned = (userData.totalEarned || 0) + bonusInfo.reward
      const newStreak = bonusInfo.streak + 1

      const updatedUserData = {
        ...userData,
        availableBalance: newBalance,
        playableBalance: newPlayableBalance,
        totalEarned: newTotalEarned,
        streak: newStreak,
        lastBonusClaim: new Date().toISOString()
      }

      // Update user data in MongoDB database
      try {
        await dataService.updateUserData(updatedUserData)
        console.log('✅ Updated user data in MongoDB database')
      } catch (error) {
        console.error('❌ Failed to update user data in database:', error.message)
        throw new Error(`Failed to update user data: ${error.message}`)
      }

      console.log('🎁 Daily bonus claimed - Updated balance:', newBalance)

      // Add transaction record to MongoDB database
      try {
        await dataService.addTransaction({
          type: 'daily_bonus',
          amount: bonusInfo.reward,
          status: 'completed',
          txHash: `DailyBonus_${Date.now()}`,
          timestamp: new Date().toISOString(),
          details: {
            streak: newStreak,
            baseReward: bonusInfo.baseReward,
            streakMultiplier: bonusInfo.streakMultiplier,
            totalReward: bonusInfo.reward
          }
        })
        console.log('✅ Transaction record added to MongoDB')
      } catch (error) {
        console.error('❌ Failed to add transaction record:', error.message)
        throw new Error(`Failed to add transaction: ${error.message}`)
      }

      // Add activity to MongoDB database
      try {
        await dataService.addActivity({
          type: 'daily_bonus_claimed',
          title: 'Daily Bonus Claimed!',
          description: `Earned ${bonusInfo.reward.toFixed(2)} USDT (${newStreak} day streak)`,
          time: 'Just now',
          icon: '🎁',
          reward: bonusInfo.reward
        })
        console.log('✅ Activity record added to MongoDB')
      } catch (error) {
        console.error('❌ Failed to add activity record:', error.message)
        throw new Error(`Failed to add activity: ${error.message}`)
      }

      // Mark as claimed (stored in database via user data update)
      console.log('Daily bonus claimed successfully')

      return {
        success: true,
        message: `Daily bonus claimed! +${bonusInfo.reward.toFixed(2)} USDT`,
        reward: bonusInfo.reward,
        streak: newStreak,
        newBalance: newBalance
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error)
      return {
        success: false,
        message: `Error claiming daily bonus: ${error.message || 'Unknown error'}`
      }
    }
  }

  // Get current streak from database
  getCurrentStreak() {
    try {
      // Prioritize Telegram user data
      let userData = telegramWebAppService.getUserData()
      if (!userData) {
        userData = dataService.getUserData()
      }
      return userData?.streak || 0
    } catch (error) {
      console.log('⚠️ Error getting streak, using default:', error)
      return 0
    }
  }

  // Get streak multiplier
  getStreakMultiplier(streak) {
    if (streak >= 30) return 3.0      // 30+ days = 3x
    if (streak >= 14) return 2.5      // 14+ days = 2.5x
    if (streak >= 7) return 2.0       // 7+ days = 2x
    if (streak >= 3) return 1.5       // 3+ days = 1.5x
    return 1.0                        // 1-2 days = 1x
  }

  // Get cooldown time until next bonus
  getCooldownTime() {
    try {
      // Prioritize Telegram user data
      let userData = telegramWebAppService.getUserData()
      if (!userData) {
        userData = dataService.getUserData()
      }
      
      const lastClaim = userData?.lastBonusClaim
      
      if (!lastClaim) return null
      
      const now = new Date()
      const lastClaimDate = new Date(lastClaim)
      const tomorrow = new Date(lastClaimDate)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      if (diff <= 0) return null
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    } catch (error) {
      console.log('⚠️ Error getting cooldown time:', error)
      return null
    }
  }

  // Get next available time
  getNextAvailableTime() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow.toISOString()
  }

  // Get total claimed amount
  getTotalClaimed() {
    try {
      const bonusData = localStorage.getItem(this.storageKey)
      if (bonusData) {
        const data = JSON.parse(bonusData)
        return data.totalClaimed || 0
      }
      return 0
    } catch (error) {
      return 0
    }
  }

  // Get daily bonus statistics
  async getDailyBonusStats() {
    try {
      const streak = this.getCurrentStreak()
      const totalClaimed = this.getTotalClaimed()
      const settings = await appSettingsService.getAppSettings()
      const baseReward = settings?.dailyBonus?.amount || 1.0
      const currentMultiplier = this.getStreakMultiplier(streak)
      
      return {
        streak: streak,
        totalClaimed: totalClaimed,
        baseReward: baseReward,
        currentMultiplier: currentMultiplier,
        nextReward: baseReward * currentMultiplier,
        isEnabled: settings?.features?.dailyBonus || false,
        cooldown: this.getCooldownTime()
      }
    } catch (error) {
      console.error('Error getting daily bonus stats:', error)
      return {
        streak: 0,
        totalClaimed: 0,
        baseReward: 1.0,
        currentMultiplier: 1.0,
        nextReward: 1.0,
        isEnabled: false,
        cooldown: '00:00:00'
      }
    }
  }

  // Reset streak (admin function)
  async resetStreak(userId) {
    try {
      localStorage.removeItem(this.lastClaimKey)
      localStorage.removeItem(this.storageKey)
      
      // Update user data
      const userData = dataService.getUserData()
      if (userData) {
        await dataService.updateUserData({
          ...userData,
          streak: 0,
          lastBonusClaim: null
        })
      }

      return {
        success: true,
        message: 'Daily bonus streak reset successfully'
      }
    } catch (error) {
      console.error('Error resetting streak:', error)
      return {
        success: false,
        message: 'Error resetting streak'
      }
    }
  }

  // Get all users' daily bonus data (admin function)
  async getAllUsersDailyBonusData() {
    try {
      // This would typically fetch from backend
      // For now, return mock data
      return {
        totalUsers: 150,
        activeUsers: 45,
        totalClaimsToday: 23,
        totalRewardsDistributed: 45.50,
        averageStreak: 3.2,
        topStreak: 15
      }
    } catch (error) {
      console.error('Error getting all users daily bonus data:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalClaimsToday: 0,
        totalRewardsDistributed: 0,
        averageStreak: 0,
        topStreak: 0
      }
    }
  }
}

export default new DailyBonusService()
