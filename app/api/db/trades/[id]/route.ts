import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,  
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    const trade = await db.collection('trades').findOne({
      _id: new ObjectId(params.id)
    })

    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json(trade)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trade' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.symbol || !data.type || !data.quantity || !data.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await connectToDatabase() 
    const result = await db.collection('trades').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: {
        ...data,
        updatedAt: new Date()
      }}
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }  
) {
  try {
    const db = await connectToDatabase()
    const result = await db.collection('trades').deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 })
  }
}
