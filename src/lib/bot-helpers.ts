// Helper utilities for safely reading bot.parameters and providing defaults.
// Purpose: centralize guards/defaults so callers can do:
//   const params = getBotParams(bot, { period: 14, threshold: 2 })
//   const lookback = getNumberParam(bot, 'period', 14)
//
// Keep functions small and well-documented so they can be extended as needed.

import type { Bot } from "@/types/bot"

/**
 * Return bot.parameters or an empty object.
 * Merge with optional defaults (defaults take effect only when parameter missing).
 */
export function getBotParams(bot: Bot | null | undefined, defaults: Record<string, any> = {}): Record<string, any> {
  const raw = (bot && bot.parameters) ? bot.parameters : {}
  return { ...defaults, ...raw }
}

/**
 * Read a numeric parameter with a fallback default.
 * Ensures callers always receive a number (not undefined).
 */
export function getNumberParam(bot: Bot | null | undefined, key: string, fallback: number): number {
  const params = getBotParams(bot)
  const v = params[key]
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Read a string parameter with fallback.
 */
export function getStringParam(bot: Bot | null | undefined, key: string, fallback = ""): string {
  const params = getBotParams(bot)
  const v = params[key]
  return v == null ? fallback : String(v)
}

/**
 * Read a boolean parameter with fallback.
 */
export function getBoolParam(bot: Bot | null | undefined, key: string, fallback = false): boolean {
  const params = getBotParams(bot)
  if (typeof params[key] === "boolean") return params[key]
  if (typeof params[key] === "string") {
    return params[key] === "true"
  }
  return fallback
}
