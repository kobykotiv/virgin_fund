import { NextRequest, NextResponse } from 'next/server'

// Mock data for trade signals
const mockSignals = [
  {
    id: '1',
    traderId: '1',
    traderName: 'AlphaTrader',
    symbol: 'AAPL',
    action: 'BUY' as const,
    price: 185.50,
    quantity: 100,
    timestamp: '2024-01-15T10:30:00Z',
    confidence: 85,
    reasoning: 'Strong earnings beat expectations, technical breakout above resistance',
    likes: 234,
    comments: 45,
    isLiked: false
  },
  {
    id: '2',
    traderId: '2',
    traderName: 'CryptoQueen',
    symbol: 'BTC-USD',
    action: 'BUY' as const,
    price: 45120.00,
    quantity: 0.5,
    timestamp: '2024-01-15T09:15:00Z',
    confidence: 78,
    reasoning: 'Bitcoin showing strong support at $44K, ETF inflows increasing',
    likes: 189,
    comments: 32,
    isLiked: true
  },
  {
    id: '3',
    traderId: '1',
    traderName: 'AlphaTrader',
    symbol: 'TSLA',
    action: 'SELL' as const,
    price: 245.80,
    quantity: 50,
    timestamp: '2024-01-14T16:45:00Z',
    confidence: 92,
    reasoning: 'Overbought conditions, taking profits after 15% gain',
    likes: 156,
    comments: 28,
    isLiked: false
  },
  {
    id: '4',
    traderId: '3',
    traderName: 'ValueInvestor',
    symbol: 'NVDA',
    action: 'BUY' as const,
    price: 875.30,
    quantity: 25,
    timestamp: '2024-01-14T14:20:00Z',
    confidence: 76,
    reasoning: 'AI chip demand remains strong, undervalued relative to growth',
    likes: 98,
    comments: 15,
    isLiked: false
  }
]

export async function GET() {
  try {
    // In a real app, this would fetch from database with pagination
    return NextResponse.json(mockSignals)
  } catch (error) {
    console.error('Error fetching signals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    )
  }
}
