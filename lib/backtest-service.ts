import type { Bot, IndicatorConfig, GridConfig, DCAConfig } from "@/types/bot"
import { fetchHistoricalData } from "@/services/market-data-service"

export interface BacktestParams {
  botId: string
  startDate: string
  endDate: string
  initialCapital: number
  slippage?: number // Percentage slippage for more realistic execution
  commission?: number // Commission percentage
  dataSource?: "alpaca" | "yahoo" | "mock" // Source of historical data
}

export interface TradeRecord {
  timestamp: string
  type: "buy" | "sell"
  price: number
  quantity: number
  value: number
  symbol: string
  fees?: number
  slippage?: number
  executionTime?: number // Simulated execution time in ms
}

export interface BacktestResult {
  id: string
  botId: string
  botName: string
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalPnL: number
  pnlPercentage: number
  maxDrawdown: number
  sharpeRatio: number
  trades: TradeRecord[]
  equityCurve: { timestamp: string; equity: number }[]
  assetPerformance: { symbol: string; performance: number }[]
  statistics: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    winRate: number
    averageWin: number
    averageLoss: number
    largestWin: number
    largestLoss: number
    profitFactor: number
    expectancy: number
    annualizedReturn: number
    volatility: number
    sortinoRatio: number
    calmarRatio: number
    maxConsecutiveWins: number
    maxConsecutiveLosses: number
    averageHoldingPeriod: number
    averageDailyReturn: number
  }
  monthlyReturns: { month: string; return: number }[]
  drawdowns: { start: string; end: string; depth: number; duration: number }[]
  optimizationResults?: { parameter: string; value: number; performance: number }[]
}

// Fetch historical market data (real or mock)
async function getHistoricalData(
  symbols: string[],
  startDate: string,
  endDate: string,
  dataSource: "alpaca" | "yahoo" | "mock" = "mock",
): Promise<Record<string, { date: string; open: number; high: number; low: number; close: number; volume: number }[]>> {
  if (dataSource === "mock") {
    return generateMockHistoricalData(symbols, startDate, endDate)
  }

  // Fetch real historical data from the specified source
  try {
    const data: Record<string, any[]> = {}

    for (const symbol of symbols) {
      const historicalData = await fetchHistoricalData(symbol, startDate, endDate, dataSource)
      data[symbol] = historicalData
    }

    return data
  } catch (error) {
    console.error("Error fetching historical data:", error)
    // Fall back to mock data if real data fetch fails
    return generateMockHistoricalData(symbols, startDate, endDate)
  }
}

// Generate mock historical price data
function generateMockHistoricalData(
  symbols: string[],
  startDate: string,
  endDate: string,
): Promise<Record<string, { date: string; open: number; high: number; low: number; close: number; volume: number }[]>> {
  return new Promise((resolve) => {
    const result: Record<string, any[]> = {}

    for (const symbol of symbols) {
      result[symbol] = generateHistoricalPrices(symbol, startDate, endDate)
    }

    resolve(result)
  })
}

// Mock historical price data generator (enhanced with OHLCV)
function generateHistoricalPrices(
  symbol: string,
  startDate: string,
  endDate: string,
  volatility = 0.015,
): { date: string; open: number; high: number; low: number; close: number; volume: number }[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // Base price for different assets
  let basePrice = 100
  if (symbol === "AAPL") basePrice = 180
  else if (symbol === "MSFT") basePrice = 350
  else if (symbol === "GOOGL") basePrice = 130
  else if (symbol === "AMZN") basePrice = 140
  else if (symbol === "TSLA") basePrice = 240
  else if (symbol === "BTC-USD") basePrice = 35000
  else if (symbol === "ETH-USD") basePrice = 2000
  else if (symbol === "SPY") basePrice = 450
  else if (symbol === "QQQ") basePrice = 380
  else if (symbol === "VTI") basePrice = 220

  const prices = []
  let prevClose = basePrice

  for (let i = 0; i < days; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)

    // Skip weekends for stocks (not for crypto)
    const day = date.getDay()
    if (!symbol.includes("-USD") && (day === 0 || day === 6)) {
      continue
    }

    // Generate OHLC with realistic relationships
    const change = (Math.random() * 2 - 1) * volatility * prevClose
    const drift = 0.0001 * prevClose // Small upward drift

    const open = prevClose
    const direction = Math.random() > 0.5 ? 1 : -1
    const range = Math.random() * volatility * open

    let close = open + change + drift
    const high = Math.max(open, close) + range * 0.5
    let low = Math.min(open, close) - range * 0.5

    // Ensure minimum price is above zero
    if (low <= 0) low = 0.01
    if (close <= 0) close = 0.01

    // Generate realistic volume (higher on volatile days)
    const volumeBase = symbol.includes("-USD") ? 1000000 : 10000000
    const volumeVariation = Math.abs(high - low) / open
    const volume = Math.round(volumeBase * (1 + volumeVariation * 10))

    prices.push({
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume,
    })

    prevClose = close
  }

  return prices
}

