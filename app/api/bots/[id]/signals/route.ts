import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"
import { getBotSignalsCollection, getBotsCollection } from "@/lib/mongodb"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const botSignalsCollection = await getBotSignalsCollection()
    const botsCollection = await getBotsCollection()

    // Verify bot ownership
    const bot = await botsCollection.findOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(session.user.id)
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Add signal with metadata
    const signalData = {
      ...data,
      botId: new ObjectId(params.id),
      timestamp: new Date(),
      status: "pending",
      metadata: {
        marketConditions: data.marketConditions || {},
        confidence: data.confidence || 0,
        source: data.source || "bot"
      }
    }

    const result = await botSignalsCollection.insertOne(signalData)

    return NextResponse.json({
      _id: result.insertedId,
      ...signalData
    })
  } catch (error) {
    console.error("Error creating signal:", error)
    return NextResponse.json(
      { error: "Failed to create signal" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for filtering and pagination
    const searchParams = new URL(req.url).searchParams
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = parseInt(searchParams.get("skip") || "0")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build query
    const query: any = { botId: new ObjectId(params.id) }
    if (status) query.status = status
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = new Date(startDate)
      if (endDate) query.timestamp.$lte = new Date(endDate)
    }

    const botSignalsCollection = await getBotSignalsCollection()
    
    // Get total count for pagination
    const total = await botSignalsCollection.countDocuments(query)
    
    // Get signals with pagination
    const signals = await botSignalsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      signals,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit
      }
    })
  } catch (error) {
    console.error("Error fetching signals:", error)
    return NextResponse.json(
      { error: "Failed to fetch signals" },
      { status: 500 }
    )
  }
}

// Update signal status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; signalId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const botSignalsCollection = await getBotSignalsCollection()

    const result = await botSignalsCollection.updateOne(
      {
        _id: new ObjectId(params.signalId),
        botId: new ObjectId(params.id)
      },
      {
        $set: {
          status: data.status,
          updated: new Date(),
          ...(data.result && { result: data.result })
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating signal:", error)
    return NextResponse.json(
      { error: "Failed to update signal" },
      { status: 500 }
    )
  }
}

// Delete a signal
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; signalId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botSignalsCollection = await getBotSignalsCollection()

    const result = await botSignalsCollection.deleteOne({
      _id: new ObjectId(params.signalId),
      botId: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting signal:", error)
    return NextResponse.json(
      { error: "Failed to delete signal" },
      { status: 500 }
    )
  }
}