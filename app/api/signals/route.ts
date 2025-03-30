import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from 'mongodb'
import type { Signal } from '@/types/bot'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const botId = searchParams.get('botId')
    const asset = searchParams.get('asset')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const db = await connectToDatabase()
    
    // Build query
    const query: any = { userId: session.user.id }
    
    if (botId) {
      if (!ObjectId.isValid(botId)) {
        return NextResponse.json({ error: "Invalid bot ID format" }, { status: 400 })
      }
      query.botId = botId
    }
    
    if (asset) {
      query.asset = asset
    }
    
    // Get signals
    const signals = await db.collection('signals')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
    
    return NextResponse.json(signals)
  } catch (error) {
    console.error('Error fetching signals:', error)
    return NextResponse.json({ error: "Failed to fetch signals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.botId || !data.type || !data.asset || data.price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Validate and convert botId to ObjectId
    if (!ObjectId.isValid(data.botId)) {
      return NextResponse.json({ error: "Invalid bot ID format" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Verify bot exists and belongs to user
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(data.botId),
      userId: session.user.id
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found or unauthorized" }, { status: 404 })
    }
    
    // Create signal with default fields
    const signal: Signal = {
      userId: session.user.id,
      botId: data.botId,
      type: data.type,
      asset: data.asset,
      price: data.price,
      timestamp: new Date().toISOString(),
      reason: data.reason || `${data.type} signal generated`,
      confidence: data.confidence || 0.5,
      metadata: data.metadata || {}
    }
    
    const result = await db.collection('signals').insertOne(signal)
    
    // Update bot's signal count
    await db.collection('bots').updateOne(
      { _id: new ObjectId(data.botId) },
      { 
        $inc: { 'signalCount': 1 },
        $set: { 'lastSignal': new Date() }
      }
    )
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      ...signal
    })
  } catch (error) {
    console.error('Error creating signal:', error)
    return NextResponse.json({ error: "Failed to create signal" }, { status: 500 })
  }
}