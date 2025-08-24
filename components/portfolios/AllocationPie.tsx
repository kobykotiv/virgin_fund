"use client"

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { Allocation } from "@/hooks/usePortfolio";

/**
 * Simple allocation pie chart using Recharts.
 * Props:
 *  - allocation: Array of { symbol, percent }
 */
export default function AllocationPie({ allocation }: { allocation: Allocation[] }) {
  // Map allocation into recharts-friendly format
  const data = allocation.map((a) => ({ name: a.symbol, value: a.percent }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6B6B",
    "#4BC0C0",
    "#9966FF",
    "#FF66B2",
    "#66B2FF",
  ];

  const tooltipFormatter = (value: any, name: any) => {
    return [`${Number(value).toFixed(2)}%`, name];
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            labelLine={false}
            label={({ percent }) => (percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : null)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
