import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    const signal = await db.collection('trading_signals').findOne({
      _id: new ObjectId(params.id)
    })

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
    }

    return NextResponse.json(signal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch signal' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    if (!data.symbol || !data.signalType || !data.source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection('trading_signals').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: {
        ...data,
        updatedAt: new Date()
      }}
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update signal' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectToDatabase()
    const result = await db.collection('trading_signals').deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete signal' }, { status: 500 })
  }
}
