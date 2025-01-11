import { Strategy, StrategyResult, Transaction } from "@/types";
import { calculateMetrics } from "../calculations";
import { fetchHistoricalData } from "../api";
import { RSI, MACD, ROC, SuperTrend } from "@debut/indicators";

export async function backtest(
  strategy: Strategy,
  startDate: Date,
  endDate: Date,
): Promise<StrategyResult> {
  try {
    // Fetch historical data for all assets
    const historicalData = await Promise.all(
      strategy.selectedAssets.map((asset) => fetchHistoricalData(asset.symbol)),
    );

    // Initialize result variables
    // const transactions: Transaction[] = [];
    // let totalInvestment = 0;
    // let currentValue = 0;

    // Process strategy based on type
    switch (strategy.strategyType) {
      case "DCA":
        return processDCAStrategy(strategy, historicalData, startDate, endDate);
      case "MEAN_REVERSION":
        throw new Error("Mean reversion strategy not implemented yet");
      // return processMeanReversionStrategy(strategy, historicalData, startDate, endDate);
      case "GRID":
        throw new Error("Grid strategy not implemented yet");
      // return processGridStrategy(strategy, historicalData, startDate, endDate);
      case "MOMENTUM":
        return processMomentumStrategy(
          strategy,
          historicalData,
          startDate,
          endDate,
        );
      case "TREND_FOLLOWING":
        return processTrendFollowingStrategy(
          strategy,
          historicalData,
          startDate,
          endDate,
        );
      default:
        throw new Error("Unsupported strategy type");
    }
  } catch (error) {
    console.error("Backtesting error:", error);
    throw error;
  }
}

function processDCAStrategy(
  strategy: Strategy,
  historicalData: any[],
  startDate: Date,
  endDate: Date,
): StrategyResult {
  const transactions: Transaction[] = [];
  const interval = getIntervalInDays(strategy.strategyConfig.frequency);
  let currentDate = startDate;
  let totalInvestment = 0;

  while (currentDate <= endDate) {
    // Calculate investment amount per asset
    const amountPerAsset =
      strategy.strategyConfig.investmentAmount / strategy.selectedAssets.length;

    // Process each asset
    strategy.selectedAssets.forEach((asset, index) => {
      const price = getHistoricalPrice(historicalData[index], currentDate);
      if (price) {
        const shares = amountPerAsset / price;
        transactions.push({
          date: currentDate,
          symbol: asset.symbol,
          shares,
          price,
          amount: amountPerAsset,
          id: "",
          type: "buy",
        });
        totalInvestment += amountPerAsset;
      }
    });

    // Move to next interval
    currentDate = new Date(
      currentDate.getTime() + interval * 24 * 60 * 60 * 1000,
    );
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
    transactions,
  };
}

