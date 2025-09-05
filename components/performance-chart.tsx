"use client";

import React, { useMemo, useState } from "react";
import ChartWrapper from "./chart-wrapper";

/**
 * PerformanceChart
 *
 * Adapter that transforms Recharts-style timeseries data into ChartWrapper (Chart.js)
 * Accepts the same quick props as the original Recharts implementation.
 */

export interface SeriesDef {
  key: string;
  name?: string;
  color?: string;
  strokeWidth?: number;
}

export interface PerformanceChartProps {
  data?: Record<string, any>[];
  series?: SeriesDef[];
  height?: number;
}

/**
 * Utility: simple default mock data if none provided
 */
const MOCK_SERIES: SeriesDef[] = [
  { key: "botA", name: "Mean Reverter", color: "#3b82f6" },
  { key: "botB", name: "Momentum Bot", color: "#f97316" },
  { key: "botC", name: "Arb Bot", color: "#10b981" },
];

const generateMockData = (points = 60) => {
  const now = Date.now();
  const day = 1000 * 60 * 60 * 24;
  const data: Record<string, any>[] = [];
  let a = 0,
    b = 2,
    c = -1;
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - i * day;
    a += (Math.random() - 0.45) * 2;
    b += (Math.random() - 0.4) * 1.5;
    c += (Math.random() - 0.5) * 1.2;
    data.push({
      timestamp,
      botA: Number((10000 + a * 200).toFixed(2)),
      botB: Number((8000 + b * 180).toFixed(2)),
      botC: Number((6000 + c * 150).toFixed(2)),
    });
  }
  return data;
};

export default function PerformanceChart({ data, series, height = 320 }: PerformanceChartProps) {
  const chartSeries = series && series.length > 0 ? series : MOCK_SERIES;
  const chartData = data && data.length > 0 ? data : generateMockData(90);

  // Transform data into Chart.js format accepted by ChartWrapper
  const labels = chartData.map((r: Record<string, any>) => {
    const ts = Number(r.timestamp);
    return new Date(ts).toISOString();
  });

  const datasets = chartSeries.map((s) => {
    return {
      label: s.name ?? s.key,
      data: chartData.map((r: Record<string, any>) => (typeof r[s.key] === "number" ? r[s.key] : Number(r[s.key] ?? 0))),
      borderColor: s.color ?? undefined,
      backgroundColor: s.color ? `${s.color}33` : undefined, // add light transparency if given
      tension: 0.3,
      fill: false,
      borderWidth: s.strokeWidth ?? 2,
    };
  });

  const chartJsData = {
    labels,
    datasets,
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const val = context.parsed?.y ?? context.raw ?? context.parsed;
            if (typeof val === "number") {
              return `${context.dataset.label}: ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
            }
            return `${context.dataset.label}: ${String(val)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: { tooltipFormat: "MMM dd, yyyy" },
      },
    },
  };

  return (
    <div className="w-full rounded border bg-white dark:bg-gray-900 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Performance</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">Hover for details · Zoom & pan enabled</div>
      </div>

      <div style={{ width: "100%", height }}>
        <ChartWrapper
          type="line"
          data={chartJsData as any}
          options={chartOptions as any}
          height={height}
          ariaLabel="Portfolio performance over time"
        />
      </div>
    </div>
  );
}
