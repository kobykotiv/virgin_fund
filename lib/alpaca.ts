import fetch from 'node-fetch'

export type Bar = { t: string; o: number; h: number; l: number; c: number; v?: number }

type Allocation = { symbol: string; percent: number }

export async function deployVirtualOrdersToAlpaca(portfolio: { tickers: string[]; allocations: Allocation[]; funds: number }) {
  // This helper simulates placing paper orders. If environment variables for Alpaca are set,
  // it can optionally call the Alpaca paper trading API. For security we do not store credentials here.

  const { tickers, allocations, funds } = portfolio
  const orders = allocations.map((a) => {
    const amount = Math.max(1, Math.round((a.percent / 100) * funds))
    return {
      symbol: a.symbol,
      allocationPct: a.percent,
      notional: amount,
      side: 'buy',
      type: 'market',
    }
  })

  // If ALPACA_BASE_URL environment variables are provided, attempt to place as paper orders
  const ALPACA_KEY = process.env.ALPACA_API_KEY
  const ALPACA_SECRET = process.env.ALPACA_API_SECRET
  const ALPACA_BASE = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets'

  if (ALPACA_KEY && ALPACA_SECRET) {
    // Place orders sequentially (small portfolios) — in production use a proper client and error handling
    const placed: any[] = []
    for (const o of orders) {
      try {
        const res = await fetch(`${ALPACA_BASE}/v2/orders`, {
          method: 'POST',
          headers: {
            'APCA-API-KEY-ID': ALPACA_KEY,
            'APCA-API-SECRET-KEY': ALPACA_SECRET,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: o.symbol,
            notional: String(o.notional),
            side: o.side,
            type: o.type,
            time_in_force: 'day',
          }),
        })
        const json = await res.json()
        placed.push({ order: json })
      } catch (e) {
        placed.push({ error: (e as Error).message })
      }
    }

    return { sim: false, placed }
  }

  // Otherwise return a simulation result
  return { sim: true, orders }
}

// Minimal adapter to satisfy existing imports (adapter.getBars)
const adapter = {
  async getBars(symbol: string, start: string, end: string, timeframe = '1Day'): Promise<Bar[]> {
    // Very small shim: in production this should call a provider or Alpaca market data API
    // Return synthetic daily bars between start and end with a flat price for safety in tests
    const s = new Date(start)
    const e = new Date(end)
    const days = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)))
    const out: Bar[] = []
    for (let i = 0; i <= days; i++) {
      const d = new Date(s.getTime() + i * 24 * 60 * 60 * 1000)
      out.push({ t: d.toISOString(), o: 100 + i, h: 101 + i, l: 99 + i, c: 100 + i, v: 1000 })
    }
    return out
  }
}

export default adapter
