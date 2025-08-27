"use client"
import React, { useState } from 'react'
import { useListBacktests, useRunBacktest } from '@/hooks/useBacktests'
import BacktestResults from '@/components/backtest/BacktestResults'

export default function BacktestsPage() {
  const { data, isLoading } = useListBacktests()
  const run = useRunBacktest()
  const [selected, setSelected] = useState<any | null>(null)
  const [running, setRunning] = useState(false)

  const onRun = async () => {
    setRunning(true)
    try {
      const payload = { botConfig: { name: 'Ad-hoc Backtest' }, params: { start: '2020-01-01', end: '2023-01-01' } }
      const res = await run.mutateAsync(payload)
      setSelected(res)
    } catch (e) {
      console.error(e)
      alert('Backtest failed: ' + (e as Error).message)
    } finally { setRunning(false) }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Backtests</h1>
        <div>
          <button className="btn-primary" onClick={onRun} disabled={running}>{running ? 'Running...' : 'Run Backtest'}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="bg-white rounded border p-4">
            <h3 className="font-medium mb-2">Recent Backtests</h3>
            {isLoading && <div>Loading...</div>}
            {!isLoading && (!data || (data.backtests || []).length === 0) && <div className="text-sm text-gray-600">No backtests yet.</div>}
            <ul className="space-y-2">
              {(data?.backtests || []).map((b: any) => (
                <li key={b.id}>
                  <button className="w-full text-left p-2 rounded hover:bg-gray-50" onClick={() => setSelected(b)}>{b.name ?? b.id}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded border p-4">
            <h3 className="font-medium mb-2">Result</h3>
            {selected ? <BacktestResults result={selected} /> : <div className="text-sm text-gray-600">Select a backtest or run a new one.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
