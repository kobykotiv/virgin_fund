import type { Bot, BotType, BotStatus } from "@/types/bot"
import { v4 as uuidv4 } from 'uuid';

// Demo account configuration
export const DEMO_ACCOUNT = {
  id: uuidv4(),
  email: "demo@example.com",
  password: "demo123",
  name: "Demo User",
  balance: 10000000, // $10M USD
  portfolioValue: 10000000,
}

// Asset allocation for the demo portfolio
export const DEMO_ASSETS = [
  { id: uuidv4(), symbol: "AAPL", name: "Apple Inc.", allocation: 0.15, price: 175.25 },
  { id: uuidv4(), symbol: "MSFT", name: "Microsoft Corp.", allocation: 0.15, price: 340.12 },
  { symbol: "GOOGL", name: "Alphabet Inc.", allocation: 0.12, price: 132.45 },
  { symbol: "AMZN", name: "Amazon.com Inc.", allocation: 0.12, price: 145.78 },
  { symbol: "TSLA", name: "Tesla Inc.", allocation: 0.08, price: 235.67 },
  { symbol: "NVDA", name: "NVIDIA Corp.", allocation: 0.08, price: 425.89 },
  { symbol: "META", name: "Meta Platforms Inc.", allocation: 0.07, price: 315.42 },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", allocation: 0.06, price: 352.63 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", allocation: 0.05, price: 145.23 },
  { symbol: "V", name: "Visa Inc.", allocation: 0.04, price: 235.78 },
  { symbol: "JNJ", name: "Johnson & Johnson", allocation: 0.04, price: 152.36 },
  { symbol: "WMT", name: "Walmart Inc.", allocation: 0.04, price: 58.92 },
]

// Generate demo bots with diverse strategies
export function generateDemoBots(): Bot[] {
  return [
    {
      id: "demo-bot-1",
      name: "S&P 500 Momentum Strategy",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["SPY", "QQQ", "IWM"],
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 1250000,
        pnlPercentage: 12.5,
        totalTrades: 145,
        winRate: 0.68,
        lastUpdated: new Date().toISOString(),
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
      allocation: 2000000, // $2M allocated
    },
    {
      id: "demo-bot-2",
      name: "Tech Sector Basket",
      type: "basket" as BotType,
      status: "active" as BotStatus,
      assets: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META"],
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 1875000,
        pnlPercentage: 18.75,
        totalTrades: 78,
        winRate: 0.72,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 7,
      takeProfit: 20,
      maxDrawdown: 15,
      basketConfig: {
        rebalancePeriod: "0 0 1 * *", // Monthly rebalance
        targetAllocation: {
          AAPL: 0.25,
          MSFT: 0.25,
          GOOGL: 0.15,
          AMZN: 0.15,
          NVDA: 0.1,
          META: 0.1,
        },
      },
      allocation: 2500000, // $2.5M allocated
    },
    {
      id: "demo-bot-3",
      name: "Bitcoin Grid Trader",
      type: "grid" as BotType,
      status: "active" as BotStatus,
      assets: ["BTC-USD"],
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 750000,
        pnlPercentage: 15.0,
        totalTrades: 210,
        winRate: 0.65,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 8,
      takeProfit: 12,
      maxDrawdown: 20,
      gridConfig: {
        gridSize: 1, // 1% grid
        upperLimit: 65000,
        lowerLimit: 45000,
        quantity: 0.5,
      },
      allocation: 1500000, // $1.5M allocated
    },
    {
      id: "demo-bot-4",
      name: "Blue Chip DCA Strategy",
      type: "dca" as BotType,
      status: "active" as BotStatus,
      assets: ["JNJ", "PG", "KO", "PEP", "WMT"],
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 425000,
        pnlPercentage: 8.5,
        totalTrades: 95,
        winRate: 0.7,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 5,
      takeProfit: 10,
      maxDrawdown: 8,
      dcaConfig: {
        interval: "0 0 * * 1", // Every Monday
        amount: 50000,
        duration: "indefinite",
      },
      allocation: 1000000, // $1M allocated
    },
    {
      id: "demo-bot-5",
      name: "MACD Crossover Strategy",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["SPY", "QQQ", "DIA"],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 625000,
        pnlPercentage: 12.5,
        totalTrades: 68,
        winRate: 0.62,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 6,
      takeProfit: 18,
      maxDrawdown: 12,
      indicatorConfig: {
        type: "macd",
        timeframe: "4hour",
        entryThreshold: 0,
        exitThreshold: 0,
      },
      allocation: 1000000, // $1M allocated
    },
    {
      id: "demo-bot-6",
      name: "Bollinger Band Mean Reversion",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["AAPL", "MSFT", "GOOGL"],
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 375000,
        pnlPercentage: 7.5,
        totalTrades: 112,
        winRate: 0.58,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 4,
      takeProfit: 8,
      maxDrawdown: 10,
      indicatorConfig: {
        type: "bollinger",
        timeframe: "1hour",
        entryThreshold: 2,
        exitThreshold: 0,
      },
      allocation: 1000000, // $1M allocated
    },
    {
      id: "demo-bot-7",
      name: "Dividend Aristocrats",
      type: "basket" as BotType,
      status: "active" as BotStatus,
      assets: ["JNJ", "PG", "KO", "XOM", "CVX", "MMM"],
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 225000,
        pnlPercentage: 4.5,
        totalTrades: 42,
        winRate: 0.75,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 3,
      takeProfit: 7,
      maxDrawdown: 5,
      basketConfig: {
        rebalancePeriod: "0 0 1 1 *", // Quarterly rebalance
        targetAllocation: {
          JNJ: 0.2,
          PG: 0.2,
          KO: 0.15,
          XOM: 0.15,
          CVX: 0.15,
          MMM: 0.15,
        },
      },
      allocation: 500000, // $500K allocated
    },
    {
      id: "demo-bot-8",
      name: "Sector Rotation Strategy",
      type: "indicator" as BotType,
      status: "active" as BotStatus,
      assets: ["XLK", "XLF", "XLE", "XLV", "XLY", "XLI", "XLP", "XLU", "XLB", "XLRE"],
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      performance: {
        totalPnL: 325000,
        pnlPercentage: 6.5,
        totalTrades: 85,
        winRate: 0.6,
        lastUpdated: new Date().toISOString(),
      },
      stopLoss: 5,
      takeProfit: 10,
      maxDrawdown: 12,
      indicatorConfig: {
        type: "rsi",
        timeframe: "1week",
        entryThreshold: 30,
        exitThreshold: 70,
      },
      allocation: 500000, // $500K allocated
    },
  ]
}

