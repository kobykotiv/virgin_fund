import type { Bot, BotStatus } from "@/types/bot"
import { generateDemoBots, generateDemoMarketData, generateDemoOrders, generateDemoPositions } from "@/lib/demo-data"

// Check if demo mode is enabled
const isDemoMode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("demoMode") === "true"
  }
  return false
}

// Mock data for demonstration with updated types
const mockBots: Bot[] = [
  {
    id: "1",
    name: "Tech Basket",
    type: "basket",
    status: "active",
    assets: ["AAPL", "MSFT", "GOOGL", "AMZN"],
    createdAt: "2023-09-15T10:30:00Z",
    updatedAt: "2023-10-20T14:45:00Z",
    performance: {
      totalPnL: 1250.75,
      pnlPercentage: 8.2,
      totalTrades: 24,
      winRate: 0.75,
      lastUpdated: "2023-10-20T14:45:00Z",
    },
    stopLoss: 5,
    takeProfit: 15,
    maxDrawdown: 10,
    basketConfig: {
      rebalancePeriod: "0 0 1 * *", // Monthly rebalance
      targetAllocation: {
        AAPL: 0.3,
        MSFT: 0.3,
        GOOGL: 0.2,
        AMZN: 0.2,
      },
    },
  },
  {
    id: "2",
    name: "BTC Grid Trader",
    type: "grid",
    status: "paused",
    assets: ["BTC-USD"],
    createdAt: "2023-08-10T08:15:00Z",
    updatedAt: "2023-10-18T11:20:00Z",
    performance: {
      totalPnL: -320.5,
      pnlPercentage: -2.1,
      totalTrades: 42,
      winRate: 0.62,
      lastUpdated: "2023-10-18T11:20:00Z",
    },
    stopLoss: 8,
    takeProfit: 12,
    gridConfig: {
      gridSize: 1, // 1% grid
      upperLimit: 35000,
      lowerLimit: 25000,
      quantity: 0.01,
    },
  },
  {
    id: "3",
    name: "TSLA RSI Strategy",
    type: "indicator",
    status: "active",
    assets: ["TSLA"],
    createdAt: "2023-07-05T15:45:00Z",
    updatedAt: "2023-10-19T09:30:00Z",
    performance: {
      totalPnL: 1875.25,
      pnlPercentage: 12.5,
      totalTrades: 18,
      winRate: 0.83,
      lastUpdated: "2023-10-19T09:30:00Z",
    },
    stopLoss: 7,
    takeProfit: 20,
    maxDrawdown: 15,
    indicatorConfig: {
      type: "rsi",
      timeframe: "1day",
      entryThreshold: 30,
      exitThreshold: 70,
    },
  },
  {
    id: "4",
    name: "ETF DCA Bot",
    type: "dca",
    status: "error",
    assets: ["SPY", "QQQ", "VTI"],
    createdAt: "2023-09-01T12:00:00Z",
    updatedAt: "2023-10-15T10:10:00Z",
    performance: {
      totalPnL: 450.8,
      pnlPercentage: 3.2,
      totalTrades: 12,
      winRate: 0.67,
      lastUpdated: "2023-10-15T10:10:00Z",
    },
    dcaConfig: {
      interval: "0 0 * * 1", // Every Monday
      amount: 500,
      duration: "90days",
    },
  },
]

// Store previous prices to simulate realistic price movements
const previousPrices: Record<string, number> = {}

// API functions
export async function fetchBots(): Promise<Bot[]> {
  // If in demo mode, return demo bots
  if (isDemoMode()) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateDemoBots()), 500)
    })
  }

  try {
    const response = await fetch('/api/bots', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching bots:', error)
    // Fallback to mock data if API fails
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockBots), 500)
    })
  }
}

export async function createBot(botData: Partial<Bot>): Promise<Bot> {
  // If in demo mode, use mock data
  if (isDemoMode()) {
    return new Promise((resolve) => {
      const now = new Date().toISOString()

      const newBot: Bot = {
        id: Math.random().toString(36).substring(2, 9),
        name: botData.name || "New Bot",
        type: botData.type || "indicator",
        status: "paused",
        assets: botData.assets || ["AAPL"],
        createdAt: now,
        updatedAt: now,
        performance: {
          totalPnL: 0,
          pnlPercentage: 0,
          totalTrades: 0,
          winRate: 0,
          lastUpdated: now,
        },
        stopLoss: botData.stopLoss,
        takeProfit: botData.takeProfit,
        maxDrawdown: botData.maxDrawdown,
        indicatorConfig: botData.indicatorConfig,
        gridConfig: botData.gridConfig,
        dcaConfig: botData.dcaConfig,
        basketConfig: botData.basketConfig,
        allocation: 500000 // Default $500K allocation for new bots in demo mode
      }

      setTimeout(() => resolve(newBot), 500)
    })
  }

  try {
    const response = await fetch('/api/bots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(botData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating bot:', error)
    throw error
  }
}

