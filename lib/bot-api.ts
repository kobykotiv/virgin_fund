import type { Bot, BotStatus } from "@/types/bot";
import { generateDemoBots, generateDemoMarketData, generateDemoOrders, generateDemoPositions } from "@/lib/demo-data";

export type BotType = 'dca' | 'grid' | 'indicator' | 'basket';

// Check if demo mode is enabled
const isDemoMode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("demoMode") === "true";
  }
  return false;
};

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
    strategy: "BasketRebalance", // Added strategy
    settings: {
      rebalancePeriod: "0 0 1 * *", // Monthly rebalance
      targetAllocation: {
        AAPL: 0.3,
        MSFT: 0.3,
        GOOGL: 0.2,
        AMZN: 0.2,
      },
    },
    description: "A basket of top tech stocks",
  },
  {
    id: "2",
    name: "BTC Grid Trader",
    type: "grid",
    status: "paused",
    assets: ["BTC-USD"],
    createdAt: "2023-08-10T08:15:00Z",
    updatedAt: "2023-10-18T11:20:00Z",
    strategy: "GridTrading", // Added strategy
    settings: {
      gridSize: 1, // 1% grid
      upperLimit: 35000,
      lowerLimit: 25000,
      quantity: 0.01,
    },
    description: "Trades BTC within a grid range",
  },
  {
    id: "3",
    name: "TSLA RSI Strategy",
    type: "indicator",
    status: "active",
    assets: ["TSLA"],
    createdAt: "2023-07-05T15:45:00Z",
    updatedAt: "2023-10-19T09:30:00Z",
    strategy: "RSI", // Added strategy
    settings: {
      type: "rsi",
      timeframe: "1day",
      entryThreshold: 30,
      exitThreshold: 70,
    },
    description: "Trades TSLA based on RSI",
  },
  {
    id: "4",
    name: "ETF DCA Bot",
    type: "dca",
    status: "error",
    assets: ["SPY", "QQQ", "VTI"],
    createdAt: "2023-09-01T12:00:00Z",
    updatedAt: "2023-10-15T10:10:00Z",
    strategy: "SimpleDCA", // Added strategy
    settings: {
      interval: "0 0 * * 1", // Every Monday
      amount: 500,
      symbol: "SPY",
    },
    description: "DCA into ETFs",
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

  // In a real app, this would be a fetch call to your API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBots), 500)
  })
}

export async function createBot(botData: Partial<Bot>): Promise<Bot> {
  // In a real app, this would be a POST request to your API
  return new Promise((resolve) => {
    const now = new Date().toISOString()

    const newBot: Bot = {
      id: Math.random().toString(36).substring(2, 9),
      name: botData.name || "New Bot",
      type: botData.type || "indicator" as BotType, // Type assertion
      status: "paused",
      assets: botData.assets || ["AAPL"],
      createdAt: now,
      updatedAt: now,
      strategy: botData.strategy || "Simple",
      settings: botData.settings || {},
      description: botData.description || "A new bot",
    }

    // If in demo mode, add allocation
    if (isDemoMode()) {
      newBot.allocation = 500000 // Default $500K allocation for new bots in demo mode
    }

    setTimeout(() => resolve(newBot as Bot), 500)
  })
}

export async function updateBot(bot: Bot): Promise<Bot> {
  // In a real app, this would be a PUT request to your API
  return new Promise((resolve) => {
    const updatedBot = {
      ...bot,
      updatedAt: new Date().toISOString(),
    }
    setTimeout(() => resolve(updatedBot), 500)
  })
}

export async function deleteBot(botId: string): Promise<void> {
  // In a real app, this would be a DELETE request to your API
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500)
  })
}

// Update the toggleBotStatus function to properly handle the case when a bot is not found
export async function toggleBotStatus(botId: string, newStatus: BotStatus): Promise<Bot> {
  // In a real app, this would be a PATCH request to your API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Find the bot in our mock data
      const botIndex = mockBots.findIndex((b) => b.id === botId);

      if (botIndex === -1) {
        // If bot is not found in mockBots, create a new copy of mockBots for the search
        // This is needed because in our demo, the mockBots array is separate from the state in the React component
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
