import { DemoBot } from '@/types/portfolio'

export const demoBots: DemoBot[] = [
  // ... previous bots remain unchanged ...
  {
    id: "bot-1",
    nickname: "MegaTrend Alpha",
    costBasis: 25000,
    positions: [
      { symbol: "AAPL", quantity: 50, avgPrice: 170.25, currentPrice: 175.50, costBasis: 8512.50, marketValue: 8775.00, unrealizedPnL: 262.50 },
      { symbol: "MSFT", quantity: 30, avgPrice: 305.75, currentPrice: 310.25, costBasis: 9172.50, marketValue: 9307.50, unrealizedPnL: 135.00 }
    ],
    assets: ["AAPL", "MSFT", "GOOGL"],
    margin: 0.4,
    performance: [100, 102, 105, 103, 106, 108, 110, 109, 111, 115],
    allocation: { "Tech": 60, "Finance": 25, "Healthcare": 15 },
    strategy: "basket",
    stopLoss: 5,
    takeProfit: 15,
    maxDrawdown: 10,
    strategyConfig: {
      rebalancePeriod: "0 0 1 * *", // Monthly rebalance
      targetAllocation: {
        AAPL: 0.4,
        MSFT: 0.4,
        GOOGL: 0.2,
      },
    },
  },
  {
    id: "bot-2",
    nickname: "Quantum Edge",
    costBasis: 18000,
    positions: [
      { symbol: "GOOGL", quantity: 20, avgPrice: 2800.50, currentPrice: 2850.75, costBasis: 56010.00, marketValue: 57015.00, unrealizedPnL: 1005.00 }
    ],
    assets: ["GOOGL", "TSLA"],
    margin: 0.3,
    performance: [90, 92, 95, 93, 96, 98, 100, 99, 101, 105],
    allocation: { "Tech": 70, "Energy": 30 },
    strategy: "indicator",
    stopLoss: 7,
    takeProfit: 20,
    maxDrawdown: 15,
    strategyConfig: {
      type: "rsi",
      timeframe: "1day",
      entryThreshold: 30,
      exitThreshold: 70,
    },
  },
  // Add more bots as needed...
]
