import { PortfolioRepository } from '../repositories/portfolio-repository'
import { Portfolio } from '@/types/portfolio'

export class PortfolioService {
  constructor(private repository: PortfolioRepository) {}

  async getPortfolio(id: string): Promise<Portfolio | null> {
    return await this.repository.findById(id)
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return await this.repository.findByUserId(userId)
  }

  async createPortfolio(portfolio: Portfolio): Promise<Portfolio> {
    return await this.repository.create(portfolio)
  }

  async updatePortfolio(id: string, data: Partial<Portfolio>): Promise<Portfolio | null> {
    return await this.repository.update(id, data)
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return await this.repository.delete(id)
  }
}
