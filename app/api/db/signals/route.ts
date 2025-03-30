import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Collection, ObjectId } from 'mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const signalType = searchParams.get('signalType')
    
    const db = await connectToDatabase()
    const collection: Collection = db.collection('trading_signals')
    
    const query = {
      ...(symbol && { symbol }),
      ...(signalType && { signalType })
    }
    
    const signals = await collection.find(query).toArray()
    return NextResponse.json(signals)
  } catch (error) {
    console.error('Error fetching signals:', error)
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = await connectToDatabase()
    const collection: Collection = db.collection('trading_signals')

    const result = await collection.insertOne({
      ...data,
      timestamp: new Date(data.timestamp)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating signal:', error)
    return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    if (!updateData.symbol || !updateData.signalType || !updateData.source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("trading_signals").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update signal" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing signal ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection("trading_signals").deleteOne({ 
      _id: new ObjectId(id) 
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete signal" }, { status: 500 })
  }
}
