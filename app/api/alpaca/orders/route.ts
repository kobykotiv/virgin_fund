import { NextResponse } from 'next/server'
import { MarketDataService } from '@/services/market-data'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Get orders
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { apiKey, secretKey, isPaper } = session.user as any
    
    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 400 })
    }
    
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'open'
    
    const marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
    const orders = await marketDataService.getOrders(status)
    
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Place order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { apiKey, secretKey, isPaper } = session.user as any
    
    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 400 })
    }
    
    const orderParams = await request.json()
    
    // Validate required fields
    if (!orderParams.symbol || !orderParams.qty || !orderParams.side || !orderParams.type || !orderParams.time_in_force) {
      return NextResponse.json({ error: 'Missing required order parameters' }, { status: 400 })
    }
    
    const marketDataService = new MarketDataService(apiKey, secretKey, isPaper)
    const order = await marketDataService.placeOrder(orderParams)
    
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error placing order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
