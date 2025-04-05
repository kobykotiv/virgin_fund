import type { Bot, BotType, BotStatus } from "@/types/bot"

// Demo mode constants
export const DEMO_USER = {
  email: "Admin@example.com",
  name: "Demo Admin",
  password: "admin123",
}

export const DEMO_MODE_KEY = "trading_platform_demo_mode"
export const DEMO_USER_KEY = "trading_platform_demo_user"
export const DEMO_BOTS_KEY = "trading_platform_demo_bots"
export const DEMO_ORDERS_KEY = "trading_platform_demo_orders"
export const DEMO_PORTFOLIO_KEY = "trading_platform_demo_portfolio"
export const DEMO_WATCHLIST_KEY = "trading_platform_demo_watchlist"
export const DEMO_SETTINGS_KEY = "trading_platform_demo_settings"

// Check if demo mode is enabled
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(DEMO_MODE_KEY) === "true"
}

// Enable demo mode
export function enableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "true")
  initializeDemoData()
}

// Disable demo mode
export function disableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, "false")
}

// Initialize demo data if it doesn't exist
export function initializeDemoData(): void {
  // Initialize user
  if (!localStorage.getItem(DEMO_USER_KEY)) {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER))
  }

  // Initialize bots
  if (!localStorage.getItem(DEMO_BOTS_KEY)) {
    localStorage.setItem(DEMO_BOTS_KEY, JSON.stringify(generateDemoBots()))
  }

  // Initialize orders
  if (!localStorage.getItem(DEMO_ORDERS_KEY)) {
    localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(generateDemoOrders()))
  }

  // Initialize portfolio
  if (!localStorage.getItem(DEMO_PORTFOLIO_KEY)) {
    localStorage.setItem(DEMO_PORTFOLIO_KEY, JSON.stringify(generateDemoPortfolio()))
  }

  // Initialize watchlist
  if (!localStorage.getItem(DEMO_WATCHLIST_KEY)) {
    localStorage.setItem(DEMO_WATCHLIST_KEY, JSON.stringify(generateDemoWatchlist()))
  }

  // Initialize settings
  if (!localStorage.getItem(DEMO_SETTINGS_KEY)) {
    localStorage.setItem(DEMO_SETTINGS_KEY, JSON.stringify(generateDemoSettings()))
  }
}

