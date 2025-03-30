import React from 'react';
import { Portfolio } from '../../app/models/Portfolio';
import { Asset } from '../../app/models/Asset';

interface RiskAnalysisProps {
  portfolio: Portfolio;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ portfolio }) => {
  // Calculate some basic risk metrics
  const calculateRiskMetrics = () => {
    // Skip calculation if no assets in portfolio
    if (portfolio.assets.length === 0) {
      return {
        diversificationScore: 0,
        concentrationRisk: 0,
        volatilityRisk: 0,
        riskScore: 0
      };
    }

    // Calculate total portfolio value
    const totalValue = portfolio.assets.reduce(
      (sum, asset) => sum + (asset.currentPrice || asset.averagePrice) * asset.quantity, 
      0
    );

    // Calculate diversification score (higher is better)
    const diversificationScore = Math.min(portfolio.assets.length * 10, 100);
    
    // Calculate concentration risk (percentage of portfolio in largest holding)
    const largestAssetValue = Math.max(
      ...portfolio.assets.map(
        asset => (asset.currentPrice || asset.averagePrice) * asset.quantity
      )
    );
    const concentrationRisk = (largestAssetValue / totalValue) * 100;
    
    // Volatility risk is assigned based on portfolio type and risk level
    let volatilityRisk: number;
    switch (portfolio.risk) {
      case 'conservative':
        volatilityRisk = 20;
        break;
      case 'moderate':
        volatilityRisk = 50;
        break;
      case 'aggressive':
        volatilityRisk = 80;
        break;
      default:
        volatilityRisk = 50;
    }
    
    // Overall risk score (0-100, higher is riskier)
    const riskScore = Math.min(
      Math.round(
        (concentrationRisk * 0.4) + 
        ((100 - diversificationScore) * 0.3) + 
        (volatilityRisk * 0.3)
      ),
      100
    );
    
    return {
      diversificationScore,
      concentrationRisk,
      volatilityRisk,
      riskScore
    };
  };
  
  const metrics = calculateRiskMetrics();
  
  // Get risk category based on score
  const getRiskCategory = (score: number) => {
    if (score < 25) return { label: 'Low', color: '#4caf50' };
    if (score < 50) return { label: 'Moderate', color: '#ff9800' };
    if (score < 75) return { label: 'High', color: '#f44336' };
    return { label: 'Very High', color: '#b71c1c' };
  };
  
  const riskCategory = getRiskCategory(metrics.riskScore);
  
  // Get sector allocation (simplified - in a real app would use sector data for symbols)
  const getSectorAllocation = () => {
    const mockSectors: Record<string, string> = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'TSLA': 'Automotive',
      'JPM': 'Financial',
      'JNJ': 'Healthcare',
      'PG': 'Consumer Staples',
      'BTC': 'Cryptocurrency',
      'ETH': 'Cryptocurrency'
    };
    
    const sectorMap: Record<string, number> = {};
    let totalValue = 0;
    
    portfolio.assets.forEach(asset => {
      const value = (asset.currentPrice || asset.averagePrice) * asset.quantity;
      totalValue += value;
      
      const sector = mockSectors[asset.symbol] || 'Other';
      sectorMap[sector] = (sectorMap[sector] || 0) + value;
    });
    
    return Object.entries(sectorMap).map(([sector, value]) => ({
      sector,
      percentage: (value / totalValue) * 100
    }));
  };
  
  const sectorAllocation = getSectorAllocation();
  
  return (
    <div className="risk-analysis">
      <h3>Risk Analysis</h3>
      
      <div className="risk-score-container">
        <div 
          className="risk-score" 
          style={{ 
            '--risk-color': riskCategory.color 
          } as React.CSSProperties}
        >
          <div className="risk-score-value">{metrics.riskScore}</div>
          <div className="risk-category">{riskCategory.label} Risk</div>
        </div>
        
        <div className="risk-metrics">
          <div className="risk-metric">
            <span className="metric-label">Diversification:</span>
            <span className="metric-value">{metrics.diversificationScore}/100</span>
          </div>
          <div className="risk-metric">
            <span className="metric-label">Concentration:</span>
            <span className="metric-value">{metrics.concentrationRisk.toFixed(1)}%</span>
          </div>
          <div className="risk-metric">
            <span className="metric-label">Volatility:</span>
            <span className="metric-value">{metrics.volatilityRisk}/100</span>
          </div>
        </div>
      </div>
      
      {portfolio.assets.length > 0 && (
        <div className="allocation-section">
          <h4>Sector Allocation</h4>
          <div className="sector-allocation">
            {sectorAllocation.map((item, index) => (
              <div key={index} className="sector-item">
                <div className="sector-bar-container">
                  <div 
                    className="sector-bar"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="sector-details">
                  <span className="sector-name">{item.sector}</span>
                  <span className="sector-percentage">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="risk-recommendations">
        <h4>Recommendations</h4>
        <ul>
          {metrics.concentrationRisk > 30 && (
            <li>Consider reducing position size of your largest holdings</li>
          )}
          {metrics.diversificationScore < 40 && (
            <li>Add more assets to increase diversification</li>
          )}
          {sectorAllocation.some(item => item.percentage > 40) && (
            <li>Reduce exposure to dominant sectors</li>
          )}
          {portfolio.risk === 'aggressive' && metrics.riskScore > 80 && (
            <li>Your portfolio risk is very high even for an aggressive strategy</li>
          )}
        </ul>
      </div>
    </div>
  );
};
