/**
 * Database type definitions for the refactored bot-centered schema
 * Schema: bots -> positions[] -> orders[] -> trades[]
 */

export interface Bot {
  id: string;
  user_id: string;
  name: string;
  type: string;
  risk: string;
  status: 'active' | 'paused' | 'stopped' | 'error';
  strategy_type: 'manual' | 'algorithmic' | 'copy' | 'dca' | 'grid';
  capital_allocated: number;
  max_position_size: number;
  risk_tolerance: 'low' | 'medium' | 'high' | 'aggressive';
  auto_trade: boolean;
  config: Record<string, any>;
  performance: number;
  total_pnl: number;
  win_rate: number;
  description?: string;
  active_orders_count: number;
  positions_count: number;
  created_at: string;
  updated_at: string;
  last_trade_at?: string;
}

export interface Position {
  id: string;
  bot_id: string;
  symbol: string;
  ticker?: string; // legacy field
  asset_type?: string;
  side: 'long' | 'short';
  status: 'open' | 'closed' | 'partial';
  quantity: number;
  avg_price: number;
  current_price?: number;
  entry_price?: number;
  exit_price?: number;
  stop_loss?: number;
  take_profit?: number;
  unrealized_pnl: number;
  realized_pnl: number;
  total_cost: number;
  market_value: number;
  name?: string; // legacy field
  positions?: Record<string, any>; // legacy field
  trades?: Record<string, any>; // legacy field
  notes?: string;
  opened_at: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  bot_id: string;
  position_id?: string;
  symbol: string;
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stop_price?: number;
  time_in_force: 'day' | 'gtc' | 'ioc' | 'fok';
  status: 'pending' | 'submitted' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';
  filled_quantity: number;
  filled_avg_price: number;
  submitted_at: string;
  filled_at?: string;
  cancelled_at?: string;
  client_order_id?: string;
  broker_order_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  trade_id: string;
  order_id?: string;
  bot_id?: string;
  position_id?: string;
  symbol?: string;
  action: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  commission: number;
  fees: number;
  net_amount: number;
  trade_type: 'execution' | 'dividend' | 'split' | 'merger';
  broker_trade_id?: string;
  datetime: string;
  created_at: string;
  updated_at: string;
}

export interface MarketData {
  id: string;
  symbol?: string;
  bar?: Record<string, any>;
  quote?: Record<string, any>;
  historical_data?: Record<string, any>;
  calendar_day?: Record<string, any>;
  created_at: string;
}

export interface News {
  id: string;
  headline?: string;
  summary?: string;
  author?: string;
  url?: string;
  images?: string[];
  symbols?: string[];
  source?: string;
  created_at: string;
  updated_at: string;
}

// View types
export interface PortfolioSummary {
  user_id: string;
  bot_id: string;
  bot_name: string;
  bot_status: string;
  capital_allocated: number;
  total_pnl: number;
  total_positions: number;
  open_positions: number;
  total_market_value: number;
  total_unrealized_pnl: number;
  total_realized_pnl: number;
}

// Aggregated types for API responses
export interface BotWithPositions extends Bot {
  positions?: Position[];
  orders?: Order[];
  recent_trades?: Trade[];
}

export interface PositionWithTrades extends Position {
  orders?: Order[];
  trades?: Trade[];
}

export interface AggregatedPortfolioPosition {
  symbol: string;
  totalShares: number;
  totalMarketValue: number;
  totalUnrealizedPnl: number;
  totalRealizedPnl: number;
  controllingBots: {
    id: string;
    name: string;
    shares: number;
    marketValue: number;
  }[];
  positions: {
    botId: string;
    positionId: string;
    shares: number;
    avgPrice: number;
    marketValue: number;
    unrealizedPnl: number;
  }[];
}

// Database table names for type safety
export const TableNames = {
  BOTS: 'bots',
  POSITIONS: 'positions',
  ORDERS: 'orders',
  TRADES: 'trades',
  MARKET_DATA: 'market_data',
  NEWS: 'news',
} as const;

// Status enums for type safety
export const BotStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  ERROR: 'error',
} as const;

export const PositionStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
  PARTIAL: 'partial',
} as const;

export const OrderStatus = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  FILLED: 'filled',
  PARTIALLY_FILLED: 'partially_filled',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
} as const;

export const OrderType = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP: 'stop',
  STOP_LIMIT: 'stop_limit',
} as const;

export const TimeInForce = {
  DAY: 'day',
  GTC: 'gtc',
  IOC: 'ioc',
  FOK: 'fok',
} as const;
