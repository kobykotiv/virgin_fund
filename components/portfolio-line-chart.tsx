"use client"

import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface PortfolioLineChartProps {
  data?: Array<{ date: string; value: number }> // Make data optional
  className?: string
}

export function PortfolioLineChart({ data = [], className }: PortfolioLineChartProps) {
  // Validate data before processing
  if (!data || data.length === 0) {
    return (
      <div className={cn("aspect-square w-full flex items-center justify-center", className)}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Calculate relative growth (starting from 100)
  const normalizedData = data.map((point, i) => ({
    date: point.date,
    value: i === 0 ? 100 : (point.value / data[0].value) * 100
  }))

  return (
    <div className={cn("aspect-square w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalizedData}>
          <XAxis 
            dataKey="date" 
            hide 
            padding={{ left: 10, right: 10 }} 
          />
          <YAxis 
            hide
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Growth"]}
            contentStyle={{ 
              backgroundColor: "rgba(255, 255, 255, 0.9)", 
              borderRadius: "6px", 
              border: "none" 
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
