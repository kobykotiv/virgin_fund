import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import crypto from 'crypto'

// Helper function to encrypt sensitive data
function encryptData(text: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}`
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const connections = await db.collection("api_connections")
      .find({ userId: session.user.id })
      .toArray()

    // Remove sensitive data from response
    return NextResponse.json(connections.map(conn => ({
      ...conn,
      credentials: {
        apiKey: conn.credentials.apiKey.substring(0, 5) + "...",
        secretKey: "********",
      }
    })))
  } catch (error) {
    console.error('Error fetching API connections:', error)
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const db = await connectToDatabase()
    
    // Validate required fields
    if (!data.provider || !data.credentials?.apiKey || !data.credentials?.secretKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Set rate limits based on provider
    let rateLimit;
    switch (data.provider) {
      case 'alpaca':
        rateLimit = { requestsPerMinute: 200, requestsPerHour: 12000 };
        break;
      case 'binance':
        rateLimit = { requestsPerMinute: 1200, requestsPerHour: 60000 };
        break;
      case 'coingecko':
        rateLimit = { requestsPerMinute: 50, requestsPerHour: 500 };
        break;
      default:
        rateLimit = { requestsPerMinute: 100, requestsPerHour: 5000 };
    }

    // Get encryption key from environment or use a default (should be in env in production)
    const encryptionKey = process.env.ENCRYPTION_KEY || '70dce76d6f52aa7a7e6e3d6af41263f46d48556be78e0d2c901872a5';

    const connection = {
      userId: session.user.id,
      name: data.name || `${data.provider} Connection`,
      provider: data.provider,
      credentials: {
        apiKey: encryptData(data.credentials.apiKey, encryptionKey),
        secretKey: encryptData(data.credentials.secretKey, encryptionKey),
        ...(data.credentials.passphrase && {
          passphrase: encryptData(data.credentials.passphrase, encryptionKey)
        }),
        additionalKeys: data.credentials.additionalKeys
      },
      permissions: data.permissions || {
        canRead: true,
        canTrade: false,
        canWithdraw: false
      },
      rateLimit,
      status: 'active',
      lastChecked: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("api_connections").insertOne(connection)
    return NextResponse.json({ id: result.insertedId, success: true })
  } catch (error) {
    console.error('Error creating API connection:', error)
    return NextResponse.json({ error: "Failed to create connection" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Missing connection ID" }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Verify ownership before deletion
    const connection = await db.collection("api_connections").findOne({
      _id: new ObjectId(id),
      userId: session.user.id
    })
    
    if (!connection) {
      return NextResponse.json({ error: "Connection not found or unauthorized" }, { status: 404 })
    }
    
    const result = await db.collection("api_connections").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id
    })
    
    return NextResponse.json({ success: true, deleted: result.deletedCount > 0 })
  } catch (error) {
    console.error('Error deleting API connection:', error)
    return NextResponse.json({ error: "Failed to delete connection" }, { status: 500 })
  }
}
