export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  initial_investment: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  duration_years: number;
  start_date: string;
  assets: string[];
  created_at: string;
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
  date: string;
  symbol: string;
  shares: number;
  price: number;
  amount: number;
}