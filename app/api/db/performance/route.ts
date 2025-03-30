import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Collection } from 'mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountType = searchParams.get('accountType')
    
    const db = await connectToDatabase()
    const collection: Collection = db.collection('portfolio_performance')
    
    const query = accountType ? { accountType } : {}
    const performance = await collection.find(query).toArray()
    
    return NextResponse.json(performance)
  } catch (error) {
    console.error('Error fetching performance:', error)
    return NextResponse.json({ error: 'Failed to fetch performance' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = await connectToDatabase()
    const collection: Collection = db.collection('portfolio_performance')

    const result = await collection.insertOne({
      ...data,
      date: new Date(data.date)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating performance record:', error)
    return NextResponse.json({ error: 'Failed to create performance record' }, { status: 500 })
  }
}
