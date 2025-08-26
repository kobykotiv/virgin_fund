"use client"

import { useState } from "react"
import SignalBuilder from "@/components/signals/SignalBuilder"
import PipelineEditor, { Pipeline as PipelineType } from "@/components/bots/PipelineEditor"
import { usePipelines } from "@/hooks/usePipelines"

export default function PipelinePage() {
  const [signals, setSignals] = useState<any[]>([])
  const { list, create, update, remove } = usePipelines()
  const pipelines = (list.data || []) as PipelineType[]

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Pipelines</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <SignalBuilder onCreate={(s) => setSignals((x) => [s, ...x])} />
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Available signals</h2>
            <div className="space-y-2">
              {signals.map(s => (
                <div key={s.id} className="border p-2 rounded">{s.name} • {s.ticker}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <PipelineEditor availableSignals={signals} onSave={(p: PipelineType) => create.mutate({ name: p.name, signalIds: p.signalIds })} />
          <div className="mt-4">
            <h2 className="font-semibold mb-2">My pipelines</h2>
            <div className="space-y-2">
              {pipelines.map(p => (
                <div key={p.id} className="border p-2 rounded">{p.name} • {p.signalIds?.length ?? 0} signals</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
