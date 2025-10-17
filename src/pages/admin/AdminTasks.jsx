import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'social',
    reward: '',
    requirements: '',
    isActive: true,
    maxCompletions: 0,
    expiryDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockTasks = [
        {
          id: 1,
          title: 'Follow Telegram Channel',
          description: 'Follow our official Telegram channel',
          type: 'social',
          reward: 5,
          requirements: 'Must follow for at least 7 days',
          isActive: true,
          maxCompletions: 1000,
          currentCompletions: 245,
          expiryDate: '2024-12-31',
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: 2,
          title: 'Share Quiz Result',
          description: 'Share your quiz result on social media',
          type: 'social',
          reward: 3,
          requirements: 'Must include hashtag #CryptoQuiz',
          isActive: true,
          maxCompletions: 500,
          currentCompletions: 89,
          expiryDate: '2024-12-31',
          createdAt: '2024-01-10',
          status: 'active'
        },
        {
          id: 3,
          title: 'Refer a Friend',
          description: 'Invite a friend to join CryptoQuiz',
          type: 'referral',
          reward: 10,
          requirements: 'Friend must complete first quiz',
          isActive: false,
          maxCompletions: 100,
          currentCompletions: 45,
          expiryDate: '2024-11-30',
          createdAt: '2024-01-05',
          status: 'completed'
        }
      ];

      setTasks(mockTasks);
      calculateStats(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const stats = {
      total: taskList.length,
      active: taskList.filter(task => task.status === 'active').length,
      completed: taskList.filter(task => task.status === 'completed').length,
      pending: taskList.filter(task => task.status === 'pending').length
    };
    setStats(stats);
  };

  const handleCreateTask = async () => {
    try {
      // Add new task logic here
      const task = {
        id: Date.now(),
        ...newTask,
        currentCompletions: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      
      setTasks([...tasks, task]);
      setShowCreateModal(false);
      setNewTask({
        title: '',
        description: '',
        type: 'social',
        reward: '',
        requirements: '',
        isActive: true,
        maxCompletions: 0,
        expiryDate: ''
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setShowCreateModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const toggleTaskStatus = async (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isActive: !task.isActive, status: !task.isActive ? 'active' : 'inactive' }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'completed': return 'text-blue-500 bg-blue-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'inactive': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'social': return <Users className="w-4 h-4" />;
      case 'referral': return <Target className="w-4 h-4" />;
      case 'quiz': return <BarChart3 className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" text="Loading tasks..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Management</h1>
          <p className="text-gray-400">Manage earning tasks for users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
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
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
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
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 hover:bg-gray-600 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-white font-medium">Task</th>
                <th className="px-4 py-3 text-left text-white font-medium">Type</th>
                <th className="px-4 py-3 text-left text-white font-medium">Reward</th>
                <th className="px-4 py-3 text-left text-white font-medium">Completions</th>
                <th className="px-4 py-3 text-left text-white font-medium">Status</th>
                <th className="px-4 py-3 text-left text-white font-medium">Expiry</th>
                <th className="px-4 py-3 text-left text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{task.title}</p>
                      <p className="text-gray-400 text-sm">{task.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(task.type)}
                      <span className="text-gray-300 capitalize">{task.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 font-medium">{task.reward} USDT</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white">{task.currentCompletions}/{task.maxCompletions || '∞'}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${task.maxCompletions > 0 ? (task.currentCompletions / task.maxCompletions) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{task.expiryDate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-blue-500 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`p-1 ${task.isActive ? 'text-yellow-500 hover:text-yellow-400' : 'text-green-500 hover:text-green-400'}`}
                        title={task.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {task.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-red-500 hover:text-red-400"
                        title="Delete"
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

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTask(null);
                  setNewTask({
                    title: '',
                    description: '',
                    type: 'social',
                    reward: '',
                    requirements: '',
                    isActive: true,
                    maxCompletions: 0,
                    expiryDate: ''
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
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="social">Social Media</option>
                    <option value="referral">Referral</option>
                    <option value="quiz">Quiz</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Reward (USDT)</label>
                  <input
                    type="number"
                    value={newTask.reward}
                    onChange={(e) => setNewTask({...newTask, reward: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Requirements</label>
                <textarea
                  value={newTask.requirements}
                  onChange={(e) => setNewTask({...newTask, requirements: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="2"
                  placeholder="Enter task requirements"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Max Completions</label>
                  <input
                    type="number"
                    value={newTask.maxCompletions}
                    onChange={(e) => setNewTask({...newTask, maxCompletions: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="0 for unlimited"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={newTask.expiryDate}
                    onChange={(e) => setNewTask({...newTask, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newTask.isActive}
                  onChange={(e) => setNewTask({...newTask, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-white text-sm">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTask(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
