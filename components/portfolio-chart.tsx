"use client"

import { useEffect, useState, useCallback } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { portfolios } from "@/lib/demo-portfolios"

interface PortfolioChartProps {
  portfolioType: string
  className?: string
}

// Color palette for different assets
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
  "#C2F970", // lime
  "#FF9F40", // light orange
  "#EC7C7C", // salmon
  "#4A90E2", // sky blue
  "#B07FFF", // lavender
];

export function PortfolioChart({ portfolioType, className }: PortfolioChartProps) {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);

  // Find and format allocation data for the specific portfolio
  const loadPortfolioData = useCallback(() => {
    const portfolio = portfolios.find(p => p.id === portfolioType);
    
    if (portfolio && portfolio.allocation) {
      // Map the allocation data to include both symbol and full name when available
      const allocData = portfolio.allocation.map(item => {
        // Find the corresponding position to get more data
        const position = portfolio.positions?.find(pos => pos.symbol === item.name);
        
        return {
          name: position?.name || item.name, // Use full name if available
          symbol: item.name, // Keep the symbol for tooltip
          value: item.value,
          color: getColorForAsset(item.name)
        };
      });
      
      setData(allocData);
    } else {
      // Fallback to sample data if portfolio not found
      setData([
        { name: "Tech", value: 35, symbol: "TECH", color: COLORS[0] },
        { name: "Finance", value: 25, symbol: "FIN", color: COLORS[1] },
        { name: "Healthcare", value: 20, symbol: "HLTH", color: COLORS[2] },
        { name: "Consumer", value: 15, symbol: "CONS", color: COLORS[3] },
        { name: "Energy", value: 5, symbol: "NRG", color: COLORS[4] }
      ]);
    }
  }, [portfolioType]);

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData, portfolioType]);

  // Get a consistent color for a specific asset
  function getColorForAsset(symbol: string): string {
    // Hash the symbol to always get the same color for the same asset
    const hash = symbol.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return COLORS[Math.abs(hash) % COLORS.length];
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    // Only show label for segments that are large enough (> 5%)
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

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
    );
  }

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-2 border rounded shadow-sm">
          <p className="font-semibold">{data.name} ({data.symbol})</p>
          <p className="font-normal">{`Allocation: ${data.value}%`}</p>
        </div>
      );
    }
    return null;
  };

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
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
          {/* Legend removed */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

