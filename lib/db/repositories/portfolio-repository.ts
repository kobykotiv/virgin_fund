import { DatabaseAdapter } from '../adapters/base-adapter'
import { Portfolio } from '@/types/portfolio'

export class PortfolioRepository {
  constructor(private db: DatabaseAdapter) {}

  async findById(id: string): Promise<Portfolio | null> {
    return await this.db.findOne<Portfolio>('portfolios', { id })
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    return await this.db.findMany<Portfolio>('portfolios', { user_id: userId })
  }

  async create(portfolio: Portfolio): Promise<Portfolio> {
    return await this.db.insertOne<Portfolio>('portfolios', portfolio)
  }

  async update(id: string, data: Partial<Portfolio>): Promise<Portfolio | null> {
    return await this.db.updateOne<Portfolio>('portfolios', { id }, data)
  }

  async delete(id: string): Promise<boolean> {
    return await this.db.deleteOne('portfolios', { id })
  }
}
