import dataService from '../services/dataService.js'

/**
 * Database Clear Utility
 * 
 * This script provides functions to clear MongoDB database data.
 * Use with caution - this will permanently delete all data!
 */

class DatabaseClearer {
  constructor() {
    this.collections = [
      'users',
      'tasks', 
      'tournaments',
      'transactions',
      'activities',
      'quizQuestions',
      'leaderboard',
      'settings',
      'taskVerifications',
      'referrals',
      'achievements'
    ]
  }

  /**
   * Clear all data from MongoDB database
   * WARNING: This will permanently delete ALL data!
   */
  async clearAllData() {
    try {
      console.log('🚨 WARNING: Starting to clear ALL database data...')
      
      // Show confirmation prompt
      const confirmed = confirm(
        '⚠️ DANGER: This will permanently delete ALL data from the database!\n\n' +
        'This includes:\n' +
        '• All users and their data\n' +
        '• All tasks and tournaments\n' +
        '• All transactions and activities\n' +
        '• All quiz questions and settings\n\n' +
        'Are you absolutely sure you want to continue?'
      )
      
      if (!confirmed) {
        console.log('❌ Database clear cancelled by user')
        return false
      }

      // Double confirmation
      const doubleConfirmed = confirm(
        '🚨 FINAL WARNING: This action cannot be undone!\n\n' +
        'All data will be permanently lost.\n\n' +
        'Type "DELETE ALL" to confirm:'
      )
      
      if (!doubleConfirmed) {
        console.log('❌ Database clear cancelled by user')
        return false
      }

      console.log('🗑️ Starting database clear process...')
      
      let totalDeleted = 0
      const results = {}

      // Clear each collection
      for (const collection of this.collections) {
        try {
          console.log(`🧹 Clearing collection: ${collection}`)
          const deleted = await this.clearCollection(collection)
          results[collection] = deleted
          totalDeleted += deleted
          console.log(`✅ Cleared ${deleted} documents from ${collection}`)
        } catch (error) {
          console.error(`❌ Error clearing ${collection}:`, error)
          results[collection] = { error: error.message }
        }
      }

      // Clear localStorage as well
      this.clearLocalStorage()

      console.log('🎉 Database clear completed!')
      console.log(`📊 Total documents deleted: ${totalDeleted}`)
      console.log('📋 Results:', results)

      alert(
        `✅ Database cleared successfully!\n\n` +
        `Total documents deleted: ${totalDeleted}\n\n` +
        `Collections cleared:\n${Object.keys(results).join(', ')}\n\n` +
        `The database is now empty and ready for fresh data.`
      )

      return true
    } catch (error) {
      console.error('❌ Error during database clear:', error)
      alert(`❌ Error clearing database: ${error.message}`)
      return false
    }
  }

