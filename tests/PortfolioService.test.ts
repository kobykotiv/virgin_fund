import { PortfolioService } from '../app/services/PortfolioService';
import { Portfolio } from '../app/models/Portfolio';

describe('PortfolioService', () => {
  let portfolioService: PortfolioService;
  const userId = 'test-user';
  
  beforeEach(() => {
    portfolioService = new PortfolioService();
  });
  
  test('createPortfolio creates a portfolio with correct properties', () => {
    const portfolio = portfolioService.createPortfolio(
      userId,
      'Test Portfolio',
      'standard',
      'moderate'
    );
    
    expect(portfolio).toHaveProperty('id');
    expect(portfolio.userId).toBe(userId);
    expect(portfolio.name).toBe('Test Portfolio');
    expect(portfolio.type).toBe('standard');
    expect(portfolio.risk).toBe('moderate');
    expect(portfolio.assets).toEqual([]);
    expect(portfolio.createdAt).toBeInstanceOf(Date);
    expect(portfolio.updatedAt).toBeInstanceOf(Date);
  });
  
  test('addAsset adds an asset to a portfolio', () => {
    const portfolio = portfolioService.createPortfolio(
      userId,
      'Test Portfolio',
      'standard',
      'moderate'
    );
    
    const updatedPortfolio = portfolioService.addAsset(
      portfolio,
      'AAPL',
      10,
      150.50
    );
    
    expect(updatedPortfolio.assets.length).toBe(1);
    expect(updatedPortfolio.assets[0].symbol).toBe('AAPL');
    expect(updatedPortfolio.assets[0].quantity).toBe(10);
    expect(updatedPortfolio.assets[0].averagePrice).toBe(150.50);
    expect(updatedPortfolio.assets[0].portfolioId).toBe(portfolio.id);
  });
  
  test('calculatePerformance correctly calculates portfolio performance', () => {
    // Create a portfolio with assets
    let portfolio = portfolioService.createPortfolio(
      userId,
      'Test Portfolio',
      'standard',
      'moderate'
    );
    
    // Add first asset
    portfolio = portfolioService.addAsset(
      portfolio,
      'AAPL',
      10,
      150.00
    );
    
    // Add second asset
    portfolio = portfolioService.addAsset(
      portfolio,
      'MSFT',
      5,
      200.00
    );
    
    // Update current prices to simulate market movement
    portfolio.assets[0].currentPrice = 160.00; // +10 per share
    portfolio.assets[1].currentPrice = 210.00; // +10 per share
    
    // Calculate performance
    const performance = portfolioService.calculatePerformance(
      portfolio,
      'daily'
    );
    
    // Expected calculations:
    // Initial value: (10 * 150) + (5 * 200) = 1500 + 1000 = 2500
    // Current value: (10 * 160) + (5 * 210) = 1600 + 1050 = 2650
    // P&L: 2650 - 2500 = 150
    // P&L percentage: (150 / 2500) * 100 = 6%
    
    expect(performance.totalValue).toBe(2650);
    expect(performance.pnl).toBe(150);
    expect(performance.pnlPercentage).toBe(6);
    expect(performance.timeframe).toBe('daily');
    expect(performance.portfolioId).toBe(portfolio.id);
  });
});
