import React, { useState, useEffect } from 'react';
import telegramWebAppService from '../services/telegramWebAppService';

const TelegramDebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateDebugInfo = () => {
      const info = {
        isTelegramWebApp: telegramWebAppService.isTelegramWebApp(),
        isInitialized: telegramWebAppService.getInitializationStatus(),
        userData: telegramWebAppService.getUserData(),
        error: telegramWebAppService.getError(),
        windowTelegram: typeof window !== 'undefined' && !!window.Telegram?.WebApp,
        telegramUser: typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user,
        initData: typeof window !== 'undefined' && window.Telegram?.WebApp?.initData,
        platform: telegramWebAppService.getPlatform(),
        version: telegramWebAppService.getVersion(),
        themeParams: telegramWebAppService.getThemeParams(),
        isDarkTheme: telegramWebAppService.isDarkTheme()
      };
      
      setDebugInfo(info);
    };

    // Update debug info immediately and then every 2 seconds
    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs z-50"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md max-h-96 overflow-y-auto text-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">🐛 Telegram Debug Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>Is Telegram WebApp:</strong> 
          <span className={debugInfo.isTelegramWebApp ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.isTelegramWebApp ? ' ✅ Yes' : ' ❌ No'}
          </span>
        </div>
        
        <div>
          <strong>Is Initialized:</strong> 
          <span className={debugInfo.isInitialized ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.isInitialized ? ' ✅ Yes' : ' ❌ No'}
          </span>
        </div>
        
        <div>
          <strong>Window.Telegram:</strong> 
          <span className={debugInfo.windowTelegram ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.windowTelegram ? ' ✅ Available' : ' ❌ Not Available'}
          </span>
        </div>
        
        <div>
          <strong>Platform:</strong> <span className="text-blue-400">{debugInfo.platform}</span>
        </div>
        
        <div>
          <strong>Version:</strong> <span className="text-blue-400">{debugInfo.version}</span>
        </div>
        
        <div>
          <strong>Dark Theme:</strong> 
          <span className={debugInfo.isDarkTheme ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.isDarkTheme ? ' ✅ Yes' : ' ❌ No'}
          </span>
        </div>
        
        {debugInfo.telegramUser && (
          <div>
            <strong>Telegram User:</strong>
            <div className="ml-2 text-gray-300">
              <div>ID: {debugInfo.telegramUser.id}</div>
              <div>Username: @{debugInfo.telegramUser.username || 'N/A'}</div>
              <div>Name: {debugInfo.telegramUser.first_name} {debugInfo.telegramUser.last_name || ''}</div>
              <div>Photo: {debugInfo.telegramUser.photo_url ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
        
        {debugInfo.userData && (
          <div>
            <strong>User Data:</strong>
            <div className="ml-2 text-gray-300">
              <div>User ID: {debugInfo.userData.userId || debugInfo.userData.id}</div>
              <div>Telegram ID: {debugInfo.userData.telegramId}</div>
              <div>Username: @{debugInfo.userData.telegramUsername || debugInfo.userData.username}</div>
              <div>Full Name: {debugInfo.userData.telegramFullName || debugInfo.userData.fullName}</div>
              <div>Balance: ${debugInfo.userData.balance || 0}</div>
              <div>Level: {debugInfo.userData.level || 0}</div>
              <div>Is Telegram User: {debugInfo.userData.isTelegramUser ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
        
        {debugInfo.error && (
          <div>
            <strong>Error:</strong> 
            <span className="text-red-400">{debugInfo.error}</span>
          </div>
        )}
        
        {debugInfo.initData && (
          <div>
            <strong>Init Data:</strong>
            <div className="ml-2 text-gray-300 break-all">
              {debugInfo.initData.substring(0, 100)}...
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700">
        <button
          onClick={() => {
            console.log('Full Debug Info:', debugInfo);
            console.log('Telegram WebApp Object:', window.Telegram?.WebApp);
            console.log('Telegram User Data:', window.Telegram?.WebApp?.initDataUnsafe?.user);
          }}
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
        >
          Log to Console
        </button>
      </div>
    </div>
  );
};

export default TelegramDebugInfo;
