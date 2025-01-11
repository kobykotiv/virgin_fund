export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Strategy {
  id: string;
  name: string;
  selectedAssets: Asset[];
  strategyType: 'DCA' | 'TRADER' | 'GRID' | 'MEAN_REVERSION' | 'MOMENTUM' | 'TREND_FOLLOWING';
  strategyConfig: {
    frequency: string;
    investmentAmount: number;
  };
  user_id: string;
  initial_investment: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  duration_years: number;
  start_date: string;
  assets: string[];
  created_at: string;
  transactions: Transaction[];
}

export interface AssetData {
  symbol: string;
  date: string;
  price: number;
}

export interface StrategyResult {
  totalInvestment: number;
  currentValue: number;
  roi: number;
  volatility: number;
  maxDrawdown: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  price: number;
  type: 'buy' | 'sell';
  symbol: string;
  shares: number;
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
}
