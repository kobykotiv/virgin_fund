import { Portfolio } from '../models/Portfolio';
import { Asset } from '../models/Asset';
import { Transaction } from '../models/Transaction';
import { Performance } from '../models/Performance';

// Simple in-memory storage for demo purposes
// Would be replaced with real database/API calls in production
export class DataService {
  private portfolios: Map<string, Portfolio> = new Map();
  private assets: Map<string, Asset> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();
  private performances: Map<string, Performance[]> = new Map();

  // Portfolio methods
  async savePortfolio(portfolio: Portfolio): Promise<Portfolio> {
    this.portfolios.set(portfolio.id, portfolio);
    return portfolio;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values())
      .filter(portfolio => portfolio.userId === userId);
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Asset methods
  async saveAsset(asset: Asset): Promise<Asset> {
    this.assets.set(asset.id, asset);
    return asset;
  }

  async getAssetsByPortfolio(portfolioId: string): Promise<Asset[]> {
    return Array.from(this.assets.values())
      .filter(asset => asset.portfolioId === portfolioId);
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Transaction methods
  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    const transactions = this.transactions.get(transaction.portfolioId) || [];
    transactions.push(transaction);
    this.transactions.set(transaction.portfolioId, transactions);
    return transaction;
  }

  async getTransactionsByPortfolio(portfolioId: string): Promise<Transaction[]> {
    return this.transactions.get(portfolioId) || [];
  }

  // Performance methods
  async savePerformance(performance: Performance): Promise<Performance> {
    const performances = this.performances.get(performance.portfolioId) || [];
    performances.push(performance);
    this.performances.set(performance.portfolioId, performances);
    return performance;
  }

  async getLatestPerformance(portfolioId: string, timeframe: Performance['timeframe']): Promise<Performance | undefined> {
    const performances = this.performances.get(portfolioId) || [];
    return performances
      .filter(p => p.timeframe === timeframe)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())[0];
  }
}
