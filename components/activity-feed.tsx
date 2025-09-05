"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "./toast-provider";

/**
 * ActivityFeed
 *
 * Chronological activity list for trades, deposits, withdrawals and team events.
 * - Fetches /api/activity (falls back to mock data)
 * - Shows color-coded badges by type
 * - Entries are expandable to reveal details
 * - Accessible: headings, aria attributes, keyboard-expandable via Enter/Space
 */

type ActivityType = "trade" | "deposit" | "withdrawal" | "bot" | "team" | "system";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  amount?: number;
  currency?: string;
  date: string; // ISO
  details?: string;
  relatedId?: string;
  unread?: boolean;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "deposit",
    title: "Deposit received",
    subtitle: "Bank transfer",
    amount: 5000,
    currency: "USD",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    details: "ACH deposit processed and available.",
    unread: false,
  },
  {
    id: "a2",
    type: "trade",
    title: "Executed trade - AAPL",
    subtitle: "Bot: MomentumTrader",
    amount: -1250.5,
    currency: "USD",
    date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    details: "Bought 10 shares AAPL at $125.05 via MomentumTrader.",
    unread: true,
  },
  {
    id: "a3",
    type: "team",
    title: "New member invited",
    subtitle: "Invite sent to charlie@example.com",
    date: new Date().toISOString(),
    details: "Role: viewer. Invitation pending.",
    unread: true,
  },
];

function typeBadgeColor(t: ActivityType) {
  switch (t) {
    case "deposit":
      return "bg-green-100 text-green-800";
    case "withdrawal":
      return "bg-red-100 text-red-800";
    case "trade":
      return "bg-indigo-100 text-indigo-800";
    case "bot":
      return "bg-yellow-100 text-yellow-800";
    case "team":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/activity");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        setItems(Array.isArray(json) ? json : MOCK_ACTIVITY);
      } catch (err) {
        console.warn("Failed to load /api/activity - falling back to mock", err);
        if (mounted) setItems(MOCK_ACTIVITY);
        push({ type: "info", message: "Activity feed is in demo mode (mock data)." });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    setExpanded((s) => ({ ...(s || {}), [id]: !s?.[id] }));
  };

  const markAllRead = async () => {
    // optimistic locally
    setItems((s) => (s ? s.map((i) => ({ ...i, unread: false })) : s));
    try {
      const res = await fetch("/api/activity/mark-read", { method: "POST" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      push({ type: "success", message: "All activities marked read" });
    } catch (err) {
      console.warn("Mark all read failed", err);
      push({ type: "error", message: "Failed to mark activities as read" });
    }
  };

  if (loading || !items) {
    return (
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Activity Feed</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs px-2 py-1 rounded border bg-white dark:bg-gray-800"
            aria-label="Mark all activity as read"
          >
            Mark all read
          </button>
        </div>
      </div>

      <ol role="list" className="space-y-3" aria-live="polite">
        {items.map((it) => (
          <li
            key={it.id}
            className={`p-3 rounded border flex gap-3 items-start ${it.unread ? "ring-2 ring-indigo-200" : ""}`}
          >
            <div className="flex-shrink-0">
              <span
                className={`inline-flex items-center justify-center h-8 w-8 rounded ${typeBadgeColor(it.type)} text-xs font-medium`}
                aria-hidden
              >
                {it.type[0].toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{it.title}</div>
                  {it.subtitle && <div className="text-xs text-gray-500 dark:text-gray-400">{it.subtitle}</div>}
                </div>

                <div className="ml-4 text-right">
                  {typeof it.amount === "number" && (
                    <div className="text-sm font-medium">
                      {it.amount < 0 ? "-" : "+"}
                      {it.currency ?? "USD"} {Math.abs(it.amount).toLocaleString()}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">{new Date(it.date).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => toggle(it.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(it.id);
                    }
                  }}
                  aria-expanded={!!expanded[it.id]}
                  aria-controls={`activity-details-${it.id}`}
                  className="text-xs text-slate-600 hover:underline"
                >
                  {expanded[it.id] ? "Hide details" : "View details"}
                </button>

                {it.unread && <span className="text-xs text-indigo-600">Unread</span>}
              </div>

              {expanded[it.id] && (
                <div id={`activity-details-${it.id}`} className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-200">
                  {it.details ?? "No additional details available."}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