// Calculate technical indicators
function calculateIndicators(
  prices: { date: string; open: number; high: number; low: number; close: number; volume: number }[],
  config: IndicatorConfig,
) {
  const result: Record<string, number[]> = {}

  switch (config.type) {
    case "rsi":
      result.rsi = calculateRSI(
        prices.map((p) => p.close),
        config.entryThreshold,
      )
      break
    case "macd":
      const macdResult = calculateMACD(prices.map((p) => p.close))
      result.macd = macdResult.macd
      result.signal = macdResult.signal
      result.histogram = macdResult.histogram
      break
    case "bollinger":
      const bollingerResult = calculateBollingerBands(prices.map((p) => p.close))
      result.upper = bollingerResult.upper
      result.middle = bollingerResult.middle
      result.lower = bollingerResult.lower
      break
  }

  return result
}

// Calculate RSI
function calculateRSI(prices: number[], period = 14): number[] {
  const rsi: number[] = []
  const gains: number[] = []
  const losses: number[] = []

  // Initialize with empty values for the first period
  for (let i = 0; i < period; i++) {
    rsi.push(0)
  }

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)

    if (i >= period) {
      const avgGain = gains.slice(-period).reduce((sum, val) => sum + val, 0) / period
      const avgLoss = losses.slice(-period).reduce((sum, val) => sum + val, 0) / period

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
      const rsiValue = 100 - 100 / (1 + rs)

      rsi.push(rsiValue)
    }
  }

  return rsi
}

// Calculate MACD
function calculateMACD(
  prices: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema12 = calculateEMA(prices, fastPeriod)
  const ema26 = calculateEMA(prices, slowPeriod)

  const macd: number[] = []

  for (let i = 0; i < prices.length; i++) {
    if (i < Math.max(fastPeriod, slowPeriod) - 1) {
      macd.push(0)
    } else {
      macd.push(ema12[i] - ema26[i])
    }
  }

  const signal = calculateEMA(macd, signalPeriod)
  const histogram: number[] = []

  for (let i = 0; i < macd.length; i++) {
    histogram.push(macd[i] - signal[i])
  }

  return { macd, signal, histogram }
}

// Calculate EMA
function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)

  // Start with SMA
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += prices[i]
    ema.push(0)
  }

  ema[period - 1] = sum / period

  // Calculate EMA
  for (let i = period; i < prices.length; i++) {
    ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1])
  }

  return ema
}

// Calculate Bollinger Bands
function calculateBollingerBands(
  prices: number[],
  period = 20,
  stdDev = 2,
): { upper: number[]; middle: number[]; lower: number[] } {
  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(0)
      middle.push(0)
      lower.push(0)
    } else {
      const slice = prices.slice(i - period + 1, i + 1)
      const sma = slice.reduce((sum, price) => sum + price, 0) / period

      const squaredDiffs = slice.map((price) => Math.pow(price - sma, 2))
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / period
      const sd = Math.sqrt(variance)

      upper.push(sma + stdDev * sd)
      middle.push(sma)
      lower.push(sma - stdDev * sd)
    }
  }

  return { upper, middle, lower }
}

// Simulate trades based on bot type and historical prices
async function simulateTrades(
  bot: Bot,
  historicalData: Record<
    string,
    { date: string; open: number; high: number; low: number; close: number; volume: number }[]
  >,
  params: BacktestParams,
): Promise<{
  trades: TradeRecord[]
  equityCurve: { timestamp: string; equity: number }[]
}> {
  const trades: TradeRecord[] = []
  const equityCurve: { timestamp: string; equity: number }[] = []

  const cash = params.initialCapital
  const positions: Record<string, number> = {}
  bot.assets.forEach((symbol) => (positions[symbol] = 0))

  // Get all dates from the first asset (assuming all assets have the same date range)
  const firstAsset = Object.keys(historicalData)[0]
  const dates = historicalData[firstAsset].map((p) => p.date)

  // Initialize equity curve with starting capital
  equityCurve.push({
    timestamp: dates[0],
    equity: params.initialCapital,
  })

  // Different simulation logic based on bot type
  switch (bot.type) {
    case "indicator":
      await simulateIndicatorStrategy(bot, historicalData, params, cash, positions, trades, equityCurve)
      break
    case "grid":
      await simulateGridStrategy(bot, historicalData, params, cash, positions, trades, equityCurve)
      break
    case "dca":
      await simulateDCAStrategy(bot, historicalData, params, cash, positions, trades, equityCurve)
      break
    case "basket":
      await simulateBasketStrategy(bot, historicalData, params, cash, positions, trades, equityCurve)
      break
  }

  return { trades, equityCurve }
}

