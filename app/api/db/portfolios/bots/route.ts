import { NextResponse } from 'next/server'
import { connectToDatabase, isValidObjectId } from '@/lib/mongodb'
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
    
    if (!portfolioId || !isValidObjectId(portfolioId)) {
      return NextResponse.json({ error: "Valid portfolio ID is required" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Get all bots connected to this portfolio
    if (!portfolio.bots || portfolio.bots.length === 0) {
      return NextResponse.json([])
    }
    
    // Get the bot IDs
    const botIds = portfolio.bots.map((bot: any) => new ObjectId(bot.botId))
    
    // Fetch all bots
    const bots = await db.collection('bots')
      .find({ _id: { $in: botIds } })
      .toArray()
    
    // Merge bot data with portfolio-specific configurations
    const enrichedBots = bots.map(bot => {
      const portfolioConfig = portfolio.bots.find(
        (b: any) => b.botId === bot._id.toString()
      )
      
      return {
        ...bot,
        portfolioConfig
      }
    })
    
    return NextResponse.json(enrichedBots)
  } catch (error) {
    console.error('Error fetching portfolio bots:', error)
    return NextResponse.json({ error: "Failed to fetch portfolio bots" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { portfolioId, botId, status, permissions } = data
    
    if (!portfolioId || !botId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    if (!isValidObjectId(portfolioId) || !isValidObjectId(botId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Check if user owns the portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Check if the bot exists
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(botId)
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    // Check if bot already connected to this portfolio
    if (portfolio.bots && portfolio.bots.some((b: any) => b.botId === botId)) {
      return NextResponse.json({ error: "Bot already connected to this portfolio" }, { status: 400 })
    }
    
    // Add bot to portfolio
    const botConfig = {
      botId,
      status: status || 'paused',
      permissions: permissions || ['read'],
      addedAt: new Date(),
      parameters: {}
    }
    
    // Create bots array if it doesn't exist
    if (!portfolio.bots) {
      await db.collection('portfolios').updateOne(
        { _id: new ObjectId(portfolioId) },
        { $set: { bots: [botConfig], updatedAt: new Date() } }
      )
    } else {
      await db.collection('portfolios').updateOne(
        { _id: new ObjectId(portfolioId) },
        { 
          $push: { bots: botConfig },
          $set: { updatedAt: new Date() }
        }
      )
    }
    
    return NextResponse.json({
      success: true,
      botConfig
    })
  } catch (error) {
    console.error('Error connecting bot to portfolio:', error)
    return NextResponse.json({ error: "Failed to connect bot to portfolio" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')
    const botId = searchParams.get('botId')
    
    if (!portfolioId || !botId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Remove bot from portfolio
    const result = await db.collection('portfolios').updateOne(
      { _id: new ObjectId(portfolioId) },
      { 
        $pull: { bots: { botId } },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({
      success: true,
      removed: result.modifiedCount > 0
    })
  } catch (error) {
    console.error('Error removing bot from portfolio:', error)
    return NextResponse.json({ error: "Failed to remove bot from portfolio" }, { status: 500 })
  }
}