export async function updateBot(bot: Bot): Promise<Bot> {
  // If in demo mode, use mock update
  if (isDemoMode()) {
    return new Promise((resolve) => {
      const updatedBot = {
        ...bot,
        updatedAt: new Date().toISOString(),
      }
      setTimeout(() => resolve(updatedBot), 500)
    })
  }

  try {
    const response = await fetch(`/api/bots/${bot.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(bot),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating bot:', error)
    throw error
  }
}

export async function deleteBot(botId: string): Promise<void> {
  // If in demo mode, use mock delete
  if (isDemoMode()) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500)
    })
  }

  try {
    const response = await fetch(`/api/bots/${botId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error deleting bot:', error)
    throw error
  }
}

// Update the toggleBotStatus function to properly handle the case when a bot is not found
export async function toggleBotStatus(botId: string, newStatus: BotStatus): Promise<Bot> {
  // If in demo mode, use mock update
  if (isDemoMode()) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find the bot in our mock data
        const botIndex = mockBots.findIndex((b) => b.id === botId)

        if (botIndex === -1) {
          // If bot is not found in mockBots, create a new copy of mockBots for the search
          const bot = mockBots.find((b) => b.id === botId)
          if (!bot) {
            reject(new Error("Bot not found"))
            return
          }

          const updatedBot = {
            ...bot,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }

          resolve(updatedBot)
        } else {
          // If bot is found in mockBots, update it
          const updatedBot = {
            ...mockBots[botIndex],
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }

          // Update the mock data
          mockBots[botIndex] = updatedBot

          resolve(updatedBot)
        }
      }, 500)
    })
  }

  try {
    // Map frontend status to database status
    const dbStatus = newStatus === 'active' ? 'active' : newStatus === 'paused' ? 'paused' : 'stopped'

    const response = await fetch(`/api/bots/${botId}/${dbStatus === 'active' ? 'start' : dbStatus === 'paused' ? 'pause' : 'stop'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error toggling bot status:', error)
    throw error
  }
}

// Enhance the fetchMarketData function to provide more realistic data
// Replace the existing fetchMarketData function with this enhanced version:
export async function fetchMarketData(symbol: string): Promise<any> {
  // If in demo mode, return demo market data
  if (isDemoMode()) {
    const demoData = generateDemoMarketData().find((data) => data.symbol === symbol)

    if (demoData) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(demoData), 300)
      })
    }
  }

  // Try to fetch from Alpaca API first
  try {
    const response = await fetch(`/api/alpaca/market?symbol=${symbol}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} from Alpaca`)
    }
    return await response.json()
  } catch (alpacaError) {
    console.warn(`Alpaca API unavailable for ${symbol}, trying Yahoo Finance...`, alpacaError)

    // Fallback to Yahoo Finance for stocks
    try {
      const isCrypto =
        symbol.includes("BTC") ||
        symbol.includes("ETH") ||
        symbol.includes("-USD") ||
        symbol.includes("SOL") ||
        symbol.includes("ADA") ||
        symbol.includes("DOT")

      // Use appropriate API based on asset type
      const endpoint = isCrypto ? `/api/coingecko/market?symbol=${symbol}` : `/api/yahoo/market?symbol=${symbol}`

      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${symbol} from fallback`)
      }
      return await response.json()
    } catch (fallbackError) {
      console.error(`All data sources failed for ${symbol}`, fallbackError)

      // Generate realistic price movements based on previous price as last resort
      let price: number

      if (previousPrices[symbol]) {
        // Generate a small random change (-1% to +1%)
        const changePercent = (Math.random() * 2 - 1) * 0.01
        price = previousPrices[symbol] * (1 + changePercent)
      } else {
        // Initial price if we don't have a previous one
        price = getBasePrice(symbol)
      }

      // Store the current price for next time
      previousPrices[symbol] = price

      // Calculate a realistic change percentage
      const change = ((price - getBasePrice(symbol)) / getBasePrice(symbol)) * 100

      // Return simulated data
      return {
        symbol,
        price,
        change,
        changePercent: change,
        volume: Math.floor(Math.random() * 1000000),
        high: price * (1 + Math.random() * 0.02),
        low: price * (1 - Math.random() * 0.02),
        open: price * (1 + (Math.random() * 0.02 - 0.01)),
        source: "simulated",
      }
    }
  }
}

// Helper function to get a base price for a symbol
function getBasePrice(symbol: string): number {
  // Return realistic base prices for common stocks
  switch (symbol) {
    case "AAPL":
      return 180 + (Math.random() * 10 - 5)
    case "MSFT":
      return 350 + (Math.random() * 15 - 7.5)
    case "GOOGL":
      return 130 + (Math.random() * 8 - 4)
    case "AMZN":
      return 140 + (Math.random() * 10 - 5)
    case "TSLA":
      return 240 + (Math.random() * 20 - 10)
    case "BTC-USD":
      return 35000 + (Math.random() * 1000 - 500)
    case "SPY":
      return 450 + (Math.random() * 5 - 2.5)
    case "QQQ":
      return 380 + (Math.random() * 8 - 4)
    case "VTI":
      return 220 + (Math.random() * 4 - 2)
    default:
      return 100 + (Math.random() * 10 - 5)
  }
}

export async function executeOrder(order: any): Promise<any> {
  // This would execute an order via Alpaca
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substring(2, 9),
        status: "filled",
        filledAt: new Date().toISOString(),
        filledPrice: order.price || Math.random() * 1000,
        filledQuantity: order.quantity,
      })
    }, 500)
  })
}

// New functions for demo mode
export async function fetchDemoOrders(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateDemoOrders()), 500)
  })
}

export async function fetchDemoPositions(): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateDemoPositions()), 500)
  })
}

export async function fetchAccountBalance(): Promise<any> {
  // If in demo mode, return demo account balance
  if (isDemoMode()) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            balance: 10000000,
            equity: 10000000,
            buyingPower: 20000000,
            currency: "USD",
          }),
        500,
      )
    })
  }

  // In a real app, this would fetch from Alpaca
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          balance: 100000,
          equity: 105000,
          buyingPower: 200000,
          currency: "USD",
        }),
      500,
    )
  })
}

