export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  costBasis: number
  marketValue: number
  unrealizedPnL: number
}

export interface DemoBot {
  id: string
  nickname: string
  costBasis: number
  positions: Position[]
  assets: string[]
  margin: number
  performance: number[]
  allocation: Record<string, number>
  strategy: string; // e.g., "grid", "dca", "indicator", "basket"
  stopLoss?: number; // percentage
  takeProfit?: number; // percentage
  strategyConfig?: {
    // Grid strategy config
    gridSize?: number; // percentage between grid lines
    upperLimit?: number;
    lowerLimit?: number;
    quantity?: number;

    // DCA strategy config
    interval?: string; // cron expression
    amount?: number; // amount to invest each interval
    duration?: string; // e.g., "90days", "indefinite"

    // Indicator strategy config
    type?: string; // "rsi", "macd", "bollinger"
    timeframe?: string; // "1day", "4hour", "1week"
    entryThreshold?: number;
    exitThreshold?: number;

    // Basket strategy config
    rebalancePeriod?: string; // cron expression
    targetAllocation?: Record<string, number>;
  };
  maxDrawdown?: number;
}
