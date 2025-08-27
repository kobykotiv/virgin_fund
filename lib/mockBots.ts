export type BotStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error';

// Use demo templates for reproducible defaults when creating new bots
import { generateDemoBots } from './demo-data';

export type Bot = {
  id: string;
  name: string;
  strategy: string;
  status: BotStatus;
  currentPnL: number; // percent
  allocatedCapital: number; // USD
  // marketplace metadata - optional
  forSale?: boolean;
  price?: number; // USD
  description?: string;
  // trading config for strategies (indicator, grid, dca, etc.)
  indicatorConfig?: Record<string, any>;
  stopLoss?: number; // percent
  takeProfit?: number; // percent
  createdAt: string;
  updatedAt: string;
};

const seed: Bot[] = [
  {
    id: 'bot-1',
    name: 'Gridmaster Alpha',
    strategy: 'grid',
    status: 'running',
    currentPnL: 3.4,
    allocatedCapital: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-2',
    name: 'RSI Scalper',
    strategy: 'rsi',
    status: 'paused',
    currentPnL: -1.2,
    allocatedCapital: 1200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-3',
    name: 'Stat Arb 01',
    strategy: 'statarb',
    status: 'idle',
    currentPnL: 0.0,
    allocatedCapital: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-4',
    name: 'MeanRevert Pro',
    strategy: 'mean_reversion',
    status: 'idle',
    currentPnL: 1.1,
    allocatedCapital: 3000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-5',
    name: 'Momentum Hunter',
    strategy: 'momentum',
    status: 'running',
    currentPnL: 6.7,
    allocatedCapital: 4000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-6',
    name: 'DCA Saver',
    strategy: 'dca',
    status: 'paused',
    currentPnL: 0.5,
    allocatedCapital: 1500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-7',
    name: 'Breakout Beast',
    strategy: 'breakout',
    status: 'running',
    currentPnL: 12.3,
    allocatedCapital: 8000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-8',
    name: 'Futures Scalper',
    strategy: 'futures_scalp',
    status: 'stopped',
    currentPnL: -4.0,
    allocatedCapital: 6000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-9',
    name: 'Pairs Trader Blue',
    strategy: 'pairs',
    status: 'idle',
    currentPnL: 2.2,
    allocatedCapital: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-10',
    name: 'Options Theta',
    strategy: 'options_theta',
    status: 'running',
    currentPnL: 5.0,
    allocatedCapital: 10000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-11',
    name: 'VWAP Intraday',
    strategy: 'vwap',
    status: 'paused',
    currentPnL: -0.3,
    allocatedCapital: 2200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-12',
    name: 'ML Signaler X',
    strategy: 'ml_classifier',
    status: 'idle',
    currentPnL: 8.9,
    allocatedCapital: 12000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-13',
    name: 'Reinforce RL Bot',
    strategy: 'reinforcement',
    status: 'running',
    currentPnL: 14.6,
    allocatedCapital: 20000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-14',
    name: 'Dividend Reinvestor',
    strategy: 'dividend',
    status: 'idle',
    currentPnL: 0.9,
    allocatedCapital: 7000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-15',
    name: 'Microcap Explorer',
    strategy: 'microcap_momentum',
    status: 'paused',
    currentPnL: -2.4,
    allocatedCapital: 3000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-16',
    name: 'EventDriven Opportunist',
    strategy: 'event_driven',
    status: 'idle',
    currentPnL: 4.2,
    allocatedCapital: 5000,
    forSale: true,
    price: 499,
    description: 'Scans news/events and trades short-term reactions around earnings and macro prints.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-17',
    name: 'Volatility Scalper Pro',
    strategy: 'volatility_scalper',
    status: 'running',
    currentPnL: 9.7,
    allocatedCapital: 7500,
    forSale: true,
    price: 899,
    description: 'High-frequency style scalper that targets volatility spikes in liquid names.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-18',
    name: 'Seasonal Value Hunter',
    strategy: 'seasonal',
    status: 'idle',
    currentPnL: 2.1,
    allocatedCapital: 4000,
    forSale: true,
    price: 199,
    description: 'Long-only seasonal/value rotation strategy suitable for swing traders.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-19',
    name: 'Pairs Arbitrager Lite',
    strategy: 'quant_pairs',
    status: 'paused',
    currentPnL: 1.8,
    allocatedCapital: 6000,
    forSale: false,
    price: 0,
    description: 'Pairs trading engine optimized for mean-reverting spreads.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bot-20',
    name: 'ArbX Cross-Market',
    strategy: 'arbitrage',
    status: 'running',
    currentPnL: 11.4,
    allocatedCapital: 25000,
    forSale: true,
    price: 1299,
    description: 'Cross-exchange arbitrage collector that finds momentary price dislocations.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const store = new Map<string, Bot>();
seed.forEach((b) => store.set(b.id, b));

function genId() {
  return 'bot-' + Math.random().toString(36).slice(2, 9);
}

export function listBots({ search, status, strategy, page = 1, pageSize = 20 }:
  {search?: string; status?: string; strategy?: string; page?: number; pageSize?: number}) {
  let items = Array.from(store.values());
  if (search) {
    const s = search.toLowerCase();
    items = items.filter((b) => b.name.toLowerCase().includes(s) || b.strategy.toLowerCase().includes(s));
  }
  if (status) items = items.filter((b) => b.status === status);
  if (strategy) items = items.filter((b) => b.strategy === strategy);
  const total = items.length;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);
  return { items: pageItems, total };
}

export function createBot(data: Partial<Bot>) {
  const now = new Date().toISOString();
  // pick a template from demo bots to provide sensible defaults
  const templates = generateDemoBots();
  const template = templates.find((t) => t.indicatorConfig?.type === (data.indicatorConfig?.type || (data.strategy as any))) || templates[0];

  const bot: Bot = {
    id: genId(),
    name: data.name || 'New Bot',
    strategy: data.strategy || 'dca',
    status: (data.status as BotStatus) || 'idle',
    currentPnL: data.currentPnL ?? 0,
    allocatedCapital: data.allocatedCapital ?? 1000,
    // inherit or default trading config
    indicatorConfig: data.indicatorConfig ?? (template as any).indicatorConfig ?? undefined,
    stopLoss: data.stopLoss ?? (template as any).stopLoss ?? 5,
    takeProfit: data.takeProfit ?? (template as any).takeProfit ?? 10,
    createdAt: now,
    updatedAt: now,
  };
  store.set(bot.id, bot);
  return bot;
}

export function getBot(id: string) {
  return store.get(id) || null;
}

export function updateBot(id: string, patch: Partial<Bot>) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated: Bot = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
}

