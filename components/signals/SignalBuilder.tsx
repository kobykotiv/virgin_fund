"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type Signal = {
  id: string
  name: string
  ticker: string
  condition: string
}

export default function SignalBuilder({ onCreate }: { onCreate?: (s: Signal) => void }) {
  const [name, setName] = useState("")
  const [ticker, setTicker] = useState("")
  const [condition, setCondition] = useState("")

  function handleCreate() {
    if (!name || !ticker) return
    const s: Signal = { id: crypto.randomUUID(), name, ticker: ticker.toUpperCase(), condition }
    onCreate?.(s)
    setName("")
    setTicker("")
    setCondition("")
  }

  return (
    <div className="space-y-3 p-4 border rounded">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Momentum breakout" />
      </div>
      <div>
        <label className="text-sm font-medium">Ticker</label>
        <Input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="VOO" />
      </div>
      <div>
        <label className="text-sm font-medium">Condition (human readable)</label>
        <Input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Price crosses 50-day SMA" />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Create Signal</Button>
      </div>
    </div>
  )
}
