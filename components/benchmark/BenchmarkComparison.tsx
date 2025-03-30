import React, { useState, useEffect } from 'react';
import { Performance } from '../../app/models/Performance';
import { MarketDataService } from '../../app/services/MarketDataService';

interface BenchmarkComparisonProps {
  portfolioId: string;
  performanceData: Performance;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
}

export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({
  portfolioId,
  performanceData,
  timeframe
}) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('SPY');
  const [benchmarkData, setBenchmarkData] = useState<{date: Date, value: number}[]>([]);
  const [benchmarkPerformance, setBenchmarkPerformance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const marketDataService = new MarketDataService();
  
  // Available benchmarks
  const benchmarks = [
    { id: 'SPY', name: 'S&P 500 (SPY)' },
    { id: 'QQQ', name: 'NASDAQ 100 (QQQ)' },
    { id: 'DIA', name: 'Dow Jones (DIA)' },
    { id: 'VTI', name: 'Total Market (VTI)' },
    { id: 'BTC', name: 'Bitcoin (BTC)' }
  ];
  
  // Fetch benchmark data when selected benchmark or timeframe changes
  useEffect(() => {
    const fetchBenchmarkData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await marketDataService.fetchBenchmarkData(selectedBenchmark, timeframe);
        setBenchmarkData(data);
        
        // Calculate benchmark performance
        if (data.length >= 2) {
          const firstValue = data[0].value;
          const lastValue = data[data.length - 1].value;
          const performance = ((lastValue - firstValue) / firstValue) * 100;
          setBenchmarkPerformance(performance);
        }
      } catch (err) {
        setError('Failed to load benchmark data. Please try again.');
        setBenchmarkPerformance(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBenchmarkData();
  }, [selectedBenchmark, timeframe]);
  
  // Calculate performance difference
  const performanceDifference = benchmarkPerformance !== null 
    ? performanceData.pnlPercentage - benchmarkPerformance
    : null;
  
  return (
    <div className="benchmark-comparison">
      <div className="benchmark-header">
        <h4>Benchmark Comparison</h4>
        
        <select 
          value={selectedBenchmark} 
          onChange={(e) => setSelectedBenchmark(e.target.value)}
        >
          {benchmarks.map(benchmark => (
            <option key={benchmark.id} value={benchmark.id}>
              {benchmark.name}
            </option>
          ))}
        </select>
      </div>
      
      {isLoading ? (
        <div className="benchmark-loading">Loading benchmark data...</div>
      ) : error ? (
        <div className="benchmark-error">{error}</div>
      ) : (
        <div className="benchmark-comparison-data">
          <div className="comparison-row">
            <span className="label">Your Portfolio:</span>
            <span className={`value ${performanceData.pnlPercentage >= 0 ? 'positive' : 'negative'}`}>
              {performanceData.pnlPercentage.toFixed(2)}%
            </span>
          </div>
          
          <div className="comparison-row">
            <span className="label">{selectedBenchmark}:</span>
            <span className={`value ${benchmarkPerformance! >= 0 ? 'positive' : 'negative'}`}>
              {benchmarkPerformance !== null ? benchmarkPerformance.toFixed(2) : 'N/A'}%
            </span>
          </div>
          
          {performanceDifference !== null && (
            <div className="comparison-row difference">
              <span className="label">Difference:</span>
              <span className={`value ${performanceDifference >= 0 ? 'positive' : 'negative'}`}>
                {performanceDifference > 0 ? '+' : ''}
                {performanceDifference.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
