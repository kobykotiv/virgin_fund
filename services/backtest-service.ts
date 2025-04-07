import type { BacktestOptions, BacktestResult, IndicatorConfig } from "@/lib/backtesting/types"
import { calculateIndicators } from "@/lib/indicators"
import type { BacktestParams, BacktestResult } from "@/types/backtest";
import type { Bot } from "@/types/bot";

export async function runBacktest(options: BacktestOptions): Promise<BacktestResult> {
  // Fetch historical data
  const data = await fetchHistoricalData(options.symbol, options.startDate, options.endDate, options.timeframe)
  
  // Add indicators if specified
  let enrichedData = data
  if (options.indicators?.length) {
    enrichedData = calculateIndicators(data, options.indicators)
  }

  // Run strategy
  const trades = executeStrategy(enrichedData, options.strategy, options.initialCapital)
  
  // Calculate metrics
  const metrics = calculateMetrics(trades, options.initialCapital)
  
  // Generate equity curve
  const equity = generateEquityCurve(trades, options.initialCapital)

  return {
    trades,
    metrics,
    equity
  }
}

async function fetchHistoricalData(symbol: string, startDate: Date, endDate: Date, timeframe: string) {
  // Implementation depends on your data source (Alpaca, Yahoo, etc.)
  return []
}

function executeStrategy(data: any[], strategy: any, initialCapital: number) {
  switch (strategy.type) {
    case 'Grid':
      return executeGridStrategy(data, strategy.params, initialCapital)
    case 'DCA':
      return executeDCAStrategy(data, strategy.params, initialCapital)
    case 'Indicator':
      return executeIndicatorStrategy(data, strategy.params, initialCapital)
    default:
      throw new Error(`Unknown strategy type: ${strategy.type}`)
  }
}

// ... implement strategy execution functions ...

export async function runBacktest(params: BacktestParams): Promise<BacktestResult> {
  const response = await fetch('/api/backtest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error('Backtest failed');
  }

  return response.json();
}

export async function optimizeStrategy(
  bot: Bot,
  paramName: string,
  rangeStart: number,
  rangeEnd: number,
  steps: number
): Promise<Array<{ value: number; performance: number }>> {
  const response = await fetch('/api/backtest/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bot,
      paramName,
      rangeStart,
      rangeEnd,
      steps
    })
  });

  if (!response.ok) {
    throw new Error('Strategy optimization failed');
  }

  return response.json();
}

export async function saveBacktestResult(
  botId: string, 
  result: BacktestResult
): Promise<void> {
  const response = await fetch(`/api/bots/${botId}/backtest-results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  });

  if (!response.ok) {
    throw new Error('Failed to save backtest result');
  }
}
