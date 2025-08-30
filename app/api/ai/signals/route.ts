import { NextRequest, NextResponse } from 'next/server'

// Mock AI signals data
const mockAISignals = [
  {
    id: '1',
    symbol: 'AAPL',
    action: 'BUY' as const,
    confidence: 85,
    price: 185.50,
    targetPrice: 195.00,
    stopLoss: 175.00,
    reasoning: 'Strong upward momentum detected with RSI at 65. MACD crossover signal confirmed. Volume increasing 23% above average.',
    indicators: ['RSI', 'MACD', 'Volume', 'Moving Average'],
    timestamp: '2024-01-15T10:30:00Z',
    status: 'active' as const
  },
  {
    id: '2',
    symbol: 'TSLA',
    action: 'SELL' as const,
    confidence: 78,
    price: 245.80,
    targetPrice: 230.00,
    stopLoss: 255.00,
    reasoning: 'Overbought conditions with RSI at 82. Bearish divergence in MACD. Profit taking recommended after 15% recent gains.',
    indicators: ['RSI', 'MACD', 'Stochastic', 'Bollinger Bands'],
    timestamp: '2024-01-15T09:15:00Z',
    status: 'active' as const
  },
  {
    id: '3',
    symbol: 'NVDA',
    action: 'BUY' as const,
    confidence: 92,
    price: 875.30,
    targetPrice: 950.00,
    stopLoss: 820.00,
    reasoning: 'AI sector momentum strong. Multiple positive catalysts including earnings beat. Support level holding at $850.',
    indicators: ['Support/Resistance', 'Volume Profile', 'Trend Lines', 'Fibonacci'],
    timestamp: '2024-01-14T16:45:00Z',
    status: 'executed' as const,
    pnl: 45.20
  },
  {
    id: '4',
    symbol: 'BTC-USD',
    action: 'HOLD' as const,
    confidence: 65,
    price: 45120.00,
    targetPrice: 48000.00,
    stopLoss: 42000.00,
    reasoning: 'Consolidation phase detected. Waiting for clearer directional momentum. Support at $43K, resistance at $47K.',
    indicators: ['Bollinger Bands', 'Volume', 'Support/Resistance', 'Ichimoku'],
    timestamp: '2024-01-14T14:20:00Z',
    status: 'active' as const
  },
  {
    id: '5',
    symbol: 'GOOGL',
    action: 'BUY' as const,
    confidence: 71,
    price: 142.80,
    targetPrice: 155.00,
    stopLoss: 135.00,
    reasoning: 'Undervalued relative to sector peers. Positive earnings surprise potential. Technical breakout above 200-day MA.',
    indicators: ['Moving Average', 'Relative Strength', 'Volume', 'Price Action'],
    timestamp: '2024-01-13T11:30:00Z',
    status: 'expired' as const
  }
]

export async function GET() {
  try {
    // In a real app, this would fetch from database with AI model predictions
    return NextResponse.json(mockAISignals)
  } catch (error) {
    console.error('Error fetching AI signals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI signals' },
      { status: 500 }
    )
  }
}
