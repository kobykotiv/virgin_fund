import { NextResponse } from 'next/server'
import { connectToDatabase, isValidObjectId } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from 'zod'
import type { Bot, BotType } from '@/types/bot'

// Bot validation schema
const BotSchema = z.object({
  name: z.string().min(1, "Bot name is required"),
  type: z.enum(["indicator", "grid", "dca", "basket"] as const),
  assets: z.array(z.string()).min(1, "At least one asset must be selected"),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  maxDrawdown: z.number().optional(),
  indicatorConfig: z.object({
    type: z.enum(["rsi", "macd", "bollinger"]),
    timeframe: z.string(),
    entryThreshold: z.number(),
    exitThreshold: z.number()
  }).optional(),
  gridConfig: z.object({
    gridSize: z.number(),
    upperLimit: z.number(),
    lowerLimit: z.number(),
    quantity: z.number()
  }).optional(),
  dcaConfig: z.object({
    interval: z.string(),
    amount: z.number(),
    duration: z.string().optional()
  }).optional(),
  basketConfig: z.object({
    targetAllocation: z.record(z.string(), z.number()),
    rebalancePeriod: z.string().optional()
  }).optional()
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id
    const type = searchParams.get('type') as BotType | null
    
    // Verify user can access these bots (admin or self)
    if (userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized to view these bots" }, { status: 403 })
    }
    
    const db = await connectToDatabase()
    
    // Build query
    const query: any = { userId }
    if (type) query.type = type
    
    const bots = await db.collection('bots').find(query).toArray()
    
    return NextResponse.json(bots)
  } catch (error) {
    console.error('Error fetching bots:', error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate bot data with Zod
    try {
      BotSchema.parse(data)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Validation failed", 
          details: validationError.errors 
        }, { status: 400 })
      }
    }
    
    // Type-specific validation
    if (data.type === 'indicator' && !data.indicatorConfig) {
      return NextResponse.json({ error: "Indicator configuration is required" }, { status: 400 })
    }
    else if (data.type === 'grid' && !data.gridConfig) {
      return NextResponse.json({ error: "Grid configuration is required" }, { status: 400 })
    }
    else if (data.type === 'dca' && !data.dcaConfig) {
      return NextResponse.json({ error: "DCA configuration is required" }, { status: 400 })
    }
    else if (data.type === 'basket' && !data.basketConfig) {
      return NextResponse.json({ error: "Basket configuration is required" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Create bot with default status
    const bot = {
      userId: session.user.id,
      name: data.name,
      type: data.type,
      status: 'paused', // Always start as paused for safety
      assets: data.assets,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      maxDrawdown: data.maxDrawdown,
      indicatorConfig: data.indicatorConfig,
      gridConfig: data.gridConfig,
      dcaConfig: data.dcaConfig,
      basketConfig: data.basketConfig,
      performance: {
        totalPnL: 0,
        pnlPercentage: 0,
        totalTrades: 0,
        winRate: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('bots').insertOne(bot)
    
    return NextResponse.json({
      ...bot,
      _id: result.insertedId
    })
  } catch (error) {
    console.error('Error creating bot:', error)
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 })
  }
}
