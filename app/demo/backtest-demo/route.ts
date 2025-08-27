import { NextResponse } from 'next/server'
import { runBacktest } from '@/lib/backtest-service'

export async function GET() {
  const bot = {
    id: 'demo-backtest-1',
    name: 'Demo RSI Bot',
    strategy: 'indicator',
    assets: ['AAPL'],
    indicatorConfig: { type: 'rsi', timeframe: '1day', entryThreshold: 30, exitThreshold: 70 },
  }

  const params = { initialCapital: 10000, commission: 0.1, slippage: 0.05, startDate: '2024-01-01', endDate: '2024-03-01' }

  try {
    const res = await runBacktest(bot as any, params as any)
    return NextResponse.json(res)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
