"use client"
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface PieChartProps {
  data?: { name: string; value: number; color: string }[]
  width?: number
  height?: number
}

export function PieChart({ data = [], width = 300, height = 300 }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart width={width} height={height}>
          <Pie
            data={data}
            cx="30%"
            cy="30%"
            labelLine={false}
            outerRadius={width > 200 ? 80 : 60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            fontSize={12}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, "Allocation"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  )
}

