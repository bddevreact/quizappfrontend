// Admin Data Service
// This service handles all admin-related data operations

import dataService from './dataService';
import telegramWebAppService from './telegramWebAppService';

class AdminDataService {
  constructor() {
    this.isInitialized = false;
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes cache for admin data
  }

  // Initialize the service
  async initialize() {
    try {
      this.isInitialized = true;
      console.log('Admin Data Service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing admin data service:', error);
      return false;
    }
  }

  // Get all users data
  async getAllUsers() {
    try {
      const cacheKey = 'all_users';
      
      if (this.isCached(cacheKey)) {
        return this.getFromCache(cacheKey);
      }

      // Try to get from backend first
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('https://updatequizapp-production.up.railway.app/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          const users = result.data || [];
          this.setCache(cacheKey, users);
          return users;
        }
      } catch (apiError) {
        console.log('Backend API not available, collecting local data');
      }

      // Collect data from local sources
      const localUsers = await this.collectLocalUserData();
      this.setCache(cacheKey, localUsers);
      return localUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Collect user data from local sources
  async collectLocalUserData() {
    try {
      const users = [];
      
      // Get current Telegram user if available
      const telegramUser = telegramWebAppService.getUserData();
      if (telegramUser) {
        users.push({
          id: telegramUser.userId || telegramUser.id || 'telegram-user',
          name: telegramUser.fullName || telegramUser.name || 'Telegram User',
          email: telegramUser.email || 'N/A',
          telegramId: telegramUser.telegramId,
          telegramUsername: telegramUser.telegramUsername || telegramUser.username,
          balance: telegramUser.balance || 0,
          availableBalance: telegramUser.availableBalance || 0,
          playableBalance: telegramUser.playableBalance || 0,
          bonusBalance: telegramUser.bonusBalance || 0,
          level: telegramUser.level || 1,
          totalXP: telegramUser.totalXP || telegramUser.xp || 0,
          joinDate: telegramUser.joinDate || new Date().toISOString().split('T')[0],
          status: 'active',
          isTelegramUser: true,
          lastSeen: telegramUser.lastSeen || new Date().toISOString(),
          totalEarned: telegramUser.totalEarned || 0,
          tournamentsWon: telegramUser.tournamentsWon || 0,
          questionsAnswered: telegramUser.questionsAnswered || 0,
          averageScore: telegramUser.averageScore || 0,
          streak: telegramUser.streak || 0,
          rank: telegramUser.rank || 'Bronze',
          isVerified: telegramUser.isVerified || false,
          withdrawalEnabled: telegramUser.withdrawalEnabled || false,
          hasDeposited: telegramUser.hasDeposited || false,
          dailyBonusAvailable: telegramUser.dailyBonusAvailable || true,
          unreadNotifications: telegramUser.unreadNotifications || 0
        });
      }

      // Get data from dataService if available
      try {
        const dataServiceUser = dataService.getUserData();
        if (dataServiceUser && (!telegramUser || dataServiceUser.userId !== telegramUser.userId)) {
          users.push({
            id: dataServiceUser.userId || dataServiceUser.id || 'data-service-user',
            name: dataServiceUser.name || dataServiceUser.fullName || 'Data Service User',
            email: dataServiceUser.email || 'N/A',
            telegramId: dataServiceUser.telegramId || 'N/A',
            telegramUsername: dataServiceUser.telegramUsername || dataServiceUser.username || 'N/A',
            balance: dataServiceUser.balance || 0,
            availableBalance: dataServiceUser.availableBalance || 0,
            playableBalance: dataServiceUser.playableBalance || 0,
            bonusBalance: dataServiceUser.bonusBalance || 0,
            level: dataServiceUser.level || 1,
            totalXP: dataServiceUser.totalXP || 0,
            joinDate: dataServiceUser.joinDate || new Date().toISOString().split('T')[0],
            status: 'active',
            isTelegramUser: dataServiceUser.isTelegramUser || false,
            lastSeen: dataServiceUser.lastSeen || new Date().toISOString(),
            totalEarned: dataServiceUser.totalEarned || 0,
            tournamentsWon: dataServiceUser.tournamentsWon || 0,
            questionsAnswered: dataServiceUser.questionsAnswered || 0,
            averageScore: dataServiceUser.averageScore || 0,
            streak: dataServiceUser.streak || 0,
            rank: dataServiceUser.rank || 'Bronze',
            isVerified: dataServiceUser.isVerified || false,
            withdrawalEnabled: dataServiceUser.withdrawalEnabled || false,
            hasDeposited: dataServiceUser.hasDeposited || false,
            dailyBonusAvailable: dataServiceUser.dailyBonusAvailable || true,
            unreadNotifications: dataServiceUser.unreadNotifications || 0
          });
        }
      } catch (error) {
        console.log('No dataService user data available');
      }

      // Add some sample users for demonstration (remove in production)
      if (users.length === 0) {
        users.push({
          id: 'demo-user-1',
          name: 'Demo User 1',
          email: 'demo1@example.com',
          telegramId: '123456789',
          telegramUsername: 'demouser1',
          balance: 150.50,
          availableBalance: 100.00,
          playableBalance: 75.00,
          bonusBalance: 25.50,
          level: 5,
          totalXP: 450,
          joinDate: '2024-01-15',
          status: 'active',
          isTelegramUser: true,
          lastSeen: new Date().toISOString(),
          totalEarned: 250.75,
          tournamentsWon: 3,
          questionsAnswered: 45,
          averageScore: 78.5,
          streak: 5,
          rank: 'Silver',
          isVerified: true,
          withdrawalEnabled: true,
          hasDeposited: true,
          dailyBonusAvailable: false,
          unreadNotifications: 2
        });
      }

      console.log('📊 Collected local user data:', users);
      return users;
    } catch (error) {
      console.error('Error collecting local user data:', error);
      return [];
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const cacheKey = 'dashboard_stats';
      
      if (this.isCached(cacheKey)) {
        return this.getFromCache(cacheKey);
      }

      const users = await this.getAllUsers();
      const stats = this.calculateStats(users);
      
      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return this.getDefaultStats();
    }
  }

  // Calculate statistics from user data
  calculateStats(users) {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const telegramUsers = users.filter(user => user.isTelegramUser).length;
    const newUsers = users.filter(user => {
      const joinDate = new Date(user.joinDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return joinDate > weekAgo;
    }).length;

    const totalRevenue = users.reduce((sum, user) => sum + (user.totalEarned || 0), 0);
    const dailyRevenue = users.reduce((sum, user) => {
      // Estimate daily revenue (simplified calculation)
      return sum + ((user.totalEarned || 0) * 0.1);
    }, 0);

    const totalQuizzes = users.reduce((sum, user) => sum + (user.questionsAnswered || 0), 0);
    const averageScore = users.length > 0 
      ? users.reduce((sum, user) => sum + (user.averageScore || 0), 0) / users.length 
      : 0;

    const totalTournaments = users.reduce((sum, user) => sum + (user.tournamentsWon || 0), 0);

    return {
      overview: {
        users: {
          totalUsers,
          activeUsers,
          newUsers,
          telegramUsers
        },
        revenue: {
          totalRevenue,
          dailyRevenue,
          monthlyRevenue: totalRevenue * 0.3,
          pendingWithdrawals: totalRevenue * 0.1
        },
        quiz: {
          totalQuizzes,
          averageScore: Math.round(averageScore * 10) / 10,
          completionRate: 85.2,
          dailyQuizzes: Math.round(totalQuizzes * 0.05)
        },
        tournaments: {
          totalTournaments,
          activeTournaments: Math.max(1, Math.floor(totalUsers / 20)),
          totalParticipants: totalUsers,
          totalPrizePool: totalRevenue * 0.2
        },
        dailyBonus: {
          totalClaims: users.reduce((sum, user) => sum + (user.streak || 0), 0),
          claimsToday: users.filter(user => user.dailyBonusAvailable).length,
          totalDistributed: totalRevenue * 0.15,
          averageStreak: users.length > 0 
            ? users.reduce((sum, user) => sum + (user.streak || 0), 0) / users.length 
            : 0,
          topStreak: Math.max(...users.map(user => user.streak || 0), 0),
          claimsThisWeek: Math.round(totalUsers * 0.3),
          claimsThisMonth: Math.round(totalUsers * 0.8)
        }
      },
      recent: {
        users: users.slice(0, 3).map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          joinDate: user.joinDate,
          status: user.status
        })),
        transactions: users.slice(0, 3).map(user => ({
          id: user.id,
          user: user.name,
          amount: user.totalEarned || 0,
          type: 'deposit',
          status: 'completed',
          date: user.joinDate
        })),
        tournaments: users.slice(0, 3).map(user => ({
          id: user.id,
          name: `${user.name}'s Tournament`,
          participants: Math.floor(Math.random() * 20) + 10,
          prizePool: (user.totalEarned || 0) * 0.5,
          status: 'active'
        }))
      },
      pending: {
        withdrawals: users.filter(user => user.withdrawalEnabled && user.availableBalance > 10).length,
        verifications: users.filter(user => !user.isVerified).length,
        supportTickets: users.filter(user => user.unreadNotifications > 0).length,
        tournamentApprovals: Math.floor(totalUsers / 50)
      }
    };
  }

  // Get default stats when no data is available
  getDefaultStats() {
    return {
      overview: {
        users: { totalUsers: 0, activeUsers: 0, newUsers: 0, telegramUsers: 0 },
        revenue: { totalRevenue: 0, dailyRevenue: 0, monthlyRevenue: 0, pendingWithdrawals: 0 },
        quiz: { totalQuizzes: 0, averageScore: 0, completionRate: 0, dailyQuizzes: 0 },
        tournaments: { totalTournaments: 0, activeTournaments: 0, totalParticipants: 0, totalPrizePool: 0 },
        dailyBonus: { totalClaims: 0, claimsToday: 0, totalDistributed: 0, averageStreak: 0, topStreak: 0, claimsThisWeek: 0, claimsThisMonth: 0 }
      },
      recent: { users: [], transactions: [], tournaments: [] },
      pending: { withdrawals: 0, verifications: 0, supportTickets: 0, tournamentApprovals: 0 }
    };
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.id === userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Update user data
  async updateUser(userId, userData) {
    try {
      // Try backend first
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`https://updatequizapp-production.up.railway.app/api/admin/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if (response.ok) {
          this.clearCache();
          return await response.json();
        }
      } catch (apiError) {
        console.log('Backend update failed, updating local data');
      }

      // Update local data
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        this.setCache('all_users', users);
        
        // Update Telegram service if this is the current user
        const telegramUser = telegramWebAppService.getUserData();
        if (telegramUser && telegramUser.userId === userId) {
          telegramWebAppService.updateUserData({ ...telegramUser, ...userData });
        }
      }

      return { success: true, data: users[userIndex] };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  isCached(key) {
    return this.getFromCache(key) !== null;
  }

  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Create singleton instance
const adminDataService = new AdminDataService();

export default adminDataService;
