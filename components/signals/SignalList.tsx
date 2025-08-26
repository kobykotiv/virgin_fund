"use client"

import React, { useState } from 'react'
import { useSignals, Signal } from '@/hooks/useSignals'
import SignalEditor from './SignalEditor'

export default function SignalList() {
  const { list, remove } = useSignals()
  const [editing, setEditing] = useState<Signal | null>(null)

  const signals = list.data ?? []

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Trading Signals</h2>
        <button className="btn" onClick={() => setEditing({ id: '', name: '', ticker: '' } as any)}>+ New</button>
      </div>

      <ul className="mt-3 space-y-2">
        {signals.map((s: Signal) => (
          <li key={s.id} className="p-3 bg-muted rounded flex justify-between">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-muted-foreground">{s.ticker} {s.condition ? `• ${s.condition}` : ''}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost" onClick={() => setEditing(s)}>Edit</button>
              <button className="btn-outline text-red-600" onClick={() => remove.mutate(s.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md">
            <SignalEditor signal={editing.id ? editing : null} onClose={() => setEditing(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
