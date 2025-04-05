"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Portfolio data with risk levels (1-10, 10 being highest risk)
const portfolioData = [
  { name: "SPY (S&P 500)", value: 35, risk: 3, color: "#4ade80" },
  { name: "QQQ (NASDAQ-100)", value: 25, risk: 4, color: "#60a5fa" },
  { name: "NASDAQ Composite", value: 20, risk: 4, color: "#818cf8" },
  { name: "BTC", value: 5, risk: 9, color: "#f59e0b" },
  { name: "ETH", value: 5, risk: 8, color: "#8b5cf6" },
  { name: "SOL", value: 5, risk: 10, color: "#ec4899" },
  { name: "Cash", value: 5, risk: 1, color: "#94a3b8" },
]

export function PortfolioAllocation() {
  const RADIAN = Math.PI / 180

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Only show label for segments with enough space
    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={portfolioData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {portfolioData.map((entry, index) => (
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
        <Legend
          layout="vertical"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "20px",
            width: "100%",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

