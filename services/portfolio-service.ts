import { isDemoMode, DEMO_PORTFOLIO_KEY } from "./demo-service"
import { DatabaseService } from './database-service'

interface Position {
  symbol: string;
  quantity: number;
  averageEntryPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
}

interface Portfolio {
  _id?: string;
  userId: string;
  totalValue: number;
  cashBalance: number;
  positions: Position[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    allTime: number;
  };
  lastUpdated: Date;
}

export class PortfolioService extends DatabaseService {
  private collection = this.getCollection<Portfolio>('portfolios');

  async getPortfolio(userId?: string): Promise<Portfolio | null> {
    // Handle demo mode
    if (!userId && isDemoMode()) {
      if (typeof window !== "undefined") {
        const demoPortfolio = localStorage.getItem(DEMO_PORTFOLIO_KEY);
        return demoPortfolio ? JSON.parse(demoPortfolio) : null;
      }
      return null;
    }

    // Use database when userId is provided
    if (userId) {
      const col = await this.collection;
      return col.findOne({ userId });
    }

    return null;
  }

  async createPortfolio(userId: string, initialCash: number): Promise<Portfolio> {
    const portfolio: Omit<Portfolio, '_id'> = {
      userId,
      totalValue: initialCash,
      cashBalance: initialCash,
      positions: [],
      performance: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
        allTime: 0
      },
      lastUpdated: new Date()
    };

    const col = await this.collection;
    const result = await col.insertOne(portfolio);
    return { ...portfolio, _id: result.insertedId.toString() };
  }

  async updatePortfolio(userId: string, updates: Partial<Portfolio>): Promise<Portfolio | null> {
    const col = await this.collection;
    const result = await col.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          ...updates,
          lastUpdated: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result;
  }

  async addPosition(userId: string, position: Position): Promise<Portfolio | null> {
    const col = await this.collection;
    const result = await col.findOneAndUpdate(
      { userId },
      { 
        $push: { positions: position },
        $set: { lastUpdated: new Date() }
      },
      { returnDocument: 'after' }
    );
    return result;
  }

  async updatePosition(userId: string, symbol: string, updates: Partial<Position>): Promise<Portfolio | null> {
    const col = await this.collection;
    const result = await col.findOneAndUpdate(
      { 
        userId,
        'positions.symbol': symbol
      },
      { 
        $set: { 
          'positions.$.currentPrice': updates.currentPrice,
          'positions.$.marketValue': updates.marketValue,
          'positions.$.unrealizedPL': updates.unrealizedPL,
          'positions.$.unrealizedPLPercent': updates.unrealizedPLPercent,
          lastUpdated: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result;
  }
}

// Singleton instance for reuse
export const portfolioService = new PortfolioService();

// Fetch portfolio data for a user
export async function fetchPortfolio(userId?: string): Promise<Portfolio | null> {
  // If no userId provided and in demo mode, return demo portfolio
  if (!userId && isDemoMode()) {
    const demoPortfolio = localStorage.getItem(DEMO_PORTFOLIO_KEY);
    return demoPortfolio ? JSON.parse(demoPortfolio) : null;
  }

  // Use the actual service when userId is provided
  if (userId) {
    return portfolioService.getPortfolio(userId);
  }

  return null;
}

