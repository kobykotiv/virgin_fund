import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')
    const portfolioId = searchParams.get('portfolioId')
    const type = searchParams.get('type')

    const db = await connectToDatabase()
    
    // Build query
    const query: any = {}
    if (assetId) query.assetId = assetId
    if (portfolioId) {
      // Verify user owns the portfolio
      const portfolio = await db.collection('portfolios').findOne({
        _id: new ObjectId(portfolioId),
        userId: session.user.id
      })
      
      if (!portfolio) {
        return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
      }
      
      // Get all assets in this portfolio
      const assets = await db.collection('portfolio_assets')
        .find({ portfolioId })
        .toArray()
      
      const assetIds = assets.map(asset => asset.id.toString())
      query.assetId = { $in: assetIds }
    }
    if (type) query.type = type
    
    const transactions = await db.collection('transactions')
      .find(query)
      .sort({ timestamp: -1 })
      .toArray()
      
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.assetId || !data.type || !data.quantity || !data.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Verify asset belongs to user
    const asset = await db.collection('portfolio_assets').findOne({
      _id: new ObjectId(data.assetId)
    })
    
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }
    
    // Verify portfolio ownership
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(asset.portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Not authorized to modify this asset" }, { status: 403 })
    }
    
    // Create transaction
    const transaction = {
      assetId: data.assetId,
      type: data.type,
      quantity: data.quantity,
      price: data.price,
      timestamp: new Date(),
      metadata: data.metadata || {},
      createdBy: session.user.id,
      botId: data.botId // Optional - link to bot if automated
    }
    
    const result = await db.collection('transactions').insertOne(transaction)
    
    // Update asset with new transaction and adjust quantity/average price
    const updateData: any = {
      updatedAt: new Date(),
      $push: { transactions: result.insertedId }
    }
    
    if (data.type === 'buy') {
      // Calculate new average price and add quantity
      const newTotalQuantity = asset.quantity + data.quantity
      const newTotalValue = (asset.quantity * asset.averagePrice) + (data.quantity * data.price)
      const newAveragePrice = newTotalValue / newTotalQuantity
      
      updateData.$set = {
        quantity: newTotalQuantity,
        averagePrice: newAveragePrice
      }
    } else if (data.type === 'sell') {
      // Just reduce quantity on sell, keep average price the same
      if (asset.quantity < data.quantity) {
        return NextResponse.json({ error: "Insufficient asset quantity" }, { status: 400 })
      }
      
      updateData.$set = {
        quantity: asset.quantity - data.quantity
      }
    }
    
    // Update the asset
    await db.collection('portfolio_assets').updateOne(
      { _id: new ObjectId(data.assetId) },
      updateData
    )
    
    return NextResponse.json({
      success: true,
      transaction: {
        ...transaction,
        id: result.insertedId.toString()
      }
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
