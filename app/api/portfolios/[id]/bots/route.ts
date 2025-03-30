import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'
import { z } from 'zod'

// Validation schema for bot configuration
const botConfigSchema = z.object({
  botId: z.string(),
  isActive: z.boolean().default(true),
  parameters: z.record(z.any()).optional(),
  maxAllocation: z.number().min(0).max(100).optional(),
  riskLevel: z.number().min(1).max(10).optional(),
  tradingPairs: z.array(z.string()).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    if (!portfolio.bots || portfolio.bots.length === 0) {
      return NextResponse.json([])
    }
    
    // Get bot details
    const botIds = portfolio.bots.map((b: any) => new ObjectId(b.botId))
    const bots = await db.collection('bots').find({ 
      _id: { $in: botIds } 
    }).toArray()
    
    // Enhance bots with their portfolio configuration
    const botsWithConfig = bots.map(bot => {
      const botConfig = portfolio.bots.find(
        (b: any) => b.botId === bot._id.toString()
      )
      return {
        ...bot,
        portfolioConfig: botConfig
      }
    })
    
    return NextResponse.json(botsWithConfig)
  } catch (error) {
    console.error('Error fetching portfolio bots:', error)
    return NextResponse.json({ error: "Failed to fetch portfolio bots" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = botConfigSchema.parse(body)
    
    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Check if the bot exists
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(validatedData.botId)
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    // Check if the bot is already associated with this portfolio
    const botConfig = {
      botId: validatedData.botId,
      isActive: validatedData.isActive,
      parameters: validatedData.parameters || {},
      maxAllocation: validatedData.maxAllocation,
      riskLevel: validatedData.riskLevel,
      tradingPairs: validatedData.tradingPairs || [],
      addedAt: new Date()
    }
    
    // Update the portfolio with the new bot
    const result = await db.collection('portfolios').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $addToSet: { bots: botConfig },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({
      success: true,
      bot: {
        ...bot,
        portfolioConfig: botConfig
      }
    })
  } catch (error) {
    console.error('Error adding bot to portfolio:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to add bot to portfolio" },
      { status: 500 }
    )
  }
}
