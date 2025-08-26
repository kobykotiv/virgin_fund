import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

  return { list, create, update, remove }
}
