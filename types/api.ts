export interface Bot {
  id: string;
  name: string;
  // allow a few known strategy strings but be permissive to avoid frequent breakage
  strategy?: 'dca' | 'grid' | 'indicator' | 'portfolio' | 'basket' | string;
  // primary traded assets (symbols)
  assets: string[];
  // portfolio allocation or default allocation per-asset (decimal e.g., 0.25)
  allocation?: number;
  currency?: 'USD' | 'EUR' | 'BTC' | 'ETH' | string;
  // permissive status so UI can map different casings/labels
  status: 'running' | 'paused' | 'stopped' | string;
  scheduleCron?: string;
  createdAt: string;
  ownerId?: string;
  initialBalance?: number;
  // optional convenience fields used in various UI components
  capital?: number;
  currentPnL?: number;
  lastTradeAt?: string;
  // optional fields present in other Bot types across the repo
  type?: string;
  updatedAt?: string;
  // allow storing form parameters or metadata from bot creation flows
  parameters?: Record<string, any>;
  // risk management
  stopLoss?: number; // percent
  takeProfit?: number; // percent
  maxDrawdown?: number; // percent

  // strategy-specific typed configurations
  indicatorConfig?: IndicatorConfig;
  gridConfig?: GridConfig;
  dcaConfig?: DCAConfig;
  basketConfig?: BasketConfig;

  // aggregated runtime performance / snapshot used by UI
  performance?: PerformanceSummary;
}

// Payload used by client when creating a bot via the API
export interface CreateBotPayload {
  name: string;
  strategy?: string;
  capital?: number;
  currency?: string;
  parameters?: Record<string, any>;
}

// Payload used for partial updates to existing bots
export interface UpdateBotPayload extends Partial<Bot> {
  id: string;
}

export interface Trade {
  id?: string;
  botId?: string;
  symbol: string;
  // qty/quantity may be present under different names in various modules
  qty?: number;
  // some places use `quantity` instead of `qty`
  quantity?: number;
  price: number;
  // optionally store computed value (qty * price)
  value?: number;
  side?: 'buy' | 'sell';
  // legacy places use `action` (buy/sell) — accept both
  action?: 'buy' | 'sell';
  // both timestamp and datetime are accepted in various places
  timestamp?: string;
  datetime?: string | number;
  pnl?: number;
}

export interface BacktestResult {
  equity?: Array<{ ts: number; value: number }>;
  trades: Trade[];
  // metric block is optional; older code also exposes top-level ROI/winRate/maxDrawdown
  metrics?: { sharpe: number; maxDrawdown: number; winRate: number };
  initialCapital?: number;
  // finalCapital is used in parts of the codebase
  finalCapital?: number;
  // ROI convenience metric used by older code
  roi?: number;
  // older code used `equityCurve` as an alias for equity
  equityCurve?: Array<{ date?: string; ts?: number; value: number }>;
  // convenience top-level metrics
  winRate?: number;
  maxDrawdown?: number;
}

// Additional types used across the codebase
export type BotType = 'indicator' | 'grid' | 'dca' | 'basket' | 'portfolio' | string

export interface IndicatorConfig {
  type: 'rsi' | 'macd' | 'bollinger' | string
  timeframe: string
  entryThreshold?: number
  exitThreshold?: number
}

export interface GridConfig {
  gridSize: number // percent or absolute depending on UI, usually percent
  upperLimit: number
  lowerLimit: number
  quantity: number
}

export interface DCAConfig {
  interval: string // cron or human readable
  amount: number
  duration?: string
}

export interface BasketConfig {
  rebalancePeriod?: string
  targetAllocation: Record<string, number> // symbol -> decimal fraction (0.25)
}

export interface PerformanceSummary {
  pnlPercentage: number
  totalTrades: number
  winRate: number
  currentValue?: number
  // convenience absolute P&L used in demo data and UI
  totalPnL?: number
  // timestamp when the summary was last computed
  lastUpdated?: string
}

// allow optional description on Bot where used by some components
declare module './api' {
  interface Bot {
    description?: string
  }
}

export type BotStatus = 'running' | 'paused' | 'stopped' | string

export type StrategyType = BotType

export interface Order {
  id?: string
  symbol: string
  qty: number
  price?: number
  side: 'buy' | 'sell'
  timestamp?: string
}

export type BotConfig = IndicatorConfig | GridConfig | DCAConfig | BasketConfig | Record<string, any>
