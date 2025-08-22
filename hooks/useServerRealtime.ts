import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * hooks/useServerRealtime.ts
 *
 * Opens an EventSource to the server SSE endpoint at /api/realtime/subscribe
 * and invalidates React Query caches on relevant events.
 *
 * - Listens for events: "bots", "portfolio"
 * - Invalidates ["bots"] and ["portfolio"] queries respectively
 * - Reconnects with exponential backoff on error/disconnect
 *
 * Notes:
 * - The server endpoint authenticates using the vf_session httpOnly cookie,
 *   so the EventSource should be opened from the same origin so cookies are sent.
 */

export default function useServerRealtime() {
  const qc = useQueryClient();
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let reconnectMs = 1000;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;

      try {
        const es = new EventSource("/api/realtime/subscribe");
        esRef.current = es;

        // Reset backoff on successful open
        es.addEventListener("open", () => {
          reconnectMs = 1000;
        });

        es.addEventListener("bots", (ev: MessageEvent) => {
          try {
            const payload = JSON.parse(ev.data);
            // Invalidate bots queries so UI refreshes
            qc.invalidateQueries({ queryKey: ["bots"] });
          } catch (e) {
            // ignore malformed payload
            qc.invalidateQueries({ queryKey: ["bots"] });
          }
        });

        es.addEventListener("portfolio", (ev: MessageEvent) => {
          try {
            const payload = JSON.parse(ev.data);
            qc.invalidateQueries({ queryKey: ["portfolio"] });
          } catch (e) {
            qc.invalidateQueries({ queryKey: ["portfolio"] });
          }
        });

        es.addEventListener("error", () => {
          // Try reconnect
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
        esRef.current?.close();
      } catch (e) {
        // ignore
      }
    };
  }, [qc]);
}