// Generate demo orders
export function generateDemoOrders() {
  return [
    {
      id: "ord_demo_1",
      symbol: "AAPL",
      side: "buy",
      type: "market",
      quantity: 5000,
      status: "filled",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      filledAt: new Date(Date.now() - 3540000).toISOString(),
      filledPrice: 175.25,
      filledQuantity: 5000,
      botId: "demo-bot-2",
      value: 876250, // $876,250
    },
    {
      id: "ord_demo_2",
      symbol: "MSFT",
      side: "buy",
      type: "limit",
      quantity: 3000,
      price: 340.0,
      status: "filled",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      filledAt: new Date(Date.now() - 7140000).toISOString(),
      filledPrice: 340.0,
      filledQuantity: 3000,
      botId: "demo-bot-2",
      value: 1020000, // $1,020,000
    },
    {
      id: "ord_demo_3",
      symbol: "BTC-USD",
      side: "buy",
      type: "market",
      quantity: 10,
      status: "filled",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      filledAt: new Date(Date.now() - 86340000).toISOString(),
      filledPrice: 52000,
      filledQuantity: 10,
      botId: "demo-bot-3",
      value: 520000, // $520,000
    },
    {
      id: "ord_demo_4",
      symbol: "GOOGL",
      side: "sell",
      type: "limit",
      quantity: 2000,
      price: 133.0,
      status: "open",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      botId: "demo-bot-2",
      value: 266000, // $266,000
    },
    {
      id: "ord_demo_5",
      symbol: "SPY",
      side: "buy",
      type: "market",
      quantity: 1500,
      status: "filled",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      filledAt: new Date(Date.now() - 172740000).toISOString(),
      filledPrice: 450.75,
      filledQuantity: 1500,
      botId: "demo-bot-1",
      value: 676125, // $676,125
    },
    {
      id: "ord_demo_6",
      symbol: "NVDA",
      side: "buy",
      type: "market",
      quantity: 1000,
      status: "filled",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      filledAt: new Date(Date.now() - 259140000).toISOString(),
      filledPrice: 425.89,
      filledQuantity: 1000,
      botId: "demo-bot-2",
      value: 425890, // $425,890
    },
    {
      id: "ord_demo_7",
      symbol: "JNJ",
      side: "buy",
      type: "market",
      quantity: 3000,
      status: "filled",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      filledAt: new Date(Date.now() - 431940000).toISOString(),
      filledPrice: 152.36,
      filledQuantity: 3000,
      botId: "demo-bot-7",
      value: 457080, // $457,080
    },
    {
      id: "ord_demo_8",
      symbol: "TSLA",
      side: "sell",
      type: "limit",
      quantity: 1500,
      price: 240.0,
      status: "open",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      botId: "demo-bot-2",
      value: 360000, // $360,000
    },
  ]
}