// Generate 10 demo bots with different strategies
function generateDemoBots(): Bot[] {
  const now = new Date().toISOString()
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  return [
    // 1. RSI Strategy Bot
    {
      id: "demo-bot-1",
      name: "AAPL RSI Strategy",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["AAPL"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 1250.75,
        pnlPercentage: 8.2,
        totalTrades: 24,
        winRate: 0.75,
        lastUpdated: now,
      },
      stopLoss: 5,
      takeProfit: 15,
      maxDrawdown: 10,
      indicatorConfig: {
        type: "rsi",
        timeframe: "1day",
        entryThreshold: 30,
        exitThreshold: 70,
      },
    },

    // 2. MACD Strategy Bot
    {
      id: "demo-bot-2",
      name: "MSFT MACD Strategy",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["MSFT"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 980.25,
        pnlPercentage: 6.5,
        totalTrades: 18,
        winRate: 0.72,
        lastUpdated: now,
      },
      stopLoss: 4,
      takeProfit: 12,
      maxDrawdown: 8,
      indicatorConfig: {
        type: "macd",
        timeframe: "4hour",
        entryThreshold: 0.5,
        exitThreshold: -0.5,
      },
    },

    // 3. Bollinger Bands Strategy Bot
    {
      id: "demo-bot-3",
      name: "GOOGL Bollinger Strategy",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["GOOGL"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 1120.5,
        pnlPercentage: 7.4,
        totalTrades: 22,
        winRate: 0.68,
        lastUpdated: now,
      },
      stopLoss: 6,
      takeProfit: 18,
      maxDrawdown: 12,
      indicatorConfig: {
        type: "bollinger",
        timeframe: "1hour",
        entryThreshold: 2,
        exitThreshold: 0,
      },
    },

    // 4. Grid Trading Bot
    {
      id: "demo-bot-4",
      name: "BTC Grid Trader",
      type: "grid" as BotType,
      status: "active" as BotStatus,
      assets: ["BTC-USD"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 2150.3,
        pnlPercentage: 10.8,
        totalTrades: 42,
        winRate: 0.62,
        lastUpdated: now,
      },
      stopLoss: 8,
      takeProfit: 12,
      maxDrawdown: 15,
      gridConfig: {
        gridSize: 1, // 1% grid
        upperLimit: 35000,
        lowerLimit: 25000,
        quantity: 0.01,
      },
    },

    // 5. DCA Bot
    {
      id: "demo-bot-5",
      name: "ETF DCA Strategy",
      type: "dca" as BotType,
      status: "active" as BotStatus,
      assets: ["SPY", "QQQ", "VTI"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 850.45,
        pnlPercentage: 5.6,
        totalTrades: 12,
        winRate: 0.83,
        lastUpdated: now,
      },
      dcaConfig: {
        interval: "0 0 * * 1", // Every Monday
        amount: 500,
        duration: "90days",
      },
    },

    // 6. Basket Trading Bot
    {
      id: "demo-bot-6",
      name: "Tech Basket",
      type: "basket" as BotType,
      status: "active" as BotStatus,
      assets: ["AAPL", "MSFT", "GOOGL", "AMZN"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 1850.2,
        pnlPercentage: 9.3,
        totalTrades: 8,
        winRate: 0.75,
        lastUpdated: now,
      },
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

    // 7. Paused RSI Bot
    {
      id: "demo-bot-7",
      name: "TSLA RSI Strategy",
      type: "indicator" as BotType,
      status: "paused" as BotStatus,
      assets: ["TSLA"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: -320.5,
        pnlPercentage: -2.1,
        totalTrades: 15,
        winRate: 0.4,
        lastUpdated: now,
      },
      stopLoss: 7,
      takeProfit: 20,
      maxDrawdown: 15,
      indicatorConfig: {
        type: "rsi",
        timeframe: "15min",
        entryThreshold: 25,
        exitThreshold: 75,
      },
    },

    // 8. Error State Bot
    {
      id: "demo-bot-8",
      name: "Error State Bot",
      type: "indicator" as BotType,
      status: "error" as BotStatus,
      assets: ["NFLX"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 0,
        pnlPercentage: 0,
        totalTrades: 3,
        winRate: 0,
        lastUpdated: now,
      },
      stopLoss: 5,
      takeProfit: 15,
      maxDrawdown: 10,
      indicatorConfig: {
        type: "rsi",
        timeframe: "1day",
        entryThreshold: 30,
        exitThreshold: 70,
      },
    },

    // 9. Crypto DCA Bot
    {
      id: "demo-bot-9",
      name: "Crypto DCA Bot",
      type: "dca" as BotType,
      status: "active" as BotStatus,
      assets: ["BTC-USD", "ETH-USD"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 1750.6,
        pnlPercentage: 12.5,
        totalTrades: 16,
        winRate: 0.75,
        lastUpdated: now,
      },
      dcaConfig: {
        interval: "0 0 * * 1,4", // Monday and Thursday
        amount: 250,
        duration: "180days",
      },
    },

    // 10. Multi-Asset Grid Bot
    {
      id: "demo-bot-10",
      name: "Multi-Asset Grid",
      type: "grid" as BotType,
      status: "active" as BotStatus,
      assets: ["AAPL", "MSFT", "GOOGL"],
      createdAt: oneMonthAgo,
      updatedAt: now,
      performance: {
        totalPnL: 950.25,
        pnlPercentage: 6.3,
        totalTrades: 36,
        winRate: 0.58,
        lastUpdated: now,
      },
      gridConfig: {
        gridSize: 0.5, // 0.5% grid
        upperLimit: 200,
        lowerLimit: 150,
        quantity: 1,
      },
    },
  ]
}

// Generate demo orders
function generateDemoOrders() {
  const now = new Date().toISOString()
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      id: "ord_demo_1",
      symbol: "AAPL",
      side: "buy",
      type: "market",
      quantity: 10,
      status: "filled",
      createdAt: twoHoursAgo,
      filledAt: twoHoursAgo,
      filledPrice: 182.45,
      filledQuantity: 10,
      botId: "demo-bot-1",
    },
    {
      id: "ord_demo_2",
      symbol: "MSFT",
      side: "sell",
      type: "limit",
      quantity: 5,
      price: 350.0,
      status: "open",
      createdAt: oneHourAgo,
    },
    {
      id: "ord_demo_3",
      symbol: "GOOGL",
      side: "buy",
      type: "market",
      quantity: 2,
      status: "filled",
      createdAt: oneDayAgo,
      filledAt: oneDayAgo,
      filledPrice: 131.22,
      filledQuantity: 2,
      botId: "demo-bot-3",
    },
    {
      id: "ord_demo_4",
      symbol: "BTC-USD",
      side: "buy",
      type: "market",
      quantity: 0.05,
      status: "filled",
      createdAt: oneHourAgo,
      filledAt: oneHourAgo,
      filledPrice: 28750.5,
      filledQuantity: 0.05,
      botId: "demo-bot-4",
    },
    {
      id: "ord_demo_5",
      symbol: "TSLA",
      side: "buy",
      type: "limit",
      quantity: 3,
      price: 240.0,
      status: "open",
      createdAt: now,
    },
  ]
}

