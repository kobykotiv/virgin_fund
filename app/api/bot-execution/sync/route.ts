import { NextResponse } from 'next/server'
import { connectToDatabase, isValidObjectId } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// This endpoint is used by the bot executor to sync bot status and execution data
export async function POST(request: Request) {
  try {
    // Check API key for execution service (more secure than session)
    const auth = request.headers.get('Authorization')
    const apiKey = process.env.BOT_EXECUTION_API_KEY
    
    // For MVP, we'll also allow authenticated users to trigger sync
    let isAuthenticated = false
    if (auth === `Bearer ${apiKey}`) {
      isAuthenticated = true
    } else {
      const session = await getServerSession(authOptions)
      isAuthenticated = !!session?.user
    }
    
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { botId, executionId, status, executionData, performanceUpdate } = data
    
    if (!botId || !isValidObjectId(botId)) {
      return NextResponse.json({ error: "Valid bot ID is required" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Update the bot with execution data
    const updateData: any = {
      updatedAt: new Date()
    }
    
    // Only update status if provided and different
    if (status) {
      const bot = await db.collection('bots').findOne({ _id: new ObjectId(botId) })
      
      if (bot && bot.status !== status) {
        updateData.status = status
        
        // Add to status history
        updateData.statusHistory = [
          ...(bot.statusHistory || []),
          {
            from: bot.status,
            to: status,
            timestamp: new Date(),
            reason: data.statusReason || 'Bot execution sync'
          }
        ]
      }
    }
    
    // Update execution data if provided
    if (executionData) {
      updateData.lastExecution = {
        executionId: executionId || new ObjectId().toString(),
        timestamp: new Date(),
        ...executionData
      }
    }
    
    // Update performance metrics if provided
    if (performanceUpdate) {
      updateData['performance.totalPnL'] = performanceUpdate.totalPnL
      updateData['performance.pnlPercentage'] = performanceUpdate.pnlPercentage
      updateData['performance.totalTrades'] = performanceUpdate.totalTrades
      updateData['performance.winRate'] = performanceUpdate.winRate
      updateData['performance.lastUpdated'] = new Date()
    }
    
    // Update the bot
    const result = await db.collection('bots').updateOne(
      { _id: new ObjectId(botId) },
      { $set: updateData }
    )
    
    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error syncing bot execution:', error)
    return NextResponse.json({ error: "Failed to sync bot execution" }, { status: 500 })
  }
}

// This endpoint lets the executor service fetch active bots to run
export async function GET(request: Request) {
  try {
    // Check API key for execution service
    const auth = request.headers.get('Authorization')
    const apiKey = process.env.BOT_EXECUTION_API_KEY
    
    if (auth !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    
    // Get all active bots
    const activeBots = await db.collection('bots')
      .find({ status: 'active' })
      .project({
        _id: 1,
        name: 1,
        type: 1,
        assets: 1,
        userId: 1,
        indicatorConfig: 1,
        gridConfig: 1,
        dcaConfig: 1,
        basketConfig: 1,
        stopLoss: 1,
        takeProfit: 1,
        maxDrawdown: 1
      })
      .toArray()
    
    return NextResponse.json(activeBots)
  } catch (error) {
    console.error('Error fetching active bots:', error)
    return NextResponse.json({ error: "Failed to fetch active bots" }, { status: 500 })
  }
}
