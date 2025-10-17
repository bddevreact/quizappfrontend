// Balance Management Service for Betting-Style Quiz
import dataService from './dataService'
import firebaseStorageService from './firebaseStorage'

class BalanceService {
  constructor() {
    this.minimumBalance = 10.0 // Minimum $10 required
    this.bettingRules = {
      minBet: 0.1,           // Minimum bet per question
      maxBet: 10.0,          // Maximum bet per question
      winRate: 0.4,          // 40% win rate for users
      lossRate: 0.6,         // 60% loss rate for users
      houseEdge: 0.1,        // 10% house edge
      correctAnswerMultiplier: 2.0, // Double return for correct answer
      wrongAnswerLoss: 1.0   // Full loss for wrong answer
    }
  }

  // Check if user has minimum balance
  async checkMinimumBalance(userId) {
    try {
      const user = await dataService.getUserData()
      if (!user) {
        return {
          hasMinimumBalance: false,
          currentBalance: 0,
          playableBalance: 0,
          bonusBalance: 0,
          requiredBalance: this.minimumBalance,
          message: 'User not found'
        }
      }

      const playableBalance = user.playableBalance || 0
      const bonusBalance = user.bonusBalance || 0
      const totalBalance = playableBalance + bonusBalance
      const hasMinimumBalance = playableBalance >= this.minimumBalance

      return {
        hasMinimumBalance,
        currentBalance: totalBalance,
        playableBalance,
        bonusBalance,
        requiredBalance: this.minimumBalance,
        message: hasMinimumBalance 
          ? 'Sufficient balance' 
          : `Minimum $${this.minimumBalance} required to play quiz. You have $${playableBalance.toFixed(2)} playable balance and $${bonusBalance.toFixed(2)} bonus balance (requires deposit to unlock)`
      }
    } catch (error) {
      console.error('Error checking minimum balance:', error)
      return {
        hasMinimumBalance: false,
        currentBalance: 0,
        playableBalance: 0,
        bonusBalance: 0,
        requiredBalance: this.minimumBalance,
        message: 'Error checking balance'
      }
    }
  }

  // Place bet for a question
  async placeBet(userId, questionId, betAmount) {
    try {
      // Validate bet amount
      if (betAmount < this.bettingRules.minBet || betAmount > this.bettingRules.maxBet) {
        return {
          success: false,
          message: `Bet amount must be between $${this.bettingRules.minBet} and $${this.bettingRules.maxBet}`
        }
      }

      // Check user balance
      const balanceCheck = await this.checkMinimumBalance(userId)
      if (!balanceCheck.hasMinimumBalance) {
        return {
          success: false,
          message: balanceCheck.message
        }
      }

      // Check if user has enough playable balance for the bet
      if (balanceCheck.playableBalance < betAmount) {
        return {
          success: false,
          message: `Insufficient playable balance for this bet. You have $${balanceCheck.playableBalance.toFixed(2)} playable balance and $${balanceCheck.bonusBalance.toFixed(2)} bonus balance (requires deposit to unlock)`
        }
      }

      // Deduct bet amount from playable balance
      const userData = await dataService.getUserData()
      if (!userData || userData.userId !== userId) {
        return {
          success: false,
          message: 'User not found or unauthorized'
        }
      }
      
      const newPlayableBalance = (userData.playableBalance || 0) - betAmount

      await dataService.updateUserData({
        ...userData,
        playableBalance: newPlayableBalance,
        availableBalance: newPlayableBalance + (userData.bonusBalance || 0) // Update total available balance
      })

      // Create bet record
      const betRecord = {
        id: `bet_${Date.now()}_${userId}`,
        userId,
        questionId,
        betAmount,
        placedAt: new Date().toISOString(),
        status: 'active'
      }

      // TODO: Implement bet record creation when dataService methods are available
      console.log('Bet record created:', betRecord)

      return {
        success: true,
        newBalance,
        betId: betRecord.id,
        message: 'Bet placed successfully'
      }
    } catch (error) {
      console.error('Error placing bet:', error)
      return {
        success: false,
        message: 'Error placing bet'
      }
    }
  }

