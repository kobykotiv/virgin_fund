import type { Bot } from '@/types/api'

export type BasketItem = { symbol: string; weightPct: number }

export function buildBasketBot(opts: { name?: string; currency?: Bot['currency']; items: BasketItem[]; totalAllocation?: number }) {
  const { name = `basket-${Math.random().toString(36).slice(2, 8)}`, currency = 'USD', items, totalAllocation = 1000 } = opts

  // normalize weights
  const total = items.reduce((s, it) => s + (it.weightPct || 0), 0) || 0
  const normalized = items.map((it) => ({ symbol: it.symbol, pct: total > 0 ? (it.weightPct / total) : (1 / items.length) }))

  // convert to assets array with individual allocations (for preview)
  const assets = normalized.map((n) => `${n.symbol}:${(n.pct * totalAllocation).toFixed(2)}`)

  const bot: Bot = {
    id: 'bot_' + Math.random().toString(36).slice(2),
    name,
    strategy: 'portfolio',
    assets: assets,
    allocation: totalAllocation,
    currency,
    status: 'paused',
    createdAt: new Date().toISOString(),
    ownerId: 'builder',
  }

  return bot
}
