// Alpaca API Types

// Bar data (OHLC)
export interface Bar {
  t: number;      // Timestamp
  o: number;      // Open
  h: number;      // High
  l: number;      // Low
  c: number;      // Close
  v: number;      // Volume
}

// Market Calendar
export interface CalendarDay {
  date: string;           // Date in YYYY-MM-DD format
  open: string;           // Market open time in HH:MM format
  close: string;          // Market close time in HH:MM format
  session_open: boolean;  // Whether the market is open for the trading session
  session_close: boolean; // Whether the market is closed for the trading session
}

// Account Activities
export interface AccountActivity {
  id: string;
  activity_type: ActivityType;
  transaction_time: string;
  type: string;
  price: number;
  qty: number;
  side: 'buy' | 'sell';
  symbol: string;
  leaves_qty: number;
  order_id: string;
  cum_qty: number;
  order_status: string;
}

// Activity types
export type ActivityType = 
  | 'FILL'
  | 'TRANS'
  | 'DIV'
  | 'ACATC'
  | 'ACATS'
  | 'CSD'
  | 'CSR'
  | 'EXP'
  | 'OPASN'
  | 'OPEXP'
  | 'CIL'
  | 'CSD'
  | 'CSW';

// Account
export interface Account {
  id: string;
  account_number: string;
  status: 'ACTIVE' | 'INACTIVE';
  currency: string;
  buying_power: string;
  cash: string;
  portfolio_value: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  created_at: string;
  trade_suspended_by_user: boolean;
  multiplier: string;
  shorting_enabled: boolean;
  equity: string;
  last_equity: string;
  long_market_value: string;
  short_market_value: string;
  initial_margin: string;
  maintenance_margin: string;
  last_maintenance_margin: string;
  daytrading_buying_power: string;
  balance_asof: string;
}

// Position
export interface Position {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  avg_entry_price: string;
  qty: string;
  side: 'long' | 'short';
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}

// Order
export interface Order {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string | null;
  expired_at: string | null;
  canceled_at: string | null;
  failed_at: string | null;
  asset_id: string;
  symbol: string;
  asset_class: string;
  qty: string;
  filled_qty: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok';
  limit_price: string | null;
  stop_price: string | null;
  status: 'new' | 'partially_filled' | 'filled' | 'done_for_day' | 'canceled' | 'expired' | 'replaced' | 'pending_cancel' | 'pending_replace';
  extended_hours: boolean;
  legs: Order[] | null;
  trail_percent: string | null;
  trail_price: string | null;
  hwm: string | null;
}
