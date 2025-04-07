export type BotType = "indicator" | "grid" | "dca" | "basket";
export type BotStatus = "active" | "paused" | "error";

export type Timeframe = "1min" | "5min" | "15min" | "30min" | "1hour" | "2hour" | "4hour" | "1day" | "1week" | "1month"

export interface IndicatorConfig {
  type: "rsi" | "macd" | "bollinger";
  timeframe: string;
  entryThreshold: number;
  exitThreshold: number;
  period?: number;
  fastPeriod?: number; 
  slowPeriod?: number;
  signalPeriod?: number;
  standardDeviation?: number;
}

export interface GridConfig {
  gridSize: number;
  upperLimit: number;
  lowerLimit: number; 
  quantity: number;
}

export interface DCAConfig {
  interval: string; // Cron expression
  amount: number;
  duration?: string;
}

export interface BasketConfig {
  rebalancePeriod?: string; // Cron expression
  targetAllocation: Record<string, number>;
}

export interface BotPerformance {
  totalPnL: number
  pnlPercentage: number
  totalTrades: number
  winRate: number
  lastUpdated: string
}

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  status: BotStatus;
  assets: string[];
  createdAt: string;
  updatedAt: string;
  performance?: {
    totalPnL: number;
    pnlPercentage: number;
    totalTrades: number;
    winRate: number;
    lastUpdated: string;
  };
  stopLoss?: number;
  takeProfit?: number;
  maxDrawdown?: number;
  indicatorConfig?: IndicatorConfig;
  gridConfig?: GridConfig;  
  dcaConfig?: DCAConfig;
  basketConfig?: BasketConfig;
  allocation?: number;
}

export interface Position {
  id: string;
  botId: string;
  symbol: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  side: "long" | "short";
  status: "open" | "closed";
  openedAt: string;
  closedAt?: string;
  pnl?: number;
  pnlPercentage?: number;
}

export interface Trade {
  id: string;
  botId: string;
  positionId: string;
  type: "entry" | "exit" | "adjust";
  side: "buy" | "sell";  
  price: number;
  quantity: number;
  timestamp: string;
  fees?: number;
  slippage?: number;
}