  // Process bet result
  async processBetResult(betId, isCorrect, questionValue) {
    try {
      // Get bet record
      // TODO: Implement bet reading when dataService methods are available
      const bet = { 
        id: betId, 
        userId: 'current_user', 
        betAmount: 1.0, 
        questionId: 'question_1', 
        status: 'active' 
      }
      if (!bet) {
        return {
          success: false,
          message: 'Bet not found'
        }
      }

      const userId = bet.userId
      const betAmount = bet.betAmount
      let result = {}

      if (isCorrect) {
        // User wins - get double return
        const winAmount = betAmount * this.bettingRules.correctAnswerMultiplier
        const netWin = winAmount - betAmount // Net profit

        // Add winnings to playable balance
        const userData = await dataService.getUserData()
        if (!userData || userData.userId !== userId) {
          return {
            success: false,
            message: 'User not found or unauthorized'
          }
        }
        
        const newPlayableBalance = (userData.playableBalance || 0) + winAmount

        await dataService.updateUserData({
          ...userData,
          playableBalance: newPlayableBalance,
          availableBalance: newPlayableBalance + (userData.bonusBalance || 0) // Update total available balance
        })

        // TODO: Implement bet update when dataService methods are available
        console.log('Bet updated:', betId, { status: 'won', result: 'correct', winAmount, netWin })

        // TODO: Implement transaction creation when dataService methods are available
        console.log('Transaction created:', {
          userId,
          type: 'quiz_win',
          amount: winAmount,
          status: 'completed',
          txHash: `Win_${betId}`,
          timestamp: new Date().toISOString(),
          details: {
            betAmount,
            winAmount,
            netWin,
            questionValue
          }
        })

        result = {
          success: true,
          result: 'won',
          winAmount,
          netWin,
          newBalance,
          message: `Correct! You won $${winAmount.toFixed(2)}`
        }
      } else {
        // User loses - lose the bet amount
        // TODO: Implement bet update when dataService methods are available
        console.log('Bet updated:', betId, { 
          status: 'lost', 
          result: 'incorrect', 
          lossAmount: betAmount 
        })

        // TODO: Implement transaction creation when dataService methods are available
        console.log('Transaction created:', {
          userId,
          type: 'quiz_loss',
          amount: -betAmount,
          status: 'completed',
          txHash: `Loss_${betId}`,
          timestamp: new Date().toISOString(),
          details: {
            betAmount,
            lossAmount: betAmount,
            questionValue
          }
        })

        result = {
          success: true,
          result: 'lost',
          lossAmount: betAmount,
          message: `Wrong answer! You lost $${betAmount.toFixed(2)}`
        }
      }

      return result
    } catch (error) {
      console.error('Error processing bet result:', error)
      return {
        success: false,
        message: 'Error processing bet result'
      }
    }
  }

  // Get user betting history
  async getUserBettingHistory(userId, limit = 50) {
    try {
      // TODO: Implement bet query when dataService methods are available
      const bets = []

      return bets
    } catch (error) {
      console.error('Error getting betting history:', error)
      return []
    }
  }

  // Get betting statistics
  async getBettingStats(userId) {
    try {
      const bets = await this.getUserBettingHistory(userId, 1000)
      
      const stats = {
        totalBets: bets.length,
        totalWon: bets.filter(bet => bet.status === 'won').length,
        totalLost: bets.filter(bet => bet.status === 'lost').length,
        totalBetAmount: bets.reduce((sum, bet) => sum + (bet.betAmount || 0), 0),
        totalWinAmount: bets.reduce((sum, bet) => sum + (bet.winAmount || 0), 0),
        totalLossAmount: bets.reduce((sum, bet) => sum + (bet.lossAmount || 0), 0),
        winRate: 0,
        netProfit: 0
      }

      if (stats.totalBets > 0) {
        stats.winRate = (stats.totalWon / stats.totalBets) * 100
        stats.netProfit = stats.totalWinAmount - stats.totalLossAmount
      }

      return stats
    } catch (error) {
      console.error('Error getting betting stats:', error)
      return {
        totalBets: 0,
        totalWon: 0,
        totalLost: 0,
        totalBetAmount: 0,
        totalWinAmount: 0,
        totalLossAmount: 0,
        winRate: 0,
        netProfit: 0
      }
    }
  }

  // Force win/loss based on house edge
  async forceBetResult(betId, questionId) {
    try {
      // Calculate if user should win based on house edge
      const shouldWin = Math.random() < this.bettingRules.winRate
      
      // Get question value for display
      // TODO: Implement question reading when dataService methods are available
      const question = { id: questionId, value: 1.0 }
      const questionValue = question?.value || 1.0

      // Process the forced result
      const result = await this.processBetResult(betId, shouldWin, questionValue)
      
      return {
        ...result,
        forced: true,
        shouldWin,
        questionValue
      }
    } catch (error) {
      console.error('Error forcing bet result:', error)
      return {
        success: false,
        message: 'Error forcing bet result'
      }
    }
  }

