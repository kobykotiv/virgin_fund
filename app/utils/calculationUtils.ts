import { Asset } from '../models/Asset';
import { Performance } from '../models/Performance';

/**
 * Calculates the total value of assets
 */
export function calculateTotalValue(assets: Asset[]): number {
  return assets.reduce(
    (sum, asset) => sum + (asset.currentPrice || asset.averagePrice) * asset.quantity, 
    0
  );
}

/**
 * Calculates profit and loss for a single asset
 */
export function calculateAssetPnL(asset: Asset): {
  pnl: number;
  pnlPercentage: number;
} {
  const currentPrice = asset.currentPrice || asset.averagePrice;
  const pnl = asset.quantity * (currentPrice - asset.averagePrice);
  const pnlPercentage = ((currentPrice - asset.averagePrice) / asset.averagePrice) * 100;
  
  return { pnl, pnlPercentage };
}

/**
 * Formats a currency value to a string with currency symbol
 */
export function formatCurrency(value: number, decimalPlaces = 2): string {
  return `$${value.toFixed(decimalPlaces)}`;
}

/**
 * Formats a percentage value
 */
export function formatPercentage(value: number, decimalPlaces = 2): string {
  return `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Calculates portfolio allocation by assets
 */
export function calculateAssetAllocation(assets: Asset[]): Array<{
  symbol: string;
  allocation: number;
}> {
  const totalValue = calculateTotalValue(assets);
  
  if (totalValue === 0) return [];
  
  return assets.map(asset => {
    const assetValue = (asset.currentPrice || asset.averagePrice) * asset.quantity;
    return {
      symbol: asset.symbol,
      allocation: (assetValue / totalValue) * 100
    };
  }).sort((a, b) => b.allocation - a.allocation);
}

/**
 * Annualizes a performance figure based on timeframe
 */
export function annualizePerformance(
  performance: Performance, 
  daysHeld: number
): number {
  if (daysHeld <= 0) return 0;
  
  // Simple annualization formula
  const annualizationFactor = 365 / daysHeld;
  return Math.pow(1 + (performance.pnlPercentage / 100), annualizationFactor) * 100 - 100;
}

/**
 * Calculates the weighted average of a numeric property across objects
 */
export function weightedAverage<T>(
  items: T[], 
  valueProperty: keyof T, 
  weightProperty: keyof T
): number {
  const totalWeight = items.reduce(
    (sum, item) => sum + (item[weightProperty] as unknown as number), 
    0
  );
  
  if (totalWeight === 0) return 0;
  
  const weightedSum = items.reduce(
    (sum, item) => 
      sum + (item[valueProperty] as unknown as number) * (item[weightProperty] as unknown as number), 
    0
  );
  
  return weightedSum / totalWeight;
}
