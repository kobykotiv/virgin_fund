import { NextResponse } from 'next/server'
import { connectToDatabase, isValidObjectId } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid bot ID format" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Get the bot
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    // Verify bot ownership
    if (bot.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized to view this bot" }, { status: 403 })
    }
    
    return NextResponse.json(bot)
  } catch (error) {
    console.error('Error fetching bot:', error)
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid bot ID format" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Get the bot
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    // Verify bot ownership
    if (bot.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized to modify this bot" }, { status: 403 })
    }
    
    // Prepare update data
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    
    // If changing status, add status history
    if (data.status && data.status !== bot.status) {
      updateData.statusHistory = [
        ...(bot.statusHistory || []),
        {
          from: bot.status,
          to: data.status,
          timestamp: new Date(),
          reason: data.statusReason || 'Manual update'
        }
      ]
    }
    
    // Update the bot
    const result = await db.collection('bots').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error updating bot:', error)
    return NextResponse.json({ error: "Failed to update bot" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid bot ID format" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    
    // Get the bot
    const bot = await db.collection('bots').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    // Verify bot ownership
    if (bot.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Not authorized to delete this bot" }, { status: 403 })
    }
    
    // Check if the bot is used in any portfolios
    const portfoliosUsingBot = await db.collection('portfolios').countDocuments({
      'bots.botId': params.id
    })
    
    if (portfoliosUsingBot > 0) {
      return NextResponse.json({ 
        error: "Cannot delete bot that is used in portfolios", 
        portfoliosCount: portfoliosUsingBot 
      }, { status: 400 })
    }
    
    // Delete the bot
    const result = await db.collection('bots').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    return NextResponse.json({
      success: true,
      deleted: result.deletedCount > 0
    })
  } catch (error) {
    console.error('Error deleting bot:', error)
    return NextResponse.json({ error: "Failed to delete bot" }, { status: 500 })
  }
}
