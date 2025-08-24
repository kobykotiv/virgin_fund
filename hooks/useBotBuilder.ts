import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Bot } from '@/types/api'

export function useBotBuilder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name?: string; currency?: string; items: { symbol: string; weightPct: number }[]; totalAllocation?: number }) => {
      const res = await fetch('/api/bots/builder', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      // server returns { data: { strategy, preview } }
      return (await res.json()) as Promise<{ data: { strategy: any; preview: Bot } }>
    },
    onSuccess: () => {
      // invalidate both strategies and bots caches so UI stays in sync
      qc.invalidateQueries({ queryKey: ['strategies'] })
      qc.invalidateQueries({ queryKey: ['bots'] })
    },
  })
}
