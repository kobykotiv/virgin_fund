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
    const portfolioId = searchParams.get('portfolioId')
    const symbol = searchParams.get('symbol')

    if (!portfolioId) {
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // First check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Build query
    const query: any = { portfolioId }
    if (symbol) query.symbol = symbol
    
    const assets = await db.collection('portfolio_assets')
      .find(query)
      .toArray()
      
    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.portfolioId || !data.symbol || !data.quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Validate portfolio ownership
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(data.portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    const asset = {
      portfolioId: data.portfolioId,
      symbol: data.symbol,
      quantity: data.quantity,
      averagePrice: data.averagePrice || 0,
      holdingType: data.holdingType || 'long',
      metadata: data.metadata || {},
      automatedHolding: data.automatedHolding,
      transactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await db.collection('portfolio_assets').insertOne(asset)
    
    // Update portfolio's assets array
    await db.collection('portfolios').updateOne(
      { _id: new ObjectId(data.portfolioId) },
      { 
        $push: { assets: { id: result.insertedId.toString(), symbol: data.symbol } },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({ 
      ...asset, 
      id: result.insertedId.toString(),
      success: true
    })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }
}
