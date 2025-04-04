"use client"

import { useState } from 'react'
import { LineChart } from '@/components/ui/line-chart'

interface SimulationParams {
  initialPrice: number;
  volatility: number;
  daysToSimulate: number;
  numberOfSimulations: number;
}

export function MonteCarloSimulation() {
  const [params, setParams] = useState<SimulationParams>({
    initialPrice: 100,
    volatility: 0.2,
    daysToSimulate: 252, // One trading year
    numberOfSimulations: 1000
  })

  const runSimulation = () => {
    const simulations = []
    for (let sim = 0; sim < params.numberOfSimulations; sim++) {
      const prices = [params.initialPrice]
      for (let day = 1; day < params.daysToSimulate; day++) {
        const previousPrice = prices[day - 1]
        const change = (Math.random() - 0.5) * params.volatility
        prices.push(previousPrice * (1 + change))
      }
      simulations.push(prices)
    }
    return simulations
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Monte Carlo Simulation</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Initial Price</label>
          <input
            type="number"
            value={params.initialPrice}
            onChange={(e) => setParams({ ...params, initialPrice: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Add other parameter inputs */}
      </div>
      <LineChart data={runSimulation()} />
    </div>
  )
}
