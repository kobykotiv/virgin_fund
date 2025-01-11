import { calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands } from './calculations';

export const INDICATORS = {
  SMA: {
    name: 'Simple Moving Average',
    calculate: calculateSMA,
    defaultParams: { period: 20 },
    description: 'Calculates the arithmetic mean of prices over a specified period',
  },
  EMA: {
    name: 'Exponential Moving Average',
    calculate: calculateEMA,
    defaultParams: { period: 12 },
    description: 'Gives more weight to recent prices in the moving average calculation',
  },
  RSI: {
    name: 'Relative Strength Index',
    calculate: calculateRSI,
    defaultParams: { period: 14, overbought: 70, oversold: 30 },
    description: 'Measures the speed and magnitude of recent price changes',
  },
  MACD: {
    name: 'Moving Average Convergence Divergence',
    calculate: calculateMACD,
    defaultParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    description: 'Shows the relationship between two moving averages of an asset's price',
  },
  BB: {
    name: 'Bollinger Bands',
    calculate: calculateBollingerBands,
    defaultParams: { period: 20, standardDeviations: 2 },
    description: 'Measures market volatility using standard deviations',
  },
};