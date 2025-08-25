import dynamic from "next/dynamic"
import SignalBuilder from "@/components/signals/SignalBuilder"
import { useState } from "react"

export const metadata = { title: "Signals" }

export default function SignalsPage() {
  const [signals, setSignals] = useState<any[]>([])
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Signals</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <SignalBuilder onCreate={(s) => setSignals((x) => [s, ...x])} />
        </div>
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2">My signals</h2>
          <div className="space-y-3">
            {signals.length === 0 ? <div className="text-sm text-muted-foreground">No signals yet</div> : signals.map(s => (
              <div key={s.id} className="border p-3 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-muted-foreground">{s.ticker} • {s.condition}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
