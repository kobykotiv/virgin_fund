"use client"

import React, { useEffect, useState } from "react";
import SummaryWidget from "./summary-widget";
import { PortfolioAllocation } from "./portfolio-allocation";
import ConfirmModal from "./confirm-modal";
import { useToast } from "./toast-provider";

/**
 * PortfolioSummaryCard
 *
 * Displays aggregated portfolio metrics: total portfolio value, active bots count,
 * available cash, and an allocation breakdown. Designed to be defensive: it first
 * attempts to fetch from `/api/portfolio/summary` (recommended) and falls back to
 * mock data on error so the UI remains stable during local dev.
 *
 * Notes:
 * - Keeps markup semantic and accessible (aria-labels on metric tiles).
 * - Uses existing `SummaryWidget` and `PortfolioAllocation` components.
 * - Each metric includes a title attribute that acts as a lightweight tooltip.
 */

interface AllocationItem {
  name: string;
  pct: number;
  color?: string;
}

interface SummaryResponse {
  totalValue: number;
  activeBots: number;
  cash: number;
  allocation: AllocationItem[];
}

const MOCK: SummaryResponse = {
  totalValue: 32150.75,
  activeBots: 3,
  cash: 5120.5,
  allocation: [
    { name: "Large Cap", pct: 40, color: "rgba(66, 133, 244, 0.85)" },
    { name: "Mid Cap", pct: 20, color: "rgba(15, 157, 88, 0.85)" },
    { name: "Small Cap", pct: 15, color: "rgba(244, 180, 0, 0.85)" },
    { name: "Bonds", pct: 15, color: "rgba(219, 68, 55, 0.85)" },
    { name: "Crypto", pct: 5, color: "rgba(145, 68, 219, 0.85)" },
    { name: "Cash", pct: 5, color: "rgba(68, 178, 219, 0.85)" },
  ],
};

const PortfolioSummaryCard: React.FC = () => {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio/summary");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (mounted) {
          setData({
            totalValue: Number(json.totalValue ?? json.total ?? 0),
            activeBots: Number(json.activeBots ?? json.botsActive ?? 0),
            cash: Number(json.cash ?? 0),
            allocation: Array.isArray(json.allocation) ? json.allocation : MOCK.allocation,
          });
        }
      } catch (err) {
        // Fallback to mock data if the endpoint is not available or fails.
        if (mounted) {
          setData(MOCK);
          console.warn("Failed to load /api/portfolio/summary, using mock data:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio/summary");
      if (!res.ok) throw new Error("Failed to refresh");
      const json = await res.json();
      setData({
        totalValue: Number(json.totalValue ?? json.total ?? 0),
        activeBots: Number(json.activeBots ?? json.botsActive ?? 0),
        cash: Number(json.cash ?? 0),
        allocation: Array.isArray(json.allocation) ? json.allocation : MOCK.allocation,
      });
      push({ type: "success", message: "Portfolio refreshed" });
    } catch (err) {
      push({ type: "error", message: "Unable to refresh portfolio — using cached data" });
    } finally {
      setLoading(false);
    }
  };

  if (!data && loading) {
    return (
      <div className="p-6 rounded-lg bg-white dark:bg-gray-900 border shadow">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const allocation = data?.allocation ?? MOCK.allocation;
  const formattedValue = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-900 border shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Portfolio Summary</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            title="Refresh portfolio data"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Refresh portfolio"
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            title="Simulate allocation rebalance"
            aria-label="Rebalance portfolio"
            className="text-sm text-red-600 hover:underline"
          >
            Rebalance
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryWidget
          title="Total Value"
          value={formattedValue(data?.totalValue ?? 0)}
          color="border-transparent"
          icon={<span aria-hidden>💼</span>}
        />
        <SummaryWidget
          title="Active Bots"
          value={data?.activeBots ?? 0}
          color="border-transparent"
          icon={<span aria-hidden>🤖</span>}
        />
        <SummaryWidget
          title="Available Cash"
          value={formattedValue(data?.cash ?? 0)}
          color="border-transparent"
          icon={<span aria-hidden>💵</span>}
        />
        <div className="p-4 rounded border bg-white dark:bg-gray-900">
          <div className="text-sm text-muted font-medium">Allocation</div>
          <div className="mt-2 h-32">
            <PortfolioAllocation />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Hover segments to view details. Data source: {data === MOCK ? "Mock Data" : "Server"}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Rebalance portfolio?"
        description="This is a simulated action for demo. Confirm to simulate a rebalance and show a success toast."
        confirmLabel="Simulate"
        cancelLabel="Cancel"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          push({ type: "success", message: "Rebalance simulated" });
        }}
      />
    </div>
  );
};

export default PortfolioSummaryCard;
