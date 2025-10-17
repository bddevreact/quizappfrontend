// Referral Service for managing referral links and tracking
import dataService from './dataService'

class ReferralService {
  constructor() {
    this.botUsername = 'quizly_bot' // Telegram bot username
    this.referralReward = 10 // USDT reward for successful referral
    this.referredReward = 5 // USDT reward for being referred
    this.maxReferralsPerUser = 50 // Maximum referrals per user
  }

  // Generate referral link for user
  generateReferralLink(userId) {
    try {
      // Format: bot + userid (e.g., @quizly_bot 12345)
      const referralLink = `@${this.botUsername} ${userId}`
      return referralLink
    } catch (error) {
      console.error('Error generating referral link:', error)
      return null
    }
  }

  // Parse referral link to extract user ID
  parseReferralLink(referralLink) {
    try {
      // Expected format: @quizly_bot 12345
      const pattern = new RegExp(`@${this.botUsername}\\s+(\\d+)`)
      const match = referralLink.match(pattern)
      
      if (match && match[1]) {
        return {
          success: true,
          referrerId: match[1],
          botUsername: this.botUsername
        }
      }
      
      return {
        success: false,
        error: 'Invalid referral link format'
      }
    } catch (error) {
      console.error('Error parsing referral link:', error)
      return {
        success: false,
        error: 'Error parsing referral link'
      }
    }
  }

  // Process referral when new user joins
  async processReferral(newUserId, referralLink) {
    try {
      const parseResult = this.parseReferralLink(referralLink)
      
      if (!parseResult.success) {
        return {
          success: false,
          error: parseResult.error
        }
      }

      const referrerId = parseResult.referrerId

      // Check if referrer exists
      const referrer = await dataService.getUserData(referrerId)
      if (!referrer) {
        return {
          success: false,
          error: 'Referrer not found'
        }
      }

      // Check if user is referring themselves
      if (newUserId === referrerId) {
        return {
          success: false,
          error: 'Cannot refer yourself'
        }
      }

      // Check if user already has a referrer
      const newUser = await dataService.getUserData(newUserId)
      if (newUser && newUser.referrerId) {
        return {
          success: false,
          error: 'User already has a referrer'
        }
      }

      // Check referrer's referral limit
      if (referrer.referralCount >= this.maxReferralsPerUser) {
        return {
          success: false,
          error: 'Referrer has reached maximum referral limit'
        }
      }

      // Process referral
      const referralResult = await this.createReferralRecord({
        referrerId: referrerId,
        referredId: newUserId,
        referralLink: referralLink,
        rewardAmount: this.referralReward,
        referredRewardAmount: this.referredReward
      })

      if (referralResult.success) {
        // Update referrer's referral count
        await this.updateReferrerStats(referrerId, 1)
        
        // Update new user's referrer info
        await this.updateReferredUser(newUserId, referrerId)

        // Send rewards
        await this.sendReferralRewards(referrerId, newUserId)

        return {
          success: true,
          referrerId: referrerId,
          referralReward: this.referralReward,
          referredReward: this.referredReward,
          message: 'Referral processed successfully'
        }
      }

      return referralResult

    } catch (error) {
      console.error('Error processing referral:', error)
      return {
        success: false,
        error: 'Error processing referral'
      }
    }
  }

  // Create referral record
  async createReferralRecord(referralData) {
    try {
      const referral = {
        id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        referrerId: referralData.referrerId,
        referredId: referralData.referredId,
        referralLink: referralData.referralLink,
        rewardAmount: referralData.rewardAmount,
        referredRewardAmount: referralData.referredRewardAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        processedAt: null,
        bonusSent: false
      }

      // TODO: Save to MongoDB when backend is ready
      console.log('Referral record created:', referral)
      
      return {
        success: true,
        referral: referral
      }
    } catch (error) {
      console.error('Error creating referral record:', error)
      return {
        success: false,
        error: 'Error creating referral record'
      }
    }
  }

  // Update referrer statistics
  async updateReferrerStats(referrerId, increment = 1) {
    try {
      // TODO: Update referrer's stats in MongoDB
      console.log(`Updating referrer ${referrerId} stats: +${increment}`)
      
      return {
        success: true,
        message: 'Referrer stats updated'
      }
    } catch (error) {
      console.error('Error updating referrer stats:', error)
      return {
        success: false,
        error: 'Error updating referrer stats'
      }
    }
  }

  // Update referred user
  async updateReferredUser(userId, referrerId) {
    try {
      // TODO: Update user's referrer info in MongoDB
      console.log(`User ${userId} referred by ${referrerId}`)
      
      return {
        success: true,
        message: 'Referred user updated'
      }
    } catch (error) {
      console.error('Error updating referred user:', error)
      return {
        success: false,
        error: 'Error updating referred user'
      }
    }
  }

