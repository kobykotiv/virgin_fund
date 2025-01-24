import type { Asset, Frequency } from '@/lib/strategies/dcaStrategy';

export interface Transaction {
  date: string;
  symbol: string;
  shares: number;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

export interface RiskManagementParams {
  stopLoss: number;
  takeProfit: number;
  trailingStop?: number;
  positionSize: number;
}

export interface BacktestParams {
  tickers: string[];
  startDate: Date;
  endDate: Date;
  frequency: Frequency;
  investmentAmount: number;
  benchmark?: 'SPY' | 'BTC' | null;
  riskManagement: RiskManagementParams;
  rebalanceFrequency?: 'daily' | 'weekly' | 'monthly';
  rebalanceThreshold?: number;
}

export interface DCAPosition extends BacktestPosition {
  fractionalShares: number;
  allocation: {
    symbol: string;
    ratio: number;
    shares: number;
    value: number;
  }[];
}

export interface PeriodReturns {
  '1w': number;
  '1m': number;
  '3m': number;
  '6m': number;
  '1y': number;
}

export interface TechnicalIndicators {
  rsi: number[];
  macd: {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
  bollingerBands: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
  adx: number[];
  stochastic: {
    k: number[];
    d: number[];
  };
  atr: number[];
}

export interface BacktestPosition {
  date: string;
  price: number;
  shares: number;
  value: number;
  totalShares: number;
  totalValue: number;
  totalInvested: number;
}

export interface BacktestMetrics {
  totalInvestment: number;
  currentValue: number;
  roi: number;
  maxDrawdown: number;
  volatility: number;
  returns: PeriodReturns;
  technicalIndicators: TechnicalIndicators;
  positions: BacktestPosition[];
  transactions: Transaction[];
}

export interface BacktestResult {
  metrics: BacktestMetrics;
  benchmarkMetrics?: BacktestMetrics;
}
