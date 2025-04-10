"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PerformanceChartProps {
  data?: {
    date: string
    value: number
    benchmark?: number
  }[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data) {
    return <Skeleton className="h-[400px] w-full" />
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 border shadow-md">
          <p className="font-medium">{formatDate(label)}</p>
          <p className="text-sm text-primary">
            Portfolio: {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-sm text-muted-foreground">
              Benchmark: {formatCurrency(payload[1].value)}
            </p>
          )}
        </Card>
      )
    }
    return null
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            className="text-xs text-muted-foreground"
          />
          <YAxis
            tickFormatter={formatCurrency}
            className="text-xs text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#portfolioGradient)"
            name="Portfolio"
            strokeWidth={2}
          />
          {data[0]?.benchmark !== undefined && (
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#benchmarkGradient)"
              name="Benchmark"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