  // Send referral rewards
  async sendReferralRewards(referrerId, referredId) {
    try {
      // Send reward to referrer
      const referrerReward = await this.sendReward(referrerId, this.referralReward, 'referral_bonus', `Referral bonus for inviting user ${referredId}`)
      
      // Send reward to referred user
      const referredReward = await this.sendReward(referredId, this.referredReward, 'welcome_bonus', `Welcome bonus for joining via referral from user ${referrerId}`)

      return {
        success: true,
        referrerReward: referrerReward,
        referredReward: referredReward,
        message: 'Referral rewards sent successfully'
      }
    } catch (error) {
      console.error('Error sending referral rewards:', error)
      return {
        success: false,
        error: 'Error sending referral rewards'
      }
    }
  }

  // Send reward to user
  async sendReward(userId, amount, type, description) {
    try {
      // TODO: Implement actual reward sending via balance service
      console.log(`Sending ${amount} USDT ${type} to user ${userId}: ${description}`)
      
      return {
        success: true,
        userId: userId,
        amount: amount,
        type: type,
        description: description,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error sending reward:', error)
      return {
        success: false,
        error: 'Error sending reward'
      }
    }
  }

  // Get user's referral statistics
  async getUserReferralStats(userId) {
    try {
      // TODO: Get from MongoDB when backend is ready
      const mockStats = {
        totalReferrals: Math.floor(Math.random() * 20),
        successfulReferrals: Math.floor(Math.random() * 15),
        pendingReferrals: Math.floor(Math.random() * 5),
        totalEarnings: Math.floor(Math.random() * 200),
        referralLink: this.generateReferralLink(userId),
        maxReferrals: this.maxReferralsPerUser,
        referralReward: this.referralReward,
        referredReward: this.referredReward
      }

      return {
        success: true,
        stats: mockStats
      }
    } catch (error) {
      console.error('Error getting referral stats:', error)
      return {
        success: false,
        error: 'Error getting referral stats'
      }
    }
  }

  // Get referral leaderboard
  async getReferralLeaderboard(limit = 10) {
    try {
      // TODO: Get from MongoDB when backend is ready
      const mockLeaderboard = Array.from({ length: limit }, (_, index) => ({
        rank: index + 1,
        userId: `user_${index + 1}`,
        username: `User${index + 1}`,
        totalReferrals: Math.floor(Math.random() * 50) + 1,
        totalEarnings: Math.floor(Math.random() * 500) + 10
      }))

      return {
        success: true,
        leaderboard: mockLeaderboard
      }
    } catch (error) {
      console.error('Error getting referral leaderboard:', error)
      return {
        success: false,
        error: 'Error getting referral leaderboard'
      }
    }
  }

  // Validate referral link
  validateReferralLink(link) {
    try {
      const parseResult = this.parseReferralLink(link)
      return parseResult
    } catch (error) {
      console.error('Error validating referral link:', error)
      return {
        success: false,
        error: 'Error validating referral link'
      }
    }
  }

  // Get referral history for user
  async getReferralHistory(userId, limit = 20) {
    try {
      // TODO: Get from MongoDB when backend is ready
      const mockHistory = Array.from({ length: Math.min(limit, 10) }, (_, index) => ({
        id: `ref_${index + 1}`,
        referredUserId: `referred_${index + 1}`,
        referredUsername: `ReferredUser${index + 1}`,
        rewardAmount: this.referralReward,
        status: index < 7 ? 'completed' : 'pending',
        createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
        completedAt: index < 7 ? new Date(Date.now() - (index * 24 * 60 * 60 * 1000) + 3600000).toISOString() : null
      }))

      return {
        success: true,
        history: mockHistory
      }
    } catch (error) {
      console.error('Error getting referral history:', error)
      return {
        success: false,
        error: 'Error getting referral history'
      }
    }
  }

  // Update referral settings
  updateReferralSettings(settings) {
    try {
      if (settings.referralReward !== undefined) {
        this.referralReward = settings.referralReward
      }
      if (settings.referredReward !== undefined) {
        this.referredReward = settings.referredReward
      }
      if (settings.maxReferralsPerUser !== undefined) {
        this.maxReferralsPerUser = settings.maxReferralsPerUser
      }
      if (settings.botUsername !== undefined) {
        this.botUsername = settings.botUsername
      }

      return {
        success: true,
        settings: {
          referralReward: this.referralReward,
          referredReward: this.referredReward,
          maxReferralsPerUser: this.maxReferralsPerUser,
          botUsername: this.botUsername
        }
      }
    } catch (error) {
      console.error('Error updating referral settings:', error)
      return {
        success: false,
        error: 'Error updating referral settings'
      }
    }
  }

  // Get current referral settings
  getReferralSettings() {
    return {
      referralReward: this.referralReward,
      referredReward: this.referredReward,
      maxReferralsPerUser: this.maxReferralsPerUser,
      botUsername: this.botUsername
    }
  }
}

// Create singleton instance
const referralService = new ReferralService()

export default referralService
