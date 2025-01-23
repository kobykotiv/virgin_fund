export interface Transaction {
  date: string;
  symbol: string;
  shares: number;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
}

export interface BacktestParams {
  tickers: string[];
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  investmentAmount: number;
  benchmark?: 'SPY' | 'BTC' | null;
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
