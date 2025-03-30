import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const risk = searchParams.get("risk")

    const db = await connectToDatabase()
    const query: any = {}
    if (type) query.type = type
    if (risk) query.riskLevel = risk

    const strategies = await db.collection("strategies").find(query).toArray()
    return NextResponse.json(strategies)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch strategies" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const strategy = await request.json()
    if (!strategy.name || !strategy.type || !strategy.parameters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    strategy.createdAt = new Date()
    const result = await db.collection("strategies").insertOne(strategy)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create strategy" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    if (!updateData.name || !updateData.type || !updateData.parameters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    updateData.updatedAt = new Date()
    const result = await db.collection("strategies").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update strategy" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing strategy ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    // Check if any bots are using this strategy
    const botsUsingStrategy = await db.collection("bots").countDocuments({
      strategyId: id
    })

    if (botsUsingStrategy > 0) {
      return NextResponse.json({ 
        error: "Cannot delete strategy in use by bots" 
      }, { status: 400 })
    }

    const result = await db.collection("strategies").deleteOne({ 
      _id: new ObjectId(id) 
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete strategy" }, { status: 500 })
  }
}
