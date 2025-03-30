import { Portfolio, PortfolioManager } from '../models/Portfolio';
import { Asset, AssetManager } from '../models/Asset';
import { Transaction, TransactionManager } from '../models/Transaction';
import { Performance, PerformanceCalculator } from '../models/Performance';

export class PortfolioService {
  private portfolioManager = new PortfolioManager();
  private assetManager = new AssetManager();
  private transactionManager = new TransactionManager();
  private performanceCalculator = new PerformanceCalculator();
  
  createPortfolio(userId: string, name: string, type: 'standard' | 'margin', 
                 risk: 'conservative' | 'moderate' | 'aggressive'): Portfolio {
    return this.portfolioManager.create(userId, name, type, risk);
  }
  
  addAsset(portfolio: Portfolio, symbol: string, quantity: number, price: number): Portfolio {
    const asset = this.assetManager.create(portfolio.id, symbol, quantity, price);
    this.transactionManager.create(portfolio.id, asset.id, 'buy', quantity, price);
    
    return {
      ...portfolio,
      assets: [...portfolio.assets, asset],
      updatedAt: new Date()
    };
  }
  
  calculatePerformance(portfolio: Portfolio, timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all'): Performance {
    const initialValue = portfolio.assets.reduce(
      (sum, asset) => sum + asset.averagePrice * asset.quantity, 0
    );
    
    const currentValue = portfolio.assets.reduce(
      (sum, asset) => sum + (asset.currentPrice || asset.averagePrice) * asset.quantity, 0
    );
    
    return this.performanceCalculator.calculate(portfolio.id, timeframe, initialValue, currentValue);
  }
}
