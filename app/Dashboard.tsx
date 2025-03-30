import React, { useState, useEffect } from 'react';
import { PortfolioCard } from '../components/portfolio/PortfolioCard';
import { PortfolioForm } from '../components/portfolio/PortfolioForm';
import { AssetList } from '../components/assets/AssetList';
import { TransactionHistory } from '../components/transactions/TransactionHistory';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { PerformanceChart } from '../components/performance/PerformanceChart';
import { PortfolioService } from './services/PortfolioService';
import { DataService } from './services/DataService';
import { MarketDataService } from './services/MarketDataService';
import { Portfolio } from './models/Portfolio';
import { Asset } from './models/Asset';
import { Transaction } from './models/Transaction';
import { Performance } from './models/Performance';
import { BenchmarkComparison } from '../components/benchmark/BenchmarkComparison';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { RiskAnalysis } from '../components/risk/RiskAnalysis';
import { analytics } from './monitoring/analytics';
import { errorReporting } from './monitoring/errorReporting';
import { performanceMonitoring } from './monitoring/performance';

export const Dashboard: React.FC = () => {
  // Mock user ID for demo purposes
  const userId = 'user123';
  
  // Services
  const portfolioService = new PortfolioService();
  const dataService = new DataService();
  const marketDataService = new MarketDataService();
  
  // State
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'all'>('monthly');
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Asset lookup for transaction history
  const [assetLookup, setAssetLookup] = useState<Record<string, Asset>>({});
  
  // Load portfolios on first render
  useEffect(() => {
    loadUserPortfolios();
  }, []);
  
  // Load portfolio details when selected portfolio changes
  useEffect(() => {
    if (selectedPortfolio) {
      loadPortfolioDetails(selectedPortfolio.id);
    }
  }, [selectedPortfolio]);
  
  // Load user portfolios
  const loadUserPortfolios = async () => {
    const endTimer = performanceMonitoring.startTimer('load_user_portfolios', { userId });
    setIsLoading(true);
    try {
      const userPortfolios = await dataService.getUserPortfolios(userId);
      setPortfolios(userPortfolios);
      
      // Track event
      analytics.trackEvent('portfolios_loaded', {
        count: userPortfolios.length
      });
      
      // Select the first portfolio by default if available
      if (userPortfolios.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(userPortfolios[0]);
      }
    } catch (error) {
      console.error('Error loading portfolios:', error);
      errorReporting.captureException(error, {
        component: 'Dashboard',
        userId
      });
    } finally {
      setIsLoading(false);
      endTimer();
    }
  };
  
  // Load detailed information for selected portfolio
  const loadPortfolioDetails = async (portfolioId: string) => {
    setIsLoading(true);
    try {
      // Load transactions
      const portfolioTransactions = await dataService.getTransactionsByPortfolio(portfolioId);
      setTransactions(portfolioTransactions);
      
      // Load performance data
      const performance = await dataService.getLatestPerformance(portfolioId, timeframe);
      if (performance) {
        setPerformances([performance]);
      }
      
      // Build asset lookup for transaction history
      const assetMap: Record<string, Asset> = {};
      selectedPortfolio?.assets.forEach(asset => {
        assetMap[asset.id] = asset;
      });
      setAssetLookup(assetMap);
      
      // Update asset prices
      if (selectedPortfolio) {
        updateAssetPrices(selectedPortfolio);
      }
    } catch (error) {
      console.error('Error loading portfolio details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update current prices for assets
  const updateAssetPrices = async (portfolio: Portfolio) => {
    const updatedAssets: Asset[] = [];
    
    for (const asset of portfolio.assets) {
      try {
        const currentPrice = await marketDataService.fetchCurrentPrice(asset.symbol);
        updatedAssets.push({
          ...asset,
          currentPrice,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error(`Error updating price for ${asset.symbol}:`, error);
        updatedAssets.push(asset);
      }
    }
    
    const updatedPortfolio = {
      ...portfolio,
      assets: updatedAssets
    };
    
    await dataService.savePortfolio(updatedPortfolio);
    setSelectedPortfolio(updatedPortfolio);
    
    // Recalculate performance
    const performance = portfolioService.calculatePerformance(updatedPortfolio, timeframe);
    await dataService.savePerformance(performance);
    setPerformances([performance]);
  };
  
  // Handle creating a new portfolio
  const handleCreatePortfolio = async (portfolioData: {
    name: string;
    type: 'standard' | 'margin';
    risk: 'conservative' | 'moderate' | 'aggressive';
  }) => {
    const endTimer = performanceMonitoring.startTimer('create_portfolio', {
      portfolioType: portfolioData.type,
      riskLevel: portfolioData.risk
    });
    
    try {
      const newPortfolio = portfolioService.createPortfolio(
        userId, 
        portfolioData.name, 
        portfolioData.type, 
        portfolioData.risk
      );
      
      await dataService.savePortfolio(newPortfolio);
      setPortfolios([...portfolios, newPortfolio]);
      setSelectedPortfolio(newPortfolio);
      setShowPortfolioForm(false);
      
      // Track event
      analytics.trackEvent('portfolio_created', {
        portfolioType: portfolioData.type,
        riskLevel: portfolioData.risk
      });
    } catch (error) {
      errorReporting.captureException(error, {
        component: 'Dashboard',
        userId,
        additionalData: { portfolioData }
      });
    } finally {
      endTimer();
    }
  };
  
  // Handle recording a transaction
  const handleRecordTransaction = async (transactionData: {
    portfolioId: string;
    assetId: string;
    type: 'buy' | 'sell';
    symbol?: string;
    quantity: number;
    price: number;
  }) => {
    if (!selectedPortfolio) return;
    
    let updatedPortfolio = { ...selectedPortfolio };
    
    // Handle new asset purchase
    if (transactionData.assetId === 'new' && transactionData.symbol) {
      updatedPortfolio = portfolioService.addAsset(
        selectedPortfolio, 
        transactionData.symbol, 
        transactionData.quantity, 
        transactionData.price
      );
      
      const newAsset = updatedPortfolio.assets[updatedPortfolio.assets.length - 1];
      const transaction = await dataService.saveTransaction({
        id: crypto.randomUUID(),
        portfolioId: updatedPortfolio.id,
        assetId: newAsset.id,
        type: 'buy',
        quantity: transactionData.quantity,
        price: transactionData.price,
        timestamp: new Date()
      });
      
      setTransactions([...transactions, transaction]);
    } 
    // Handle transaction for existing asset
    else {
      const asset = selectedPortfolio.assets.find(a => a.id === transactionData.assetId);
      if (!asset) return;
      
      // Create transaction
      const transaction = await dataService.saveTransaction({
        id: crypto.randomUUID(),
        portfolioId: updatedPortfolio.id,
        assetId: asset.id,
        type: transactionData.type,
        quantity: transactionData.quantity,
        price: transactionData.price,
        timestamp: new Date()
      });
      
      setTransactions([...transactions, transaction]);
      
      // Update asset quantity
      const updatedAssets = updatedPortfolio.assets.map(a => {
        if (a.id === asset.id) {
          const newQuantity = transactionData.type === 'buy' 
            ? a.quantity + transactionData.quantity
            : a.quantity - transactionData.quantity;
            
          return {
            ...a,
            quantity: newQuantity,
            averagePrice: transactionData.type === 'buy'
              ? (a.quantity * a.averagePrice + transactionData.quantity * transactionData.price) / 
                (a.quantity + transactionData.quantity)
              : a.averagePrice
          };
        }
        return a;
      });
      
      updatedPortfolio = {
        ...updatedPortfolio,
        assets: updatedAssets,
        updatedAt: new Date()
      };
    }
    
    // Save updated portfolio
    await dataService.savePortfolio(updatedPortfolio);
    setSelectedPortfolio(updatedPortfolio);
    
    // Recalculate performance
    const performance = portfolioService.calculatePerformance(updatedPortfolio, timeframe);
    await dataService.savePerformance(performance);
    setPerformances([performance]);
    
    setShowTransactionForm(false);
  };
  
  // Handle removing an asset
  const handleRemoveAsset = async (assetId: string) => {
    if (!selectedPortfolio) return;
    
    const updatedAssets = selectedPortfolio.assets.filter(asset => asset.id !== assetId);
    const updatedPortfolio = {
      ...selectedPortfolio,
      assets: updatedAssets,
      updatedAt: new Date()
    };
    
    await dataService.savePortfolio(updatedPortfolio);
    setSelectedPortfolio(updatedPortfolio);
    
    // Recalculate performance
    const performance = portfolioService.calculatePerformance(updatedPortfolio, timeframe);
    await dataService.savePerformance(performance);
    setPerformances([performance]);
  };
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Virgin Fund Portfolio Manager</h1>
        <button onClick={() => setShowPortfolioForm(true)} className="new-portfolio-btn">
          New Portfolio
        </button>
      </header>
      
      {isLoading ? (
        <div className="loading">
          <LoadingSpinner message="Loading your portfolios..." />
        </div>
      ) : (
        <div className="dashboard-content">
          <div className="portfolios-list">
            <h2>Your Portfolios</h2>
            {portfolios.length === 0 ? (
              <div className="no-portfolios">
                <p>You don't have any portfolios yet.</p>
                <button onClick={() => setShowPortfolioForm(true)}>
                  Create your first portfolio
                </button>
              </div>
            ) : (
              <div className="portfolio-cards">
                {portfolios.map(portfolio => (
                  <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    performance={performances.find(p => p.portfolioId === portfolio.id)}
                    onEdit={() => setSelectedPortfolio(portfolio)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {selectedPortfolio && (
            <div className="portfolio-details">
              <h2>{selectedPortfolio.name}</h2>
              
              <div className="portfolio-actions">
                <button onClick={() => setShowTransactionForm(true)}>
                  Record Transaction
                </button>
              </div>
              
              <div className="portfolio-content">
                <div className="performance-section">
                  <PerformanceChart
                    portfolioId={selectedPortfolio.id}
                    performances={performances}
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                  />
                  
                  {performances.length > 0 && (
                    <BenchmarkComparison
                      portfolioId={selectedPortfolio.id}
                      performanceData={performances[0]}
                      timeframe={timeframe}
                    />
                  )}
                </div>
                
                <RiskAnalysis portfolio={selectedPortfolio} />
                
                <AssetList
                  assets={selectedPortfolio.assets}
                  onAddAsset={() => setShowTransactionForm(true)}
                  onRemoveAsset={handleRemoveAsset}
                />
                
                <TransactionHistory
                  transactions={transactions}
                  assets={assetLookup}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {showPortfolioForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PortfolioForm
              userId={userId}
              onSubmit={handleCreatePortfolio}
              onCancel={() => setShowPortfolioForm(false)}
            />
          </div>
        </div>
      )}
      
      {showTransactionForm && selectedPortfolio && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TransactionForm
              portfolioId={selectedPortfolio.id}
              assets={selectedPortfolio.assets}
              onSubmit={handleRecordTransaction}
              onCancel={() => setShowTransactionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
