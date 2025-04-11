export interface Bot {
  id: string;
  name: string;
  description?: string;
  type: BotType['value'];
  strategy?: string;
  settings: BotSettings;
  userId: string;
  active: boolean;
  status?: BotStatus;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
}

export interface BotType {
  value: string;
  label: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  features?: string[];
}

export type BotStatus = {
  state: 'idle' | 'running' | 'error' | 'paused';
  message?: string;
  lastUpdate: Date;
  performance?: {
    totalTrades: number;
    winRate: number;
    totalProfit: number;
    totalFees: number;
  };
};

// Base settings interface that all bot types extend
interface BaseBotSettings {
  enabled: boolean;
  maxDrawdown?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface DCASettings extends BaseBotSettings {
  symbol: string;
  amount: number;
  interval: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
  maxPositionSize?: number;
}

export interface GridSettings extends BaseBotSettings {
  symbol: string;
  upperPrice: number;
  lowerPrice: number;
  gridLines: number;
  investmentAmount: number;
  profitTarget?: number;
}

export interface IndicatorSettings extends BaseBotSettings {
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  entryAmount: number;
  indicators: {
    rsi?: {
      period: number;
      overbought: number;
      oversold: number;
    };
    macd?: {
      fastPeriod: number;
      slowPeriod: number;
      signalPeriod: number;
    };
    ma?: {
      type: 'sma' | 'ema';
      period: number;
    };
  };
}

export interface BasketSettings extends BaseBotSettings {
  assets: Array<{
    symbol: string;
    weight: number;
    minWeight?: number;
    maxWeight?: number;
  }>;
  rebalanceThreshold: number;
  rebalanceInterval: 'daily' | 'weekly' | 'monthly';
  totalAmount: number;
  maxAssets?: number;
}

export type BotSettings = 
  | DCASettings
  | GridSettings
  | IndicatorSettings
  | BasketSettings;

export const BOT_TYPES: BotType[] = [
  {
    value: 'dca',
    label: 'DCA Bot',
    description: 'Dollar Cost Averaging bot for automated periodic investments',
    minAmount: 10,
    features: [
      'Automated periodic investments',
      'Customizable intervals',
      'Position size management',
      'Market condition checks'
    ]
  },
  {
    value: 'grid',
    label: 'Grid Trading',
    description: 'Create a grid of buy/sell orders across a price range',
    minAmount: 100,
    features: [
      'Automatic grid generation',
      'Dynamic grid spacing',
      'Profit per grid calculation',
      'Risk management rules'
    ]
  },
  {
    value: 'indicator',
    label: 'Indicator Bot',
    description: 'Trade based on technical indicators (RSI, MACD, etc.)',
    minAmount: 50,
    features: [
      'Multiple indicator support',
      'Custom signal generation',
      'Backtesting capabilities',
      'Risk management tools'
    ]
  },
  {
    value: 'basket',
    label: 'Basket Trading',
    description: 'Manage a portfolio of assets with periodic rebalancing',
    minAmount: 500,
    features: [
      'Portfolio rebalancing',
      'Asset correlation analysis',
      'Risk-adjusted weighting',
      'Automatic diversification'
    ]
  }
];

// Helper type for extracting settings type based on bot type
export type SettingsForType<T extends BotType['value']> = 
  T extends 'dca' ? DCASettings :
  T extends 'grid' ? GridSettings :
  T extends 'indicator' ? IndicatorSettings :
  T extends 'basket' ? BasketSettings :
  never;

// Helper functions for type checking
export function isDCASettings(settings: BotSettings): settings is DCASettings {
  return 'interval' in settings;
}

export function isGridSettings(settings: BotSettings): settings is GridSettings {
  return 'gridLines' in settings;
}

export function isIndicatorSettings(settings: BotSettings): settings is IndicatorSettings {
  return 'timeframe' in settings && 'indicators' in settings;
}

export function isBasketSettings(settings: BotSettings): settings is BasketSettings {
  return 'assets' in settings && Array.isArray((settings as BasketSettings).assets);
}
