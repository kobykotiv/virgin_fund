import React from 'react';
import { Portfolio } from '../../app/models/Portfolio';
import { Performance } from '../../app/models/Performance';

interface PortfolioCardProps {
  portfolio: Portfolio;
  performance?: Performance;
  onEdit: (portfolio: Portfolio) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  portfolio, 
  performance, 
  onEdit 
}) => {
  return (
    <div className="portfolio-card">
      <div className="portfolio-header">
        <h3>{portfolio.name}</h3>
        <span className={`risk-badge ${portfolio.risk}`}>{portfolio.risk}</span>
        <span className="type-badge">{portfolio.type}</span>
      </div>
      
      <div className="portfolio-summary">
        <p>Assets: {portfolio.assets.length}</p>
        {performance && (
          <div className="performance-summary">
            <p className={performance.pnl >= 0 ? 'positive' : 'negative'}>
              {performance.pnl.toFixed(2)} ({performance.pnlPercentage.toFixed(2)}%)
            </p>
          </div>
        )}
      </div>
      
      <button onClick={() => onEdit(portfolio)}>Edit Portfolio</button>
    </div>
  );
};
