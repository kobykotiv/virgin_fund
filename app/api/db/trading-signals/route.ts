import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Collection } from 'mongodb'

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
    
    const signals = await collection.find(query).sort({ timestamp: -1 }).toArray()
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
      timestamp: new Date(data.timestamp || new Date())
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating signal:', error)
    return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 })
  }
}
