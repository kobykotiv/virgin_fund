"use client"

import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { BotPerformance } from '@/types/bot'

interface MiniChartProps {
  data: BotPerformance;
  height?: number;
}

export function MiniChart({ data, height = 60 }: MiniChartProps) {
  // Convert performance data into chart points
  const chartData = [
    { pnl: 0, time: 0 },
    { pnl: data.pnlPercentage, time: 1 }
  ]

  const isPositive = data.totalPnL >= 0

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${data.lastUpdated}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="pnl"
            stroke={isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
            fill={`url(#gradient-${data.lastUpdated})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}