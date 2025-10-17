import React, { useState, useEffect } from 'react'
import { 
  Home as HomeIcon, 
  Gift, 
  Trophy, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award, 
  Zap,
  Clock,
  Wallet,
  ChevronRight,
  Star,
  Flame,
  Crown,
  Settings,
  Bell,
  Shield
} from 'lucide-react'
import dataService from '../services/dataService'
import walletService from '../services/walletService'
import appSettingsService from '../services/appSettingsService'
import dailyBonusService from '../services/dailyBonusService'

const Home = () => {
  const [userData, setUserData] = useState({})
  const [dailyBonus, setDailyBonus] = useState(null)
  const [walletAddresses, setWalletAddresses] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [achievements, setAchievements] = useState([])
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      // Initialize dataService if not already initialized
      if (!dataService.isInitialized) {
        await dataService.initializeData()
      }
      
      setUserData(dataService.getUserData() || {})
      setRecentActivity(dataService.getRecentActivity ? dataService.getRecentActivity() : [])
      setAchievements(dataService.getAchievements ? dataService.getAchievements() : [])
      
      // Load app settings
      const appSettings = await appSettingsService.getAppSettings()
      setSettings(appSettings)
      
      // Check daily bonus (always check, fallback if settings not available)
      await checkDailyBonus()
      
      // Load wallet addresses
      await loadWalletAddresses()
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkDailyBonus = async () => {
    try {
      const bonusInfo = await dailyBonusService.checkDailyBonusAvailability()
      setDailyBonus(bonusInfo)
    } catch (error) {
      console.error('Error checking daily bonus:', error)
      // Fallback: Show daily bonus with default settings
      const today = new Date().toDateString()
      const lastBonusDate = localStorage.getItem('quizApp_lastBonusDate')
      
      if (lastBonusDate !== today) {
        setDailyBonus({
          available: true,
          reward: 1.0,
          baseReward: 1.0,
          streakMultiplier: 1.0,
          streak: 0,
          cooldown: null,
          nextAvailable: null
        })
      } else {
        setDailyBonus({
          available: false,
          reward: 1.0,
          baseReward: 1.0,
          streakMultiplier: 1.0,
          streak: 0,
          cooldown: "23:59:59",
          nextAvailable: null
        })
      }
    }
  }

  const claimDailyBonus = async () => {
    if (!dailyBonus?.available) return

    try {
      const result = await dailyBonusService.claimDailyBonus()
      
      if (result.success) {
        // Update local state immediately
        setUserData(prev => {
          const newData = {
            ...prev,
            availableBalance: (prev.availableBalance || 0) + result.reward,
            playableBalance: (prev.playableBalance || 0) + result.reward,
            totalEarned: (prev.totalEarned || 0) + result.reward,
            streak: result.streak
          }
          console.log('Home page - Updated user data:', newData)
          return newData
        })
        
        // Reload data to sync with backend
        await loadData()
        
        // Show success message
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error claiming daily bonus:', error)
      alert('Error claiming daily bonus. Please try again.')
    }
  }

  const loadWalletAddresses = async () => {
    try {
      const networks = await walletService.getAvailableNetworks()
      const walletAddressesData = []
      
      for (const network of networks) {
        const wallet = await walletService.getDepositAddress(network)
        if (wallet) {
          walletAddressesData.push({
            network,
            address: wallet.address,
            name: wallet.name,
            minDeposit: wallet.minDeposit || 1,
            maxDeposit: wallet.maxDeposit || 10000,
            processingTime: wallet.processingTime || '5-10 minutes'
          })
        }
      }
      
      setWalletAddresses(walletAddressesData)
    } catch (error) {
      console.error('Error loading wallet addresses:', error)
    }
  }

  const getContentSettings = () => {
    return settings?.content || {
      homePageTitle: 'Crypto Master',
      homePageSubtitle: 'Test your crypto knowledge and win USDT!'
    }
  }

  const getAppConfig = () => {
    return settings?.appConfig || {
      welcomeMessage: 'Welcome to Quizly! Test your crypto knowledge and win USDT!'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  const contentSettings = getContentSettings()
  const appConfig = getAppConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {contentSettings.homePageTitle}
          </h1>
          <p className="text-gray-300 text-sm">
            {contentSettings.homePageSubtitle}
          </p>
        </div>

        {/* Daily Bonus Card */}
        {dailyBonus && (
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Daily Bonus</h3>
                  <p className="text-gray-300 text-sm">
                    {dailyBonus.available ? 'Available now!' : 'Already claimed today'}
                  </p>
                  {dailyBonus.streak > 0 && (
                    <p className="text-yellow-400 text-xs">
                      {dailyBonus.streak} day streak • {dailyBonus.streakMultiplier}x multiplier
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">
                  ${dailyBonus.reward.toFixed(2)}
                </div>
                {dailyBonus.baseReward !== dailyBonus.reward && (
                  <div className="text-xs text-gray-400">
                    Base: ${dailyBonus.baseReward}
                  </div>
                )}
                <button
                  onClick={claimDailyBonus}
                  disabled={!dailyBonus.available}
                  className={`btn-sm ${
                    dailyBonus.available
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {dailyBonus.available ? 'Claim Now' : 'Claimed'}
                </button>
              </div>
            </div>
            
            {/* Cooldown Timer */}
            {!dailyBonus.available && dailyBonus.cooldown && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Next bonus in: {dailyBonus.cooldown}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{userData.level || 1}</div>
            <div className="text-gray-300 text-sm">Level</div>
          </div>
          <div className="card text-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">${(userData.availableBalance || userData.balance || 0).toFixed(2)}</div>
            <div className="text-gray-300 text-sm">Balance</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>XP Progress</span>
                <span>{userData.totalXP || 0} / {(userData.level || 1) * 100}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${((userData.totalXP || 0) % 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>Quiz Streak</span>
                <span>{userData.streak || 0} days</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                  style={{ width: `${Math.min((userData.streak || 0) * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/quiz" className="btn-primary text-center">
              <Target className="w-5 h-5 mr-2" />
              Start Quiz
            </a>
            {settings?.features?.tournaments && (
              <a href="/tournaments" className="btn-secondary text-center">
                <Trophy className="w-5 h-5 mr-2" />
                Tournaments
              </a>
            )}
            {settings?.features?.tasks && (
              <a href="/earn" className="btn-secondary text-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Earn Tasks
              </a>
            )}
            <a href="/deposit" className="btn-secondary text-center">
              <Wallet className="w-5 h-5 mr-2" />
              Deposit
            </a>
          </div>
        </div>

        {/* Deposit Addresses */}
        {walletAddresses.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Deposit Addresses</h3>
            <div className="space-y-3">
              {walletAddresses.slice(0, 3).map((wallet, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{wallet.network}</span>
                    <span className="text-xs text-gray-500">{wallet.processingTime}</span>
                  </div>
                  <div className="text-xs text-gray-400 break-all">{wallet.address}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min: ${wallet.minDeposit} | Max: ${wallet.maxDeposit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Overview */}
        <div className="card mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Performance Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{userData.quizzesCompleted || 0}</div>
              <div className="text-gray-300 text-sm">Quizzes Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userData.correctAnswers || 0}</div>
              <div className="text-gray-300 text-sm">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{userData.totalEarned || 0}</div>
              <div className="text-gray-300 text-sm">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{userData.achievements || 0}</div>
              <div className="text-gray-300 text-sm">Achievements</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{activity.title}</div>
                    <div className="text-xs text-gray-400">{activity.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {settings?.features?.achievements && achievements.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{achievement.title}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                  </div>
                  <div className="text-xs text-yellow-400">+{achievement.reward} USDT</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak Info */}
        {userData.streak > 0 && (
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">Current Streak</div>
                <div className="text-xs text-gray-400">{userData.streak} days in a row!</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-400">{userData.streak}</div>
                <div className="text-xs text-gray-400">days</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home