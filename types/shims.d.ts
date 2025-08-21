// Lightweight shims to reduce noise from missing third-party typings and legacy globals.

declare module 'lucide-react' {
  // Export commonly referenced icons as `any` to avoid type failures.
  export const Grid2X2: any
  export const Timer: any
  export const ArrowsUpDown: any
  export const ArrowUpDown: any
  export const LineChart: any
  export const Pulse: any
  export const Repeat: any
  export const ChevronDown: any
  export const Package: any
  export const AlarmBell: any
  export const Play: any
  export const Pause: any
  export const BarChart3: any
  export const RefreshCw: any
  export const Info: any
  export const Save: any
  export const AlertTriangle: any
  export const Bot: any
  const _default: any
  export default _default
}

declare module 'recharts' {
  export const CandlestickChart: any
  export const Candlestick: any
  const _default: any
  export default _default
}

declare module '@/lib/market-data' {
  export function getMarketData(...args: any[]): any
  export function fetchHistoricalData(...args: any[]): any
  const _default: any
  export default _default
}

// Small global helpers and legacy variables referenced in multiple files
declare const prevStep: any
declare const nextStep: any

declare global {
  // Backwards-compatible aliases
  function generateEquityCurve(...args: any[]): any
  function generateEquityCurveData(...args: any[]): any
  function generateRollingReturnsData(...args: any[]): any
  function generateTradeDistributionData(...args: any[]): any
  function generateTradeTimingData(...args: any[]): any
  function generateAssetAllocationData(...args: any[]): any
  function generateStrategyAttributionData(...args: any[]): any
  function generateCorrelationData(...args: any[]): any
}

export {}
