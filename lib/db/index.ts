import { DatabaseAdapter } from './adapters/base-adapter'
import { SupabaseAdapter } from './adapters/supabase-adapter'
import { MongoDBAdapter } from './adapters/mongodb-adapter'
import { PortfolioRepository } from './repositories/portfolio-repository'
import { PortfolioService } from './services/portfolio-service'

let dbAdapter: DatabaseAdapter

// Initialize the database adapter based on environment configuration
if (process.env.DATABASE_TYPE === 'mongodb') {
  dbAdapter = new MongoDBAdapter()
} else {
  dbAdapter = new SupabaseAdapter()
}

// Initialize repositories
export const portfolioRepository = new PortfolioRepository(dbAdapter)

// Initialize services
export const portfolioService = new PortfolioService(portfolioRepository)

// Export the database adapter for direct use if needed
export { dbAdapter }
