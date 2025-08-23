/**
 * Minimal implementation for scripts/process_backtests used by tests.
 * Supports:
 *  - passing an array of equity numbers -> returns { total_return, max_drawdown }
 *  - passing an object with trades -> returns { win_rate }
 *
 * This is intentionally permissive and typed as `any` to keep tests and tsc happy
 * while the full implementation lives elsewhere.
 */

export function computeSummary(backtests: any): any {
  // If input is an array of equity points (numbers)
  if (Array.isArray(backtests) && backtests.length > 0 && typeof backtests[0] === "number") {
    const equity = backtests as number[]
    const first = equity[0]
    const last = equity[equity.length - 1]
    const total_return = first ? ((last - first) / first) * 100 : 0

    // compute max drawdown in percentage
    let peak = equity[0]
    let maxDrawdown = 0
    for (const v of equity) {
      if (v > peak) peak = v
      const drawdown = peak > 0 ? ((peak - v) / peak) * 100 : 0
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }

    return {
      total_return,
      max_drawdown: maxDrawdown,
    }
  }

  // If input is an object with trades
  if (backtests && typeof backtests === "object" && Array.isArray(backtests.trades)) {
    const trades = backtests.trades as Array<{ pnl?: number }>
    const wins = trades.filter((t) => (t?.pnl ?? 0) > 0).length
    const total = trades.length || 1
    const win_rate = (wins / total) * 100
    return { win_rate }
  }

  // Fallback minimal summary
  return {
    total_return: 0,
    max_drawdown: 0,
    win_rate: 0,
  }
}
