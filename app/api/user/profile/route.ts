import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection, isValidObjectId, ObjectId } from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import crypto from 'crypto'

// Encryption helpers for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-32-character-secret-key'
const ENCRYPTION_IV = crypto.randomBytes(16)

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), 
    ENCRYPTION_IV
  )
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return { 
    iv: ENCRYPTION_IV.toString('hex'),
    encryptedData: encrypted 
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const usersCollection = await getUsersCollection()
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(session.user.id as string) 
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      hasAlpacaKeys: !!user.alpacaApiKey,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { name, email, alpacaApiKey, alpacaSecretKey } = body
    
    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      )
    }
    
    const updateData: any = {
      name,
      email,
      updatedAt: new Date()
    }
    
    // Encrypt Alpaca keys if provided
    if (alpacaApiKey && alpacaSecretKey) {
      const encryptedApiKey = encrypt(alpacaApiKey)
      const encryptedSecretKey = encrypt(alpacaSecretKey)
      
      updateData.alpacaApiKey = encryptedApiKey
      updateData.alpacaSecretKey = encryptedSecretKey
    }
    
    const usersCollection = await getUsersCollection()
    
    // Update user profile
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id as string) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully' 
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
