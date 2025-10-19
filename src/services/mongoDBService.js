// MongoDB Service
// This service handles all database operations using MongoDB via REST API

import axios from 'axios';

class MongoDBService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://updatequizapp-production.up.railway.app/api';
    this.mongoURI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/cryptoquiz';
    this.isInitialized = false;
    this.userData = null;
    this.token = null;
    this.backendAvailable = false;
    this.lastCheckTime = null;
    
    // Setup axios defaults
    axios.defaults.baseURL = this.baseURL;
    axios.defaults.withCredentials = true;
    
    // Get token from environment or localStorage
    this.token = import.meta.env.VITE_API_TOKEN || localStorage.getItem('accessToken');
    
    // For development, use a mock token if no token is available
    if (!this.token && import.meta.env.DEV) {
      this.token = 'dev-token-123';
      localStorage.setItem('accessToken', this.token);
    }
    
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
    
    console.log('MongoDB Service initialized with baseURL:', this.baseURL);
    console.log('MongoDB Service initialized with URI:', this.mongoURI);
    
    // Check backend availability
    this.checkBackendAvailability();
  }

  // Check if backend is available
  async checkBackendAvailability() {
    try {
      // Skip check if already available and recent
      if (this.backendAvailable && this.lastCheckTime && (Date.now() - this.lastCheckTime) < 30000) {
        return this.backendAvailable;
      }
      
      // Use fetch instead of axios to avoid CORS issues
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        this.backendAvailable = true;
        this.lastCheckTime = Date.now();
        console.log('✅ Backend server is available');
        return true;
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      // Check if it's a rate limiting error
      if (error.response && error.response.status === 429) {
        this.backendAvailable = true; // Server is running, just rate limited
        this.lastCheckTime = Date.now();
        console.log('✅ Backend server is available (rate limited)');
        return true;
      }
      
      this.backendAvailable = false;
      this.lastCheckTime = Date.now();
      console.log('⚠️ Backend server not available');
      console.log('Backend check error:', error.message);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
        console.log('🔧 CORS error detected - this should be fixed with the recent CORS update');
      }
      
      return false;
    }
  }

  // Initialize the service
  async initializeData() {
    try {
      this.isInitialized = true;
      console.log('MongoDB Service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing MongoDB service:', error);
      return false;
    }
  }

  // User Management
  async getUserData() {
    try {
      console.log('🔄 Fetching user data from MongoDB...');
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      // If backend is not available, throw error
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot fetch user data');
        throw new Error('Backend not available');
      }
      
      // Ensure we have a token
      const token = localStorage.getItem('accessToken') || 'dev-token-123';
      if (!token) {
        console.log('⚠️ No access token available');
        throw new Error('No access token available');
      }
      
      // Update axios headers with current token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get('/users/profile');
      this.userData = response.data.data;
      
      console.log('✅ User data fetched successfully from MongoDB:', this.userData);
      return this.userData;
    } catch (error) {
      // Check if it's a rate limiting error
      if (error.response && error.response.status === 429) {
        console.log('Rate limited, retrying later');
        throw new Error('Rate limited - please try again later');
      }
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        console.log('Authentication error - token may be invalid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Authentication failed - please refresh the page');
      }
      
      console.error('❌ Error fetching user data from MongoDB:', error);
      throw error;
    }
  }

  async updateUserData(userData) {
    try {
      console.log('🔄 Updating user data:', userData);
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      // If backend is not available, return error
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot update user data');
        throw new Error('Backend not available');
      }
      
      // Ensure we have a token
      const token = localStorage.getItem('accessToken') || 'dev-token-123';
      if (!token) {
        console.log('⚠️ No access token available');
        throw new Error('No access token available');
      }
      
      // Update axios headers with current token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.put('/users/profile', userData);
      this.userData = response.data.data;
      
      console.log('✅ User data updated successfully:', this.userData);
      return this.userData;
    } catch (error) {
      // Check if it's a rate limiting error
      if (error.response && error.response.status === 429) {
        console.log('Rate limited, retrying later');
        throw new Error('Rate limited - please try again later');
      }
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        console.log('Authentication error - token may be invalid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Authentication failed - please refresh the page');
      }
      
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  async updateUserBalance(balanceData) {
    try {
      console.log('💰 Updating user balance:', balanceData);
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      // If backend is not available, return error
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot update balance');
        throw new Error('Backend not available');
      }
      
      // Ensure we have a token
      const token = localStorage.getItem('accessToken') || 'dev-token-123';
      if (!token) {
        console.log('⚠️ No access token available');
        throw new Error('No access token available');
      }
      
      // Update axios headers with current token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.put('/users/balance', balanceData);
      this.userData = response.data.data;
      
      console.log('✅ User balance updated successfully:', this.userData);
      return this.userData;
    } catch (error) {
      // Check if it's a rate limiting error
      if (error.response && error.response.status === 429) {
        console.log('Rate limited, retrying later');
        throw new Error('Rate limited - please try again later');
      }
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        console.log('Authentication error - token may be invalid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Authentication failed - please refresh the page');
      }
      
      console.error('Error updating user balance:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await axios.post('/users', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Quiz Management
  async getQuestions(difficulty = 'easy', limit = 10) {
    try {
      console.log(`🔄 Fetching ${limit} ${difficulty} questions from MongoDB...`);
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot fetch questions');
        throw new Error('Backend not available');
      }
      
      const response = await axios.get(`/quiz/questions?difficulty=${difficulty}&limit=${limit}`);
      console.log(`✅ Questions fetched successfully from MongoDB: ${response.data.data.length} questions`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching questions from MongoDB:', error);
      throw error;
    }
  }

  async submitQuizResult(quizData) {
    try {
      const response = await axios.post('/quiz/submit', quizData);
      return response.data.data;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }

  // Tournament Management
  async getTournaments(status = 'active') {
    try {
      console.log(`🔄 Fetching ${status} tournaments from MongoDB...`);
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot fetch tournaments');
        throw new Error('Backend not available');
      }
      
      // Check if we're in admin context
      const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
      const endpoint = isAdmin ? `/admin/tournaments?status=${status}` : `/tournaments?status=${status}`;
      
      const response = await axios.get(endpoint);
      console.log(`✅ Tournaments fetched successfully from MongoDB: ${response.data.data.length} tournaments`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching tournaments from MongoDB:', error);
      throw error;
    }
  }

  async createTournament(tournamentData) {
    try {
      const response = await axios.post('/tournaments', tournamentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  }

  async joinTournament(tournamentId) {
    try {
      const response = await axios.post(`/tournaments/${tournamentId}/join`);
      return response.data.data;
    } catch (error) {
      console.error('Error joining tournament:', error);
      throw error;
    }
  }

  // Transaction Management
  async getTransactions(type = 'all', limit = 20) {
    try {
      console.log(`🔄 Fetching ${type} transactions from MongoDB...`);
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot fetch transactions');
        throw new Error('Backend not available');
      }
      
      const response = await axios.get(`/transactions?type=${type}&limit=${limit}`);
      console.log(`✅ Transactions fetched successfully from MongoDB: ${response.data.data.length} transactions`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching transactions from MongoDB:', error);
      throw error;
    }
  }

  async createTransaction(transactionData) {
    try {
      console.log('💰 Creating transaction:', transactionData);
      
      // Check backend availability first
      await this.checkBackendAvailability();
      
      // If backend is not available, return error
      if (!this.backendAvailable) {
        console.log('⚠️ Backend not available - cannot create transaction');
        throw new Error('Backend not available');
      }
      
      // Ensure we have a token
      const token = localStorage.getItem('accessToken') || 'dev-token-123';
      if (!token) {
        console.log('⚠️ No access token available');
        throw new Error('No access token available');
      }
      
      // Update axios headers with current token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.post('/transactions', transactionData);
      
      console.log('✅ Transaction created successfully:', response.data.data);
      return response.data.data;
    } catch (error) {
      // Check if it's a rate limiting error
      if (error.response && error.response.status === 429) {
        console.log('Rate limited, retrying later');
        throw new Error('Rate limited - please try again later');
      }
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        console.log('Authentication error - token may be invalid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Authentication failed - please refresh the page');
      }
      
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async approveTransaction(transactionId) {
    try {
      const response = await axios.put(`/transactions/${transactionId}/approve`);
      return response.data.data;
    } catch (error) {
      console.error('Error approving transaction:', error);
      throw error;
    }
  }

  // Task Management
  async getTasks(status = 'active') {
    try {
      const response = await axios.get(`/tasks?status=${status}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return this.getMockTasks();
    }
  }

  async completeTask(taskId) {
    try {
      const response = await axios.post(`/tasks/${taskId}/complete`);
      return response.data.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // Achievement Management
  async getAchievements() {
    try {
      const response = await axios.get('/achievements');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return this.getMockAchievements();
    }
  }

  async unlockAchievement(achievementId) {
    try {
      const response = await axios.post(`/achievements/${achievementId}/unlock`);
      return response.data.data;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  // Leaderboard
  async getLeaderboard(type = 'xp', limit = 10) {
    try {
      const response = await axios.get(`/leaderboard?type=${type}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return this.getMockLeaderboard();
    }
  }

  // Admin Functions
  async getAdminDashboard() {
    try {
      const response = await axios.get('/admin/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      return this.getMockAdminData();
    }
  }

  async getAdminUsers() {
    try {
      const response = await axios.get('/admin/users');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return this.getMockUsers();
    }
  }

  // Authentication
  async login(credentials) {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      this.token = accessToken;
      this.userData = user;
      
      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      this.token = null;
      this.userData = null;
    }
  }

  // Activity Management
  async getActivities(limit = 50) {
    try {
      const response = await axios.get(`/activities?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return this.getMockActivities();
    }
  }

  async createActivity(activityData) {
    try {
      const response = await axios.post('/activities', activityData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  // Achievement Management
  async getAchievements() {
    try {
      const response = await axios.get('/achievements');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return this.getMockAchievements();
    }
  }

  async createAchievement(achievementData) {
    try {
      const response = await axios.post('/achievements', achievementData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  }

  getMockActivities() {
    return [
      {
        id: 'activity-1',
        type: 'quiz_completed',
        title: 'Quiz Completed',
        description: 'Completed Crypto Basics quiz',
        time: '2 hours ago',
        icon: '🎯',
        reward: 5.0
      },
      {
        id: 'activity-2',
        type: 'daily_bonus_claimed',
        title: 'Daily Bonus Claimed',
        description: 'Earned 1.00 USDT from daily bonus',
        time: '1 day ago',
        icon: '🎁',
        reward: 1.0
      }
    ];
  }

  getMockAchievements() {
    return [
      {
        id: 'achievement-1',
        title: 'First Quiz',
        description: 'Complete your first quiz',
        icon: '🏆',
        unlocked: true,
        unlockedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'achievement-2',
        title: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: '🎯',
        unlocked: false,
        progress: 3,
        target: 10
      }
    ];
  }

  // Mock Data Methods (for development)
  getMockUserData() {
    return {
      userId: 'mock-user-1',
      id: 'mock-user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      balance: 150.50,
      availableBalance: 150.50,
      playableBalance: 100.00,
      bonusBalance: 50.50,
      level: 5,
      totalXP: 450,
      tournamentsWon: 3,
      questionsAnswered: 45,
      averageScore: 78.5,
      streak: 5,
      rank: 'Silver',
      totalEarned: 250.75,
      totalDeposited: 200.00,
      totalWithdrawn: 50.00,
      invitedFriends: 2,
      dailyBonusAvailable: true,
      unreadNotifications: 3,
      joinDate: '2024-01-15',
      lastSeen: new Date().toISOString(),
      isTelegramUser: true,
      telegramId: '123456789',
      telegramUsername: 'demouser',
      hasDeposited: true,
      withdrawalEnabled: true,
      isVerified: true
    };
  }

  getMockQuestions(difficulty, limit) {
    const questions = [
      {
        id: 'q1',
        question: 'What is Bitcoin?',
        options: ['A digital currency', 'A physical coin', 'A bank account', 'A credit card'],
        correctAnswer: 0,
        difficulty: 'easy',
        category: 'crypto',
        explanation: 'Bitcoin is a decentralized digital currency.'
      },
      {
        id: 'q2',
        question: 'What is blockchain?',
        options: ['A type of database', 'A cryptocurrency', 'A bank', 'A computer'],
        correctAnswer: 0,
        difficulty: 'medium',
        category: 'crypto',
        explanation: 'Blockchain is a distributed ledger technology.'
      },
      {
        id: 'q3',
        question: 'What is Ethereum?',
        options: ['A cryptocurrency', 'A blockchain platform', 'A bank', 'A game'],
        correctAnswer: 1,
        difficulty: 'medium',
        category: 'crypto',
        explanation: 'Ethereum is a blockchain platform for smart contracts.'
      }
    ];
    
    return questions.slice(0, limit);
  }

  getMockTournaments() {
    return [
      {
        id: 't1',
        name: 'Crypto Master',
        description: 'Test your crypto knowledge',
        entryFee: 10,
        prizePool: 500,
        maxParticipants: 50,
        currentParticipants: 25,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        difficulty: 'medium',
        questionsCount: 10
      },
      {
        id: 't2',
        name: 'Bitcoin Expert',
        description: 'Bitcoin-focused tournament',
        entryFee: 5,
        prizePool: 250,
        maxParticipants: 30,
        currentParticipants: 18,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        difficulty: 'hard',
        questionsCount: 15
      }
    ];
  }

  getMockTransactions() {
    return [
      {
        id: 'tx1',
        type: 'deposit',
        amount: 50,
        status: 'completed',
        date: new Date().toISOString(),
        description: 'USDT Deposit',
        transactionHash: '0x123...abc'
      },
      {
        id: 'tx2',
        type: 'withdrawal',
        amount: 25,
        status: 'pending',
        date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        description: 'USDT Withdrawal',
        transactionHash: null
      }
    ];
  }

  getMockTasks() {
    return [
      {
        id: 'task1',
        title: 'Follow Telegram Channel',
        description: 'Follow our official Telegram channel',
        reward: 5,
        type: 'social',
        status: 'active',
        requirements: 'Must follow for at least 7 days'
      },
      {
        id: 'task2',
        title: 'Share Quiz Result',
        description: 'Share your quiz result on social media',
        reward: 3,
        type: 'social',
        status: 'active',
        requirements: 'Must include hashtag #CryptoQuiz'
      }
    ];
  }

  getMockAchievements() {
    return [
      {
        id: 'ach1',
        title: 'First Quiz Master',
        description: 'Complete your first quiz',
        reward: 5,
        type: 'quiz',
        rarity: 'common',
        icon: 'trophy'
      },
      {
        id: 'ach2',
        title: 'Quiz Streak Master',
        description: 'Complete 10 quizzes in a row',
        reward: 25,
        type: 'streak',
        rarity: 'rare',
        icon: 'star'
      }
    ];
  }

  getMockLeaderboard() {
    return [
      { rank: 1, name: 'CryptoKing', xp: 2500, level: 15 },
      { rank: 2, name: 'BitcoinMaster', xp: 2200, level: 14 },
      { rank: 3, name: 'EthereumExpert', xp: 2000, level: 13 }
    ];
  }

  getMockAdminData() {
    return {
      overview: {
        users: { totalUsers: 1250, activeUsers: 890, newUsers: 45 },
        revenue: { totalRevenue: 12500, dailyRevenue: 450 },
        quiz: { totalQuizzes: 15600, averageScore: 72.5 },
        tournaments: { totalTournaments: 245, activeTournaments: 12 }
      },
      recent: {
        users: [],
        transactions: [],
        tournaments: []
      },
      pending: {
        withdrawals: 8,
        verifications: 12,
        supportTickets: 5
      }
    };
  }

  getMockUsers() {
    return [
      {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        balance: 150.50,
        level: 5,
        status: 'active',
        isTelegramUser: true
      },
      {
        id: 'u2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        balance: 75.25,
        level: 3,
        status: 'active',
        isTelegramUser: true
      }
    ];
  }

  // Utility Methods
  setToken(token) {
    this.token = token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }

  clearData() {
    this.userData = null;
    this.token = null;
    delete axios.defaults.headers.common['Authorization'];
  }
}

// Create singleton instance
const mongoDBService = new MongoDBService();

export default mongoDBService;
