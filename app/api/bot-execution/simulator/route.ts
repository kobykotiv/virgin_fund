import { NextResponse } from 'next/server'
import { connectToDatabase, isValidObjectId } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// This endpoint simulates bot execution for demo purposes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { botId } = data
    
    if (!botId || !isValidObjectId(botId)) {
      return NextResponse.json({ error: "Valid bot ID is required" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Check if the bot exists and belongs to user
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(botId),
      userId: session.user.id
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found or unauthorized" }, { status: 404 })
    }
    
    // Make sure bot is active
    if (bot.status !== 'active') {
      return NextResponse.json({ 
        error: "Bot must be active to simulate execution",
        currentStatus: bot.status
      }, { status: 400 })
    }
    
    // Generate a random signal based on bot type
    const signal = generateSignal(bot)
    
    // Insert signal to database
    await db.collection('signals').insertOne({
      ...signal,
      botId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
      simulatedExecution: true
    })
    
    // Update bot performance
    const pnl = (Math.random() * 200) - 100 // Random value between -100 and 100
    const currentPnL = bot.performance?.totalPnL || 0
    const newTotalPnL = currentPnL + pnl
    
    const pnlPercentage = bot.performance?.pnlPercentage || 0
    const newPnlPercentage = pnlPercentage + (pnl * 0.1) // Simulate percentage change
    
    const totalTrades = (bot.performance?.totalTrades || 0) + 1
    const winRate = pnl > 0 
      ? ((bot.performance?.winRate || 50) * (totalTrades - 1) + 100) / totalTrades
      : ((bot.performance?.winRate || 50) * (totalTrades - 1)) / totalTrades
    
    await db.collection('bots').updateOne(
      { _id: new ObjectId(botId) },
      { 
        $set: { 
          'performance.totalPnL': newTotalPnL,
          'performance.pnlPercentage': newPnlPercentage,
          'performance.totalTrades': totalTrades,
          'performance.winRate': winRate,
          'performance.lastUpdated': new Date(),
          lastExecution: {
            executionId: new ObjectId().toString(),
            timestamp: new Date(),
            result: signal.type === 'entry' ? 'bought' : 'sold',
            asset: signal.asset,
            price: signal.price,
            amount: Math.random() * 10, // Random amount
            pnl
          }
        } 
      }
    )
    
    return NextResponse.json({
      success: true,
      signal,
      performance: {
        totalPnL: newTotalPnL,
        pnlPercentage: newPnlPercentage,
        totalTrades,
        winRate
      }
    })
  } catch (error) {
    console.error('Error simulating bot execution:', error)
    return NextResponse.json({ error: "Failed to simulate bot execution" }, { status: 500 })
  }
}

// Helper function to generate a signal based on bot type
function generateSignal(bot: any) {
  // Pick random asset from bot's assets
  const asset = bot.assets[Math.floor(Math.random() * bot.assets.length)]
  
  // Randomize whether it's an entry or exit
  const type = Math.random() > 0.5 ? 'entry' : 'exit'
  
  // Generate a reasonable price
  let price = 0
  switch (asset) {
    case 'AAPL':
      price = 150 + (Math.random() * 50)
      break
    case 'MSFT':
      price = 300 + (Math.random() * 100)
      break
    case 'GOOGL':
      price = 2500 + (Math.random() * 500)
      break
    case 'AMZN':
      price = 3000 + (Math.random() * 1000)
      break
    case 'TSLA':
      price = 700 + (Math.random() * 300)
      break
    default:
      price = 100 + (Math.random() * 200)
  }
  
  // Generate reason based on bot type
  let reason = ''
  let confidence = 0.5 + (Math.random() * 0.5) // Between 0.5 and 1.0
  
  switch (bot.type) {
    case 'indicator':
      if (bot.indicatorConfig?.type === 'rsi') {
        const rsiValue = type === 'entry' ? 25 + (Math.random() * 10) : 75 - (Math.random() * 10)
        reason = `RSI ${rsiValue.toFixed(2)} ${type === 'entry' ? 'oversold' : 'overbought'} condition`
      } else if (bot.indicatorConfig?.type === 'macd') {
        reason = `MACD ${type === 'entry' ? 'bullish' : 'bearish'} crossover`
      } else {
        reason = `${type === 'entry' ? 'Bullish' : 'Bearish'} indicator signal`
      }
      break
      
    case 'grid':
      reason = `Grid level ${Math.floor(Math.random() * 10) + 1} ${type === 'entry' ? 'buy' : 'sell'} triggered`
      confidence = 0.9 // Grid bots have high confidence
      break
      
    case 'dca':
      reason = 'Scheduled DCA purchase'
      confidence = 1.0 // DCA has perfect confidence (it's scheduled)
      break
      
    case 'basket':
      reason = `Portfolio ${type === 'entry' ? 'rebalance buy' : 'rebalance sell'} to maintain target allocation`
      break
      
    default:
      reason = `${type === 'entry' ? 'Buy' : 'Sell'} signal generated`
  }
  
  return {
    type,
    asset,
    price,
    reason,
    confidence,
    metadata: {
      simulated: true,
      botType: bot.type
    }
  }
}
