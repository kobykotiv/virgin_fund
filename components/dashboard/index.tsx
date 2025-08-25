"use client"

import React from "react"
import FundsGrid from "./FundsGrid"
import PortfolioCreator from "@/components/portfolios/PortfolioCreator"
import { fetchSharedStrategies } from "@/lib/mockApi"

export default function DashboardShell() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Quick snapshot of top index funds</p>
        </div>
        <div>
          <button className="btn">Create / Import Strategy</button>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FundsGrid />
          </div>
          <aside className="lg:col-span-1">
            <PortfolioCreator />
          </aside>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium">Shared strategies</h3>
        {/* lightweight client-only rendering of strategies for now */}
        <SharedStrategies />
      </section>
    </div>
  )
}

function SharedStrategies() {
  const [list, setList] = React.useState<any[] | null>(null)
  React.useEffect(() => { fetchSharedStrategies().then(r => setList(r)) }, [])
  if (!list) return <div className="h-24 animate-pulse bg-muted rounded" />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {list.map(s => (
        <div key={s.id} className="border p-3 rounded">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-muted-foreground">by {s.author}</div>
            </div>
            <div>
              <button className="btn btn-sm" onClick={() => console.log('import', s.id)}>Import</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
