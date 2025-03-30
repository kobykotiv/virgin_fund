import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAssets = searchParams.get('includeAssets') !== 'false'
    const includeBots = searchParams.get('includeBots') !== 'false'
    
    const db = await connectToDatabase()
    
    // Get the portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    // Check authorization for private portfolios
    if (!portfolio.sharing?.isPublic) {
      const session = await getServerSession(authOptions)
      if (!session?.user || session.user.id !== portfolio.userId) {
        return NextResponse.json({ error: 'Unauthorized access to portfolio' }, { status: 403 })
      }
    }
    
    // Fetch additional data if requested
    let assets = []
    let botDetails = []
    
    if (includeAssets && portfolio.assets?.length) {
      assets = await db.collection('portfolio_assets')
        .find({ portfolioId: params.id })
        .toArray()
    }
    
    if (includeBots && portfolio.bots?.length) {
      const botIds = portfolio.bots.map((bot: any) => new ObjectId(bot.botId))
      botDetails = await db.collection('bots')
        .find({ _id: { $in: botIds } })
        .toArray()
    }
    
    return NextResponse.json({
      ...portfolio,
      assets: includeAssets ? assets : portfolio.assets,
      botDetails: includeBots ? botDetails : undefined
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const updateData = await request.json()
    const db = await connectToDatabase()
    
    // First check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    if (portfolio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to modify this portfolio' }, { status: 403 })
    }
    
    // Prepare update data
    const update = {
      ...updateData,
      updatedAt: new Date()
    }
    
    // If updating bots, validate them
    if (updateData.bots) {
      const botIds = updateData.bots.map((b: any) => new ObjectId(b.botId))
      const bots = await db.collection("bots")
        .find({ _id: { $in: botIds }, userId: session.user.id })
        .toArray()
      
      if (bots.length !== botIds.length) {
        return NextResponse.json({ error: "Invalid bot configuration" }, { status: 400 })
      }
    }
    
    const result = await db.collection('portfolios').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    )
    
    return NextResponse.json({ 
      success: true, 
      updatedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase()
    const result = await db.collection('demo_portfolio').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}
