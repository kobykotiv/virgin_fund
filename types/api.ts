export interface Bot {
  id: string;
  name: string;
  // allow a few known strategy strings but be permissive to avoid frequent breakage
  strategy: 'dca' | 'grid' | 'indicator' | 'portfolio' | 'basket' | string;
  assets: string[];
  allocation: number;
  currency: 'USD' | 'EUR' | 'BTC' | 'ETH' | string;
  // permissive status so UI can map different casings/labels
  status: 'running' | 'paused' | 'stopped' | string;
  scheduleCron?: string;
  createdAt: string;
  ownerId: string;
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
  id: string;
  botId?: string;
  symbol: string;
  qty: number;
  price: number;
  side: 'buy' | 'sell';
  timestamp: string;
  pnl?: number;
}

export interface BacktestResult {
  equity: Array<{ ts: number; value: number }>;
  trades: Trade[];
  metrics: { sharpe: number; maxDrawdown: number; winRate: number };
}
