"use client"

import { useEffect, useState } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface PerformanceChartProps {
  days: number
  variant?: "default" | "crypto" | "defi"
  className?: string
}

export function PerformanceChart({ days = 30, variant = "default", className = "" }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate random performance data
    const generateData = () => {
      setIsLoading(true)

      let startValue = 10000
      let volatility = 0.01

      // Adjust volatility based on variant
      if (variant === "crypto") {
        startValue = 5000
        volatility = 0.03
      } else if (variant === "defi") {
        startValue = 8000
        volatility = 0.02
      }

      const result = []
      let currentValue = startValue

      // Generate data for the specified number of days
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      for (let i = 0; i <= days; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)

        // Add some randomness to the value, but with an upward trend
        const change = (Math.random() - 0.3) * volatility
        currentValue = currentValue * (1 + change)

        result.push({
          date: currentDate.toISOString().split("T")[0],
          value: currentValue,
          previousValue: currentValue * 0.85,
        })
      }

      setData(result)
      setIsLoading(false)
    }

    generateData()
  }, [days, variant])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
      </div>
    )
  }

  // Determine colors based on variant
  let colors = {
    line: "#3b82f6",
    area: "rgba(59, 130, 246, 0.2)",
    grid: "rgba(59, 130, 246, 0.1)",
  }

  if (variant === "crypto") {
    colors = {
      line: "#f59e0b",
      area: "rgba(245, 158, 11, 0.2)",
      grid: "rgba(245, 158, 11, 0.1)",
    }
  } else if (variant === "defi") {
    colors = {
      line: "#10b981",
      area: "rgba(16, 185, 129, 0.2)",
      grid: "rgba(16, 185, 129, 0.1)",
    }
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={`colorValue-${variant}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.line} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.line} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            domain={["dataMin - 500", "dataMax + 500"]}
          />
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
              "Value",
            ]}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Area
            type="monotone"
            dataKey="previousValue"
            stroke="rgba(100, 100, 100, 0.3)"
            strokeWidth={1.5}
            fillOpacity={0.3}
            fill="url(#colorValue-previous)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.line}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#colorValue-${variant})`}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

