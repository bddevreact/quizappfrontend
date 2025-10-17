import React, { useState, useEffect } from 'react'
import { 
  Home, 
  HelpCircle, 
  Trophy, 
  DollarSign, 
  User,
  Gift,
  Settings,
  Bell,
  Shield,
  Users,
  Target,
  Zap,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  Crown,
  Flame,
  Plus,
  Menu,
  X
} from 'lucide-react'
import appSettingsService from '../services/appSettingsService'

const BottomNavbar = ({ user }) => {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(window.location.pathname)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const appSettings = await appSettingsService.getAppSettings()
        setSettings(appSettings)
      } catch (error) {
        console.error('Error loading settings:', error)
        setSettings(appSettingsService.getDefaultSettings())
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()

    const unsubscribe = appSettingsService.subscribeToSettings((newSettings) => {
      setSettings(newSettings)
    })

    return unsubscribe
  }, [])

  if (isLoading || !settings?.layout?.showBottomNav) {
    return null
  }

  const navigation = [
    { 
      path: '/', 
      icon: Home, 
      label: settings?.content?.homePageTitle || 'Home',
      enabled: true,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/quiz', 
      icon: HelpCircle, 
      label: settings?.content?.quizPageTitle || 'Quiz',
      enabled: true,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      path: '/tournaments', 
      icon: Trophy, 
      label: settings?.content?.tournamentPageTitle || 'Tournaments',
      enabled: settings?.features?.tournaments,
      color: 'yellow',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      path: '/earn', 
      icon: DollarSign, 
      label: settings?.content?.earnPageTitle || 'Earn',
      enabled: settings?.features?.tasks,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: settings?.content?.profilePageTitle || 'Profile',
      enabled: true,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600'
    }
  ]

  const enabledNavigation = navigation.filter(item => item.enabled)

  const handleTabClick = (path) => {
    setActiveTab(path)
    setShowMobileMenu(false)
    window.location.href = path
  }

  return (
    <>
      {/* Background Blur Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none z-40"></div>
      
      {/* Main Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Glassmorphism Container */}
        <div className="mx-2 sm:mx-4 mb-2 sm:mb-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl">
          {/* Inner Container */}
          <div className="bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex justify-around items-center">
              {enabledNavigation.map((item, index) => {
                const Icon = item.icon
                const isActive = activeTab === item.path
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleTabClick(item.path)}
                    className={`relative flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 transform ${
                      isActive
                        ? 'scale-105 bg-gradient-to-r ' + item.gradient + ' shadow-lg shadow-' + item.color + '-500/25'
                        : 'hover:scale-105 hover:bg-white/10'
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <>
                        <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-${item.color}-400 rounded-full animate-pulse`}></div>
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl opacity-20 animate-pulse`}></div>
                      </>
                    )}
                    
                    {/* Icon Container */}
                    <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'hover:bg-white/10'
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-gray-400 hover:text-white'
                      }`} />
                      
                      {/* Special Effects for Active Tab */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white/60 animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                      isActive 
                        ? 'text-white font-semibold drop-shadow-sm' 
                        : 'text-gray-400 hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Level Badge for Profile */}
                    {item.path === '/profile' && user?.level && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                        {user.level}
                      </div>
                    )}
                    
                    {/* Notification Badge */}
                    {item.path === '/earn' && user?.pendingTasks > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce">
                        {user.pendingTasks}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden">
              {/* Main Mobile Nav */}
              <div className="flex justify-around items-center">
                {enabledNavigation.slice(0, 3).map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.path
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleTabClick(item.path)}
                      className={`relative flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r ' + item.gradient + ' shadow-lg'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium mt-1 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-400'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
                
                {/* More Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="flex flex-col items-center py-2 px-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {showMobileMenu ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
                  </div>
                  <span className="text-xs font-medium mt-1 text-gray-400">More</span>
                </button>
              </div>

              {/* Expanded Mobile Menu */}
              {showMobileMenu && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="flex justify-around items-center">
                    {enabledNavigation.slice(3).map((item, index) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.path
                      
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleTabClick(item.path)}
                          className={`relative flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r ' + item.gradient + ' shadow-lg'
                              : 'hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`w-5 h-5 transition-all duration-300 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-gray-400'
                          }`} />
                          <span className={`text-xs font-medium mt-1 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-gray-400'
                          }`}>
                            {item.label}
                          </span>
                          
                          {/* Level Badge for Profile */}
                          {item.path === '/profile' && user?.level && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-1 py-0.5 rounded-full shadow-lg">
                              {user.level}
                            </div>
                          )}
                          
                          {/* Notification Badge */}
                          {item.path === '/earn' && user?.pendingTasks > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full shadow-lg animate-bounce">
                              {user.pendingTasks}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Floating Action Buttons - Desktop Only */}
      <div className="hidden sm:block fixed bottom-20 right-4 z-50">
        <div className="flex flex-col space-y-2">
          {/* Daily Bonus Button */}
          {settings?.features?.dailyBonus && user?.dailyBonusAvailable && (
            <button className="group relative">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Daily Bonus Available!
              </div>
            </button>
          )}
          
          {/* Quick Quiz Button */}
          <button 
            onClick={() => handleTabClick('/quiz')}
            className="group relative"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Quick Quiz
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="sm:hidden fixed bottom-20 right-4 z-50">
        <div className="flex flex-col space-y-2">
          {/* Daily Bonus Button - Mobile */}
          {settings?.features?.dailyBonus && user?.dailyBonusAvailable && (
            <button className="group relative">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
          )}
          
          {/* Quick Quiz Button - Mobile */}
          <button 
            onClick={() => handleTabClick('/quiz')}
            className="group relative"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default BottomNavbar