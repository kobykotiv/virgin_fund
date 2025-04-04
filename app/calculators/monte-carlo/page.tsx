"use client"

import { MonteCarloSimulation } from '@/components/calculators/monte-carlo'
import { useLocalStorage } from '@/hooks/use-local-storage'

export default function MonteCarloPage() {
  // Load user's trading data from localStorage if available
  const [userData] = useLocalStorage('trading_history', null)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Monte Carlo Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Simulate potential price paths using historical volatility
        </p>
      </header>

      <MonteCarloSimulation initialData={userData} />

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="font-bold mb-2">About Monte Carlo Simulation</h3>
        <p className="text-sm">
          This tool runs thousands of price simulations to help predict potential
          outcomes and assess risk levels for your trading strategies.
        </p>
      </div>
    </div>
  )
}
