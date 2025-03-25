"use client"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

type PieChartProps = {
  data: {
    name: string
    value: number
    color: string
  }[]
  width?: number
  height?: number
}

export function PieChart({ data, width = 300, height = 300 }: PieChartProps) {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie width={width} height={height}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
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
        </RechartsPie>
      </ResponsiveContainer>
    </div>
  )
}

