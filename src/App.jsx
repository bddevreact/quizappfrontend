import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNavbar from './components/BottomNavbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import telegramWebAppService from './services/telegramWebAppService';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Deposit from './pages/Deposit';
import Tournaments from './pages/Tournaments';
import Earn from './pages/Earn';
import Profile from './pages/Profile';
import appSettingsService from './services/appSettingsService';

// Admin components
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDashboardEnhanced from './pages/admin/AdminDashboardEnhanced';
import AdminUsers from './pages/admin/AdminUsers';
import AdminQuiz from './pages/admin/AdminQuiz';
import AdminTournaments from './pages/admin/AdminTournaments';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminTasks from './pages/admin/AdminTasks';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSecurity from './pages/admin/AdminSecurity';
import AdminLossPrevention from './pages/admin/AdminLossPrevention';
import AdminMarketingTasks from './pages/admin/AdminMarketingTasks';
import AdminTaskVerifications from './pages/admin/AdminTaskVerifications';
import AdminReferrals from './pages/admin/AdminReferrals';
import AdminDailyBonus from './pages/admin/AdminDailyBonus';
import AdminWalletSettings from './pages/admin/AdminWalletSettings';
import AdminAppSettings from './pages/admin/AdminAppSettings';
import TelegramDebugInfo from './components/TelegramDebugInfo';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isTelegramUser, setIsTelegramUser] = useState(false);
  const [telegramData, setTelegramData] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize app settings
        await appSettingsService.initializeSettings();
        
        // Check maintenance mode
        const shouldShowMaintenance = await appSettingsService.shouldShowMaintenanceMode();
        setIsMaintenanceMode(shouldShowMaintenance);
        
        if (shouldShowMaintenance) {
          const message = await appSettingsService.getMaintenanceMessage();
          setMaintenanceMessage(message);
        }

        // Initialize Telegram WebApp
        const isTelegram = telegramWebAppService.isTelegramWebApp();
        setIsTelegramUser(isTelegram);

        if (isTelegram) {
          try {
            console.log('🚀 Setting up Telegram WebApp callbacks...');
            
            // Set up callbacks
            telegramWebAppService.setCallbacks({
              onUserData: (data) => {
                console.log('📱 Telegram User Data Callback:', data);
                setUser(data.user);
                setTelegramData(data);
              },
              onError: (error) => {
                console.error('❌ Telegram WebApp Error:', error);
              },
              onInitialized: (status) => {
                console.log('✅ Telegram WebApp Initialized:', status);
              }
            });

            // Initialize Telegram WebApp
            console.log('🔄 Initializing Telegram WebApp...');
            const result = await telegramWebAppService.initialize();
            console.log('📊 Telegram WebApp Result:', result);
            
            if (result) {
              setUser(result.user);
              setTelegramData(result);
              console.log('✅ Telegram user data set in App state');
            } else {
              console.log('⚠️ No Telegram user data received');
            }
          } catch (error) {
            console.error('Error initializing Telegram user:', error);
            // Don't block the app, just log the error
          }
        }
        
        // Initialize MongoDB service for admin routes
        if (isAdminRoute) {
          try {
            // MongoDB service initialization is handled automatically
            console.log('MongoDB service ready for admin routes');
          } catch (error) {
            console.error('Error initializing MongoDB service:', error);
            // Don't block the app
          }
        }
        
        // Set up periodic data sync
        const syncInterval = setInterval(async () => {
          try {
            await dataService.syncPendingData();
          } catch (error) {
            console.log('Sync error (non-blocking):', error.message);
          }
        }, 30000); // Sync every 30 seconds
        
        // Cleanup interval on unmount
        return () => clearInterval(syncInterval);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isAdminRoute]);


  // Show maintenance mode
  if (isMaintenanceMode && !isAdminRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Maintenance Mode</h1>
          <p className="text-gray-300 mb-6">{maintenanceMessage}</p>
          <div className="text-sm text-gray-400">
            We'll be back soon. Thank you for your patience!
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading app..." />
          {isTelegramUser && (
            <p className="text-white mt-4">Initializing Telegram WebApp...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="glow-orange"></div>
      {!isAdminRoute && <Header user={user} isTelegramUser={isTelegramUser} />}
      <main>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home user={user} telegramData={telegramData} />} />
          <Route path="/quiz" element={<Quiz user={user} />} />
          <Route path="/deposit" element={<Deposit user={user} />} />
          <Route path="/tournaments" element={<Tournaments user={user} />} />
          <Route path="/earn" element={<Earn user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/dashboard-enhanced" element={
            <AdminLayout>
              <AdminDashboardEnhanced />
            </AdminLayout>
          } />
          <Route path="/admin/users" element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          } />
          <Route path="/admin/quiz" element={
            <AdminLayout>
              <AdminQuiz />
            </AdminLayout>
          } />
          <Route path="/admin/tournaments" element={
            <AdminLayout>
              <AdminTournaments />
            </AdminLayout>
          } />
          <Route path="/admin/transactions" element={
            <AdminLayout>
              <AdminTransactions />
            </AdminLayout>
          } />
          <Route path="/admin/tasks" element={
            <AdminLayout>
              <AdminTasks />
            </AdminLayout>
          } />
          <Route path="/admin/achievements" element={
            <AdminLayout>
              <AdminAchievements />
            </AdminLayout>
          } />
          <Route path="/admin/analytics" element={
            <AdminLayout>
              <AdminAnalytics />
            </AdminLayout>
          } />
          <Route path="/admin/settings" element={
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          } />
          <Route path="/admin/security" element={
            <AdminLayout>
              <AdminSecurity />
            </AdminLayout>
          } />
          <Route path="/admin/loss-prevention" element={
            <AdminLayout>
              <AdminLossPrevention />
            </AdminLayout>
          } />
          <Route path="/admin/marketing-tasks" element={
            <AdminLayout>
              <AdminMarketingTasks />
            </AdminLayout>
          } />
          <Route path="/admin/task-verifications" element={
            <AdminLayout>
              <AdminTaskVerifications />
            </AdminLayout>
          } />
          <Route path="/admin/referrals" element={
            <AdminLayout>
              <AdminReferrals />
            </AdminLayout>
          } />
          <Route path="/admin/daily-bonus" element={
            <AdminLayout>
              <AdminDailyBonus />
            </AdminLayout>
          } />
          <Route path="/admin/wallet-settings" element={
            <AdminLayout>
              <AdminWalletSettings />
            </AdminLayout>
          } />
          <Route path="/admin/app-settings" element={
            <AdminLayout>
              <AdminAppSettings />
            </AdminLayout>
          } />
          <Route path="/admin/daily-bonus" element={
            <AdminLayout>
              <AdminDailyBonus />
            </AdminLayout>
          } />
          <Route path="/admin/earn" element={
            <AdminLayout>
              <AdminTasks />
            </AdminLayout>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <BottomNavbar user={user} />}
      
      {/* Debug Component */}
      <TelegramDebugInfo />
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize app settings
    appSettingsService.initializeSettings();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
