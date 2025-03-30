export interface Performance {
  portfolioId: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
  benchmarkComparison?: number;
  lastUpdated: Date;
}

export class PerformanceCalculator {
  calculate(portfolioId: string, timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all', 
            initialValue: number, currentValue: number): Performance {
    const pnl = currentValue - initialValue;
    const pnlPercentage = (pnl / initialValue) * 100;
    
    return {
      portfolioId,
      timeframe,
      totalValue: currentValue,
      pnl,
      pnlPercentage,
      lastUpdated: new Date()
    };
  }
}
