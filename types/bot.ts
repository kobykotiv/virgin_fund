// Re-export canonical API types so imports from `types/bot` and `types/api` resolve to the same definitions.
export * from './api'

// Backwards-compatible aliases
import type { Bot as ApiBot } from './api'
export type TradingBot = ApiBot
export type Position = any
