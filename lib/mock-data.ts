// Mock data for development and demonstration purposes

export const mockPortfolioData = {
  value: 125350.75,
  bots: [
    { id: 1, name: 'Mean Reversion Bot', status: 'active', assets: ['AAPL', 'MSFT'], updatedAt: new Date() },
    { id: 2, name: 'Trend Following Bot', status: 'active', assets: ['TSLA', 'AMZN'], updatedAt: new Date() },
    { id: 3, name: 'Grid Trading Bot', status: 'paused', assets: ['BTC/USD', 'ETH/USD'], updatedAt: new Date() },
    { id: 4, name: 'MA Crossover Bot', status: 'error', assets: ['GOOGL'], updatedAt: new Date() },
  ],
  positions: [
    { symbol: 'AAPL', quantity: 10, avgPrice: 180.25, currentPrice: 190.50, pnl: 102.50 },
    { symbol: 'MSFT', quantity: 5, avgPrice: 330.10, currentPrice: 345.75, pnl: 78.25 },
    { symbol: 'TSLA', quantity: 3, avgPrice: 240.50, currentPrice: 225.30, pnl: -45.60 },
  ],
  performance: {
    totalPnL: 15350.75,
    avgPnlPercentage: 12.25,
  },
  orders: [
    { id: 1, symbol: 'AAPL', side: 'buy', type: 'market', quantity: 5, status: 'filled', createdAt: new Date() },
    { id: 2, symbol: 'MSFT', side: 'sell', type: 'limit', quantity: 2, status: 'open', createdAt: new Date() },
    { id: 3, symbol: 'TSLA', side: 'buy', type: 'market', quantity: 1, status: 'filled', createdAt: new Date() },
  ]
};

export const mockPerformanceData = [
  { name: 'Mean Reversion Bot', performance: 12.5 },
  { name: 'Trend Following Bot', performance: 8.3 },
  { name: 'Grid Trading Bot', performance: 15.2 },
  { name: 'MA Crossover Bot', performance: -3.7 },
];

export const mockMarketData = [
  { symbol: 'AAPL', price: 190.50, changePercent: 1.25, volume: 45000000, open: 188.75, high: 191.20, low: 188.50 },
  { symbol: 'MSFT', price: 345.75, changePercent: 0.85, volume: 32000000, open: 343.20, high: 347.50, low: 342.90 },
  { symbol: 'GOOGL', price: 142.30, changePercent: -0.45, volume: 28000000, open: 143.10, high: 143.75, low: 141.90 },
  { symbol: 'AMZN', price: 178.75, changePercent: 2.10, volume: 38000000, open: 175.20, high: 179.30, low: 174.80 },
  { symbol: 'TSLA', price: 225.30, changePercent: -1.20, volume: 52000000, open: 228.40, high: 229.50, low: 224.10 },
];

export const mockHistoricalData = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (30 - i));
  
  return {
    date: date.toISOString().split('T')[0],
    value: 100 + Math.random() * 30 * Math.sin(i/5) + i/2,
  };
});
