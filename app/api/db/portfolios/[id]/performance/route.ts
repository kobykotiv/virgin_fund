import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '1m'
    
    const db = await connectToDatabase()
    
    // Check if portfolio exists and verify access permissions
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    // For private portfolios, check authorization
    if (!portfolio.sharing?.isPublic) {
      const session = await getServerSession(authOptions)
      if (!session?.user || session.user.id !== portfolio.userId) {
        return NextResponse.json({ error: 'Unauthorized access to portfolio' }, { status: 403 })
      }
    }
    
    // Calculate date filter based on timeframe
    const dateFilter = getDateFilter(timeframe)
    
    // Fetch performance history for the specified timeframe
    const performanceData = await db.collection('portfolio_performance')
      .find({ 
        portfolioId: params.id,
        date: dateFilter
      })
      .sort({ date: 1 })
      .toArray()
    
    // If no data is found, generate sample data
    if (performanceData.length === 0) {
      const sampleData = generateSamplePerformanceData(timeframe, portfolio.accountType)
      return NextResponse.json(sampleData)
    }
    
    return NextResponse.json(performanceData)
  } catch (error) {
    console.error('Error fetching portfolio performance:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio performance' }, { status: 500 })
  }
}

// Helper function to get date filter based on timeframe
function getDateFilter(timeframe: string): any {
  const now = new Date()
  
  switch (timeframe) {
    case '1w':
      const oneWeekAgo = new Date(now)
      oneWeekAgo.setDate(now.getDate() - 7)
      return { $gte: oneWeekAgo }
    
    case '1m':
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return { $gte: oneMonthAgo }
    
    case '3m':
      const threeMonthsAgo = new Date(now)
      threeMonthsAgo.setMonth(now.getMonth() - 3)
      return { $gte: threeMonthsAgo }
    
    case '1y':
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return { $gte: oneYearAgo }
    
    case 'all':
    default:
      return {}
  }
}

// Function to generate sample performance data when no real data exists
function generateSamplePerformanceData(timeframe: string, accountType: string = 'standard'): any[] {
  const now = new Date()
  const data: any[] = []
  
  // Set starting value and volatility based on account type
  let baseValue = 10000 // Starting portfolio value
  let volatility = 0.005 // Default volatility
  
  if (accountType === 'aggressive') {
    volatility = 0.02
  } else if (accountType === 'conservative') {
    volatility = 0.0025
  }
  
  // Determine number of data points and interval based on timeframe
  let days = 30
  let interval = 1
  
  switch (timeframe) {
    case '1w':
      days = 7
      interval = 1
      break
    case '1m':
      days = 30
      interval = 1
      break
    case '3m':
      days = 90
      interval = 3
      break
    case '1y':
      days = 365
      interval = 7
      break
    case 'all':
      days = 365 * 2
      interval = 14
      break
  }
  
  // Generate data points
  let currentValue = baseValue
  for (let i = days; i >= 0; i -= interval) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Add some random variation
    const change = (Math.random() - 0.5) * volatility * currentValue
    currentValue += change
    
    // Add a slight upward trend
    if (accountType !== 'conservative') {
      currentValue += (baseValue * 0.0002)
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalValue: Math.max(currentValue, baseValue * 0.7), // Ensure value doesn't drop too much
      percentChange: ((currentValue - baseValue) / baseValue) * 100
    })
  }
  
  return data
}

// Add a POST endpoint to record actual performance data points
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    const db = await connectToDatabase()
    
    // Verify portfolio ownership
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Create performance data point
    const performancePoint = {
      portfolioId: params.id,
      userId: session.user.id,
      date: new Date(data.date || new Date()),
      totalValue: data.totalValue,
      cashBalance: data.cashBalance || 0,
      investments: data.investments || 0,
      percentChange: data.percentChange || 0,
      createdAt: new Date()
    }
    
    const result = await db.collection('portfolio_performance').insertOne(performancePoint)
    
    // Update portfolio with latest performance summary
    await db.collection('portfolios').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          'performance.totalValue': data.totalValue,
          'performance.percentChange': data.percentChange,
          'performance.lastUpdated': new Date()
        } 
      }
    )
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      ...performancePoint
    })
  } catch (error) {
    console.error('Error recording portfolio performance:', error)
    return NextResponse.json({ error: "Failed to record portfolio performance" }, { status: 500 })
  }
}