// Simulate indicator-based strategy
async function simulateIndicatorStrategy(
  bot: Bot,
  historicalData: Record<string, any[]>,
  params: BacktestParams,
  cash: number,
  positions: Record<string, number>,
  trades: TradeRecord[],
  equityCurve: { timestamp: string; equity: number }[],
): Promise<void> {
  if (!bot.indicatorConfig) return

  const symbol = bot.assets[0] // Use first asset for indicator strategy
  const prices = historicalData[symbol]

  // Calculate indicators
  const indicators = calculateIndicators(prices, bot.indicatorConfig)

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i].close
    let signal = "none"

    // Generate trading signals based on indicator type
    switch (bot.indicatorConfig.type) {
      case "rsi":
        if (indicators.rsi[i] <= bot.indicatorConfig.entryThreshold && positions[symbol] === 0) {
          signal = "buy"
        } else if (indicators.rsi[i] >= bot.indicatorConfig.exitThreshold && positions[symbol] > 0) {
          signal = "sell"
        }
        break
      case "macd":
        // Buy when MACD crosses above signal line
        if (indicators.histogram[i] > 0 && indicators.histogram[i - 1] <= 0 && positions[symbol] === 0) {
          signal = "buy"
        }
        // Sell when MACD crosses below signal line
        else if (indicators.histogram[i] < 0 && indicators.histogram[i - 1] >= 0 && positions[symbol] > 0) {
          signal = "sell"
        }
        break
      case "bollinger":
        // Buy when price touches lower band
        if (price <= indicators.lower[i] && positions[symbol] === 0) {
          signal = "buy"
        }
        // Sell when price touches upper band
        else if (price >= indicators.upper[i] && positions[symbol] > 0) {
          signal = "sell"
        }
        break
    }

    // Execute trades based on signals
    if (signal === "buy") {
      const quantity = Math.floor((cash * 0.95) / price) // Use 95% of available cash

      if (quantity > 0) {
        const value = quantity * price
        const fees = (value * (params.commission || 0)) / 100
        const slippage = (value * (params.slippage || 0)) / 100

        cash -= value + fees + slippage
        positions[symbol] += quantity

        trades.push({
          timestamp: prices[i].date,
          type: "buy",
          price,
          quantity,
          value,
          symbol,
          fees,
          slippage,
        })
      }
    } else if (signal === "sell") {
      const quantity = positions[symbol]
      const value = quantity * price
      const fees = (value * (params.commission || 0)) / 100
      const slippage = (value * (params.slippage || 0)) / 100

      cash += value - fees - slippage
      positions[symbol] = 0

      trades.push({
        timestamp: prices[i].date,
        type: "sell",
        price,
        quantity,
        value,
        symbol,
        fees,
        slippage,
      })
    }

    // Apply stop loss and take profit if configured
    if (positions[symbol] > 0) {
      const lastBuyTrade = trades.filter((t) => t.type === "buy" && t.symbol === symbol).pop()

      if (lastBuyTrade && bot.stopLoss) {
        const stopPrice = lastBuyTrade.price * (1 - bot.stopLoss / 100)

        if (price <= stopPrice) {
          // Execute stop loss
          const quantity = positions[symbol]
          const value = quantity * price
          const fees = (value * (params.commission || 0)) / 100
          const slippage = (value * (params.slippage || 0)) / 100

          cash += value - fees - slippage
          positions[symbol] = 0

          trades.push({
            timestamp: prices[i].date,
            type: "sell",
            price,
            quantity,
            value,
            symbol,
            fees,
            slippage,
          })
        }
      }

      if (lastBuyTrade && bot.takeProfit) {
        const takeProfitPrice = lastBuyTrade.price * (1 + bot.takeProfit / 100)

        if (price >= takeProfitPrice) {
          // Execute take profit
          const quantity = positions[symbol]
          const value = quantity * price
          const fees = (value * (params.commission || 0)) / 100
          const slippage = (value * (params.slippage || 0)) / 100

          cash += value - fees - slippage
          positions[symbol] = 0

          trades.push({
            timestamp: prices[i].date,
            type: "sell",
            price,
            quantity,
            value,
            symbol,
            fees,
            slippage,
          })
        }
      }
    }

    // Update equity curve
    let equity = cash
    for (const [sym, qty] of Object.entries(positions)) {
      if (qty > 0) {
        equity += qty * price
      }
    }

    equityCurve.push({
      timestamp: prices[i].date,
      equity,
    })
  }
}

