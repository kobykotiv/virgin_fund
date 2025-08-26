"use client"

import React, { useState, useEffect } from 'react'
import { useSignals, Signal } from '@/hooks/useSignals'

export default function SignalEditor({ signal, onClose }: { signal?: Signal | null; onClose: () => void }) {
  const { create, update } = useSignals()
  const [name, setName] = useState(signal?.name ?? '')
  const [ticker, setTicker] = useState(signal?.ticker ?? '')
  const [condition, setCondition] = useState(signal?.condition ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(signal?.name ?? '')
    setTicker(signal?.ticker ?? '')
    setCondition(signal?.condition ?? '')
  }, [signal])

  async function handleSave() {
    setSaving(true)
    try {
      const payload = { name, ticker, condition }
      if (signal?.id) {
        await update.mutateAsync({ id: signal.id, payload })
      } else {
        await create.mutateAsync(payload)
      }
      onClose()
    } catch (e) {
      // noop - callers can show toast
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded shadow">
      <h3 className="text-lg font-semibold">{signal ? 'Edit Signal' : 'Create Signal'}</h3>
      <div className="grid gap-2 mt-3">
        <label className="flex flex-col">
          <span className="text-sm">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Ticker</span>
          <input className="input" value={ticker} onChange={(e) => setTicker(e.target.value)} />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Condition (freeform)</span>
          <input className="input" value={condition} onChange={(e) => setCondition(e.target.value)} />
        </label>

        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