  // Get house statistics
  async getHouseStats() {
    try {
      const [allBets, allUsers] = await Promise.all([
        dataService.read('bets'),
        dataService.read('users')
      ])

      const stats = {
        totalUsers: allUsers.length,
        totalBets: allBets.length,
        totalBetAmount: allBets.reduce((sum, bet) => sum + (bet.betAmount || 0), 0),
        totalWinAmount: allBets.reduce((sum, bet) => sum + (bet.winAmount || 0), 0),
        totalLossAmount: allBets.reduce((sum, bet) => sum + (bet.lossAmount || 0), 0),
        houseProfit: 0,
        averageWinRate: 0
      }

      if (stats.totalBets > 0) {
        stats.houseProfit = stats.totalLossAmount - stats.totalWinAmount
        const wonBets = allBets.filter(bet => bet.status === 'won').length
        stats.averageWinRate = (wonBets / stats.totalBets) * 100
      }

      return stats
    } catch (error) {
      console.error('Error getting house stats:', error)
      return {
        totalUsers: 0,
        totalBets: 0,
        totalBetAmount: 0,
        totalWinAmount: 0,
        totalLossAmount: 0,
        houseProfit: 0,
        averageWinRate: 0
      }
    }
  }

  // Deposit money to user account (requires admin approval)
  async depositMoney(userId, amount, paymentMethod = 'crypto', walletAddress = '', transactionId = '', proofFile = null) {
    try {
      if (amount < 1) {
        return {
          success: false,
          message: 'Minimum deposit amount is $1'
        }
      }

      // Get current user data (we'll use userId from the parameter)
      const userData = await dataService.getUserData()
      if (!userData || userData.userId !== userId) {
        return {
          success: false,
          message: 'User not found or unauthorized'
        }
      }

      // Upload proof file if provided
      let proofUrl = ''
      if (proofFile) {
        try {
          const fileName = `deposit_proofs/${userId}_${Date.now()}_${proofFile.name}`
          const uploadResult = await firebaseStorageService.uploadFile(proofFile, fileName)
          if (uploadResult.success) {
            proofUrl = uploadResult.downloadURL
          } else {
            throw new Error(uploadResult.error || 'Upload failed')
          }
        } catch (uploadError) {
          console.error('Error uploading proof:', uploadError)
          return {
            success: false,
            message: 'Failed to upload deposit proof. Please try again.'
          }
        }
      }

      // Create pending deposit transaction (not added to balance yet)
      const depositId = `deposit_${Date.now()}_${userId}`
      const depositTransaction = {
        id: depositId,
        userId,
        type: 'deposit',
        amount,
        status: 'pending',
        txHash: transactionId || `Deposit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        details: {
          paymentMethod,
          walletAddress,
          transactionId: transactionId,
          proofUrl: proofUrl,
          adminApprovalRequired: true,
          submittedBy: userId,
          submittedAt: new Date().toISOString()
        }
      }

      // TODO: Implement transaction creation when dataService methods are available
      console.log('Deposit transaction created:', depositTransaction)

      return {
        success: true,
        depositId,
        message: `Deposit request submitted for $${amount.toFixed(2)}. Please wait for admin approval.`,
        status: 'pending'
      }
    } catch (error) {
      console.error('Error depositing money:', error)
      return {
        success: false,
        message: 'Error processing deposit'
      }
    }
  }

  // Approve deposit (admin only)
  async approveDeposit(depositId) {
    try {
      // TODO: Implement transaction reading when dataService methods are available
      const deposit = { 
        id: depositId, 
        type: 'deposit', 
        status: 'pending', 
        userId: 'current_user', 
        amount: 10.0 
      }
      if (!deposit || deposit.type !== 'deposit') {
        return {
          success: false,
          message: 'Deposit not found'
        }
      }

      if (deposit.status !== 'pending') {
        return {
          success: false,
          message: 'Deposit is not pending'
        }
      }

      const userId = deposit.userId
      const amount = deposit.amount

      // Get current user data
      const userData = await dataService.getUserData()
      if (!userData || userData.userId !== userId) {
        return {
          success: false,
          message: 'User not found or unauthorized'
        }
      }

      // Add to playable balance and unlock bonus balance
      const newPlayableBalance = (userData.playableBalance || 0) + amount
      const bonusBalance = userData.bonusBalance || 0
      const newTotalBalance = newPlayableBalance + bonusBalance

      // Update user balance
      await dataService.updateUserData({
        ...userData,
        playableBalance: newPlayableBalance,
        availableBalance: newTotalBalance,
        totalDeposited: (userData.totalDeposited || 0) + amount,
        hasDeposited: true // Mark that user has deposited
      })

      // TODO: Implement transaction update when dataService methods are available
      console.log('Transaction updated:', depositId, {
        status: 'completed',
        approvedAt: new Date().toISOString(),
        approvedBy: 'admin',
        details: {
          ...deposit.details,
          newPlayableBalance,
          newTotalBalance
        }
      })

      return {
        success: true,
        message: `Deposit of $${amount.toFixed(2)} approved and added to user balance`,
        newBalance: newTotalBalance
      }
    } catch (error) {
      console.error('Error approving deposit:', error)
      return {
        success: false,
        message: 'Error approving deposit'
      }
    }
  }

  // Reject deposit (admin only)
  async rejectDeposit(depositId, reason = '') {
    try {
      // Get the deposit transaction
      // TODO: Implement transaction reading when dataService methods are available
      const deposit = { 
        id: depositId, 
        type: 'deposit', 
        status: 'pending', 
        userId: 'current_user', 
        amount: 10.0 
      }
      if (!deposit || deposit.type !== 'deposit') {
        return {
          success: false,
          message: 'Deposit not found'
        }
      }

      if (deposit.status !== 'pending') {
        return {
          success: false,
          message: 'Deposit is not pending'
        }
      }

      // TODO: Implement transaction update when dataService methods are available
      console.log('Transaction updated:', depositId, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: 'admin',
        rejectionReason: reason,
        details: {
          ...deposit.details,
          rejectionReason: reason
        }
      })

      return {
        success: true,
        message: `Deposit of $${deposit.amount.toFixed(2)} rejected`,
        reason
      }
    } catch (error) {
      console.error('Error rejecting deposit:', error)
      return {
        success: false,
        message: 'Error rejecting deposit'
      }
    }
  }

  // Withdraw money from user account
  async withdrawMoney(userId, amount) {
    try {
      if (amount < 10) {
        return {
          success: false,
          message: 'Minimum withdrawal amount is $10'
        }
      }

      // Check user balance
      const balanceCheck = await this.checkMinimumBalance(userId)
      if (!balanceCheck.hasMinimumBalance || balanceCheck.currentBalance < amount) {
        return {
          success: false,
          message: 'Insufficient balance for withdrawal'
        }
      }

      // Deduct from balance
      const userData = await dataService.getUserData()
      if (!userData || userData.userId !== userId) {
        return {
          success: false,
          message: 'User not found or unauthorized'
        }
      }
      
      const newBalance = (userData.availableBalance || 0) - amount

      await dataService.updateUserData({
        ...userData,
        availableBalance: newBalance,
        totalWithdrawn: (userData.totalWithdrawn || 0) + amount
      })

      // TODO: Implement transaction creation when dataService methods are available
      console.log('Transaction created:', {
        userId,
        type: 'withdrawal',
        amount: -amount,
        status: 'pending',
        txHash: `Withdrawal_${Date.now()}`,
        timestamp: new Date().toISOString(),
        details: {
          newBalance
        }
      })

      return {
        success: true,
        newBalance,
        message: `Withdrawal request submitted for $${amount.toFixed(2)}`
      }
    } catch (error) {
      console.error('Error withdrawing money:', error)
      return {
        success: false,
        message: 'Error processing withdrawal'
      }
    }
  }

  // Add balance to user account
  async addBalance(userId, amount, type, description) {
    try {
      const userData = await dataService.getUserData()
      if (!userData || userData.userId !== userId) {
        return { success: false, message: 'User not found or unauthorized' }
      }

      const newPlayableBalance = (userData.playableBalance || 0) + amount
      const newAvailableBalance = newPlayableBalance + (userData.bonusBalance || 0)

      await dataService.updateUserData({
        ...userData,
        playableBalance: newPlayableBalance,
        availableBalance: newAvailableBalance
      })

      // TODO: Implement transaction creation when dataService methods are available
      console.log('Transaction created:', {
        userId,
        type: type,
        amount: amount,
        status: 'completed',
        txHash: `TX_${Date.now()}`,
        timestamp: new Date().toISOString(),
        details: {
          description: description
        }
      })

      return { success: true, message: 'Balance added successfully' }
    } catch (error) {
      console.error('Error adding balance:', error)
      return { success: false, message: error.message }
    }
  }

  // Deduct balance from user account
  async deductBalance(userId, amount, type, description) {
    try {
      const userData = await dataService.getUserData()
      if (!userData || userData.userId !== userId) {
        return { success: false, message: 'User not found or unauthorized' }
      }

      const currentBalance = userData.playableBalance || 0
      if (currentBalance < amount) {
        return { 
          success: false, 
          message: `Insufficient balance. Required: $${amount}, Available: $${currentBalance}` 
        }
      }

      const newPlayableBalance = currentBalance - amount
      const newAvailableBalance = newPlayableBalance + (userData.bonusBalance || 0)

      await dataService.updateUserData({
        ...userData,
        playableBalance: newPlayableBalance,
        availableBalance: newAvailableBalance
      })

      // TODO: Implement transaction creation when dataService methods are available
      console.log('Transaction created:', {
        userId,
        type: type,
        amount: -amount,
        status: 'completed',
        txHash: `TX_${Date.now()}`,
        timestamp: new Date().toISOString(),
        details: {
          description: description
        }
      })

      return { success: true, message: 'Balance deducted successfully' }
    } catch (error) {
      console.error('Error deducting balance:', error)
      return { success: false, message: error.message }
    }
  }
}

// Create singleton instance
const balanceService = new BalanceService()

export default balanceService
