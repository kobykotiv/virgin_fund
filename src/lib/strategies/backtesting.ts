import { Strategy, Asset, StrategyResult, Transaction } from '@/types';
import { calculateMetrics } from '../calculations';
import { fetchHistoricalData } from '../api';
import { STRATEGIES } from './index';

export async function backtest(
  strategy: Strategy,
  startDate: Date,
  endDate: Date
): Promise<StrategyResult> {
  try {
    // Fetch historical data for all assets
    const historicalData = await Promise.all(
      strategy.selectedAssets.map(asset => 
        fetchHistoricalData(asset.symbol)
      )
    );

    // Initialize result variables
    const transactions: Transaction[] = [];
    let totalInvestment = 0;
    let currentValue = 0;

    // Process strategy based on type
    switch (strategy.strategyType) {
      case 'DCA':
        return processDCAStrategy(strategy, historicalData, startDate, endDate);
      case 'MOMENTUM':
        return processMomentumStrategy(strategy, historicalData, startDate, endDate);
      case 'TREND_FOLLOWING':
        return processTrendFollowingStrategy(strategy, historicalData, startDate, endDate);
      default:
        throw new Error('Unsupported strategy type');
    }
  } catch (error) {
    console.error('Backtesting error:', error);
    throw error;
  }
}

function processDCAStrategy(
  strategy: Strategy,
  historicalData: any[],
  startDate: Date,
  endDate: Date
): StrategyResult {
  const transactions: Transaction[] = [];
  const interval = getIntervalInDays(strategy.strategyConfig.frequency);
  let currentDate = startDate;
  let totalInvestment = 0;

  while (currentDate <= endDate) {
    // Calculate investment amount per asset
    const amountPerAsset = strategy.strategyConfig.investmentAmount / strategy.selectedAssets.length;

    // Process each asset
    strategy.selectedAssets.forEach((asset, index) => {
      const price = getHistoricalPrice(historicalData[index], currentDate);
      if (price) {
        const shares = amountPerAsset / price;
        transactions.push({
          date: currentDate.toISOString(),
          symbol: asset.symbol,
          shares,
          price,
          amount: amountPerAsset
        });
        totalInvestment += amountPerAsset;
      }
    });

    // Move to next interval
    currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
  }

  // Calculate final metrics
  const currentPrices = getCurrentPrices(historicalData);
  const metrics = calculateMetrics(transactions, currentPrices);

  return {
    totalInvestment,
    currentValue: metrics.currentValue,
    roi: metrics.roi,
    volatility: metrics.volatility,
    maxDrawdown: metrics.maxDrawdown,
    transactions
  };
}

function processMomentumStrategy(
  strategy: Strategy,
  historicalData: any[],
  startDate: Date,
  endDate: Date
): StrategyResult {
  // Implementation for momentum strategy
  // This would include RSI calculations and momentum-based trading decisions
  throw new Error('Momentum strategy not implemented yet');
}

function processTrendFollowingStrategy(
  strategy: Strategy,
  historicalData: any[],
  startDate: Date,
  endDate: Date
): StrategyResult {
  // Implementation for trend following strategy
  // This would include moving average calculations and trend-based trading decisions
  throw new Error('Trend following strategy not implemented yet');
}

function getIntervalInDays(frequency: string): number {
  switch (frequency) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'monthly': return 30;
    case 'quarterly': return 90;
    case 'yearly': return 365;
    default: return 30;
  }
}

function getHistoricalPrice(data: any[], date: Date): number | null {
  // Find the closest price to the given date
  const closest = data.reduce((prev, curr) => {
    const prevDiff = Math.abs(new Date(prev.date).getTime() - date.getTime());
    const currDiff = Math.abs(new Date(curr.date).getTime() - date.getTime());
    return prevDiff < currDiff ? prev : curr;
  });

  return closest ? closest.price : null;
}

function getCurrentPrices(historicalData: any[]): Record<string, number> {
  const prices: Record<string, number> = {};
  historicalData.forEach(data => {
    if (data.length > 0) {
      prices[data[0].symbol] = data[0].price;
    }
  });
  return prices;
}