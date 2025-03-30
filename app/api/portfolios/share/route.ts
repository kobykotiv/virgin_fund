import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { portfolioId, isPublic, allowCopy } = body
    
    if (!portfolioId) {
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Verify ownership
    const portfolio = await db.collection("portfolios").findOne({
      _id: new ObjectId(portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or you don't have permission" }, { status: 404 })
    }
    
    // Update sharing settings
    const updateData: any = { 'sharing.isPublic': isPublic }
    
    if (allowCopy !== undefined) {
      updateData['sharing.allowCopy'] = allowCopy
    }
    
    const result = await db.collection("portfolios").updateOne(
      { _id: new ObjectId(portfolioId) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    
    return NextResponse.json({
      success: true,
      sharing: {
        isPublic,
        allowCopy: allowCopy !== undefined ? allowCopy : portfolio.sharing?.allowCopy || false
      }
    })
  } catch (error) {
    console.error("Failed to update sharing settings:", error)
    return NextResponse.json(
      { error: "Failed to update sharing settings" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('shareId')
    
    if (!shareId) {
      return NextResponse.json({ error: "Share ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Get the shared portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(shareId),
      'sharing.isPublic': true
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Shared portfolio not found" }, { status: 404 })
    }
    
    // Load assets for the shared portfolio
    const assets = await db.collection('portfolio_assets')
      .find({ portfolioId: shareId })
      .toArray()
    
    // If this is a copyable portfolio, include performance data
    let performanceData = null
    if (portfolio.sharing.allowCopy) {
      performanceData = await db.collection('portfolio_performance')
        .find({ portfolioId: shareId })
        .sort({ date: -1 })
        .limit(30)
        .toArray()
    }
    
    // Hide sensitive user information
    delete portfolio.userId
    
    return NextResponse.json({
      portfolio,
      assets,
      performance: performanceData,
    })
  } catch (error) {
    console.error('Error fetching shared portfolio:', error)
    return NextResponse.json({ error: "Failed to fetch shared portfolio" }, { status: 500 })
  }
}
