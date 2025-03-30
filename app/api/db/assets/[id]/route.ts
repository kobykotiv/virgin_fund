import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
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

    const db = await connectToDatabase()
    
    // Get the asset
    const asset = await db.collection('portfolio_assets').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }
    
    // Verify portfolio ownership
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(asset.portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Not authorized to view this asset" }, { status: 403 })
    }
    
    return NextResponse.json(asset)
  } catch (error) {
    console.error('Error fetching asset:', error)
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 })
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
    const db = await connectToDatabase()
    
    // Get the asset
    const asset = await db.collection('portfolio_assets').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }
    
    // Verify portfolio ownership
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(asset.portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Not authorized to modify this asset" }, { status: 403 })
    }
    
    // Update the asset
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    
    const result = await db.collection('portfolio_assets').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error updating asset:', error)
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 })
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

    const db = await connectToDatabase()
    
    // Get the asset
    const asset = await db.collection('portfolio_assets').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }
    
    // Verify portfolio ownership
    const portfolio = await db.collection('portfolios').findOne({
      _id: new ObjectId(asset.portfolioId),
      userId: session.user.id
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "Not authorized to delete this asset" }, { status: 403 })
    }
    
    // Delete the asset
    const result = await db.collection('portfolio_assets').deleteOne({
      _id: new ObjectId(params.id)
    })
    
    // Update portfolio to remove this asset
    await db.collection('portfolios').updateOne(
      { _id: new ObjectId(asset.portfolioId) },
      { 
        $pull: { assets: { id: params.id } },
        $set: { updatedAt: new Date() }
      }
    )
    
    return NextResponse.json({
      success: true,
      deleted: result.deletedCount > 0
    })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 })
  }
}
