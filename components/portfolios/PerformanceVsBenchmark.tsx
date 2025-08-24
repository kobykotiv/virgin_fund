"use client"

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface HistoryPoint {
  timestamp: string;
  value: number;
  benchmark?: number;
}

export default function PerformanceVsBenchmark({ history }: { history: HistoryPoint[] }) {
  const data = (history || []).map((h) => ({
    timestamp: new Date(h.timestamp).toLocaleDateString(),
    equity: h.value,
    benchmark: h.benchmark ?? null,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.find((p: any) => p.dataKey === "equity") && (
            <p>Equity: {formatCurrency(payload.find((p: any) => p.dataKey === "equity").value)}</p>
          )}
          {payload.find((p: any) => p.dataKey === "benchmark") && (
            <p className="text-sm text-muted-foreground">Benchmark: {formatCurrency(payload.find((p: any) => p.dataKey === "benchmark").value)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Performance vs Benchmark</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-muted-foreground">No performance history available</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="equity" stroke="hsl(var(--primary))" dot={false} />
                <Line type="monotone" dataKey="benchmark" stroke="#8884d8" dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
