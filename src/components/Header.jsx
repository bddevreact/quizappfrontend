import React, { useState, useEffect } from 'react'
import { 
  User, 
  DollarSign, 
  Trophy, 
  TrendingUp,
  Settings,
  Bell,
  Gift,
  Shield,
  Zap,
  Users,
  Crown,
  Star,
  Flame,
  Sparkles,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Wallet,
  Target,
  Award,
  Activity,
  Menu,
  X
} from 'lucide-react'
import dataService from '../services/dataService'
import appSettingsService from '../services/appSettingsService'
import { useDebounce } from '../hooks/useDebounce'

const Header = ({ user, isTelegramUser }) => {
  const [userData, setUserData] = useState({})
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const debouncedUserData = useDebounce(userData, 300)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!dataService.isInitialized) {
          await dataService.initializeData()
        }
        setUserData(dataService.getUserData() || {})

        const appSettings = await appSettingsService.getAppSettings()
        setSettings(appSettings)
      } catch (error) {
        console.error('Error loading header data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    const unsubscribe = appSettingsService.subscribeToSettings((newSettings) => {
      setSettings(newSettings)
    })

    return unsubscribe
  }, [])

  if (isLoading || !settings?.layout?.showHeader) {
    return null
  }

  const formatBalance = (balance) => {
    return parseFloat(balance || 0).toFixed(2)
  }

  const getLevelColor = (level) => {
    if (level >= 20) return 'text-purple-400'
    if (level >= 15) return 'text-blue-400'
    if (level >= 10) return 'text-green-400'
    if (level >= 5) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const getLevelIcon = (level) => {
    if (level >= 20) return <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
    if (level >= 15) return <Star className="w-3 h-3 sm:w-4 sm:h-4" />
    if (level >= 10) return <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
    if (level >= 5) return <Award className="w-3 h-3 sm:w-4 sm:h-4" />
    return <User className="w-3 h-3 sm:w-4 sm:h-4" />
  }

  const getXPProgress = () => {
    const currentXP = debouncedUserData.totalXP || 0
    const currentLevel = debouncedUserData.level || 1
    const xpForCurrentLevel = (currentLevel - 1) * 100
    const xpForNextLevel = currentLevel * 100
    const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  const getRankTitle = (level) => {
    if (level >= 20) return 'Legend'
    if (level >= 15) return 'Master'
    if (level >= 10) return 'Expert'
    if (level >= 5) return 'Advanced'
    return 'Beginner'
  }

  const currentUser = user || debouncedUserData

  return (
    <>
      {/* Background Blur Effect */}
      <div className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-b from-black/20 via-black/10 to-transparent pointer-events-none z-30"></div>
      
      {/* Main Header */}
      <header className="relative z-40">
        {/* Glassmorphism Container */}
        <div className="mx-2 sm:mx-4 mt-2 sm:mt-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl">
          {/* Inner Container */}
          <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4">
            
            {/* Main Header Content */}
            <div className="flex items-center justify-between">
              {/* User Info Section */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                {/* Avatar with Level Badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    {currentUser?.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt="User Avatar" 
                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>
                  
                  {/* Level Badge */}
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-1 sm:px-2 py-0.5 rounded-full shadow-lg">
                    {currentUser?.level || 1}
                  </div>
                  
                  {/* Telegram Indicator */}
                  {isTelegramUser && (
                    <div className="absolute -top-0.5 -left-0.5 sm:-top-1 sm:-left-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <h2 className="text-sm sm:text-lg font-bold text-white truncate">
                      {currentUser?.name || currentUser?.fullName || 'Guest User'}
                    </h2>
                    <div className={`flex items-center space-x-1 ${getLevelColor(currentUser?.level)}`}>
                      {getLevelIcon(currentUser?.level)}
                      <span className="text-xs sm:text-sm font-semibold hidden sm:inline">
                        {getRankTitle(currentUser?.level)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-300">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{currentUser?.totalXP || 0} XP</span>
                    </span>
                    <span className="flex items-center space-x-1 hidden sm:flex">
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{currentUser?.tournamentsWon || 0} Wins</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden sm:flex items-center space-x-2">
                {/* Balance Toggle */}
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  <Wallet className="w-4 h-4 text-white" />
                  {balanceVisible ? (
                    <span className="text-white font-semibold">
                      ${formatBalance(currentUser?.availableBalance || currentUser?.balance)}
                    </span>
                  ) : (
                    <EyeOff className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Daily Bonus */}
                {settings?.features?.dailyBonus && (
                  <div className="relative">
                    <button className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg">
                      <Gift className="w-5 h-5 text-white" />
                    </button>
                    {currentUser?.dailyBonusAvailable && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                )}

                {/* Notifications */}
                {settings?.features?.notifications && (
                  <div className="relative">
                    <button className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg">
                      <Bell className="w-5 h-5 text-white" />
                    </button>
                    {currentUser?.unreadNotifications > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {currentUser.unreadNotifications > 9 ? '9+' : currentUser.unreadNotifications}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Settings */}
                <button className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg">
                  <Settings className="w-5 h-5 text-white" />
                </button>

                {/* Expand/Collapse Details */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  {showDetails ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden flex items-center space-x-1">
                {/* Balance - Mobile */}
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="flex items-center space-x-1 px-2 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-xs font-semibold text-white"
                >
                  <Wallet className="w-3 h-3" />
                  {balanceVisible ? (
                    <span>${formatBalance(currentUser?.availableBalance || currentUser?.balance)}</span>
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="sm:hidden mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-around space-x-2">
                  {/* Daily Bonus */}
                  {settings?.features?.dailyBonus && (
                    <div className="relative">
                      <button className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                        <Gift className="w-4 h-4 text-white" />
                      </button>
                      {currentUser?.dailyBonusAvailable && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  )}

                  {/* Notifications */}
                  {settings?.features?.notifications && (
                    <div className="relative">
                      <button className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                        <Bell className="w-4 h-4 text-white" />
                      </button>
                      {currentUser?.unreadNotifications > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {currentUser.unreadNotifications > 9 ? '9+' : currentUser.unreadNotifications}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Settings */}
                  <button className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                    <Settings className="w-4 h-4 text-white" />
                  </button>

                  {/* Expand Details */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
                  >
                    {showDetails ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            )}

            {/* XP Progress Bar */}
            <div className="mt-3 sm:mt-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">
                <span className="flex items-center space-x-1 sm:space-x-2">
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                  <span>Level {currentUser?.level || 1}</span>
                </span>
                <span className="text-xs sm:text-sm">{currentUser?.totalXP || 0} / {(currentUser?.level || 1) * 100} XP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${getXPProgress()}%` }}
                >
                  <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {showDetails && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Stats */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-300">Statistics</h4>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Quizzes Completed:</span>
                        <span className="text-white">{currentUser?.questionsAnswered || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span className="text-white">{currentUser?.averageScore || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Streak:</span>
                        <span className="text-white">{currentUser?.streak || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-300">Achievements</h4>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Total Earned:</span>
                        <span className="text-green-400">${formatBalance(currentUser?.totalEarned)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Referrals:</span>
                        <span className="text-white">{currentUser?.invitedFriends || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rank:</span>
                        <span className="text-yellow-400">{currentUser?.rank || 'Bronze'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Indicators */}
                {settings?.features && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2">Active Features</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {settings.features.tournaments && (
                        <div className="flex items-center space-x-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                          <Trophy className="w-3 h-3" />
                          <span>Tournaments</span>
                        </div>
                      )}
                      {settings.features.tasks && (
                        <div className="flex items-center space-x-1 text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                          <Zap className="w-3 h-3" />
                          <span>Tasks</span>
                        </div>
                      )}
                      {settings.features.referrals && (
                        <div className="flex items-center space-x-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          <Users className="w-3 h-3" />
                          <span>Referrals</span>
                        </div>
                      )}
                      {settings.features.achievements && (
                        <div className="flex items-center space-x-1 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          <Shield className="w-3 h-3" />
                          <span>Achievements</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header