// Simulate grid trading strategy
async function simulateGridStrategy(
  bot: Bot,
  historicalData: Record<string, any[]>,
  params: BacktestParams,
  cash: number,
  positions: Record<string, number>,
  trades: TradeRecord[],
  equityCurve: { timestamp: string; equity: number }[],
): Promise<void> {
  if (!bot.gridConfig) return

  const symbol = bot.assets[0] // Use first asset for grid strategy
  const prices = historicalData[symbol]

  const gridSize = bot.gridConfig.gridSize / 100 // Convert percentage to decimal
  const upperLimit = bot.gridConfig.upperLimit
  const lowerLimit = bot.gridConfig.lowerLimit
  const quantity = bot.gridConfig.quantity

  // Create grid levels
  const levels: number[] = []
  let currentLevel = lowerLimit

  while (currentLevel <= upperLimit) {
    levels.push(currentLevel)
    currentLevel = currentLevel * (1 + gridSize)
  }

  // Track which grid levels have been bought
  const boughtLevels: Record<number, boolean> = {}

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i].close

    // Check each grid level
    for (const level of levels) {
      // If price crosses below a level and we haven't bought at this level
      if (price <= level && prices[i - 1].close > level && !boughtLevels[level]) {
        // Buy at this level
        const value = quantity * price
        const fees = (value * (params.commission || 0)) / 100
        const slippage = (value * (params.slippage || 0)) / 100

        if (cash >= value + fees + slippage) {
          cash -= value + fees + slippage
          positions[symbol] += quantity
          boughtLevels[level] = true

          trades.push({
            timestamp: prices[i].date,
            type: "buy",
            price,
            quantity,
            value,
            symbol,
            fees,
            slippage,
          })
        }
      }
      // If price crosses above a level and we have bought at this level
      else if (price >= level * (1 + gridSize) && boughtLevels[level]) {
        // Sell at this level + grid size
        const sellPrice = level * (1 + gridSize)
        const value = quantity * sellPrice
        const fees = (value * (params.commission || 0)) / 100
        const slippage = (value * (params.slippage || 0)) / 100

        cash += value - fees - slippage
        positions[symbol] -= quantity
        boughtLevels[level] = false

        trades.push({
          timestamp: prices[i].date,
          type: "sell",
          price: sellPrice,
          quantity,
          value,
          symbol,
          fees,
          slippage,
        })
      }
    }

    // Update equity curve
    let equity = cash
    for (const [sym, qty] of Object.entries(positions)) {
      if (qty > 0) {
        equity += qty * price
      }
    }

    equityCurve.push({
      timestamp: prices[i].date,
      equity,
    })
  }
}

