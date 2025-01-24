type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface Asset {
  symbol: string;
  ratio: number; // Ratio of the asset in the portfolio
  value: number; // Value of the asset in dollars
  shares: number; // Number of shares owned
}

interface Position {
  date: string;
  assets: Asset[];
}

interface DCAParams {
  frequency: Frequency;
  assets: Omit<Asset, 'shares'>[]; // Allow creating assets without shares initially
  startDate: Date;
  endDate: Date;
  rebalanceFrequency?: 'daily' | 'weekly' | 'monthly';
  rebalanceThreshold?: number; // Percentage threshold for rebalancing
}

const getNextDate = (date: Date, frequency: Frequency): Date => {
  const newDate = new Date(date);

  switch (frequency) {
    case 'daily':
      newDate.setDate(newDate.getDate() + 1);
      break;
    case 'weekly':
      newDate.setDate(newDate.getDate() + 7);
      break;
    case 'monthly':
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case 'quarterly':
      newDate.setMonth(newDate.getMonth() + 3);
      break;
    case 'yearly':
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
  }

  return newDate;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const rebalancePortfolio = (portfolio: Asset[], threshold: number): Asset[] => {
  // Calculate the total value of the portfolio
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);

  return portfolio.map(asset => {
    const targetValue = totalValue * (asset.ratio / 100);
    // Rebalance if the current value deviates from the target value by more than the threshold
    if (Math.abs(asset.value - targetValue) / targetValue > threshold / 100) {
      const newShares = targetValue / (asset.value / asset.shares);
      return { 
        ...asset, 
        value: targetValue,
        shares: newShares
      };
    }
    return asset;
  });
};

export const calculateDCA = (params: DCAParams): Position[] => {
  let { startDate, endDate, assets, frequency, rebalanceFrequency, rebalanceThreshold } = params;
  let currentDate = new Date(startDate);
  const positions: Position[] = [];
  let currentAssets: Asset[] = assets.map(asset => ({
    ...asset,
    shares: 0,
  }));

  while (currentDate <= endDate) {
    // Calculate shares for each asset based on its value
    const updatedAssets = currentAssets.map(asset => ({
      ...asset,
      shares: asset.shares + (asset.value / 100), // Assuming $100 per share for this example
    }));

    positions.push({ 
      date: formatDate(currentDate), 
      assets: updatedAssets
    });

    // Rebalance if required
    if (rebalanceFrequency && rebalanceThreshold) {
      const nextRebalanceDate = getNextDate(currentDate, rebalanceFrequency);
      if (currentDate >= nextRebalanceDate) {
        currentAssets = rebalancePortfolio(updatedAssets, rebalanceThreshold);
      } else {
        currentAssets = updatedAssets;
      }
    } else {
      currentAssets = updatedAssets;
    }

    // Move to the next investment date
    currentDate = getNextDate(currentDate, frequency);
  }

  return positions;
};

export type { Asset, DCAParams, Frequency, Position };
