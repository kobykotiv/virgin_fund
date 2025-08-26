import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabaseClient'

export type Pipeline = {
  id: string
  user_id?: string
  name: string
  signalIds: string[]
  created_at?: string
  updated_at?: string
}

async function fetchPipelines() {
  const res = await fetch('/api/pipelines')
  if (!res.ok) throw new Error('Failed to fetch pipelines')
  const json = await res.json()
  return json.pipelines as Pipeline[]
}

async function createPipeline(payload: Partial<Pipeline>) {
  const res = await fetch('/api/pipelines', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) throw new Error('Failed to create')
  const json = await res.json()
  // backend may return signal_ids; normalize to signalIds
  const p = json.pipeline as any
  if (p && p.signal_ids && !p.signalIds) p.signalIds = p.signal_ids
  return p as Pipeline
}

async function updatePipeline(id: string, payload: Partial<Pipeline>) {
  const res = await fetch(`/api/pipelines/${id}`, { method: 'PATCH', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) throw new Error('Failed to update')
  const json = await res.json()
  const p = json.pipeline as any
  if (p && p.signal_ids && !p.signalIds) p.signalIds = p.signal_ids
  return p as Pipeline
}

async function deletePipeline(id: string) {
  const res = await fetch(`/api/pipelines/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}

export function usePipelines() {
  const qc = useQueryClient()

  const list = useQuery({ queryKey: ['pipelines'], queryFn: fetchPipelines, staleTime: 1000 * 60 })

  const create = useMutation({
    mutationFn: createPipeline,
    onSuccess: (data: Pipeline) => qc.setQueryData(['pipelines'], (old: any) => [data, ...(old || [])]),
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pipeline> }) => updatePipeline(id, payload),
    onSuccess: (data: Pipeline) => qc.setQueryData(['pipelines'], (old: any) => (old || []).map((p: any) => (p.id === data.id ? data : p))),
  })

  const remove = useMutation({
    mutationFn: (id: string) => deletePipeline(id),
    onSuccess: (_data, id: string) => qc.setQueryData(['pipelines'], (old: any) => (old || []).filter((p: any) => p.id !== id)),
  })

  useEffect(() => {
    let channel: ReturnType<typeof supabase['channel']> | null = null
    try {
      channel = supabase
        .channel('public:pipelines')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'pipelines' }, (payload) => {
          qc.setQueryData(['pipelines'], (old: any) => {
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
