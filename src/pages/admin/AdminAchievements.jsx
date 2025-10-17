import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  Users,
  Target,
  Calendar,
  Gift,
  CheckCircle,
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });

  // New achievement form state
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    type: 'quiz',
    icon: 'trophy',
    requirement: '',
    reward: '',
    isActive: true,
    rarity: 'common',
    category: 'general'
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockAchievements = [
        {
          id: 1,
          title: 'First Quiz Master',
          description: 'Complete your first quiz',
          type: 'quiz',
          icon: 'trophy',
          requirement: 'Complete 1 quiz',
          reward: 5,
          isActive: true,
          rarity: 'common',
          category: 'quiz',
          usersEarned: 1250,
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: 2,
          title: 'Quiz Streak Master',
          description: 'Complete 10 quizzes in a row',
          type: 'streak',
          icon: 'star',
          requirement: 'Complete 10 quizzes without failing',
          reward: 25,
          isActive: true,
          rarity: 'rare',
          category: 'streak',
          usersEarned: 89,
          createdAt: '2024-01-10',
          status: 'active'
        },
        {
          id: 3,
          title: 'Referral King',
          description: 'Refer 5 friends successfully',
          type: 'referral',
          icon: 'users',
          requirement: 'Refer 5 friends who complete their first quiz',
          reward: 50,
          isActive: false,
          rarity: 'epic',
          category: 'social',
          usersEarned: 23,
          createdAt: '2024-01-05',
          status: 'completed'
        },
        {
          id: 4,
          title: 'Tournament Champion',
          description: 'Win your first tournament',
          type: 'tournament',
          icon: 'award',
          requirement: 'Win 1 tournament',
          reward: 100,
          isActive: true,
          rarity: 'legendary',
          category: 'tournament',
          usersEarned: 12,
          createdAt: '2024-01-01',
          status: 'active'
        }
      ];

      setAchievements(mockAchievements);
      calculateStats(mockAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (achievementList) => {
    const stats = {
      total: achievementList.length,
      active: achievementList.filter(achievement => achievement.status === 'active').length,
      completed: achievementList.filter(achievement => achievement.status === 'completed').length,
      pending: achievementList.filter(achievement => achievement.status === 'pending').length
    };
    setStats(stats);
  };

  const handleCreateAchievement = async () => {
    try {
      // Add new achievement logic here
      const achievement = {
        id: Date.now(),
        ...newAchievement,
        usersEarned: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      
      setAchievements([...achievements, achievement]);
      setShowCreateModal(false);
      setNewAchievement({
        title: '',
        description: '',
        type: 'quiz',
        icon: 'trophy',
        requirement: '',
        reward: '',
        isActive: true,
        rarity: 'common',
        category: 'general'
      });
    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setNewAchievement(achievement);
    setShowCreateModal(true);
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter(achievement => achievement.id !== achievementId));
    }
  };

  const toggleAchievementStatus = async (achievementId) => {
    setAchievements(achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isActive: !achievement.isActive, status: !achievement.isActive ? 'active' : 'inactive' }
        : achievement
    ));
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || achievement.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-500 bg-gray-100';
      case 'rare': return 'text-blue-500 bg-blue-100';
      case 'epic': return 'text-purple-500 bg-purple-100';
      case 'legendary': return 'text-yellow-500 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'completed': return 'text-blue-500 bg-blue-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'inactive': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />;
      case 'gift': return <Gift className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" text="Loading achievements..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievement Management</h1>
          <p className="text-gray-400">Manage achievements and rewards for users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Achievement
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Achievements</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-500">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-blue-500">{stats.completed}</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="streak">Streak</option>
              <option value="referral">Referral</option>
              <option value="tournament">Tournament</option>
              <option value="social">Social</option>
            </select>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div key={achievement.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  {getIconComponent(achievement.icon)}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{achievement.title}</h3>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(achievement.status)}`}>
                  {achievement.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Requirement:</p>
                <p className="text-white text-sm">{achievement.requirement}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Reward:</p>
                  <p className="text-green-500 font-semibold">{achievement.reward} USDT</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Earned by:</p>
                  <p className="text-white font-semibold">{achievement.usersEarned} users</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Created: {achievement.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => handleEditAchievement(achievement)}
                className="p-1 text-blue-500 hover:text-blue-400"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleAchievementStatus(achievement.id)}
                className={`p-1 ${achievement.isActive ? 'text-yellow-500 hover:text-yellow-400' : 'text-green-500 hover:text-green-400'}`}
                title={achievement.isActive ? 'Deactivate' : 'Activate'}
              >
                {achievement.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDeleteAchievement(achievement.id)}
                className="p-1 text-red-500 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingAchievement ? 'Edit Achievement' : 'Create New Achievement'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAchievement(null);
                  setNewAchievement({
                    title: '',
                    description: '',
                    type: 'quiz',
                    icon: 'trophy',
                    requirement: '',
                    reward: '',
                    isActive: true,
                    rarity: 'common',
                    category: 'general'
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter achievement title"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
                  placeholder="Enter achievement description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Type</label>
                  <select
                    value={newAchievement.type}
                    onChange={(e) => setNewAchievement({...newAchievement, type: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="streak">Streak</option>
                    <option value="referral">Referral</option>
                    <option value="tournament">Tournament</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Icon</label>
                  <select
                    value={newAchievement.icon}
                    onChange={(e) => setNewAchievement({...newAchievement, icon: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="trophy">Trophy</option>
                    <option value="star">Star</option>
                    <option value="award">Award</option>
                    <option value="users">Users</option>
                    <option value="target">Target</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Requirement</label>
                <textarea
                  value={newAchievement.requirement}
                  onChange={(e) => setNewAchievement({...newAchievement, requirement: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="2"
                  placeholder="Enter achievement requirement"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Reward (USDT)</label>
                  <input
                    type="number"
                    value={newAchievement.reward}
                    onChange={(e) => setNewAchievement({...newAchievement, reward: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Rarity</label>
                  <select
                    value={newAchievement.rarity}
                    onChange={(e) => setNewAchievement({...newAchievement, rarity: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <select
                  value={newAchievement.category}
                  onChange={(e) => setNewAchievement({...newAchievement, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="quiz">Quiz</option>
                  <option value="social">Social</option>
                  <option value="tournament">Tournament</option>
                  <option value="referral">Referral</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newAchievement.isActive}
                  onChange={(e) => setNewAchievement({...newAchievement, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-white text-sm">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAchievement(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAchievement}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {editingAchievement ? 'Update Achievement' : 'Create Achievement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAchievements;
