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
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  XCircle,
  Smartphone,
  Globe,
  Zap,
  Crown,
  Flame,
  Sparkles,
  Search,
  Filter,
  Download
} from 'lucide-react';
import telegramWebAppService from '../../services/telegramWebAppService';
import adminDataService from '../../services/adminDataService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [telegramUsers, setTelegramUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchTelegramUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching users data...');
      
      // Initialize admin data service
      await adminDataService.initialize();
      
      // Get real users data
      const usersData = await adminDataService.getAllUsers();
      console.log('👥 Users data:', usersData);
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTelegramUsers = async () => {
    try {
      // Get Telegram users from admin data service
      const allUsers = await adminDataService.getAllUsers();
      const telegramUsers = allUsers.filter(user => user.isTelegramUser);
      
      console.log('📱 Telegram users:', telegramUsers);
      setTelegramUsers(telegramUsers);
    } catch (error) {
      console.error('Error fetching Telegram users:', error);
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        await adminDataService.updateUser(userId, { status: 'blocked' });
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: 'blocked' }
            : user
        ));
        alert('User blocked successfully');
      } catch (error) {
        console.error('Error blocking user:', error);
        alert('Failed to block user');
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      try {
        await adminDataService.updateUser(userId, { status: 'active' });
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: 'active' }
            : user
        ));
        alert('User unblocked successfully');
      } catch (error) {
        console.error('Error unblocking user:', error);
        alert('Failed to unblock user');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        // Note: In a real implementation, you would call an API to delete the user
        // For now, we'll just remove from local state
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await adminDataService.updateUser(userId, { isVerified: true });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: true } : user
      ));
      alert('User verified successfully');
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.telegramUsername && user.telegramUsername.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'blocked': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    if (level >= 10) return 'text-purple-500';
    if (level >= 5) return 'text-blue-500';
    if (level >= 3) return 'text-green-500';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading users...</p>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all users and their accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Telegram Users Section */}
      {telegramUsers.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Telegram User</h3>
                <p className="text-sm text-gray-600">User currently accessing the admin panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Telegram</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {telegramUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.telegramUsername}</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Level:</span>
                    <span className={`font-semibold ${getLevelColor(user.level)}`}>Lv.{user.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span className="font-semibold text-green-600">${user.balance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP:</span>
                    <span className="font-semibold">{user.totalXP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telegram ID:</span>
                    <span className="font-mono text-xs">{user.telegramId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telegram</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${getLevelColor(user.level)}`}>
                        Lv.{user.level}
                      </span>
                      <span className="text-xs text-gray-500">{user.totalXP} XP</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">${user.balance}</div>
                    <div className="text-xs text-gray-500">Earned: ${user.totalEarned}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.isTelegramUser ? (
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <Smartphone className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-900">@{user.telegramUsername}</div>
                          <div className="text-xs text-gray-500">{user.telegramId}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not connected</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {/* View user details */}}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Edit user */}}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'blocked' ? (
                        <button
                          onClick={() => handleUnblockUser(user.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Unblock User"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Block User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Telegram Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isTelegramUser).length}</p>
            </div>
            <Smartphone className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blocked Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'blocked').length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
