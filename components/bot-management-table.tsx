"use client"

import React, { useEffect, useMemo, useState } from "react";
import ConfirmModal from "./confirm-modal";
import { useToast } from "./toast-provider";

/**
 * BotManagementTable
 *
 * Client-side table listing trading bots with sorting, basic filtering,
 * and actions (edit / start-stop / delete). Uses `/api/bots` GET to load data.
 *
 * Notes:
 * - This component is intentionally defensive: it falls back to local mock data
 *   if the API is not available to keep the UI usable during development.
 * - Delete/start/stop actions optimistically update UI and attempt a network
 *   call; failures are surfaced via toast but do not crash the UI.
 *
 * Accessibility:
 * - Semantic table markup
 * - Buttons include aria-labels
 */

type BotStatus = "active" | "paused" | string;

interface Bot {
  id: string;
  name: string;
  type?: string;
  status?: BotStatus;
  strategy?: string;
  performance?: { pnlPct?: number; totalPnL?: number } | number;
  lastActivity?: string | null;
  createdAt?: string | number | null;
}

const MOCK: Bot[] = [
  { id: "1", name: "Mean Reverter", type: "mean-revert", status: "active", strategy: "Mean Reversion", performance: { pnlPct: 4.2 }, lastActivity: new Date().toISOString() },
  { id: "2", name: "Momentum Bot", type: "momentum", status: "paused", strategy: "Momentum", performance: { pnlPct: -1.3 }, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "3", name: "Arb Bot", type: "arbitrage", status: "active", strategy: "Arbitrage", performance: { pnlPct: 12.1 }, lastActivity: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
];

export default function BotManagementTable() {
  const [bots, setBots] = useState<Bot[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [strategyFilter, setStrategyFilter] = useState<string>("all");

  const [sortKey, setSortKey] = useState<"name" | "status" | "performance" | "lastActivity">("lastActivity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; bot?: Bot }>({ open: false, bot: undefined });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { push } = useToast();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/bots");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (mounted) {
          setBots(Array.isArray(json) ? json : MOCK);
        }
      } catch (err) {
        console.warn("Failed to load /api/bots - using mock data", err);
        if (mounted) {
          setBots(MOCK);
          setError(null); // use mock silently
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

  const strategies = useMemo(() => {
    if (!bots) return [];
    const set = new Set<string>();
    bots.forEach((b) => b.strategy && set.add(String(b.strategy)));
    return Array.from(set);
  }, [bots]);

  const filtered = useMemo(() => {
    if (!bots) return [];
    return bots
      .filter((b) => {
        if (statusFilter !== "all" && String(b.status) !== statusFilter) return false;
        if (strategyFilter !== "all" && String(b.strategy) !== strategyFilter) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          return String(b.name).toLowerCase().includes(q) || String(b.type || "").toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortKey === "name") return dir * String(a.name).localeCompare(String(b.name));
        if (sortKey === "status") return dir * String((a.status || "")).localeCompare(String(b.status || ""));
        if (sortKey === "performance") {
          const pa = typeof a.performance === "number" ? a.performance : (a.performance?.pnlPct ?? 0);
          const pb = typeof b.performance === "number" ? b.performance : (b.performance?.pnlPct ?? 0);
          return dir * (Number(pa) - Number(pb));
        }
        // lastActivity
        const ta = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
        const tb = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
        return dir * (ta - tb);
      });
  }, [bots, statusFilter, strategyFilter, query, sortKey, sortDir]);

  const toggleStartStop = async (bot: Bot) => {
    setActionLoading(bot.id);
    const nextStatus = bot.status === "active" ? "paused" : "active";
    // Optimistic UI
    setBots((prev) => prev?.map((b) => (b.id === bot.id ? { ...b, status: nextStatus } : b)) ?? null);
    try {
      // Attempt to notify backend (best-effort)
      await fetch(`/api/bots/${bot.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextStatus === "active" ? "start" : "stop" }),
      });
      push({ type: "success", message: `Bot "${bot.name}" ${nextStatus === "active" ? "started" : "paused"}.` });
    } catch (err) {
      console.warn("Bot action failed", err);
      push({ type: "error", message: `Failed to ${nextStatus === "active" ? "start" : "pause"} bot; UI updated optimistically.` });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirmed = async (bot: Bot | undefined) => {
    if (!bot) {
      setConfirmDelete({ open: false, bot: undefined });
      return;
    }
    setConfirmDelete({ open: false, bot: undefined });
    setActionLoading(bot.id);
    // Optimistic remove
    setBots((prev) => prev?.filter((b) => b.id !== bot.id) ?? null);
    try {
      await fetch(`/api/bots/${bot.id}`, { method: "DELETE" });
      push({ type: "success", message: `Deleted "${bot.name}"` });
    } catch (err) {
      console.warn("Delete failed", err);
      push({ type: "error", message: `Failed to delete "${bot.name}" on server; removed locally.` });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !bots) {
    return (
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="mt-4 space-y-2">
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border bg-white dark:bg-gray-900 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bot Management</h3>

        <div className="flex items-center gap-2">
          <input
            aria-label="Search bots"
            placeholder="Search by name or type"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 rounded border bg-gray-50 dark:bg-gray-800 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-2 rounded border bg-white dark:bg-gray-800 text-sm"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>

          <select
            value={strategyFilter}
            onChange={(e) => setStrategyFilter(e.target.value)}
            className="px-2 py-2 rounded border bg-white dark:bg-gray-800 text-sm"
            aria-label="Filter by strategy"
          >
            <option value="all">All strategies</option>
            {strategies.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 border rounded overflow-hidden">
            <button
              onClick={() => {
                setSortKey("lastActivity");
                setSortDir((d) => (d === "asc" ? "desc" : "asc"));
              }}
              className="px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-pressed={sortKey === "lastActivity"}
            >
              Last activity {sortKey === "lastActivity" ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              onClick={() => {
                setSortKey("performance");
                setSortDir((d) => (d === "asc" ? "desc" : "asc"));
              }}
              className="px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-pressed={sortKey === "performance"}
            >
              Performance {sortKey === "performance" ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-sm text-gray-600 dark:text-gray-300">
              <th className="px-3 py-2">Bot</th>
              <th className="px-3 py-2">Strategy</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Performance</th>
              <th className="px-3 py-2">Last Activity</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bot) => (
              <tr key={bot.id} className="border-t">
                <td className="px-3 py-3">
                  <div className="font-medium">{bot.name}</div>
                  <div className="text-xs text-gray-500">{bot.type}</div>
                </td>
                <td className="px-3 py-3 text-sm">{bot.strategy}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      bot.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bot.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-sm">
                  {typeof bot.performance === "number"
                    ? `${(bot.performance as number).toFixed(2)}%`
                    : `${Number((bot.performance as any)?.pnlPct ?? 0).toFixed(2)}%`}
                </td>
                <td className="px-3 py-3 text-sm">
                  {bot.lastActivity ? new Date(bot.lastActivity).toLocaleString() : "—"}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => push({ type: "info", message: "Edit flow not implemented in this demo." })}
                      aria-label={`Edit ${bot.name}`}
                      className="px-3 py-1 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleStartStop(bot)}
                      aria-label={`${bot.status === "active" ? "Pause" : "Start"} ${bot.name}`}
                      disabled={actionLoading === bot.id}
                      className="px-3 py-1 rounded bg-primary text-white text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      {actionLoading === bot.id ? "…" : bot.status === "active" ? "Pause" : "Start"}
                    </button>

                    <button
                      onClick={() => setConfirmDelete({ open: true, bot })}
                      aria-label={`Delete ${bot.name}`}
                      className="px-3 py-1 rounded border text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-500">
                  No bots match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmDelete.open}
        title={`Delete ${confirmDelete.bot?.name ?? "bot"}?`}
        description="This action will remove the bot. There is no undo."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setConfirmDelete({ open: false, bot: undefined })}
        onConfirm={() => handleDeleteConfirmed(confirmDelete.bot)}
      />
    </div>
  );
}
