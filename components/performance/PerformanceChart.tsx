import React, { useState, useEffect } from 'react';
import { Performance } from '../../app/models/Performance';

interface PerformanceChartProps {
  portfolioId: string;
  performances: Performance[];
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
  onTimeframeChange: (timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all') => void;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  portfolioId,
  performances,
  timeframe,
  onTimeframeChange
}) => {
  // In a real implementation, this would use a charting library like Chart.js, Recharts, etc.
  // This is a simplified representation
  
  // Filter performances by the selected timeframe
  const filteredPerformances = performances.filter(p => p.timeframe === timeframe)
    .sort((a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime());
  
  const latestPerformance = filteredPerformances[filteredPerformances.length - 1];
  
  return (
    <div className="performance-chart-container">
      <div className="performance-header">
        <h3>Portfolio Performance</h3>
        
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'daily' ? 'active' : ''} 
            onClick={() => onTimeframeChange('daily')}
          >
            Daily
          </button>
          <button 
            className={timeframe === 'weekly' ? 'active' : ''} 
            onClick={() => onTimeframeChange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={timeframe === 'monthly' ? 'active' : ''} 
            onClick={() => onTimeframeChange('monthly')}
          >
            Monthly
          </button>
          <button 
            className={timeframe === 'yearly' ? 'active' : ''} 
            onClick={() => onTimeframeChange('yearly')}
          >
            Yearly
          </button>
          <button 
            className={timeframe === 'all' ? 'active' : ''} 
            onClick={() => onTimeframeChange('all')}
          >
            All Time
          </button>
        </div>
      </div>
      
      {filteredPerformances.length === 0 ? (
        <div className="no-data">
          <p>No performance data available for this timeframe</p>
        </div>
      ) : (
        <div className="chart-container">
          <div className="chart-placeholder">
            {/* This would be replaced with an actual chart component */}
            <div className="mock-chart">
              <div className="mock-bars">
                {filteredPerformances.map((perf, index) => (
                  <div 
                    key={index}
                    className={`mock-bar ${perf.pnl >= 0 ? 'positive' : 'negative'}`}
                    style={{ 
                      height: `${Math.min(Math.abs(perf.pnlPercentage * 2), 100)}px`,
                      marginTop: perf.pnl >= 0 ? 'auto' : 0
                    }}
                    title={`${perf.lastUpdated.toLocaleDateString()}: ${perf.pnlPercentage.toFixed(2)}%`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="performance-summary">
            <div className="summary-item">
              <span className="label">Total Value:</span>
              <span className="value">${latestPerformance?.totalValue.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-item">
              <span className="label">P&L:</span>
              <span className={`value ${latestPerformance?.pnl >= 0 ? 'positive' : 'negative'}`}>
                ${latestPerformance?.pnl.toFixed(2) || '0.00'} 
                ({latestPerformance?.pnlPercentage.toFixed(2) || '0.00'}%)
              </span>
            </div>
            {latestPerformance?.benchmarkComparison !== undefined && (
              <div className="summary-item">
                <span className="label">vs. Benchmark:</span>
                <span className={`value ${latestPerformance.benchmarkComparison >= 0 ? 'positive' : 'negative'}`}>
                  {latestPerformance.benchmarkComparison > 0 ? '+' : ''}
                  {latestPerformance.benchmarkComparison.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
