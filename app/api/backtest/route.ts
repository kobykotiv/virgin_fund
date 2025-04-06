import { NextResponse } from 'next/server'
import { BacktestEngine } from '@/services/backtest-engine'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { apiKey, secretKey, isPaper } = session.user as any
    
    if (!apiKey && !session.user.isDemoMode) {
      return NextResponse.json({ error: 'API credentials not configured' }, { status: 400 })
    }
    
    const { bot, startDate, endDate } = await request.json()
    
    if (!bot || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    // Use demo keys for demo mode or when running backtests
    const backtestEngine = new BacktestEngine(
      apiKey || 'demo-key',
      secretKey || 'demo-secret',
      true // Always use paper trading for backtests
    )
    
    const results = await backtestEngine.runBacktest(bot, startDate, endDate)
    
    return NextResponse.json(results)
  } catch (error: any) {
    console.error('Error running backtest:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
