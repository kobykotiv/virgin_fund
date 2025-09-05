"use client"

import React, { useEffect, useRef, useState } from "react";
import { useToast } from "./toast-provider";

/**
 * NotificationDrawer
 *
 * Slide-out drawer that displays recent notifications.
 * - Polls /api/notifications periodically (fallbacks to mock data).
 * - Shows unread highlight, timestamps, type icon, concise message.
 * - Supports "Mark all read" and "Clear all" bulk actions.
 * - Accessible: focus trap is not implemented (kept simple), but aria attributes provided.
 *
 * Usage:
 * <NotificationDrawer isOpen={open} onClose={() => setOpen(false)} />
 */

type NotifType = "account" | "bot" | "team" | string;
interface Notification {
  id: string;
  type: NotifType;
  message: string;
  createdAt: string;
  read?: boolean;
  meta?: Record<string, any>;
}

const MOCK: Notification[] = [
  { id: "n1", type: "account", message: "Deposit completed", createdAt: new Date().toISOString(), read: false },
  { id: "n2", type: "bot", message: "Bot 'Arb Bot' paused due to error", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: "n3", type: "team", message: "Alice invited Bob to the team", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
];

const typeIcon = (t: NotifType) => {
  switch (t) {
    case "account":
      return "💰";
    case "bot":
      return "🤖";
    case "team":
      return "👥";
    default:
      return "🔔";
  }
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pollIntervalMs?: number;
}

export default function NotificationDrawer({ isOpen, onClose, pollIntervalMs = 30_000 }: Props) {
  const [items, setItems] = useState<Notification[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("No notifications endpoint");
        const json = await res.json();
        if (!mountedRef.current) return;
        setItems(Array.isArray(json) ? json : MOCK);
      } catch (err) {
        console.warn("Failed to load /api/notifications - using mock", err);
        if (mountedRef.current) setItems(MOCK);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    load();
    const t = setInterval(load, pollIntervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(t);
    };
  }, [pollIntervalMs]);

  const unreadCount = items ? items.filter((i) => !i.read).length : 0;

  const markAllRead = async () => {
    // optimistic update
    setItems((s) => (s ? s.map((i) => ({ ...i, read: true })) : s));
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      push({ type: "success", message: "All notifications marked read" });
    } catch (err) {
      console.warn("Mark all read failed", err);
      push({ type: "error", message: "Failed to mark all read" });
    }
  };

  const clearAll = async () => {
    setItems([]);
    try {
      await fetch("/api/notifications/clear", { method: "DELETE" });
      push({ type: "success", message: "Notifications cleared" });
    } catch (err) {
      console.warn("Clear notifications failed", err);
      push({ type: "error", message: "Failed to clear notifications" });
    }
  };

  const markRead = async (id: string) => {
    setItems((s) => (s ? s.map((i) => (i.id === id ? { ...i, read: true } : i)) : s));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    } catch (err) {
      console.warn("Mark read failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    // Drawer overlay
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="w-96 max-w-full bg-white dark:bg-gray-900 border-l shadow-lg p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">{unreadCount} unread</div>
            <button onClick={markAllRead} className="px-2 py-1 text-sm rounded border" aria-label="Mark all as read">
              Mark all read
            </button>
            <button onClick={clearAll} className="px-2 py-1 text-sm rounded border text-red-600" aria-label="Clear notifications">
              Clear
            </button>
            <button onClick={onClose} className="px-2 py-1 rounded border" aria-label="Close drawer">
              Close
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-160px)] overflow-auto">
          {loading && <div className="text-sm text-gray-500">Loading…</div>}
          {!loading && (!items || items.length === 0) && <div className="text-sm text-gray-500">No notifications</div>}

          <ul className="space-y-3">
            {items?.map((n) => (
              <li key={n.id} className={`p-3 rounded border ${n.read ? "bg-white dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-900/20"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="text-xl" aria-hidden>
                      {typeIcon(n.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{n.message}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="px-2 py-1 text-xs rounded border"
                        aria-label={`Mark notification ${n.id} as read`}
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // optimistic remove single notification
                        setItems((s) => (s ? s.filter((x) => x.id !== n.id) : s));
                        fetch(`/api/notifications/${n.id}`, { method: "DELETE" }).catch((e) => console.warn(e));
                      }}
                      className="px-2 py-1 text-xs rounded border text-red-600"
                      aria-label={`Delete notification ${n.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
