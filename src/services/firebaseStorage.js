// Firebase Storage Service for file uploads (Mock version for development)
// This is a mock implementation that simulates Firebase Storage functionality

class FirebaseStorageService {
  constructor() {
    this.storage = { mock: true }
  }

  // Upload file to Firebase Storage (Mock implementation)
  async uploadFile(file, path, metadata = {}) {
    try {
      // Mock implementation - simulate successful upload
      console.log('Mock upload:', { file: file.name, path, metadata })
      
      return {
        success: true,
        downloadURL: `mock://storage/${path}`,
        path: path,
        metadata: {
          ...metadata,
          mock: true,
          originalName: file.name,
          size: file.size,
          type: file.type
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Upload image with automatic resizing (Mock implementation)
  async uploadImage(file, path, options = {}) {
    try {
      console.log('Mock image upload:', { file: file.name, path, options })
      
      return {
        success: true,
        downloadURL: `mock://storage/${path}`,
        path: path,
        metadata: {
          mock: true,
          originalName: file.name,
          size: file.size,
          type: file.type,
          ...options
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Upload user profile picture (Mock implementation)
  async uploadProfilePicture(userId, file) {
    const timestamp = Date.now()
    const path = `users/${userId}/profile_${timestamp}.jpg`
    return await this.uploadImage(file, path, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.9
    })
  }

  // Upload question images (Mock implementation)
  async uploadQuestionImage(questionId, file) {
    const timestamp = Date.now()
    const path = `questions/${questionId}/image_${timestamp}.jpg`
    return await this.uploadImage(file, path, {
      maxWidth: 800,
      maxHeight: 600,
      quality: 0.8
    })
  }

  // Upload tournament banners (Mock implementation)
  async uploadTournamentBanner(tournamentId, file) {
    const timestamp = Date.now()
    const path = `tournaments/${tournamentId}/banner_${timestamp}.jpg`
    return await this.uploadImage(file, path, {
      maxWidth: 1200,
      maxHeight: 600,
      quality: 0.8
    })
  }

  // Get file download URL (Mock implementation)
  async getDownloadURL(path) {
    try {
      return `mock://storage/${path}`
    } catch (error) {
      console.error('Error getting download URL:', error)
      throw error
    }
  }

  // Delete file (Mock implementation)
  async deleteFile(path) {
    try {
      console.log('Mock delete:', path)
      return { success: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // List files in a directory (Mock implementation)
  async listFiles(path) {
    try {
      console.log('Mock list files:', path)
      return []
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  }

  // Get file metadata (Mock implementation)
  async getFileMetadata(path) {
    try {
      console.log('Mock get metadata:', path)
      return { mock: true, path }
    } catch (error) {
      console.error('Error getting file metadata:', error)
      throw error
    }
  }

  // Clean up old files (Mock implementation)
  async cleanupOldFiles(path, maxAge = 30 * 24 * 60 * 60 * 1000) {
    try {
      console.log('Mock cleanup:', path, maxAge)
      return {
        success: true,
        deletedCount: 0
      }
    } catch (error) {
      console.error('Error cleaning up old files:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Create singleton instance
const firebaseStorageService = new FirebaseStorageService()

export default firebaseStorageService
