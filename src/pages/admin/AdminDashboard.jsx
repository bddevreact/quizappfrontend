import React, { useEffect, useState } from 'react';
import { 
  User, 
  Wallet, 
  Trophy, 
  Target, 
  TrendingUp, 
  Activity,
  Star,
  Gift,
  Users,
  Award,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  Megaphone,
  CheckCircle,
  Database,
  Wallet as WalletIcon,
  Smartphone,
  Globe,
  Zap,
  Crown,
  Flame,
  Sparkles
} from 'lucide-react';
import telegramWebAppService from '../../services/telegramWebAppService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telegramStats, setTelegramStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchTelegramStats();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setDashboardData(result.data);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Fallback to mock data
      const mockData = {
        overview: {
          users: {
            totalUsers: 1250,
            activeUsers: 890,
            newUsers: 45,
            telegramUsers: 320
          },
          revenue: {
            totalRevenue: 12500,
            dailyRevenue: 450,
            monthlyRevenue: 8500,
            pendingWithdrawals: 1200
          },
          quiz: {
            totalQuizzes: 15600,
            averageScore: 72.5,
            completionRate: 85.2,
            dailyQuizzes: 245
          },
          tournaments: {
            totalTournaments: 245,
            activeTournaments: 12,
            totalParticipants: 1250,
            totalPrizePool: 8500
          },
          dailyBonus: {
            totalClaims: 3450,
            claimsToday: 89,
            totalDistributed: 1250.50,
            averageStreak: 3.2,
            topStreak: 15,
            claimsThisWeek: 456,
            claimsThisMonth: 1890
          }
        },
        recent: {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', status: 'active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-14', status: 'active' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2024-01-13', status: 'pending' }
          ],
          transactions: [
            { id: 1, user: 'John Doe', amount: 50, type: 'deposit', status: 'completed', date: '2024-01-15' },
            { id: 2, user: 'Jane Smith', amount: 25, type: 'withdrawal', status: 'pending', date: '2024-01-14' },
            { id: 3, user: 'Bob Johnson', amount: 100, type: 'deposit', status: 'completed', date: '2024-01-13' }
          ],
          tournaments: [
            { id: 1, name: 'Crypto Master', participants: 25, prizePool: 500, status: 'active' },
            { id: 2, name: 'Quiz Champion', participants: 18, prizePool: 300, status: 'completed' },
            { id: 3, name: 'Bitcoin Expert', participants: 32, prizePool: 750, status: 'active' }
          ]
        },
        pending: {
          withdrawals: 8,
          verifications: 12,
          supportTickets: 5,
          tournamentApprovals: 3
        }
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTelegramStats = async () => {
    try {
      // Check if Telegram WebApp is available
      const isTelegram = telegramWebAppService.isTelegramWebApp();
      const userData = telegramWebAppService.getUserData();
      
      const telegramData = {
        isAvailable: isTelegram,
        userData: userData,
        platform: telegramWebAppService.getPlatform(),
        version: telegramWebAppService.getVersion(),
        theme: telegramWebAppService.isDarkTheme() ? 'dark' : 'light',
        isInitialized: telegramWebAppService.getInitializationStatus()
      };

      setTelegramStats(telegramData);
    } catch (error) {
      console.error('Error fetching Telegram stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  const { overview, recent, pending } = dashboardData;

  const statsCards = [
    {
      title: 'Total Users',
      value: overview.users.totalUsers,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: overview.users.activeUsers,
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Telegram Users',
      value: overview.users.telegramUsers,
      change: '+25%',
      changeType: 'positive',
      icon: Smartphone,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `$${overview.revenue.totalRevenue.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive',
      icon: Wallet,
      color: 'yellow'
    },
    {
      title: 'Daily Revenue',
      value: `$${overview.revenue.dailyRevenue}`,
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Total Quizzes',
      value: overview.quiz.totalQuizzes.toLocaleString(),
      change: '+22%',
      changeType: 'positive',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Tournaments',
      value: overview.tournaments.totalTournaments,
      change: '+18%',
      changeType: 'positive',
      icon: Trophy,
      color: 'orange'
    },
    {
      title: 'Prize Pool',
      value: `$${overview.tournaments.totalPrizePool.toLocaleString()}`,
      change: '+30%',
      changeType: 'positive',
      icon: Award,
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      orange: 'bg-orange-500 text-white',
      pink: 'bg-pink-500 text-white'
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your CryptoQuiz platform</p>
      </div>

      {/* Telegram WebApp Status */}
      {telegramStats && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Telegram WebApp Status</h3>
                <p className="text-sm text-gray-600">
                  {telegramStats.isAvailable ? 'Connected to Telegram' : 'Not running in Telegram'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{telegramStats.platform}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>v{telegramStats.version}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  telegramStats.isInitialized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {telegramStats.isInitialized ? 'Initialized' : 'Not Initialized'}
                </span>
              </div>
            </div>
          </div>
          
          {telegramStats.userData && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {telegramStats.userData.fullName || telegramStats.userData.name || 'Telegram User'}
                  </p>
                  <p className="text-xs text-gray-600">
                    ID: {telegramStats.userData.telegramId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Bonus Analytics */}
      {dashboardData?.overview?.dailyBonus && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Gift className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Daily Bonus Analytics</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{dashboardData.overview.dailyBonus.totalClaims}</div>
              <div className="text-sm text-gray-600">Total Claims</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{dashboardData.overview.dailyBonus.claimsToday}</div>
              <div className="text-sm text-gray-600">Claims Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">${dashboardData.overview.dailyBonus.totalDistributed.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{dashboardData.overview.dailyBonus.averageStreak}</div>
              <div className="text-sm text-gray-600">Avg Streak</div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Top Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{dashboardData.overview.dailyBonus.topStreak} days</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">This Week</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{dashboardData.overview.dailyBonus.claimsThisWeek} claims</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">This Month</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{dashboardData.overview.dailyBonus.claimsThisMonth} claims</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recent.users.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recent.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Wallet className={`w-4 h-4 ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{transaction.user}</p>
                  <p className="text-xs text-gray-500">${transaction.amount}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tournaments</h3>
            <Trophy className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recent.tournaments.map((tournament) => (
              <div key={tournament.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{tournament.name}</p>
                  <p className="text-xs text-gray-500">{tournament.participants} participants</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tournament.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tournament.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wallet className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Withdrawals</p>
              <p className="text-lg font-bold text-yellow-600">{pending.withdrawals}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Verifications</p>
              <p className="text-lg font-bold text-blue-600">{pending.verifications}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Support Tickets</p>
              <p className="text-lg font-bold text-red-600">{pending.supportTickets}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Tournament Approvals</p>
              <p className="text-lg font-bold text-purple-600">{pending.tournamentApprovals}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;