import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const automationData = await request.json()
    if (!automationData.type) {
      return NextResponse.json({ error: "Missing automation type" }, { status: 400 })
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
      return NextResponse.json({ error: "Not authorized to modify this asset" }, { status: 403 })
    }
    
    // Set up automation
    const automatedHolding = {
      type: automationData.type,
      parameters: automationData.parameters || {},
      automationRules: automationData.automationRules || []
    }
    
    // Update asset with automation config
    const result = await db.collection('portfolio_assets').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          automatedHolding,
          updatedAt: new Date()
        }
      }
    )
    
    // Create automation record in automations collection
    await db.collection('asset_automations').insertOne({
      assetId: params.id,
      portfolioId: asset.portfolioId,
      userId: session.user.id,
      automatedHolding,
      status: 'active',
      nextRun: calculateNextRun(automationData),
      createdAt: new Date()
    })
    
    return NextResponse.json({
      success: true,
      automatedHolding
    })
  } catch (error) {
    console.error('Error setting up automation:', error)
    return NextResponse.json({ error: "Failed to set up automation" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
      return NextResponse.json({ error: "Not authorized to modify this asset" }, { status: 403 })
    }
    
    // Remove automation
    const result = await db.collection('portfolio_assets').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $unset: { automatedHolding: "" },
        $set: { updatedAt: new Date() }
      }
    )
    
    // Update automation record
    await db.collection('asset_automations').updateMany(
      { assetId: params.id },
      { $set: { status: 'inactive' }}
    )
    
    return NextResponse.json({
      success: true,
      removed: result.modifiedCount > 0
    })
  } catch (error) {
    console.error('Error removing automation:', error)
    return NextResponse.json({ error: "Failed to remove automation" }, { status: 500 })
  }
}

// Helper function to calculate next automation run time
function calculateNextRun(automationData: any): Date {
  const now = new Date()
  const interval = automationData.parameters?.interval || '1d'
  
  switch (interval) {
    case '1d':
      return new Date(now.setDate(now.getDate() + 1))
    case '1w':
      return new Date(now.setDate(now.getDate() + 7))
    case '2w':
      return new Date(now.setDate(now.getDate() + 14))
    case '1m':
      return new Date(now.setMonth(now.getMonth() + 1))
    default:
      return new Date(now.setDate(now.getDate() + 1))
  }
}
