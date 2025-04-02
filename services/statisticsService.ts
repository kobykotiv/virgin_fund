/**
 * This service simulates fetching statistics from a database with aggregated data.
 * In a real application, this would connect to your actual database or API.
 */

// Trading volume statistics
export interface TradingVolumeStats {
  totalVolumeUsd: number;
  totalTrades: number;
  averageTradeSize: number;
  percentIncrease: number;
  topAssets: Array<{asset: string, volume: number, percentOfTotal: number}>;
  volumeByTimeframe: Array<{period: string, volume: number}>;
}

// User statistics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  averageBotCount: number;
  userGrowth: number;
  usersByExperience: Array<{level: string, count: number, percentage: number}>;
  usersByCountry: Array<{country: string, count: number, percentage: number}>;
}

// Performance statistics
export interface PerformanceStats {
  averageReturnPercentage: number;
  bestStrategyPerformance: number;
  worstStrategyPerformance: number;
  medianStrategyPerformance: number;
  performanceDistribution: Array<{range: string, count: number, percentage: number}>;
  winRate: number;
}

// Bot statistics
export interface BotStats {
  totalBots: number;
  activeBots: number;
  averageTradesPerBot: number;
  botGrowth: number;
  botsByStrategy: Array<{strategy: string, count: number, percentage: number}>;
  botsByAssetClass: Array<{assetClass: string, count: number, percentage: number}>;
}

// Mock function to get trading volume statistics
export function getTradingVolumeStats(): TradingVolumeStats {
  return {
    totalVolumeUsd: 1428576450,
    totalTrades: 5739284,
    averageTradeSize: 248.91,
    percentIncrease: 23.7,
    topAssets: [
      { asset: "BTC", volume: 423456000, percentOfTotal: 29.64 },
      { asset: "ETH", volume: 312789000, percentOfTotal: 21.89 },
      { asset: "AAPL", volume: 156823000, percentOfTotal: 10.98 },
      { asset: "MSFT", volume: 143267000, percentOfTotal: 10.03 },
      { asset: "SPY", volume: 102345000, percentOfTotal: 7.16 }
    ],
    volumeByTimeframe: [
      { period: "Last 24h", volume: 6745230 },
      { period: "Last week", volume: 42356780 },
      { period: "Last month", volume: 187654300 },
      { period: "Last quarter", volume: 543287600 },
      { period: "Last year", volume: 1428576450 }
    ]
  };
}

// Mock function to get user statistics
export function getUserStats(): UserStats {
  return {
    totalUsers: 124567,
    activeUsers: 86723,
    averageBotCount: 2.7,
    userGrowth: 16.8,
    usersByExperience: [
      { level: "Beginner", count: 53764, percentage: 43.16 },
      { level: "Intermediate", count: 42853, percentage: 34.40 },
      { level: "Advanced", count: 19876, percentage: 15.96 },
      { level: "Professional", count: 8074, percentage: 6.48 }
    ],
    usersByCountry: [
      { country: "United States", count: 38653, percentage: 31.03 },
      { country: "United Kingdom", count: 12456, percentage: 10.00 },
      { country: "Germany", count: 10245, percentage: 8.22 },
      { country: "Japan", count: 9876, percentage: 7.93 },
      { country: "Canada", count: 7890, percentage: 6.33 },
      { country: "Others", count: 45447, percentage: 36.49 }
    ]
  };
}

// Mock function to get performance statistics
export function getPerformanceStats(): PerformanceStats {
  return {
    averageReturnPercentage: 12.7,
    bestStrategyPerformance: 78.3,
    worstStrategyPerformance: -24.6,
    medianStrategyPerformance: 9.4,
    performanceDistribution: [
      { range: "<0%", count: 15672, percentage: 12.58 },
      { range: "0-5%", count: 23876, percentage: 19.17 },
      { range: "5-10%", count: 31245, percentage: 25.08 },
      { range: "10-20%", count: 26784, percentage: 21.50 },
      { range: "20-50%", count: 22456, percentage: 18.03 },
      { range: ">50%", count: 4534, percentage: 3.64 }
    ],
    winRate: 64.7
  };
}

// Mock function to get bot statistics
export function getBotStats(): BotStats {
  return {
    totalBots: 336329,
    activeBots: 278943,
    averageTradesPerBot: 17.3,
    botGrowth: 34.2,
    botsByStrategy: [
      { strategy: "DCA", count: 142567, percentage: 42.39 },
      { strategy: "Indicators", count: 98765, percentage: 29.37 },
      { strategy: "Signal-based", count: 67834, percentage: 20.17 },
      { strategy: "Grid", count: 15342, percentage: 4.56 },
      { strategy: "Other", count: 11821, percentage: 3.51 }
    ],
    botsByAssetClass: [
      { assetClass: "Crypto", count: 178965, percentage: 53.21 },
      { assetClass: "Stocks", count: 89765, percentage: 26.69 },
      { assetClass: "Forex", count: 43267, percentage: 12.86 },
      { assetClass: "Commodities", count: 15678, percentage: 4.66 },
      { assetClass: "Other", count: 8654, percentage: 2.58 }
    ]
  };
}