export function deleteBot(id: string) {
  return store.delete(id);
}

export function performAction(id: string, action: string) {
  const bot = store.get(id);
  if (!bot) return null;
  switch (action) {
    case 'start':
      bot.status = 'running';
      break;
    case 'pause':
      bot.status = 'paused';
      break;
    case 'stop':
      bot.status = 'stopped';
      break;
    case 'clone': {
      const clone = createBot({
        name: bot.name + ' (clone)',
        strategy: bot.strategy,
        status: 'idle',
        allocatedCapital: bot.allocatedCapital,
      });
      return clone;
    }
    default:
      // no-op
      break;
  }
  bot.updatedAt = new Date().toISOString();
  store.set(id, bot);
  return bot;
}

// --- Marketplace & strategy samples helpers ---
export const strategySamples: Record<string, { name: string; description: string; tickers: string[] }> = {
  grid: { name: 'Grid', description: 'Range-bound grid trading across support/resistance levels.', tickers: ['AAPL', 'MSFT', 'SPY'] },
  rsi: { name: 'RSI Scalper', description: 'Short-term mean-reversion using RSI signals.', tickers: ['TSLA', 'NVDA'] },
  statarb: { name: 'Statistical Arbitrage', description: 'Pairs and basket mean-reversion.', tickers: ['XLF', 'XLY', 'XLC'] },
  mean_reversion: { name: 'Mean Reversion', description: 'Reverts to short-term mean.', tickers: ['AMZN', 'FB'] },
  momentum: { name: 'Momentum', description: 'Trend following across liquid names.', tickers: ['QQQ', 'SPY'] },
  dca: { name: 'Dollar Cost Average', description: 'Regular buys into target tickers.', tickers: ['VOO', 'VTI'] },
  breakout: { name: 'Breakout', description: 'Catches breakouts after consolidation.', tickers: ['NFLX', 'ZM'] },
  futures_scalp: { name: 'Futures Scalper', description: 'Scalp futures markets for small edge.', tickers: ['ES', 'NQ'] },
  pairs: { name: 'Pairs Trader', description: 'Long/short pairs mean-reversion.', tickers: ['BAC/GS', 'XOM/COP'] },
  options_theta: { name: 'Options Theta', description: 'Income generation via options decay.', tickers: ['SPY', 'AAPL'] },
  vwap: { name: 'VWAP Intraday', description: 'VWAP-based execution and intraday timing.', tickers: ['MSFT', 'AAPL'] },
  ml_classifier: { name: 'ML Classifier', description: 'Feature-driven classifier for signals.', tickers: ['NVDA', 'AMD'] },
  reinforcement: { name: 'Reinforcement RL', description: 'RL agent trained for episodic returns.', tickers: ['SPY', 'QQQ'] },
  dividend: { name: 'Dividend Reinvestor', description: 'Focus on dividend growers and reinvestment.', tickers: ['JNJ', 'KO'] },
  microcap_momentum: { name: 'Microcap Momentum', description: 'High-beta microcap momentum plays.', tickers: ['Penny1', 'Penny2'] },
  event_driven: { name: 'Event Driven', description: 'Earnings/news-driven short-term trades.', tickers: ['AAPL', 'TSLA'] },
  volatility_scalper: { name: 'Volatility Scalper', description: 'Targets intraday volatility spikes.', tickers: ['VXX', 'UVXY'] },
  seasonal: { name: 'Seasonal Rotation', description: 'Seasonal and value rotations.', tickers: ['XLY', 'XLP'] },
  quant_pairs: { name: 'Quant Pairs', description: 'Algorithmic pairs strategies.', tickers: ['KO/PEP'] },
  arbitrage: { name: 'Arbitrage', description: 'Cross-market arbitrage collector.', tickers: ['BTC-USD', 'ETH-USD'] },
};

export function listMarketplace({ page = 1, pageSize = 20 } = { page: 1, pageSize: 20 }) {
  const items = Array.from(store.values()).filter((b) => b.forSale);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total };
}

export function findStrategiesForTicker(ticker: string) {
  const keys = Object.keys(strategySamples).filter((k) => strategySamples[k].tickers.includes(ticker));
  return keys.map((k) => ({ key: k, ...strategySamples[k] }));
}