// Simulate DCA strategy
async function simulateDCAStrategy(
  bot: Bot,
  historicalData: Record<string, any[]>,
  params: BacktestParams,
  cash: number,
  positions: Record<string, number>,
  trades: TradeRecord[],
  equityCurve: { timestamp: string; equity: number }[],
): Promise<void> {
  if (!bot.dcaConfig) return

  const symbol = bot.assets[0] // Use first asset for DCA strategy
  const prices = historicalData[symbol]

  const amount = bot.dcaConfig.amount

  // Determine purchase interval in days
  let intervalDays = 7 // Default to weekly
  if (bot.dcaConfig.interval.includes("* * *"))
    intervalDays = 1 // Daily
  else if (bot.dcaConfig.interval.includes("* * 1"))
    intervalDays = 7 // Weekly
  else if (bot.dcaConfig.interval.includes("1 * *")) intervalDays = 30 // Monthly

  let lastBuyPrice = null;

  for (let i = 0; i < prices.length; i += intervalDays) {
    if (i >= prices.length) break

    const price = prices[i].close
    const quantity = amount / price

    // Check stop loss / take profit before buying (if holding)
    if (positions[symbol] > 0 && lastBuyPrice !== null) {
      let shouldSell = false;
      let reason = "";
      if (bot.stopLoss) {
        const stopPrice = lastBuyPrice * (1 - bot.stopLoss / 100);
        if (price <= stopPrice) {
          shouldSell = true;
          reason = "stopLoss";
        }
      }
      if (!shouldSell && bot.takeProfit) {
        const takeProfitPrice = lastBuyPrice * (1 + bot.takeProfit / 100);
        if (price >= takeProfitPrice) {
          shouldSell = true;
          reason = "takeProfit";
        }
      }
      if (shouldSell) {
        const sellQty = positions[symbol];
        const value = sellQty * price;
        const fees = (value * (params.commission || 0)) / 100;
        const slippage = (value * (params.slippage || 0)) / 100;
        cash += value - fees - slippage;
        positions[symbol] = 0;
        trades.push({
          timestamp: prices[i].date,
          type: "sell",
          price,
          quantity: sellQty,
          value,
          symbol,
          fees,
          slippage,
        });
        lastBuyPrice = null;
      }
    }

    if (cash >= amount) {
      const fees = (amount * (params.commission || 0)) / 100
      const slippage = (amount * (params.slippage || 0)) / 100

      cash -= amount + fees + slippage
      positions[symbol] += quantity
      lastBuyPrice = price

      trades.push({
        timestamp: prices[i].date,
        type: "buy",
        price,
        quantity,
        value: amount,
        symbol,
        fees,
        slippage,
      })
    }

    // Update equity curve
    let equity = cash
    for (const [sym, qty] of Object.entries(positions)) {
      if (qty > 0) {
        equity += qty * price
      }
    }

    equityCurve.push({
      timestamp: prices[i].date,
      equity,
    })
  }
}

// Simulate basket trading strategy
async function simulateBasketStrategy(
  bot: Bot,
  historicalData: Record<string, any[]>,
  params: BacktestParams,
  cash: number,
  positions: Record<string, number>,
  trades: TradeRecord[],
  equityCurve: { timestamp: string; equity: number }[],
): Promise<void> {
  if (!bot.basketConfig) return

  const rebalancePeriod = 30 // Default to monthly rebalance
  const allocation = bot.basketConfig.targetAllocation

  // Get all dates
  const allDates = Object.values(historicalData)[0]
    .map((p) => p.date)
    .sort()

  // Initial purchase based on allocation
  for (const [symbol, alloc] of Object.entries(allocation)) {
    if (historicalData[symbol] && historicalData[symbol].length > 0) {
      const initialPrice = historicalData[symbol][0].close
      const value = params.initialCapital * alloc
      const quantity = value / initialPrice
      const fees = (value * (params.commission || 0)) / 100
      const slippage = (value * (params.slippage || 0)) / 100

      cash -= value + fees + slippage
      positions[symbol] = quantity

      trades.push({
        timestamp: allDates[0],
        type: "buy",
        price: initialPrice,
        quantity,
        value,
        symbol,
        fees,
        slippage,
      })
    }
  }

  // Rebalance periodically
  for (let i = rebalancePeriod; i < allDates.length; i += rebalancePeriod) {
    // Calculate current portfolio value
    let portfolioValue = cash
    const currentPositionValue: Record<string, number> = {}

    for (const [symbol, qty] of Object.entries(positions)) {
      if (qty > 0 && historicalData[symbol]) {
        const priceIndex = historicalData[symbol].findIndex((p) => p.date === allDates[i])
        if (priceIndex >= 0) {
          const currentPrice = historicalData[symbol][priceIndex].close
          const value = qty * currentPrice
          portfolioValue += value
          currentPositionValue[symbol] = value
        }
      }
    }

    // Rebalance each asset
    for (const [symbol, targetAlloc] of Object.entries(allocation)) {
      if (historicalData[symbol]) {
        const priceIndex = historicalData[symbol].findIndex((p) => p.date === allDates[i])

        if (priceIndex >= 0) {
          const currentPrice = historicalData[symbol][priceIndex].close
          const targetValue = portfolioValue * targetAlloc
          const currentValue = currentPositionValue[symbol] || 0

          if (Math.abs(targetValue - currentValue) / portfolioValue > 0.05) {
            // 5% threshold
            if (targetValue > currentValue) {
              // Need to buy more
              const buyValue = targetValue - currentValue
              const buyQty = buyValue / currentPrice
              const fees = (buyValue * (params.commission || 0)) / 100
              const slippage = (buyValue * (params.slippage || 0)) / 100

              if (cash >= buyValue + fees + slippage) {
                cash -= buyValue + fees + slippage
                positions[symbol] = (positions[symbol] || 0) + buyQty

                trades.push({
                  timestamp: allDates[i],
                  type: "buy",
                  price: currentPrice,
                  quantity: buyQty,
                  value: buyValue,
                  symbol,
                  fees,
                  slippage,
                })
              }
            } else {
              // Need to sell some
              const sellValue = currentValue - targetValue
              const sellQty = sellValue / currentPrice
              const fees = (sellValue * (params.commission || 0)) / 100
              const slippage = (sellValue * (params.slippage || 0)) / 100

              cash += sellValue - fees - slippage
              positions[symbol] -= sellQty

              trades.push({
                timestamp: allDates[i],
                type: "sell",
                price: currentPrice,
                quantity: sellQty,
                value: sellValue,
                symbol,
                fees,
                slippage,
              })
            }
          }
        }
      }
    }

    // Update equity curve
    let equity = cash
    for (const [symbol, qty] of Object.entries(positions)) {
      if (qty > 0 && historicalData[symbol]) {
        const priceIndex = historicalData[symbol].findIndex((p) => p.date === allDates[i])
        if (priceIndex >= 0) {
          equity += qty * historicalData[symbol][priceIndex].close
        }
      }
    }

    equityCurve.push({
      timestamp: allDates[i],
      equity,
    })
  }
}