// Generate portfolio positions
export function generateDemoPositions() {
  return [
    {
      symbol: "AAPL",
      quantity: 25000,
      avgPrice: 165.42,
      currentPrice: 175.25,
      value: 4381250,
      pnl: 245750,
      pnlPercentage: 5.94,
    },
    {
      symbol: "MSFT",
      quantity: 12000,
      avgPrice: 320.18,
      currentPrice: 340.12,
      value: 4081440,
      pnl: 239280,
      pnlPercentage: 6.23,
    },
    {
      symbol: "GOOGL",
      quantity: 15000,
      avgPrice: 125.75,
      currentPrice: 132.45,
      value: 1986750,
      pnl: 100500,
      pnlPercentage: 5.33,
    },
    {
      symbol: "AMZN",
      quantity: 18000,
      avgPrice: 135.92,
      currentPrice: 145.78,
      value: 2624040,
      pnl: 177480,
      pnlPercentage: 7.25,
    },
    {
      symbol: "TSLA",
      quantity: 12000,
      avgPrice: 220.45,
      currentPrice: 235.67,
      value: 2828040,
      pnl: 182640,
      pnlPercentage: 6.9,
    },
    {
      symbol: "NVDA",
      quantity: 8000,
      avgPrice: 380.25,
      currentPrice: 425.89,
      value: 3407120,
      pnl: 365120,
      pnlPercentage: 12.01,
    },
    {
      symbol: "META",
      quantity: 9000,
      avgPrice: 290.75,
      currentPrice: 315.42,
      value: 2838780,
      pnl: 222030,
      pnlPercentage: 8.49,
    },
    {
      symbol: "BTC-USD",
      quantity: 25,
      avgPrice: 48000,
      currentPrice: 52000,
      value: 1300000,
      pnl: 100000,
      pnlPercentage: 8.33,
    },
    {
      symbol: "SPY",
      quantity: 8000,
      avgPrice: 435.25,
      currentPrice: 450.75,
      value: 3606000,
      pnl: 124000,
      pnlPercentage: 3.56,
    },
    {
      symbol: "JNJ",
      quantity: 12000,
      avgPrice: 145.8,
      currentPrice: 152.36,
      value: 1828320,
      pnl: 78720,
      pnlPercentage: 4.5,
    },
  ]
}

// Generate market data for demo assets
export function generateDemoMarketData() {
  return DEMO_ASSETS.map((asset) => ({
    symbol: asset.symbol,
    price: asset.price,
    change: Math.random() * 6 - 3, // Random change between -3% and +3%
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    timestamp: new Date().toISOString(),
  }))
}

// Generate portfolio performance history
export function generatePortfolioHistory(days = 90) {
  const history = []
  const startValue = 9000000 // Starting at $9M
  const endValue = 10000000 // Ending at $10M
  const dailyGrowthRate = Math.pow(endValue / startValue, 1 / days) - 1

  let currentValue = startValue

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))

    // Add some randomness to daily change
    const randomFactor = 1 + (Math.random() * 0.02 - 0.01) // ±1%
    currentValue = currentValue * (1 + dailyGrowthRate) * randomFactor

    history.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(currentValue),
    })
  }

  return history
}

// Generate portfolio allocation by sector
export function generateSectorAllocation() {
  return [
    { sector: "Technology", allocation: 0.35, value: 3500000 },
    { sector: "Healthcare", allocation: 0.15, value: 1500000 },
    { sector: "Consumer Cyclical", allocation: 0.12, value: 1200000 },
    { sector: "Financial Services", allocation: 0.1, value: 1000000 },
    { sector: "Communication Services", allocation: 0.08, value: 800000 },
    { sector: "Industrials", allocation: 0.07, value: 700000 },
    { sector: "Consumer Defensive", allocation: 0.05, value: 500000 },
    { sector: "Energy", allocation: 0.04, value: 400000 },
    { sector: "Cryptocurrencies", allocation: 0.04, value: 400000 },
  ]
}

