import { runBacktest } from '@/lib/backtest-service'
import type { Bot } from '@/types/api'

async function main() {
  // Minimal bot for indicator strategy using RSI
  const botBase: Partial<Bot> = {
    id: 'sample-bot',
    name: 'Sample RSI Bot',
    strategy: 'indicator',
    assets: ['AAPL'],
    stopLoss: 5,
    takeProfit: 10,
    indicatorConfig: { type: 'rsi', timeframe: '1day', entryThreshold: 30, exitThreshold: 70 },
  }

  const params = {
    initialCapital: 10000,
    commission: 0.1,
    slippage: 0.05,
    startDate: '2024-01-01',
    endDate: '2024-03-01',
  }

  console.log('\nRunning backtest WITHOUT rule...')
  const res1 = await runBacktest(botBase as Bot, params as any)
  const r1: any = res1
  console.log('Trades:', (r1.trades || []).length)
  console.log('Equity points:', (r1.equityCurve || r1.equity || []).length)

  // Add a simple rule: buy when price < 150 (this will likely trigger some buys)
  const rule = {
    id: 'r1',
    op: 'AND',
    conditions: [
      { id: 'c1', type: 'price', comparator: '<', value: 150 }
    ]
  }

  const botWithRule = { ...botBase, id: 'sample-bot-rule', name: 'Sample RSI Bot w/ Rule', rule }

  console.log('\nRunning backtest WITH rule (price < 150)...')
  const res2 = await runBacktest(botWithRule as Bot, params as any)
  const r2: any = res2
  console.log('Trades:', (r2.trades || []).length)
  console.log('Equity points:', (r2.equityCurve || r2.equity || []).length)

  console.log('\nSample trades (first 5) without rule:')
  console.table((res1.trades || []).slice(0,5))
  console.log('\nSample trades (first 5) with rule:')
  console.table((res2.trades || []).slice(0,5))
}

main().catch((e) => {
  console.error('Error running sample backtests:', e)
  process.exit(1)
})
