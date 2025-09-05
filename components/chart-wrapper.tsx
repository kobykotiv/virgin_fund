"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  ChartOptions,
  ChartData,
  ChartType,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import { saveAs } from "file-saver";

/**
 * ChartWrapper
 *
 * Reusable chart wrapper that supports:
 * - line / bar / doughnut (area via `line` + fill)
 * - legend toggling for individual datasets
 * - zoom & pan controls (powered by chartjs-plugin-zoom)
 * - export PNG and CSV
 *
 * Lightweight, TypeScript-friendly, and intended as a drop-in replacement
 * or augment for the existing PerformanceChart.
 *
 * Props:
 * - type: Chart type to render
 * - data: ChartData (labels + datasets)
 * - options: partial ChartOptions override
 * - height: pixel height of chart container
 *
 * Accessibility:
 * - Buttons include aria-labels; chart container has role="img" and aria-label if provided.
 */

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

export interface ChartWrapperProps<T extends ChartType = "line"> {
  type?: T;
  data: ChartData<T>;
  options?: ChartOptions<T>;
  height?: number;
  ariaLabel?: string;
  allowExport?: boolean;
}

export default function ChartWrapper<T extends ChartType = "line">({
  type = "line" as T,
  data,
  options,
  height = 320,
  ariaLabel,
  allowExport = true,
}: ChartWrapperProps<T>) {
  const chartRef = useRef<any>(null);
  const [visible, setVisible] = useState<boolean[]>(
    () => data?.datasets?.map(() => true) ?? []
  );

  // sync visible state if datasets change
  useEffect(() => {
    setVisible((_) => data?.datasets?.map(() => true) ?? []);
  }, [data?.datasets?.length]);

  // Register zoom plugin dynamically on the client to avoid SSR issues
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;
    let mounted = true;
    (async () => {
      try {
        // dynamic import avoids server-side bundling of hammerjs / window usage
        const mod = await import("chartjs-plugin-zoom");
        if (!mounted) return;
        // chart.js requires plugin registration; guard against duplicate registers
        try {
          // @ts-ignore
          ChartJS.register(mod.default ?? mod);
        } catch {
          // ignore if already registered
        }
      } catch (err) {
        // plugin optional — fail silently in environments where it can't load
        // eslint-disable-next-line no-console
        console.warn("chartjs-plugin-zoom failed to load:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggle = useCallback(
    (i: number) => {
      const chart = chartRef.current?.chart ?? chartRef.current;
      if (!chart) return;
      const newVis = [...visible];
      newVis[i] = !newVis[i];
      setVisible(newVis);
      // Chart.js 3+ supports setDatasetVisibility
      try {
        // @ts-ignore
        chart.setDatasetVisibility(i, newVis[i]);
        chart.update();
      } catch {
        // fallback: toggle hidden flag and update
        if (chart.data && chart.data.datasets && chart.data.datasets[i]) {
          chart.data.datasets[i].hidden = !newVis[i];
          chart.update();
        }
      }
    },
    [visible]
  );

  const resetZoom = useCallback(() => {
    const chart = chartRef.current?.chart ?? chartRef.current;
    if (!chart) return;
    try {
      chart.resetZoom?.();
    } catch (err) {
      // ignore if plugin not active
      // eslint-disable-next-line no-console
      console.warn("resetZoom failed", err);
    }
  }, []);

  const zoomIn = useCallback(() => {
    const chart = chartRef.current?.chart ?? chartRef.current;
    if (!chart) return;
    try {
      chart.zoom?.(1.2);
    } catch {
      // ignore
    }
  }, []);

  const zoomOut = useCallback(() => {
    const chart = chartRef.current?.chart ?? chartRef.current;
    if (!chart) return;
    try {
      chart.zoom?.(0.8);
    } catch {
      // ignore
    }
  }, []);

  const exportPNG = useCallback(() => {
    const chart = chartRef.current?.chart ?? chartRef.current;
    if (!chart) return;
    try {
      const url = chart.toBase64Image();
      // Convert base64 -> blob then save
      fetch(url)
        .then((r) => r.blob())
        .then((blob) => saveAs(blob, `chart-${Date.now()}.png`));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Export PNG failed", err);
    }
  }, []);

  const exportCSV = useCallback(() => {
    try {
      const labels = (data.labels ?? []) as (string | number)[];
      const rows: string[] = [];
      const header = ["label", ...((data.datasets ?? []).map((d) => d.label ?? "series"))];
      rows.push(header.join(","));

      for (let i = 0; i < labels.length; i++) {
        const row = [String(labels[i])];
        for (const ds of data.datasets ?? []) {
          const val = Array.isArray(ds.data) ? ds.data[i] ?? "" : "";
          row.push(String(val));
        }
        rows.push(row.join(","));
      }

      const csv = rows.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `chart-${Date.now()}.csv`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Export CSV failed", err);
    }
  }, [data]);

  // Default options including zoom plugin controls
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true, speed: 0.1 },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...(options ?? {}),
    plugins: {
      ...(defaultOptions.plugins ?? {}),
      ...(options?.plugins ?? {}),
    },
  } as ChartOptions;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {(data.datasets ?? []).map((ds, i) => (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              aria-pressed={visible[i]}
              className={`text-xs px-2 py-1 rounded inline-flex items-center gap-2 border ${
                visible[i] ? "bg-gray-100 dark:bg-gray-800" : "opacity-60"
              }`}
            >
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded"
                style={{ background: (ds as any).backgroundColor ?? (ds as any).borderColor ?? "#9CA3AF" }}
              />
              <span>{ds.label ?? `Series ${i + 1}`}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={zoomIn} aria-label="Zoom in" className="px-2 py-1 text-xs rounded border">Zoom in</button>
          <button onClick={zoomOut} aria-label="Zoom out" className="px-2 py-1 text-xs rounded border">Zoom out</button>
          <button onClick={resetZoom} aria-label="Reset zoom" className="px-2 py-1 text-xs rounded border">Reset</button>
          {allowExport && (
            <>
              <button onClick={exportPNG} aria-label="Export PNG" className="px-2 py-1 text-xs rounded border">PNG</button>
              <button onClick={exportCSV} aria-label="Export CSV" className="px-2 py-1 text-xs rounded border">CSV</button>
            </>
          )}
        </div>
      </div>

      <div style={{ height }} role="img" aria-label={ariaLabel ?? "Chart visualization"}>
        <Chart ref={chartRef} type={type as any} data={data as any} options={mergedOptions as any} />
      </div>
    </div>
  );
}
