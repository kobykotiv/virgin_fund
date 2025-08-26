import dynamic from "next/dynamic"
import SignalBuilder from "@/components/signals/SignalBuilder"
import { useSignals } from "@/hooks/useSignals"
import { useState } from "react"

export const metadata = { title: "Signals" }

export default function SignalsPage() {
  const { list, create, update, remove } = useSignals()
  const signals = list.data || []
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Signals</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <SignalBuilder onCreate={(s) => create.mutate({ name: s.name, ticker: s.ticker, condition: s.condition })} />
        </div>
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2">My signals</h2>
          <div className="space-y-3">
            {signals.length === 0 ? (
              <div className="text-sm text-muted-foreground">No signals yet</div>
            ) : (
              signals.map((s: any) => (
                <div key={s.id} className="border p-2 rounded mb-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-muted-foreground">{s.ticker} • {s.condition}</div>
                  </div>
                  <div>
                    <button className="text-sm text-red-500" onClick={() => remove.mutate(s.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
