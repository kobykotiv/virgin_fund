"use client"

import React, { useEffect, useState } from "react";
import { useToast } from "./toast-provider";

/**
 * TransactionTimeline
 *
 * Vertical timeline showing deposits, withdrawals, and trades in chronological order.
 * - Fetches from `/api/transactions` and falls back to mock data on failure.
 * - Uses color-coded badges for transaction types.
 * - Entries are expandable to reveal full details.
 * - Accessible: buttons have aria-expanded and semantic markup.
 *
 * Notes:
 * - Keep the component client-side so it can poll / refresh in the future.
 * - This implementation is intentionally lightweight and framework-agnostic.
 */

type TxType = "deposit" | "withdrawal" | "trade" | string;

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  currency?: string;
  date: string; // ISO
  related?: { id?: string; name?: string; kind?: string };
  details?: string;
  status?: string;
}

const MOCK: Transaction[] = [
  {
    id: "t1",
    type: "deposit",
    amount: 5000,
    currency: "USD",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    related: { id: "f1", name: "Main Fund", kind: "fund" },
    details: "ACH deposit processed",
    status: "completed",
  },
  {
    id: "t2",
    type: "trade",
    amount: -1200.5,
    currency: "USD",
    date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    related: { id: "b3", name: "Momentum Bot", kind: "bot" },
    details: "Bought 2 shares of XYZ at $600.25 each",
    status: "filled",
  },
  {
    id: "t3",
    type: "withdrawal",
    amount: -300,
    currency: "USD",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    related: { id: "f1", name: "Main Fund", kind: "fund" },
    details: "Bank withdrawal initiated",
    status: "pending",
  },
];

const typeColor = (t: TxType) => {
  switch (t) {
    case "deposit":
      return "bg-green-100 text-green-800";
    case "withdrawal":
      return "bg-red-100 text-red-800";
    case "trade":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amt: number, currency = "USD") => {
  const abs = Math.abs(amt);
  const sign = amt < 0 ? "-" : "";
  return `${sign}${currency} ${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function TransactionTimeline() {
  const [txs, setTxs] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { push } = useToast();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        if (Array.isArray(json)) {
          // ensure consistent shape
          const normalized = json.map((x: any) => ({
            id: String(x.id ?? x.tx_id ?? x._id ?? `${Math.random()}`),
            type: x.type ?? x.txType ?? "trade",
            amount: Number(x.amount ?? x.value ?? 0),
            currency: x.currency ?? "USD",
            date: x.date ?? x.created_at ?? new Date().toISOString(),
            related: x.related ?? x.meta ?? undefined,
            details: x.details ?? x.description ?? "",
            status: x.status ?? "unknown",
          })) as Transaction[];
          setTxs(normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
          setTxs(MOCK);
        }
      } catch (err) {
        console.warn("Failed to load /api/transactions - using mock data", err);
        if (mounted) {
          setTxs(MOCK);
          push({ type: "info", message: "Transactions loaded from mock data (server unavailable)" });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [push]);

  if (loading || !txs) {
    return (
      <div className="p-4 rounded border bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (txs.length === 0) {
    return (
      <div className="p-4 rounded border bg-white dark:bg-gray-900 text-center text-sm text-gray-500">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="p-4 rounded border bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction History</h3>

      <ol className="mt-4 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
        {txs.map((tx) => {
          const isExpanded = !!expanded[tx.id];
          return (
            <li key={tx.id} className="mb-6 pl-6 relative">
              <span
                className={`absolute -left-3 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 ${typeColor(
                  tx.type
                )}`}
                aria-hidden
              >
                {/* Simple icon: first letter */}
                <span className="text-xs font-semibold">{String(tx.type).charAt(0).toUpperCase()}</span>
              </span>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <div className="font-medium text-sm">{formatCurrency(tx.amount, tx.currency)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{tx.related?.name ?? tx.related?.id ?? "—"}</div>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs text-gray-600 bg-gray-100 dark:bg-gray-800">
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    aria-expanded={isExpanded}
                    aria-controls={`tx-details-${tx.id}`}
                    onClick={() => setExpanded((s) => ({ ...s, [tx.id]: !s[tx.id] }))}
                    className="px-3 py-1 text-sm rounded border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {isExpanded ? "Hide" : "Details"}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div id={`tx-details-${tx.id}`} className="mt-3 rounded bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-700 dark:text-gray-200">
                  <div>
                    <strong>Type:</strong> {tx.type}
                  </div>
                  <div>
                    <strong>Amount:</strong> {formatCurrency(tx.amount, tx.currency)}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(tx.date).toLocaleString()}
                  </div>
                  <div>
                    <strong>Related:</strong> {tx.related?.name ?? tx.related?.id ?? "—"}
                  </div>
                  {tx.details && (
                    <div className="mt-2">
                      <strong>Details:</strong>
                      <div className="mt-1 whitespace-pre-wrap">{tx.details}</div>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
