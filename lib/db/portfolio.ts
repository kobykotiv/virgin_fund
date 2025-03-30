import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Portfolio, PortfolioAsset } from "@/types/db"

export async function createPortfolio(userId: string, data: Partial<Portfolio>): Promise<Portfolio> {
  const db = await connectToDatabase()
  
  const portfolio = {
    userId,
    name: data.name,
    accountType: data.accountType,
    strategy: data.strategy,
    riskProfile: data.riskProfile,
    assets: [],
    isPublic: data.isPublic || false,
    metadata: data.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection('portfolios').insertOne(portfolio)
  return { ...portfolio, id: result.insertedId.toString() }
}

export async function addAssetToPortfolio(
  portfolioId: string, 
  assetData: Partial<PortfolioAsset>
): Promise<PortfolioAsset> {
  const db = await connectToDatabase()
  
  const asset = {
    portfolioId,
    symbol: assetData.symbol,
    quantity: assetData.quantity || 0,
    averagePrice: assetData.averagePrice || 0,
    holdingType: assetData.holdingType,
    metadata: assetData.metadata || {},
    automatedHolding: assetData.automatedHolding,
    transactions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection('portfolio_assets').insertOne(asset)
  
  // Update portfolio's assets array
  await db.collection('portfolios').updateOne(
    { _id: new ObjectId(portfolioId) },
    { $push: { assets: result.insertedId } }
  )

  return { ...asset, id: result.insertedId.toString() }
}
