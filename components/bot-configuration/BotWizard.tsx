"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import YahooScreener from '@/components/market/YahooScreener'
import type { CreateBotPayload } from '@/types/api'

interface BotWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: CreateBotPayload) => Promise<any>
}

export default function BotWizard({ open, onOpenChange, onCreate }: BotWizardProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [strategy, setStrategy] = useState('dca')
  const [symbols, setSymbols] = useState<string[]>([])
  const [capital, setCapital] = useState<number | undefined>(1000)
  const [submitting, setSubmitting] = useState(false)

  function addSymbol(sym: string) {
    if (!symbols.includes(sym)) setSymbols(prev => [...prev, sym])
  }

  async function finish() {
    setSubmitting(true)
    try {
      await onCreate({ name: name || `bot-${Date.now()}`, strategy, capital, parameters: { symbols } })
      onOpenChange(false)
    } finally { setSubmitting(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a bot — Step {step + 1} / 3</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {step === 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My bot name" />
              <label className="text-sm font-medium">Strategy</label>
              <select className="select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                <option value="dca">DCA</option>
                <option value="grid">Grid</option>
                <option value="basket">Basket</option>
              </select>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose assets</label>
              <YahooScreener onSelect={addSymbol} />
              <div className="flex gap-2 flex-wrap">
                {symbols.map(s => (
                  <div key={s} className="px-2 py-1 rounded bg-slate-100">{s}</div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Capital allocation</label>
              <Input type="number" value={String(capital ?? '')} onChange={(e) => setCapital(Number(e.target.value))} />
              <div className="text-sm text-muted-foreground">Review: {name || 'Unnamed'} — {strategy} — {symbols.join(', ')}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            <div>
              {step > 0 && <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>}
            </div>
            <div>
              {step < 2 && <Button onClick={() => setStep(s => s + 1)}>Next</Button>}
              {step === 2 && <Button onClick={finish} disabled={submitting}>{submitting ? 'Creating…' : 'Create Bot'}</Button>}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
