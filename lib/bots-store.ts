import type { Bot } from '@/types/api'

// Simple process-local in-memory store for development.
// Replace with Supabase/DB-backed persistence in production.
const store: Bot[] = []

export function listBots(): Bot[] {
  return store
}

export function addBot(bot: Bot) {
  store.push(bot)
  return bot
}

export function findBot(id: string) {
  return store.find((b) => b.id === id) || null
}
