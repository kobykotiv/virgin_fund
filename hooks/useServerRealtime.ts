import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * hooks/useServerRealtime.ts
 *
 * Opens an EventSource to the server SSE endpoint at /api/realtime/subscribe
 * and invalidates React Query caches on relevant events.
 *
 * - Listens for events: "bots", "watchlists", "portfolio"
 * - Schedules debounced invalidation for each query key to coalesce bursts
 * - Reconnects with exponential backoff on error/disconnect
 *
 * Notes:
 * - The server endpoint authenticates using the vf_session httpOnly cookie,
 *   so the EventSource should be opened from the same origin so cookies are sent.
 */

export default function useServerRealtime() {
  const qc = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  // Map of scheduled invalidation timers by query key
  const invalidationTimersRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  useEffect(() => {
    let reconnectMs = 1000;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isUnmounted = false;

    const scheduleInvalidate = (queryKey: string, delay = 300) => {
      // Clear previous timer for this key
      try {
        if (invalidationTimersRef.current[queryKey]) {
          clearTimeout(invalidationTimersRef.current[queryKey] as ReturnType<typeof setTimeout>);
        }
      } catch (e) {
        // ignore
      }

      invalidationTimersRef.current[queryKey] = setTimeout(() => {
        try {
          // prefer invalidateQueries by key array for compatibility
          qc.invalidateQueries({ queryKey: [queryKey] });
        } catch (e) {
          // best-effort: swallow
          // console.warn("invalidateQueries failed", e);
        } finally {
          invalidationTimersRef.current[queryKey] = null;
        }
      }, delay);
    };

    const connect = () => {
      if (isUnmounted) return;

      try {
        const es = new EventSource("/api/realtime/subscribe");
        esRef.current = es;

        // Reset backoff on successful open
        es.addEventListener("open", () => {
          reconnectMs = 1000;
        });

        // Listen for bots changes
        es.addEventListener("bots", (ev: MessageEvent) => {
          try {
            // payload may contain helpful metadata, but invalidation is sufficient
            JSON.parse(ev.data);
            scheduleInvalidate("bots");
          } catch (e) {
            // malformed payload — still trigger an invalidate
            scheduleInvalidate("bots");
          }
        });

        // Listen for watchlists changes
        es.addEventListener("watchlists", (ev: MessageEvent) => {
          try {
            JSON.parse(ev.data);
            scheduleInvalidate("watchlists");
          } catch (e) {
            scheduleInvalidate("watchlists");
          }
        });

        // Listen for portfolio changes
        es.addEventListener("portfolio", (ev: MessageEvent) => {
          try {
            JSON.parse(ev.data);
            scheduleInvalidate("portfolio");
          } catch (e) {
            scheduleInvalidate("portfolio");
          }
        });

        // Generic fallback: if server emits 'message' with a key, attempt to handle
        es.addEventListener("message", (ev: MessageEvent) => {
          try {
            const payload = JSON.parse(ev.data);
            if (payload?.table) {
              const table = String(payload.table);
              if (["bots", "watchlists", "portfolio"].includes(table)) {
                scheduleInvalidate(table);
              }
            }
          } catch (e) {
            // ignore non-JSON messages
          }
        });

        es.addEventListener("error", () => {
          // Try reconnect (close current and schedule reconnect with backoff)
          try {
            es.close();
          } catch (e) {
            // ignore
          }
          if (isUnmounted) return;
          reconnectTimer = setTimeout(() => {
            reconnectMs = Math.min(30000, reconnectMs * 2);
            connect();
          }, reconnectMs);
        });
      } catch (e) {
        if (isUnmounted) return;
        reconnectTimer = setTimeout(() => {
          reconnectMs = Math.min(30000, reconnectMs * 2);
          connect();
        }, reconnectMs);
      }
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      try {
        // clear any pending invalidation timers
        Object.values(invalidationTimersRef.current).forEach((t) => {
          if (t) clearTimeout(t);
        });
        esRef.current?.close();
      } catch (e) {
        // ignore
      }
    };
  }, [qc]);
}
