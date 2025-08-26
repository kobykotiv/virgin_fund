import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabaseClient'

export type Signal = {
  id: string
  user_id?: string
  name: string
  ticker: string
  condition?: string
  params?: any
  enabled?: boolean
  created_at?: string
  updated_at?: string
}

async function fetchSignals() {
  const res = await fetch('/api/signals')
  if (!res.ok) throw new Error('Failed to fetch signals')
  const json = await res.json()
  return json.signals as Signal[]
}

async function createSignal(payload: Partial<Signal>) {
  const res = await fetch('/api/signals', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) throw new Error('Failed to create')
  return (await res.json()).signal as Signal
}

async function updateSignal(id: string, payload: Partial<Signal>) {
  const res = await fetch(`/api/signals/${id}`, { method: 'PATCH', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) throw new Error('Failed to update')
  return (await res.json()).signal as Signal
}

async function deleteSignal(id: string) {
  const res = await fetch(`/api/signals/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}

export function useSignals() {
  const qc = useQueryClient()

  const list = useQuery({
    queryKey: ['signals'],
    queryFn: fetchSignals,
    staleTime: 1000 * 60
  })

  const create = useMutation({
    mutationFn: createSignal,
    onSuccess: (data) => qc.setQueryData(['signals'], (old: Signal[]) => [data, ...(old || [])]),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Signal> }) => updateSignal(id, payload),
    onSuccess: (data) => qc.setQueryData(['signals'], (old: Signal[]) => (old || []).map((s: Signal) => (s.id === data.id ? data : s))),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteSignal(id),
    onSuccess: (_data, id) => qc.setQueryData(['signals'], (old: Signal[]) => (old || []).filter((s: Signal) => s.id !== id)),
  })

  // subscribe to realtime signals events to keep list up-to-date
  useEffect(() => {
    let channel: ReturnType<typeof supabase['channel']> | null = null
    try {
      channel = supabase
        .channel('public:signals')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'signals' }, (payload) => {
          qc.setQueryData(['signals'], (old: any) => {
            const prev = old ? [...old] : []
            const newRow = payload.new as any
            const oldRow = payload.old as any
            switch (payload.eventType) {
              case 'INSERT':
                if (!prev.find((p) => p.id === newRow.id)) return [newRow, ...prev]
                return prev
              case 'UPDATE':
                return prev.map((p) => (p.id === newRow.id ? newRow : p))
              case 'DELETE':
                return prev.filter((p) => p.id !== oldRow.id)
              default:
                return prev
            }
          })
        })
        .subscribe()
    } catch (e) {
      channel = null
    }

    return () => {
      if (channel) void channel.unsubscribe()
    }
  }, [qc])

  return { list, create, update, remove }
}
