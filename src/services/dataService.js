// Data Service
// This service manages all data operations using MongoDB service

import mongoDBService from './mongoDBService';

class DataService {
  constructor() {
    this.isInitialized = false;
    this.userData = null;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Initialize the service
  async initializeData() {
    try {
      await mongoDBService.initializeData();
      this.isInitialized = true;
      
      // Load user data if authenticated
      if (mongoDBService.isAuthenticated()) {
        this.userData = await mongoDBService.getUserData();
      }
      
      console.log('Data Service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing data service:', error);
      return false;
    }
  }

  // User Data Management
  async getUserData() {
    try {
      if (!this.isInitialized) {
        await this.initializeData();
      }
      
      if (this.userData) {
        return this.userData;
      }
      
      this.userData = await mongoDBService.getUserData();
      return this.userData;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async updateUserData(userData) {
    try {
      const updatedUser = await mongoDBService.updateUserData(userData);
      this.userData = updatedUser;
      this.clearCache('user');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  // Quiz Management
  async getQuestions(difficulty = 'easy', limit = 10) {
    const cacheKey = `questions_${difficulty}_${limit}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }
    
    try {
      const questions = await mongoDBService.getQuestions(difficulty, limit);
      this.setCache(cacheKey, questions);
      return questions;
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }

  async submitQuizResult(quizData) {
    try {
      const result = await mongoDBService.submitQuizResult(quizData);
      
      // Update local user data
      if (result.user) {
        this.userData = result.user;
      }
      
      this.clearCache('user');
      return result;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }

  // Tournament Management
  async getTournaments(status = 'active') {
    const cacheKey = `tournaments_${status}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }
    
    try {
      const tournaments = await mongoDBService.getTournaments(status);
      this.setCache(cacheKey, tournaments);
      return tournaments;
    } catch (error) {
      console.error('Error getting tournaments:', error);
      return [];
    }
  }

  async createTournament(tournamentData) {
    try {
      const tournament = await mongoDBService.createTournament(tournamentData);
      this.clearCache('tournaments');
      return tournament;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  }

  async joinTournament(tournamentId) {
    try {
      const result = await mongoDBService.joinTournament(tournamentId);
      
      // Update local user data
      if (result.user) {
        this.userData = result.user;
      }
      
      this.clearCache('tournaments');
      this.clearCache('user');
      return result;
    } catch (error) {
      console.error('Error joining tournament:', error);
      throw error;
    }
  }

  // Transaction Management
  async getTransactions(type = 'all', limit = 20) {
    const cacheKey = `transactions_${type}_${limit}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }
    
    try {
      const transactions = await mongoDBService.getTransactions(type, limit);
      this.setCache(cacheKey, transactions);
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  async createTransaction(transactionData) {
    try {
      const transaction = await mongoDBService.createTransaction(transactionData);
      this.clearCache('transactions');
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async approveTransaction(transactionId) {
    try {
      const result = await mongoDBService.approveTransaction(transactionId);
      this.clearCache('transactions');
      return result;
    } catch (error) {
      console.error('Error approving transaction:', error);
      throw error;
    }
  }

  // Task Management
  async getTasks(status = 'active') {
    const cacheKey = `tasks_${status}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }
    
    try {
      const tasks = await mongoDBService.getTasks(status);
      this.setCache(cacheKey, tasks);
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async completeTask(taskId) {
    try {
      const result = await mongoDBService.completeTask(taskId);
      
      // Update local user data
      if (result.user) {
        this.userData = result.user;
      }
      
      this.clearCache('tasks');
      this.clearCache('user');
      return result;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // Achievement Management
  async getAchievements() {
    const cacheKey = 'achievements';
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }
    
    try {
      const achievements = await mongoDBService.getAchievements();
      this.setCache(cacheKey, achievements);
      return achievements;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async unlockAchievement(achievementId) {
    try {
      const result = await mongoDBService.unlockAchievement(achievementId);
      
      // Update local user data
      if (result.user) {
        this.userData = result.user;
      }
      
      this.clearCache('achievements');
      this.clearCache('user');
      return result;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  // Leaderboard
  async getLeaderboard(type = 'xp', limit = 10) {
    const cacheKey = `leaderboard_${type}_${limit}`;
    
    if (this.isCached(cacheKey)) {
      return this.getFromCache(cacheKey);
    }
    
    try {
      const leaderboard = await mongoDBService.getLeaderboard(type, limit);
      this.setCache(cacheKey, leaderboard);
      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Admin Functions
  async getAdminDashboard() {
    try {
      return await mongoDBService.getAdminDashboard();
    } catch (error) {
      console.error('Error getting admin dashboard:', error);
      return null;
    }
  }

  async getAdminUsers() {
    try {
      return await mongoDBService.getAdminUsers();
    } catch (error) {
      console.error('Error getting admin users:', error);
      return [];
    }
  }

  // Authentication
  async login(credentials) {
    try {
      const result = await mongoDBService.login(credentials);
      this.userData = result.user;
      this.clearCache();
      return result;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const result = await mongoDBService.register(userData);
      return result;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await mongoDBService.logout();
      this.userData = null;
      this.clearCache();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Cache Management
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

  // Utility Methods
  isAuthenticated() {
    return mongoDBService.isAuthenticated();
  }

  getToken() {
    return mongoDBService.getToken();
  }

  setToken(token) {
    mongoDBService.setToken(token);
  }

  // Get recent activity
  async getRecentActivity() {
    try {
      const activities = await mongoDBService.getActivities();
      return activities.slice(0, 10); // Return last 10 activities
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  // Add activity
  async addActivity(activity) {
    try {
      const result = await mongoDBService.createActivity(activity);
      return result;
    } catch (error) {
      console.error('Error adding activity:', error);
      return false;
    }
  }

  // Get achievements
  async getAchievements() {
    try {
      const achievements = await mongoDBService.getAchievements();
      return achievements;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  // Add achievement
  async addAchievement(achievement) {
    try {
      const result = await mongoDBService.createAchievement(achievement);
      return result;
    } catch (error) {
      console.error('Error adding achievement:', error);
      return false;
    }
  }

  // Add transaction (database version)
  async addTransaction(transaction) {
    try {
      const result = await mongoDBService.createTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }

  // Real-time Updates (placeholder for future WebSocket implementation)
  subscribeToUpdates(callback) {
    // This would be implemented with WebSocket connection
    console.log('Real-time updates subscription placeholder');
  }

  unsubscribeFromUpdates() {
    // This would be implemented with WebSocket disconnection
    console.log('Real-time updates unsubscription placeholder');
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;