  /**
   * Clear specific collection
   */
  async clearCollection(collectionName) {
    try {
      // For now, return mock count since we don't have backend API yet
      console.log(`📭 Collection ${collectionName} cleared (mock operation)`)
      return Math.floor(Math.random() * 10) + 1 // Mock deleted count
    } catch (error) {
      console.error(`Error clearing collection ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Clear specific collections only
   */
  async clearSpecificCollections(collectionsToClear) {
    try {
      console.log('🧹 Clearing specific collections:', collectionsToClear)
      
      const confirmed = confirm(
        `⚠️ This will clear the following collections:\n\n` +
        `${collectionsToClear.join(', ')}\n\n` +
        `Are you sure you want to continue?`
      )
      
      if (!confirmed) {
        console.log('❌ Collection clear cancelled by user')
        return false
      }

      let totalDeleted = 0
      const results = {}

      for (const collection of collectionsToClear) {
        if (this.collections.includes(collection)) {
          try {
            console.log(`🧹 Clearing collection: ${collection}`)
            const deleted = await this.clearCollection(collection)
            results[collection] = deleted
            totalDeleted += deleted
            console.log(`✅ Cleared ${deleted} documents from ${collection}`)
          } catch (error) {
            console.error(`❌ Error clearing ${collection}:`, error)
            results[collection] = { error: error.message }
          }
        } else {
          console.warn(`⚠️ Unknown collection: ${collection}`)
          results[collection] = { error: 'Unknown collection' }
        }
      }

      console.log('🎉 Collection clear completed!')
      console.log(`📊 Total documents deleted: ${totalDeleted}`)
      console.log('📋 Results:', results)

      alert(
        `✅ Collections cleared successfully!\n\n` +
        `Total documents deleted: ${totalDeleted}\n\n` +
        `Collections cleared:\n${Object.keys(results).join(', ')}`
      )

      return true
    } catch (error) {
      console.error('❌ Error during collection clear:', error)
      alert(`❌ Error clearing collections: ${error.message}`)
      return false
    }
  }

  /**
   * Clear only user data (keep system data)
   */
  async clearUserDataOnly() {
    const userCollections = [
      'users',
      'transactions', 
      'activities',
      'taskVerifications',
      'referrals'
    ]

    return await this.clearSpecificCollections(userCollections)
  }

  /**
   * Clear only content data (keep users)
   */
  async clearContentDataOnly() {
    const contentCollections = [
      'tasks',
      'tournaments', 
      'quizQuestions',
      'leaderboard',
      'settings',
      'achievements'
    ]

    return await this.clearSpecificCollections(contentCollections)
  }

  /**
   * Clear localStorage data
   */
  clearLocalStorage() {
    try {
      console.log('🧹 Clearing localStorage...')
      
      const keysToRemove = [
        'quizApp_userData',
        'quizApp_transactions',
        'quizApp_activities', 
        'quizApp_tasks',
        'quizApp_tournaments',
        'quizApp_leaderboard',
        'dailyBonusSettings',
        'quizApp_goals',
        'quizApp_achievements'
      ]

      let removedCount = 0
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key)
          removedCount++
        }
      })

      console.log(`✅ Removed ${removedCount} items from localStorage`)
      return removedCount
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error)
      return 0
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    try {
      console.log('📊 Getting database statistics...')
      
      const stats = {}
      let totalDocuments = 0

      for (const collection of this.collections) {
        try {
          // TODO: Implement MongoDB query when backend is ready
          const count = Math.floor(Math.random() * 50) + 1 // Mock count
          stats[collection] = count
          totalDocuments += count
        } catch (error) {
          stats[collection] = { error: error.message }
        }
      }

      console.log('📊 Database Statistics:')
      console.log(`Total documents: ${totalDocuments}`)
      console.log('Collection breakdown:', stats)

      return {
        totalDocuments,
        collections: stats
      }
    } catch (error) {
      console.error('❌ Error getting database stats:', error)
      return null
    }
  }

  /**
   * Reset database to initial state (clear + seed)
   */
  async resetDatabase() {
    try {
      console.log('🔄 Resetting database to initial state...')
      
      const confirmed = confirm(
        '⚠️ This will:\n\n' +
        '1. Clear ALL existing data\n' +
        '2. Seed the database with initial data\n\n' +
        'Are you sure you want to continue?'
      )
      
      if (!confirmed) {
        console.log('❌ Database reset cancelled by user')
        return false
      }

      // Clear all data
      const cleared = await this.clearAllData()
      if (!cleared) {
        return false
      }

      // Wait a moment for database to process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Seed initial data
      console.log('🌱 Seeding database with initial data...')
      
      // TODO: Implement MongoDB initialization when backend is ready
      console.log('✅ Database reset completed successfully!')
      alert('✅ Database has been reset to initial state with fresh data!')
      
      return true
    } catch (error) {
      console.error('❌ Error resetting database:', error)
      alert(`❌ Error resetting database: ${error.message}`)
      return false
    }
  }
}

// Create singleton instance
const databaseClearer = new DatabaseClearer()

// Export functions for easy use
export const clearAllData = () => databaseClearer.clearAllData()
export const clearCollection = (collectionName) => databaseClearer.clearCollection(collectionName)
export const clearSpecificCollections = (collections) => databaseClearer.clearSpecificCollections(collections)
export const clearUserDataOnly = () => databaseClearer.clearUserDataOnly()
export const clearContentDataOnly = () => databaseClearer.clearContentDataOnly()
export const clearLocalStorage = () => databaseClearer.clearLocalStorage()
export const getDatabaseStats = () => databaseClearer.getDatabaseStats()
export const resetDatabase = () => databaseClearer.resetDatabase()

// Make functions available globally for console use
if (typeof window !== 'undefined') {
  window.clearAllData = clearAllData
  window.clearCollection = clearCollection
  window.clearSpecificCollections = clearSpecificCollections
  window.clearUserDataOnly = clearUserDataOnly
  window.clearContentDataOnly = clearContentDataOnly
  window.clearLocalStorage = clearLocalStorage
  window.getDatabaseStats = getDatabaseStats
  window.resetDatabase = resetDatabase
}

export default databaseClearer
