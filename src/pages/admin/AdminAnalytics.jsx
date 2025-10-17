import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Trophy,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalRevenue: 0,
      totalQuizzes: 0,
      totalTournaments: 0,
      totalTransactions: 0
    },
    userStats: {
      newUsers: [],
      activeUsers: [],
      userRetention: 0
    },
    revenueStats: {
      dailyRevenue: [],
      monthlyRevenue: [],
      totalRevenue: 0
    },
    quizStats: {
      totalQuizzes: 0,
      averageScore: 0,
      completionRate: 0,
      difficultyDistribution: {}
    },
    tournamentStats: {
      totalTournaments: 0,
      averageParticipants: 0,
      winRate: 0,
      prizeDistribution: {}
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API call
      const mockAnalytics = {
        overview: {
          totalUsers: 1250,
          activeUsers: 890,
          totalRevenue: 12500,
          totalQuizzes: 15600,
          totalTournaments: 245,
          totalTransactions: 890
        },
        userStats: {
          newUsers: [
            { date: '2024-01-01', count: 45 },
            { date: '2024-01-02', count: 52 },
            { date: '2024-01-03', count: 38 },
            { date: '2024-01-04', count: 61 },
            { date: '2024-01-05', count: 47 },
            { date: '2024-01-06', count: 55 },
            { date: '2024-01-07', count: 43 }
          ],
          activeUsers: [
            { date: '2024-01-01', count: 320 },
            { date: '2024-01-02', count: 345 },
            { date: '2024-01-03', count: 298 },
            { date: '2024-01-04', count: 367 },
            { date: '2024-01-05', count: 312 },
            { date: '2024-01-06', count: 389 },
            { date: '2024-01-07', count: 356 }
          ],
          userRetention: 78.5
        },
        revenueStats: {
          dailyRevenue: [
            { date: '2024-01-01', amount: 1250 },
            { date: '2024-01-02', amount: 1380 },
            { date: '2024-01-03', amount: 1120 },
            { date: '2024-01-04', amount: 1450 },
            { date: '2024-01-05', amount: 1320 },
            { date: '2024-01-06', amount: 1580 },
            { date: '2024-01-07', amount: 1420 }
          ],
          monthlyRevenue: [
            { month: 'Jan', amount: 8500 },
            { month: 'Feb', amount: 9200 },
            { month: 'Mar', amount: 7800 },
            { month: 'Apr', amount: 10500 },
            { month: 'May', amount: 11200 },
            { month: 'Jun', amount: 12500 }
          ],
          totalRevenue: 12500
        },
        quizStats: {
          totalQuizzes: 15600,
          averageScore: 72.5,
          completionRate: 85.2,
          difficultyDistribution: {
            easy: 45,
            medium: 35,
            hard: 20
          }
        },
        tournamentStats: {
          totalTournaments: 245,
          averageParticipants: 12.5,
          winRate: 8.3,
          prizeDistribution: {
            '1st': 50,
            '2nd': 30,
            '3rd': 20
          }
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.totalUsers)}</p>
              <p className="text-green-500 text-xs">+12.5% from last period</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.activeUsers)}</p>
              <p className="text-green-500 text-xs">+8.3% from last period</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(analytics.overview.totalRevenue)}</p>
              <p className="text-green-500 text-xs">+15.2% from last period</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Quizzes</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analytics.overview.totalQuizzes)}</p>
              <p className="text-green-500 text-xs">+22.1% from last period</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tournaments</p>
              <p className="text-2xl font-bold text-white">{analytics.overview.totalTournaments}</p>
              <p className="text-green-500 text-xs">+5.7% from last period</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-white">{analytics.overview.totalTransactions}</p>
              <p className="text-green-500 text-xs">+18.9% from last period</p>
            </div>
            <BarChart3 className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">User Growth</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400 text-sm">New Users</span>
              <div className="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
              <span className="text-gray-400 text-sm">Active Users</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.userStats.newUsers.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1">
                  <div 
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${(data.count / 70) * 100}px` }}
                  ></div>
                  <div 
                    className="w-8 bg-green-500 rounded-t"
                    style={{ height: `${(analytics.userStats.activeUsers[index].count / 400) * 100}px` }}
                  ></div>
                </div>
                <span className="text-gray-400 text-xs">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <div className="text-green-500 text-sm font-medium">
              +15.2% from last period
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.revenueStats.dailyRevenue.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div 
                  className="w-8 bg-green-500 rounded-t"
                  style={{ height: `${(data.amount / 1600) * 100}px` }}
                ></div>
                <span className="text-gray-400 text-xs">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Statistics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Quiz Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Quizzes</span>
              <span className="text-white font-semibold">{formatNumber(analytics.quizStats.totalQuizzes)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Score</span>
              <span className="text-white font-semibold">{analytics.quizStats.averageScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completion Rate</span>
              <span className="text-white font-semibold">{analytics.quizStats.completionRate}%</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Difficulty Distribution</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Easy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.quizStats.difficultyDistribution.easy}%` }}></div>
                    </div>
                    <span className="text-white text-sm">{analytics.quizStats.difficultyDistribution.easy}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Medium</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analytics.quizStats.difficultyDistribution.medium}%` }}></div>
                    </div>
                    <span className="text-white text-sm">{analytics.quizStats.difficultyDistribution.medium}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Hard</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${analytics.quizStats.difficultyDistribution.hard}%` }}></div>
                    </div>
                    <span className="text-white text-sm">{analytics.quizStats.difficultyDistribution.hard}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Statistics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Tournament Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Tournaments</span>
              <span className="text-white font-semibold">{analytics.tournamentStats.totalTournaments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Participants</span>
              <span className="text-white font-semibold">{analytics.tournamentStats.averageParticipants}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-white font-semibold">{analytics.tournamentStats.winRate}%</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Prize Distribution</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">1st Place</span>
                  <span className="text-white text-sm">{analytics.tournamentStats.prizeDistribution['1st']}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">2nd Place</span>
                  <span className="text-white text-sm">{analytics.tournamentStats.prizeDistribution['2nd']}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">3rd Place</span>
                  <span className="text-white text-sm">{analytics.tournamentStats.prizeDistribution['3rd']}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Retention */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">User Retention</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{analytics.userStats.userRetention}%</div>
              <p className="text-gray-400 text-sm">Overall Retention Rate</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Day 1</span>
                <span className="text-white text-sm">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Day 7</span>
                <span className="text-white text-sm">72%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Day 30</span>
                <span className="text-white text-sm">58%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Day 90</span>
                <span className="text-white text-sm">45%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
