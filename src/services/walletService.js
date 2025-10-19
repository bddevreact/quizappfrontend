// Wallet Service for managing deposit addresses and networks
import dataService from './dataService'
import adminDataService from './adminDataService'

class WalletService {
  constructor() {
    this.cache = {
      addresses: null,
      lastFetch: null,
      cacheDuration: 5 * 60 * 1000 // 5 minutes
    }
  }

  // Get all wallet addresses from database
  async getWalletAddresses() {
    try {
      // Check cache first
      if (this.cache.addresses && this.cache.lastFetch && 
          (Date.now() - this.cache.lastFetch) < this.cache.cacheDuration) {
        return this.cache.addresses
      }

      // Get wallet addresses from database via adminDataService
      const adminData = await adminDataService.getDashboardStats()
      
      // For now, use default wallet addresses since we don't have wallet management in backend yet
      const defaultAddresses = [
        {
          network: 'TRC20',
          address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
          name: 'Tron USDT Wallet',
          minDeposit: 1,
          maxDeposit: 10000,
          processingTime: '5-10 minutes'
        },
        {
          network: 'ERC20',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          name: 'Ethereum USDT Wallet',
          minDeposit: 5,
          maxDeposit: 50000,
          processingTime: '10-30 minutes'
        },
        {
          network: 'BEP20',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          name: 'BSC USDT Wallet',
          minDeposit: 1,
          maxDeposit: 25000,
          processingTime: '5-15 minutes'
        }
      ]

      // Update cache
      this.cache.addresses = defaultAddresses
      this.cache.lastFetch = Date.now()

      return defaultAddresses
    } catch (error) {
      console.error('Error fetching wallet addresses:', error)
      return []
    }
  }

  // Get addresses by network
  async getAddressesByNetwork(network) {
    try {
      const addresses = await this.getWalletAddresses()
      return addresses.filter(addr => addr.network === network)
    } catch (error) {
      console.error('Error fetching addresses by network:', error)
      return []
    }
  }

  // Get available networks
  async getAvailableNetworks() {
    try {
      const addresses = await this.getWalletAddresses()
      const networks = [...new Set(addresses.map(addr => addr.network))]
      return networks.sort()
    } catch (error) {
      console.error('Error fetching available networks:', error)
      return []
    }
  }

  // Get network info
  getNetworkInfo(network) {
    const networkInfo = {
      'TRC20': {
        name: 'Tron (TRC20)',
        icon: '🔴',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        description: 'Fast and low-cost transactions',
        fee: '1-2 USDT',
        speed: 'Fast'
      },
      'ERC20': {
        name: 'Ethereum (ERC20)',
        icon: '🔵',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        description: 'Most widely supported',
        fee: '5-20 USDT',
        speed: 'Medium'
      },
      'BEP20': {
        name: 'BSC (BEP20)',
        icon: '🟡',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        description: 'Binance Smart Chain',
        fee: '0.5-2 USDT',
        speed: 'Fast'
      },
      'Polygon': {
        name: 'Polygon (MATIC)',
        icon: '🟣',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30',
        description: 'Ethereum scaling solution',
        fee: '0.1-1 USDT',
        speed: 'Very Fast'
      },
      'Arbitrum': {
        name: 'Arbitrum',
        icon: '🔵',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        description: 'Layer 2 scaling',
        fee: '1-5 USDT',
        speed: 'Fast'
      },
      'Optimism': {
        name: 'Optimism',
        icon: '🔴',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        description: 'Optimistic rollup',
        fee: '1-5 USDT',
        speed: 'Fast'
      }
    }

    return networkInfo[network] || {
      name: network,
      icon: '💰',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/30',
      description: 'Custom network',
      fee: 'Variable',
      speed: 'Unknown'
    }
  }

  // Validate deposit amount for network
  async validateDepositAmount(network, amount) {
    try {
      const addresses = await this.getAddressesByNetwork(network)
      if (addresses.length === 0) {
        return {
          valid: false,
          message: 'Network not available'
        }
      }

      const networkConfig = addresses[0] // Use first address config
      const minDeposit = networkConfig.minDeposit || 1
      const maxDeposit = networkConfig.maxDeposit || 10000

      if (amount < minDeposit) {
        return {
          valid: false,
          message: `Minimum deposit amount is $${minDeposit}`
        }
      }

      if (amount > maxDeposit) {
        return {
          valid: false,
          message: `Maximum deposit amount is $${maxDeposit}`
        }
      }

      return {
        valid: true,
        message: 'Amount is valid'
      }
    } catch (error) {
      console.error('Error validating deposit amount:', error)
      return {
        valid: false,
        message: 'Error validating amount'
      }
    }
  }

  // Get deposit address for network
  async getDepositAddress(network) {
    try {
      const addresses = await this.getAddressesByNetwork(network)
      if (addresses.length === 0) {
        return null
      }

      // Return the first active address for the network
      return addresses[0]
    } catch (error) {
      console.error('Error getting deposit address:', error)
      return null
    }
  }

  // Get mock wallet addresses for development
  getMockWalletAddresses() {
    return [
      {
        id: '1',
        network: 'TRC20',
        address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
        label: 'USDT TRC20',
        isActive: true,
        minDeposit: 10,
        maxDeposit: 10000,
        fee: '1 USDT',
        speed: 'Very Fast',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        network: 'ERC20',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        label: 'USDT ERC20',
        isActive: true,
        minDeposit: 20,
        maxDeposit: 10000,
        fee: '5-20 USDT',
        speed: 'Slow',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        network: 'BEP20',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        label: 'USDT BEP20',
        isActive: true,
        minDeposit: 5,
        maxDeposit: 10000,
        fee: '1-3 USDT',
        speed: 'Fast',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        network: 'Polygon',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        label: 'USDT Polygon',
        isActive: true,
        minDeposit: 5,
        maxDeposit: 10000,
        fee: '0.1-1 USDT',
        speed: 'Very Fast',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        network: 'Arbitrum',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        label: 'USDT Arbitrum',
        isActive: true,
        minDeposit: 5,
        maxDeposit: 10000,
        fee: '1-5 USDT',
        speed: 'Fast',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]
  }

  // Clear cache (useful when addresses are updated)
  clearCache() {
    this.cache.addresses = null
    this.cache.lastFetch = null
  }

  // Get network statistics
  async getNetworkStats() {
    try {
      const addresses = await this.getWalletAddresses()
      const stats = {}

      addresses.forEach(addr => {
        if (!stats[addr.network]) {
          stats[addr.network] = {
            count: 0,
            totalMinDeposit: 0,
            totalMaxDeposit: 0,
            active: 0
          }
        }

        stats[addr.network].count++
        stats[addr.network].totalMinDeposit += addr.minDeposit || 0
        stats[addr.network].totalMaxDeposit += addr.maxDeposit || 0
        if (addr.isActive) {
          stats[addr.network].active++
        }
      })

      return stats
    } catch (error) {
      console.error('Error getting network stats:', error)
      return {}
    }
  }
}

// Create singleton instance
const walletService = new WalletService()

export default walletService
