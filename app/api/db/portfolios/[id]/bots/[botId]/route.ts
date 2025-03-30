import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string; botId: string } }
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
    
    // Find bot configuration in portfolio
    const botConfig = portfolio.bots?.find((b: any) => b.botId === params.botId)
    
    if (!botConfig) {
      return NextResponse.json({ error: "Bot not found in this portfolio" }, { status: 404 })
    }
    
    // Get bot details
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(params.botId)
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      ...bot,
      portfolioConfig: botConfig
    })
  } catch (error) {
    console.error('Error fetching bot details:', error)
    return NextResponse.json({ error: "Failed to fetch bot details" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; botId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    const db = await connectToDatabase()
    
    // Check if user owns this portfolio
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found or unauthorized" }, { status: 404 })
    }
    
    // Find bot configuration in portfolio
    const botExists = portfolio.bots?.some((b: any) => b.botId === params.botId)
    
    if (!botExists) {
      return NextResponse.json({ error: "Bot not found in this portfolio" }, { status: 404 })
    }
    
    // Update bot configuration
    const result = await db.collection('portfolios').updateOne(
      { 
        _id: new ObjectId(params.id),
        "bots.botId": params.botId 
      },
      { 
        $set: { 
          "bots.$.status": data.status,
          "bots.$.permissions": data.permissions,
          "bots.$.parameters": data.parameters,
          updatedAt: new Date()
        } 
      }
    )
    
    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error updating bot configuration:', error)
    return NextResponse.json({ error: "Failed to update bot configuration" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; botId: string } }
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
    
    // Remove bot from portfolio
    const result = await db.collection('portfolios').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $pull: { bots: { botId: params.botId } },
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
