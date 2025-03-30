import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase()
    const result = await db.collection('portfolio_performance').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!result) {
      return NextResponse.json({ error: 'Performance record not found' }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch performance record' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const db = await connectToDatabase()
    
    const result = await db.collection('portfolio_performance').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Performance record not found' }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update performance record' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase()
    const result = await db.collection('portfolio_performance').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Performance record not found' }, { status: 404 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete performance record' }, { status: 500 })
  }
}
