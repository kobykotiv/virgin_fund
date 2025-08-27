"use client"
import { useMutation, useQuery } from '@tanstack/react-query'

export function useRunBacktest() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('/api/backtest', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      if (!res.ok) throw new Error((await res.json()).error || 'Backtest failed')
      return res.json()
    }
  })
}

export function useListBacktests() {
  return useQuery({
    queryKey: ['backtests'],
    queryFn: async () => {
      const res = await fetch('/api/backtest/list')
      if (!res.ok) throw new Error('Failed to fetch backtests')
      return res.json()
    }
  })
}

export default useRunBacktest