// Calculate performance metrics
function calculateMetrics(
  trades: TradeRecord[],
  equityCurve: { timestamp: string; equity: number }[],
  initialCapital: number,
  startDate: string,
  endDate: string,
): {
  finalCapital: number
  totalPnL: number
  pnlPercentage: number
  maxDrawdown: number
  sharpeRatio: number
  assetPerformance: { symbol: string; performance: number }[]
  statistics: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    winRate: number
    averageWin: number
    averageLoss: number
    largestWin: number
    largestLoss: number
    profitFactor: number
    expectancy: number
    annualizedReturn: number
    volatility: number
    sortinoRatio: number
    calmarRatio: number
    maxConsecutiveWins: number
    maxConsecutiveLosses: number
    averageHoldingPeriod: number
    averageDailyReturn: number
  }
  monthlyReturns: { month: string; return: number }[]
  drawdowns: { start: string; end: string; depth: number; duration: number }[]
} {
  // Calculate final capital
  const finalCapital = equityCurve.length > 0 ? equityCurve[equityCurve.length - 1].equity : initialCapital

  // Calculate P&L
  const totalPnL = finalCapital - initialCapital
  const pnlPercentage = (totalPnL / initialCapital) * 100

  // Calculate max drawdown
  let maxDrawdown = 0
  let peak = initialCapital
  const drawdowns: { start: string; end: string; depth: number; duration: number }[] = []
  let currentDrawdownStart: string | null = null

  for (let i = 0; i < equityCurve.length; i++) {
    const point = equityCurve[i]

    if (point.equity > peak) {
      // New peak, end any current drawdown
      if (currentDrawdownStart) {
        const startIndex = equityCurve.findIndex((p) => p.timestamp === currentDrawdownStart)
        const duration = i - startIndex
        const depth = ((peak - equityCurve[i - 1].equity) / peak) * 100

        drawdowns.push({
          start: currentDrawdownStart,
          end: equityCurve[i - 1].timestamp,
          depth,
          duration,
        })

        currentDrawdownStart = null
      }

      peak = point.equity
    }

    const drawdown = ((peak - point.equity) / peak) * 100

    if (drawdown > 0 && !currentDrawdownStart) {
      currentDrawdownStart = point.timestamp
    }

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  // Calculate returns for Sharpe ratio
  const dailyReturns: number[] = []
  for (let i = 1; i < equityCurve.length; i++) {
    const dailyReturn = (equityCurve[i].equity - equityCurve[i - 1].equity) / equityCurve[i - 1].equity
    dailyReturns.push(dailyReturn)
  }

  const avgDailyReturn = dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length
  const stdDev = Math.sqrt(
    dailyReturns.reduce((sum, val) => sum + Math.pow(val - avgDailyReturn, 2), 0) / dailyReturns.length,
  )

  // Calculate Sharpe ratio (annualized)
  const sharpeRatio = stdDev === 0 ? 0 : (avgDailyReturn / stdDev) * Math.sqrt(252)

  // Calculate Sortino ratio (downside deviation only)
  const downsideReturns = dailyReturns.filter((r) => r < 0)
  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce((sum, val) => sum + Math.pow(val, 2), 0) / (downsideReturns.length || 1),
  )
  const sortinoRatio = downsideDeviation === 0 ? 0 : (avgDailyReturn / downsideDeviation) * Math.sqrt(252)

  // Calculate Calmar ratio (return / max drawdown)
  const annualizedReturn = Math.pow(finalCapital / initialCapital, 252 / equityCurve.length) - 1
  const calmarRatio = maxDrawdown === 0 ? 0 : annualizedReturn / (maxDrawdown / 100)

  // Calculate asset performance
  const assetPerformance: { symbol: string; performance: number }[] = []
  const symbolMap: Record<string, { buys: number; sells: number; buyValue: number; sellValue: number }> = {}

  for (const trade of trades) {
    if (!symbolMap[trade.symbol]) {
      symbolMap[trade.symbol] = { buys: 0, sells: 0, buyValue: 0, sellValue: 0 }
    }

    if (trade.type === "buy") {
      symbolMap[trade.symbol].buys += trade.quantity
      symbolMap[trade.symbol].buyValue += trade.value
    } else {
      symbolMap[trade.symbol].sells += trade.quantity
      symbolMap[trade.symbol].sellValue += trade.value
    }
  }

  for (const [symbol, data] of Object.entries(symbolMap)) {
    const performance = data.buyValue === 0 ? 0 : ((data.sellValue - data.buyValue) / data.buyValue) * 100
    assetPerformance.push({ symbol, performance })
  }

  // Calculate monthly returns
  const monthlyReturns: { month: string; return: number }[] = []
  let currentMonth = ""
  let monthStartEquity = initialCapital

  for (const point of equityCurve) {
    const month = point.timestamp.substring(0, 7) // YYYY-MM format

    if (month !== currentMonth) {
      if (currentMonth !== "") {
        const monthReturn = ((monthStartEquity - initialCapital) / initialCapital) * 100
        monthlyReturns.push({ month: currentMonth, return: monthReturn })
      }

      currentMonth = month
      monthStartEquity = point.equity
    }
  }

  // Add the last month
  if (currentMonth !== "") {
    const lastEquity = equityCurve[equityCurve.length - 1].equity
    const monthReturn = ((lastEquity - monthStartEquity) / monthStartEquity) * 100
    monthlyReturns.push({ month: currentMonth, return: monthReturn })
  }

  // Calculate trade statistics
  const tradeResults: number[] = []
  let winningTrades = 0
  let losingTrades = 0
  let totalWins = 0
  let totalLosses = 0
  let largestWin = 0
  let largestLoss = 0
  let consecutiveWins = 0
  let consecutiveLosses = 0
  let maxConsecutiveWins = 0
  let maxConsecutiveLosses = 0
  let totalHoldingPeriod = 0

  // Pair buys with sells to calculate trade results
  const openPositions: Record<string, { price: number; quantity: number; timestamp: string }[]> = {}

  for (const trade of trades) {
    if (!openPositions[trade.symbol]) {
      openPositions[trade.symbol] = []
    }

    if (trade.type === "buy") {
      openPositions[trade.symbol].push({
        price: trade.price,
        quantity: trade.quantity,
        timestamp: trade.timestamp,
      })
    } else {
      // sell
      let remainingQty = trade.quantity

      while (remainingQty > 0 && openPositions[trade.symbol].length > 0) {
        const position = openPositions[trade.symbol][0]

        const qtyToClose = Math.min(position.quantity, remainingQty)
        const pnl = (trade.price - position.price) * qtyToClose

        // Calculate holding period in days
        const buyDate = new Date(position.timestamp)
        const sellDate = new Date(trade.timestamp)
        const holdingPeriod = Math.ceil((sellDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24))
        totalHoldingPeriod += holdingPeriod

        tradeResults.push(pnl)

        if (pnl > 0) {
          winningTrades++
          totalWins += pnl
          largestWin = Math.max(largestWin, pnl)
          consecutiveWins++
          consecutiveLosses = 0
          maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins)
        } else {
          losingTrades++
          totalLosses += Math.abs(pnl)
          largestLoss = Math.max(largestLoss, Math.abs(pnl))
          consecutiveLosses++
          consecutiveWins = 0
          maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses)
        }

        position.quantity -= qtyToClose
        remainingQty -= qtyToClose

        if (position.quantity === 0) {
          openPositions[trade.symbol].shift()
        }
      }
    }
  }

  const totalTrades = winningTrades + losingTrades
  const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0
  const averageWin = winningTrades > 0 ? totalWins / winningTrades : 0
  const averageLoss = losingTrades > 0 ? totalLosses / losingTrades : 0
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Number.POSITIVE_INFINITY : 0
  const expectancy = winRate * averageWin - (1 - winRate) * averageLoss
  const averageHoldingPeriod = totalTrades > 0 ? totalHoldingPeriod / totalTrades : 0

  return {
    finalCapital,
    totalPnL,
    pnlPercentage,
    maxDrawdown,
    sharpeRatio,
    assetPerformance,
    statistics: {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      profitFactor,
      expectancy,
      annualizedReturn,
      volatility: stdDev * Math.sqrt(252), // Annualized volatility
      sortinoRatio,
      calmarRatio,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      averageHoldingPeriod,
      averageDailyReturn: avgDailyReturn,
    },
    monthlyReturns,
    drawdowns,
  }
}

