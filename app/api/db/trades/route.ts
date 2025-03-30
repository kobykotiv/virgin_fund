import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Collection, ObjectId } from 'mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const type = searchParams.get('type')
    
    const db = await connectToDatabase()
    const collection: Collection = db.collection('trades')
    
    const query = {
      ...(symbol && { symbol }),
      ...(type && { type })
    }
    
    const trades = await collection.find(query).sort({ timestamp: -1 }).toArray()
    return NextResponse.json(trades)
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = await connectToDatabase()
    const collection: Collection = db.collection('trades')

    const result = await collection.insertOne({
      ...data,
      timestamp: new Date(data.timestamp || new Date())
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating trade:', error)
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    if (!updateData.symbol || !updateData.type || !updateData.quantity || !updateData.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("trades").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update trade" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing trade ID" }, { status: 400 })
    }
    
    const db = await connectToDatabase()
    const result = await db.collection("trades").deleteOne({
      _id: new ObjectId(id)
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete trade" }, { status: 500 })
  }
}
