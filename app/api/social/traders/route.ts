import { NextRequest, NextResponse } from 'next/server'

// Mock data for social trading network
const mockTraders = [
  {
    id: '1',
    username: 'AlphaTrader',
    bio: 'Professional trader with 10+ years experience',
    followers: 15420,
    following: 45,
    totalReturn: 245.8,
    winRate: 78.5,
    riskScore: 6.2,
    strategy: 'Momentum & Technical Analysis',
    isFollowing: false,
    isVerified: true,
    lastActive: '2024-01-15T10:30:00Z',
    portfolioValue: 2500000,
    monthlyReturn: 12.4,
    totalTrades: 1247
  },
  {
    id: '2',
    username: 'CryptoQueen',
    bio: 'Crypto specialist focusing on DeFi and altcoins',
    followers: 8920,
    following: 23,
    totalReturn: 189.3,
    winRate: 82.1,
    riskScore: 8.7,
    strategy: 'Crypto Arbitrage & HODL',
    isFollowing: true,
    isVerified: true,
    lastActive: '2024-01-15T09:15:00Z',
    portfolioValue: 1800000,
    monthlyReturn: 8.9,
    totalTrades: 892
  },
  {
    id: '3',
    username: 'ValueInvestor',
    bio: 'Long-term value investing with fundamental analysis',
    followers: 12340,
    following: 67,
    totalReturn: 156.7,
    winRate: 71.3,
    riskScore: 4.1,
    strategy: 'Value Investing',
    isFollowing: false,
    isVerified: false,
    lastActive: '2024-01-14T16:45:00Z',
    portfolioValue: 3200000,
    monthlyReturn: 6.2,
    totalTrades: 234
  }
]

export async function GET() {
  try {
    // In a real app, this would fetch from database
    return NextResponse.json(mockTraders)
  } catch (error) {
    console.error('Error fetching traders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch traders' },
      { status: 500 }
    )
  }
}
