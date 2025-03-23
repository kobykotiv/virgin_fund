"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

export function FearGreedWidget() {
  const [data, setData] = useState<any[]>([])
  const [currentValue, setCurrentValue] = useState<number>(0)
  const [sentiment, setSentiment] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate mock fear & greed data
    const generateData = () => {
      setIsLoading(true)

      const result = []
      const days = 30

      // Generate data for the last 30 days
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      let value = 50 + (Math.random() * 20 - 10)

      for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)

        // Add some randomness to the value, but with a trend
        const change = Math.random() * 10 - 5
        value = Math.max(0, Math.min(100, value + change))

        result.push({
          date: currentDate.toISOString().split("T")[0],
          value: Math.round(value),
        })
      }

      setData(result)
      setCurrentValue(Math.round(value))

      // Set sentiment based on value
      if (value >= 0 && value < 25) {
        setSentiment("Extreme Fear")
      } else if (value >= 25 && value < 45) {
        setSentiment("Fear")
      } else if (value >= 45 && value < 55) {
        setSentiment("Neutral")
      } else if (value >= 55 && value < 75) {
        setSentiment("Greed")
      } else {
        setSentiment("Extreme Greed")
      }

      setIsLoading(false)
    }

    generateData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading fear & greed data...</div>
      </div>
    )
  }

  // Get color based on value
  const getColor = (value: number) => {
    if (value >= 0 && value < 25) return "#ef4444" // red
    if (value >= 25 && value < 45) return "#f97316" // orange
    if (value >= 45 && value < 55) return "#eab308" // yellow
    if (value >= 55 && value < 75) return "#84cc16" // light green
    return "#22c55e" // green
  }

  const color = getColor(currentValue)

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Current Index</div>
          <div className="text-2xl font-bold">{currentValue}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Sentiment</div>
          <div className="text-lg font-semibold" style={{ color }}>
            {sentiment}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value) => [`${value}`, "Index"]}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <ReferenceLine y={25} stroke="rgba(239, 68, 68, 0.5)" strokeDasharray="3 3" />
            <ReferenceLine y={45} stroke="rgba(234, 179, 8, 0.5)" strokeDasharray="3 3" />
            <ReferenceLine y={55} stroke="rgba(234, 179, 8, 0.5)" strokeDasharray="3 3" />
            <ReferenceLine y={75} stroke="rgba(34, 197, 94, 0.5)" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-1 mt-2 text-xs text-center">
        <div className="bg-red-500 text-white p-1 rounded-l-sm">Extreme Fear</div>
        <div className="bg-orange-500 text-white p-1">Fear</div>
        <div className="bg-yellow-500 text-white p-1">Neutral</div>
        <div className="bg-lime-500 text-white p-1">Greed</div>
        <div className="bg-green-500 text-white p-1 rounded-r-sm">Extreme Greed</div>
      </div>
    </div>
  )
}

