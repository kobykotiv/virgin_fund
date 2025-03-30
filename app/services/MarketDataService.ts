// A service to fetch market data for assets

export class MarketDataService {
  // Simulated market data fetch - would connect to a real API in production
  async fetchCurrentPrice(symbol: string): Promise<number> {
    // Mock implementation - would be replaced with actual API calls
    const mockPrices: Record<string, number> = {
      'AAPL': 170.50,
      'MSFT': 340.20,
      'GOOGL': 128.75,
      'AMZN': 130.45,
      'TSLA': 245.30,
      'BTC': 37250.25,
      'ETH': 2045.80
    };
    
    // Return the mock price or a random value if symbol not found
    return mockPrices[symbol] || (100 + Math.random() * 100);
  }
  
  async fetchHistoricalPrices(symbol: string, timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{date: Date, price: number}[]> {
    // Mock implementation for historical data
    const result: {date: Date, price: number}[] = [];
    const basePrice = 100 + Math.random() * 100;
    const volatility = 0.02; // 2% daily volatility
    
    // Generate mock data points based on timeframe
    const dataPoints = timeframe === 'daily' ? 30 : 
                      timeframe === 'weekly' ? 12 : 
                      timeframe === 'monthly' ? 12 : 
                      timeframe === 'yearly' ? 5 : 30;
    
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const change = (Math.random() - 0.5) * 2 * volatility;
      currentPrice = currentPrice * (1 + change);
      
      const date = new Date(now);
      if (timeframe === 'daily') {
        date.setDate(date.getDate() - i);
      } else if (timeframe === 'weekly') {
        date.setDate(date.getDate() - (i * 7));
      } else if (timeframe === 'monthly') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setFullYear(date.getFullYear() - i);
      }
      
      result.push({
        date,
        price: currentPrice
      });
    }
    
    return result;
  }
  
  async fetchBenchmarkData(benchmarkSymbol: string, timeframe: string): Promise<{date: Date, value: number}[]> {
    // Similar to historical prices, but for benchmark indexes
    return this.fetchHistoricalPrices(benchmarkSymbol, timeframe as any)
      .then(data => data.map(item => ({
        date: item.date,
        value: item.price
      })));
  }
}
