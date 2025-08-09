
import { useEffect, useState } from "react"

type MetricCardProps = {
  label: string
  value: string | number
  change?: string
}

function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      {change && (
        <span
          className={`text-sm ${change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
        >
          {change}
        </span>
      )}
    </div>
  )
}

type ChartPlaceholderProps = {
  title: string
}

function ChartPlaceholder({ title }: ChartPlaceholderProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center h-64 text-gray-400">
      {title} Chart Placeholder
    </div>
  )
}

type Bot = {
  id: string
  name: string
  status: string
  return: string
}

export default function PerformancePage() {
  const [portfolioMetrics, setPortfolioMetrics] = useState<MetricCardProps[]>([])
  const [botMetrics, setBotMetrics] = useState<Bot[]>([])

  // Mock data for now
  useEffect(() => {
    setPortfolioMetrics([
      { label: "Total Return", value: "+12.5%", change: "+1.2%" },
      { label: "P/L", value: "$3,200", change: "+$150" },
      { label: "Max Drawdown", value: "-5.2%", change: "-0.3%" },
      { label: "Win Rate", value: "58%" },
      { label: "Avg Trade Size", value: "$1,050" },
    ])

    setBotMetrics([
      { id: "1", name: "Mean Reversion Alpha", status: "Active", return: "+8.3%" },
      { id: "2", name: "CryptoMomentum", status: "Paused", return: "+15.7%" },
      { id: "3", name: "ScalperX", status: "Active", return: "+3.9%" },
    ])
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Portfolio Performance */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {portfolioMetrics.map((m, i) => (
            <MetricCard key={i} {...m} />
          ))}
        </div>
        <ChartPlaceholder title="Portfolio Performance" />
      </section>

      {/* Bot Performance */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Bot Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Bot Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Return</th>
              </tr>
            </thead>
            <tbody>
              {botMetrics.map((bot) => (
                <tr
                  key={bot.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2 font-medium">{bot.name}</td>
                  <td className="px-4 py-2">{bot.status}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      bot.return.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {bot.return}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <ChartPlaceholder title="Bot Performance" />
        </div>
      </section>
    </div>
  )
}

// PerformanceChart: Placeholder for future chart integration
export function PerformanceChart({ title }: { title: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center h-64 text-gray-400">
      <span className="flex flex-col items-center">
        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mb-2"><path d="M4 17l6-6 4 4 6-6" /></svg>
        {title} Chart Coming Soon
      </span>
    </div>
  )
}

// BotPerformanceTable: Table of bots with metrics and chart action
export function BotPerformanceTable({ bots }: { bots: Bot[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">Bot Name</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Return</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-2 font-medium">{bot.name}</td>
              <td className="px-4 py-2">{bot.status}</td>
              <td className={`px-4 py-2 font-semibold ${bot.return.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{bot.return}</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs">View Chart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// CandlestickChart: Placeholder for candlestick chart integration
/**
 * CandlestickChart component
 * Displays a placeholder for a candlestick chart. Replace with a charting library (e.g., Recharts, Chart.js) for live data.
 * @param {string} title - Chart title
 * @param {Array} data - Candlestick data (future use)
 */
export function CandlestickChart({ title, data }: { title: string; data?: any[] }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center h-64 text-gray-400">
      <span className="flex flex-col items-center">
        {/* Placeholder SVG for candlestick chart */}
        <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
          <rect x="10" y="20" width="6" height="18" fill="#22c55e" />
          <rect x="26" y="10" width="6" height="28" fill="#ef4444" />
          <rect x="42" y="16" width="6" height="22" fill="#22c55e" />
          <rect x="58" y="8" width="6" height="30" fill="#ef4444" />
          <rect x="74" y="24" width="6" height="14" fill="#22c55e" />
          <rect x="90" y="12" width="6" height="26" fill="#ef4444" />
        </svg>
        <span>{title} Candlestick Chart Coming Soon</span>
      </span>
    </div>
  )
}
// ...existing code...