// Main backtesting function
export async function runBacktest(bot: Bot, params: BacktestParams): Promise<BacktestResult> {
  // Get historical price data for each asset
  const historicalData = await getHistoricalData(bot.assets, params.startDate, params.endDate, params.dataSource)

  // Simulate trades based on bot type and strategy
  const { trades, equityCurve } = await simulateTrades(bot, historicalData, params)

  // Calculate performance metrics
  const metrics = calculateMetrics(trades, equityCurve, params.initialCapital, params.startDate, params.endDate)

  // Return complete backtest result
  return {
    id: Math.random().toString(36).substring(2, 9),
    botId: bot.id,
    botName: bot.name,
    startDate: params.startDate,
    endDate: params.endDate,
    initialCapital: params.initialCapital,
    trades,
    equityCurve,
    ...metrics,
  }
}

// Optimize strategy parameters
export async function optimizeStrategy(
  bot: Bot,
  params: BacktestParams,
  paramToOptimize: string,
  rangeStart: number,
  rangeEnd: number,
  steps: number,
): Promise<{ parameter: string; value: number; performance: number }[]> {
  const step = (rangeEnd - rangeStart) / steps;
  const tasks: Promise<{ parameter: string; value: number; performance: number }>[] = [];

  for (let i = 0; i <= steps; i++) {
    const paramValue = rangeStart + step * i;
    const botCopy = JSON.parse(JSON.stringify(bot)) as Bot;

    // Update the parameter to optimize
    if (paramToOptimize.startsWith("indicator.")) {
      const indicatorParam = paramToOptimize.split(".")[1];
      if (botCopy.indicatorConfig && (indicatorParam in botCopy.indicatorConfig)) {
        (botCopy.indicatorConfig as any)[indicatorParam] = paramValue;
      }
    } else if (paramToOptimize.startsWith("grid.")) {
      const gridParam = paramToOptimize.split(".")[1];
      if (botCopy.gridConfig && (gridParam in botCopy.gridConfig)) {
        (botCopy.gridConfig as any)[gridParam] = paramValue;
      }
    } else if (paramToOptimize.startsWith("dca.")) {
      const dcaParam = paramToOptimize.split(".")[1];
      if (botCopy.dcaConfig && (dcaParam in botCopy.dcaConfig)) {
        (botCopy.dcaConfig as any)[dcaParam] = paramValue;
      }
    } else if (paramToOptimize === "stopLoss") {
      botCopy.stopLoss = paramValue;
    } else if (paramToOptimize === "takeProfit") {
      botCopy.takeProfit = paramValue;
    }

    // Prepare parallel backtest task
    const task = runBacktest(botCopy, params).then((result) => ({
      parameter: paramToOptimize,
      value: paramValue,
      performance: result.sharpeRatio,
    }));
    tasks.push(task);
  }

  const results = await Promise.all(tasks);

  // Sort results by performance
  return results.sort((a, b) => b.performance - a.performance);
}

// Get saved backtest results
export async function getSavedBacktests(): Promise<BacktestResult[]> {
  // In a real app, this would fetch from a database
  const savedResults = localStorage.getItem("savedBacktests")
  return savedResults ? JSON.parse(savedResults) : []
}

// Save backtest result
export async function saveBacktestResult(result: BacktestResult): Promise<void> {
  // In a real app, this would save to a database
  const savedResults = localStorage.getItem("savedBacktests")
  const results = savedResults ? JSON.parse(savedResults) : []
  results.push(result)
  localStorage.setItem("savedBacktests", JSON.stringify(results))
}

// Compare multiple backtest results
export async function compareBacktests(resultIds: string[]): Promise<BacktestResult[]> {
  const savedResults = await getSavedBacktests()
  return savedResults.filter((result) => resultIds.includes(result.id))
}