// Generate demo portfolio
function generateDemoPortfolio() {
  return {
    totalValue: 125750.45,
    cashBalance: 25750.45,
    positions: [
      {
        symbol: "AAPL",
        quantity: 25,
        averagePrice: 175.32,
        currentPrice: 182.45,
        marketValue: 4561.25,
        unrealizedPnL: 178.25,
        percentChange: 3.9,
      },
      {
        symbol: "MSFT",
        quantity: 15,
        averagePrice: 340.15,
        currentPrice: 350.2,
        marketValue: 5253.0,
        unrealizedPnL: 150.75,
        percentChange: 2.9,
      },
      {
        symbol: "GOOGL",
        quantity: 10,
        averagePrice: 125.75,
        currentPrice: 131.22,
        marketValue: 1312.2,
        unrealizedPnL: 54.7,
        percentChange: 4.3,
      },
      {
        symbol: "BTC-USD",
        quantity: 0.5,
        averagePrice: 27500.0,
        currentPrice: 28750.5,
        marketValue: 14375.25,
        unrealizedPnL: 625.25,
        percentChange: 4.5,
      },
      {
        symbol: "ETH-USD",
        quantity: 2.5,
        averagePrice: 1850.25,
        currentPrice: 1925.75,
        marketValue: 4814.38,
        unrealizedPnL: 188.75,
        percentChange: 4.1,
      },
      {
        symbol: "SPY",
        quantity: 20,
        averagePrice: 435.5,
        currentPrice: 450.25,
        marketValue: 9005.0,
        unrealizedPnL: 295.0,
        percentChange: 3.4,
      },
      {
        symbol: "QQQ",
        quantity: 15,
        averagePrice: 370.25,
        currentPrice: 385.5,
        marketValue: 5782.5,
        unrealizedPnL: 228.75,
        percentChange: 4.1,
      },
    ],
  }
}

// Generate demo watchlist
function generateDemoWatchlist() {
  return ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "BTC-USD", "ETH-USD", "SPY", "QQQ", "VTI"]
}

// Generate demo settings
function generateDemoSettings() {
  return {
    account: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      notifications: {
        email: true,
        push: true,
        trades: true,
        performance: true,
      },
    },
    trading: {
      defaultRiskPercentage: 2,
      maxDrawdown: 10,
      autoRebalance: false,
      tradingHours: {
        start: "09:30",
        end: "16:00",
      },
    },
  }
}

