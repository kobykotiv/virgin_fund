"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { portfolios } from "@/lib/demo-portfolios"

interface PortfolioChartProps {
  portfolioType: string
  className?: string
}

const COLORS = [
  "#0088FE", // blue
  "#00C49F", // green
  "#FFBB28", // yellow
  "#FF8042", // orange
  "#8884D8", // purple
  "#FF6B6B", // red
  "#4BC0C0", // teal
  "#9966FF", // violet
  "#FF66B2", // pink
  "#66B2FF", // light blue
]

export function PortfolioChart({ portfolioType, className }: PortfolioChartProps) {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([])

  useEffect(() => {
    // Find the specific portfolio data by ID instead of using generic demo positions
    const portfolio = portfolios.find(p => p.id === portfolioType)
    
    if (portfolio && portfolio.allocation) {
      // Use the portfolio-specific allocation data
      setData(portfolio.allocation)
    } else {
      // Fallback to sample data if portfolio not found
      setData([
        { name: "Tech", value: 35 },
        { name: "Finance", value: 25 },
        { name: "Healthcare", value: 20 },
        { name: "Consumer", value: 15 },
        { name: "Energy", value: 5 }
      ])
    }
  }, [portfolioType])

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    // Only show label for segments that are large enough (> 5%)
    if (percent < 0.05) return null
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className={`aspect-square w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="80%"
            innerRadius="40%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Allocation"]}
            contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "6px", border: "none" }}
          />
          <Legend 
            layout="vertical"
            align="center"
            verticalAlign="bottom"
            formatter={(value, entry, index) => {
              // Truncate long ticker names
              return value.length > 8 ? value.substring(0, 7) + "..." : value
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

