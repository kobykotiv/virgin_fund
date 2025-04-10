"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Position {
  symbol: string
  marketValue: number
  quantity: number
  avgPrice: number
}

interface PortfolioAllocationProps {
  data?: Position[]
}

export function PortfolioAllocation({ data }: PortfolioAllocationProps) {
  if (!data) {
    return <Skeleton className="h-[300px] w-full" />
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57",
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  // Calculate total portfolio value
  const totalValue = data.reduce((sum, position) => sum + position.marketValue, 0)

  // Transform data for the pie chart
  const chartData = data.map((position) => ({
    name: position.symbol,
    value: position.marketValue,
    percentage: (position.marketValue / totalValue) * 100,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 border shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-primary">
            Value: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatPercentage(data.percentage)} of portfolio
          </p>
        </Card>
      )
    }
    return null
  }

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show labels for small segments

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {chartData[index].name}
      </text>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="stroke-background hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value, entry: any) => (
              <span className="text-sm">
                {value} ({formatPercentage(entry.payload.percentage)})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

