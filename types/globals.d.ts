import type { Position as _Position } from './portfolio'

// Expose a few permissive global types and functions used in various legacy components.
// These are intentionally loose and can be tightened later.

declare global {
  // Re-exported position type for files that reference Position without importing.
  type Position = _Position | any

  // Backtest options shape used in some components
  type BacktestOptions = any

  // Ambient generator helpers referenced in enhanced-dashboard
  function generateEquityCurveData(bot: any): any
  function generateRollingReturnsData(bot: any): any
  function generateTradeDistributionData(bot: any): any
  function generateTradeTimingData(bot: any): any
  function generateAssetAllocationData(bot: any): any
  function generateStrategyAttributionData(bot: any): any
  function generateCorrelationData(bot: any): any
}

export {}