function processMomentumStrategy(
  strategy: Strategy,
  historicalData: any[],
  startDate: Date,
  endDate: Date,
  // add arguments for the indicators
  rsiPeriod: number = 14,
  macdFastPeriod: number = 12,
  macdSlowPeriod: number = 26,
  macdSignalPeriod: number = 9,
  rocPeriod: number = 10,
  // rsiOverbought: number = 70,
  // rsiOversold: number = 30
): StrategyResult {
  // Implementation for momentum strategy
  const transactions: Transaction[] = [];
  let totalInvestment = 0;

  // Initialize technical indicators
  const indicators = strategy.selectedAssets.map(() => ({
    rsi: new RSI(rsiPeriod),
    macd: new MACD(macdFastPeriod, macdSlowPeriod, macdSignalPeriod),
    roc: new ROC(rocPeriod),
  }));

  // Process each asset
  strategy.selectedAssets.forEach((asset, assetIndex) => {
    const assetData = historicalData[assetIndex];
    let position = 0;

    assetData.forEach(
      (dataPoint: { date: string | number | Date; price: number }) => {
        const date = new Date(dataPoint.date);
        if (date >= startDate && date <= endDate) {
          const { rsi, macd, roc } = indicators[assetIndex];
          const rsiValue = rsi.nextValue(dataPoint.price);
          const macdValue = macd.nextValue(dataPoint.price);
          const rocValue = roc.nextValue(dataPoint.price);

          if (rsiValue && macdValue && rocValue) {
            const investmentAmount = strategy.strategyConfig.investmentAmount;

            // Buy signal
            if (
              rsiValue < 30 &&
              macdValue.histogram > 0 &&
              rocValue > 0 &&
              position === 0
            ) {
              const shares = investmentAmount / dataPoint.price;
              position = shares;
              totalInvestment += investmentAmount;

              transactions.push({
                date: date,
                symbol: asset.symbol,
                shares,
                price: dataPoint.price,
                amount: investmentAmount,
                type: "buy",
                id: "",
              });
            }
            // Sell signal
            else if (
              rsiValue > 70 &&
              macdValue.histogram < 0 &&
              rocValue < 0 &&
              position > 0
            ) {
              const saleAmount = position * dataPoint.price;
              transactions.push({
                date: date,
                symbol: asset.symbol,
                shares: -position,
                price: dataPoint.price,
                amount: saleAmount,
                type: "sell",
                id: "",
              });
              position = 0;
            }
          }
        }
      },
    );
  });

  const currentPrices = getCurrentPrices(historicalData);
  const metrics = calculateMetrics(transactions, currentPrices);

  return {
    totalInvestment,
    currentValue: metrics.currentValue,
    roi: metrics.roi,
    volatility: metrics.volatility,
    maxDrawdown: metrics.maxDrawdown,
    transactions,
  };
  // This would include RSI calculations and momentum-based trading decisions
  // throw new Error('Momentum strategy not implemented yet');
}

function processTrendFollowingStrategy(
  strategy: Strategy,
  historicalData: any[],
  startDate: Date,
  endDate: Date,
  atrPeriod: number = 10,
  atrMultiplier: number = 3,
): StrategyResult {
  const transactions: Transaction[] = [];
  let totalInvestment = 0;

  // Process each asset
  strategy.selectedAssets.forEach((asset, assetIndex) => {
    const assetData = historicalData[assetIndex];
    const superTrend = new SuperTrend(atrPeriod, atrMultiplier);
    let position = 0;

    assetData.forEach(
      (dataPoint: {
        date: string | number | Date;
        high: number;
        low: number;
        price: number;
      }) => {
        const date = new Date(dataPoint.date);
        if (date >= startDate && date <= endDate) {
          const superTrendValue = superTrend.nextValue(
            dataPoint.high,
            dataPoint.low,
            dataPoint.price,
          );

          if (superTrendValue) {
            const investmentAmount = strategy.strategyConfig.investmentAmount;

            // Buy signal when trend turns up
            if (superTrendValue.direction === 1 && position === 0) {
              const shares = investmentAmount / dataPoint.price;
              position = shares;
              totalInvestment += investmentAmount;

              transactions.push({
                date,
                symbol: asset.symbol,
                shares,
                price: dataPoint.price,
                amount: investmentAmount,
                type: "buy",
                id: "",
              });
            }
            // Sell signal when trend turns down
            else if (superTrendValue.direction === -1 && position > 0) {
              const saleAmount = position * dataPoint.price;
              transactions.push({
                date,
                symbol: asset.symbol,
                shares: -position,
                price: dataPoint.price,
                amount: saleAmount,
                type: "sell",
                id: "",
              });
              position = 0;
            }
          }
        }
      },
    );
  });

  const currentPrices = getCurrentPrices(historicalData);
  const metrics = calculateMetrics(transactions, currentPrices);

  return {
    totalInvestment,
    currentValue: metrics.currentValue,
    roi: metrics.roi,
    volatility: metrics.volatility,
    maxDrawdown: metrics.maxDrawdown,
    transactions,
  };
}

function getIntervalInDays(frequency: string): number {
  switch (frequency) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    case "quarterly":
      return 90;
    case "yearly":
      return 365;
    default:
      return 30;
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
  historicalData.forEach((data) => {
    if (data.length > 0) {
      prices[data[0].symbol] = data[0].price;
    }
  });
  return prices;
}
