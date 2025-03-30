import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getUsersCollection, getPortfoliosCollection, getPositionsCollection, getTransactionsCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'

// Decryption helpers for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-fallback-32-character-secret-key'

function decrypt(encryptedData: { iv: string, encryptedData: string }) {
  const iv = Buffer.from(encryptedData.iv, 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  )
  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's Alpaca API keys
    const usersCollection = await getUsersCollection()
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(session.user.id as string) 
    })
    
    if (!user || !user.alpacaApiKey || !user.alpacaSecretKey) {
      return NextResponse.json(
        { error: 'Alpaca API keys not found' }, 
        { status: 400 }
      )
    }
    
    // Decrypt the keys
    const alpacaApiKey = decrypt(user.alpacaApiKey)
    const alpacaSecretKey = decrypt(user.alpacaSecretKey)
    
    // Initialize Alpaca API client
    const baseURL = process.env.ALPACA_API_BASE_URL || 'https://paper-api.alpaca.markets'
    
    // Fetch account information
    const accountResponse = await fetch(`${baseURL}/v2/account`, {
      headers: {
        'APCA-API-KEY-ID': alpacaApiKey,
        'APCA-API-SECRET-KEY': alpacaSecretKey
      }
    })
    
    if (!accountResponse.ok) {
      const errorData = await accountResponse.json()
      console.error('Alpaca API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to connect to Alpaca API' }, 
        { status: 400 }
      )
    }
    
    // Fetch positions
    const positionsResponse = await fetch(`${baseURL}/v2/positions`, {
      headers: {
        'APCA-API-KEY-ID': alpacaApiKey,
        'APCA-API-SECRET-KEY': alpacaSecretKey
      }
    })
    
    // Fetch recent orders/trades
    const ordersResponse = await fetch(`${baseURL}/v2/orders?status=filled&limit=100`, {
      headers: {
        'APCA-API-KEY-ID': alpacaApiKey,
        'APCA-API-SECRET-KEY': alpacaSecretKey
      }
    })
    
    // Get necessary collections
    const portfoliosCollection = await getPortfoliosCollection()
    const positionsCollection = await getPositionsCollection()
    const transactionsCollection = await getTransactionsCollection()
    
    // Find or create default portfolio
    let defaultPortfolio = await portfoliosCollection.findOne({
      userId: user._id,
      isDefault: true
    })
    
    if (!defaultPortfolio) {
      const result = await portfoliosCollection.insertOne({
        userId: user._id,
        name: 'Alpaca Portfolio',
        description: 'Automatically synced from Alpaca',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      defaultPortfolio = {
        _id: result.insertedId,
        userId: user._id,
        name: 'Alpaca Portfolio'
      }
    }
    
    // Process positions data
    const positions = await positionsResponse.json()
    
    // Clear existing positions for this portfolio
    await positionsCollection.deleteMany({
      portfolioId: defaultPortfolio._id
    })
    
    // Insert new positions
    if (Array.isArray(positions) && positions.length > 0) {
      const positionDocs = positions.map(pos => ({
        portfolioId: defaultPortfolio._id,
        userId: user._id,
        ticker: pos.symbol,
        name: pos.symbol, // We could get proper names with another API call
        quantity: parseFloat(pos.qty),
        purchasePrice: parseFloat(pos.avg_entry_price),
        currentPrice: parseFloat(pos.current_price),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      await positionsCollection.insertMany(positionDocs)
    }
    
    // Process orders/trades data
    const orders = await ordersResponse.json()
    
    if (Array.isArray(orders) && orders.length > 0) {
      // Get existing transactions to avoid duplicates
      const existingTransactionIds = await transactionsCollection
        .find({ 
          userId: user._id,
          externalId: { $exists: true }
        })
        .project({ externalId: 1 })
        .toArray()
      
      const existingIds = new Set(existingTransactionIds.map(t => t.externalId))
      
      const transactionDocs = orders
        .filter(order => !existingIds.has(order.id))
        .map(order => ({
          portfolioId: defaultPortfolio._id,
          userId: user._id,
          externalId: order.id,
          ticker: order.symbol,
          type: order.side.toUpperCase(), // 'buy' -> 'BUY', 'sell' -> 'SELL'
          quantity: parseFloat(order.filled_qty),
          price: parseFloat(order.filled_avg_price),
          totalValue: parseFloat(order.filled_qty) * parseFloat(order.filled_avg_price),
          date: new Date(order.filled_at),
          source: 'alpaca',
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      
      if (transactionDocs.length > 0) {
        await transactionsCollection.insertMany(transactionDocs)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Successfully synced with Alpaca',
      positionsCount: positions.length,
      transactionsCount: orders.length,
      portfolioId: defaultPortfolio._id
    })
  } catch (error) {
    console.error('Error syncing with Alpaca:', error)
    return NextResponse.json(
      { error: 'Failed to sync with Alpaca' }, 
      { status: 500 }
    )
  }
}
