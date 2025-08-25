"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Signal } from "@/components/signals/SignalBuilder"

export type Pipeline = {
  id: string
  name: string
  signalIds: string[]
}

export default function PipelineEditor({ availableSignals, onSave }: { availableSignals: Signal[]; onSave?: (p: Pipeline) => void }) {
  const [name, setName] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]))
  }

  function handleSave() {
    if (!name) return
    const p: Pipeline = { id: crypto.randomUUID(), name, signalIds: selected }
    onSave?.(p)
    setName("")
    setSelected([])
  }

  return (
    <div className="space-y-3 p-4 border rounded">
      <div>
        <label className="text-sm font-medium">Pipeline name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Morning momentum" />
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Select signals</div>
        <div className="space-y-2">
          {availableSignals.map(s => (
            <div key={s.id} className="flex items-center justify-between border p-2 rounded">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.ticker} — {s.condition}</div>
              </div>
              <div>
                <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Pipeline</Button>
      </div>
    </div>
  )
}
