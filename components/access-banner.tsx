"use client"

import React, { useEffect, useState } from "react";
import { useToast } from "./toast-provider";

/**
 * AccessBanner
 *
 * Displays the current user's role and a contextual warning if permissions are insufficient.
 * - Attempts to fetch the current user role from `/api/auth/me`. Falls back to localStorage.
 * - Shows a CTA to request elevated access which POSTS to `/api/access/request` (best-effort).
 * - Updates dynamically when authentication state changes (polls on mount).
 *
 * Accessibility:
 * - Banner is a landmark with role="status" so screen readers are informed of role changes.
 *
 * Usage:
 * <AccessBanner requiredRole="editor" />
 */
interface Props {
  requiredRole?: string; // e.g. "editor" or "admin"
}

export default function AccessBanner({ requiredRole }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchRole = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("No auth endpoint");
        const json = await res.json();
        if (!mounted) return;
        if (json?.role) setRole(String(json.role));
        else if (typeof window !== "undefined") setRole(localStorage.getItem("user_role") ?? "viewer");
      } catch {
        // Fallback
        if (mounted && typeof window !== "undefined") {
          setRole(localStorage.getItem("user_role") ?? "viewer");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRole();
    // small poll to update banner if auth changes elsewhere
    const t = setInterval(fetchRole, 30_000);
    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, []);

  const lacksAccess = requiredRole && role && role !== requiredRole && role !== "admin";

  const requestAccess = async () => {
    try {
      push({ type: "info", message: "Requesting elevated access…" });
      const res = await fetch("/api/access/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestedRole: requiredRole }) });
      if (!res.ok) throw new Error("Request failed");
      push({ type: "success", message: "Access request submitted" });
    } catch (err) {
      console.warn("Access request failed", err);
      push({ type: "error", message: "Failed to submit access request" });
    }
  };

  if (loading || role === null) {
    return null; // don't show while loading
  }

  return (
    <div role="status" aria-live="polite" className="w-full">
      <div className="flex items-center justify-between px-4 py-2 rounded-md bg-blue-50 dark:bg-blue-900/30 border">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <strong>Role:</strong> <span className="ml-1">{role}</span>
          </div>
          {lacksAccess ? (
            <div className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
              You have limited access for this page (required: {requiredRole})
            </div>
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-300">You have sufficient permissions</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lacksAccess && (
            <button
              onClick={requestAccess}
              className="px-3 py-1 rounded bg-primary text-white text-sm"
              aria-label="Request elevated access"
            >
              Request Access
            </button>
          )}
          <button
            onClick={() => {
              const next = role === "viewer" ? "editor" : role === "editor" ? "admin" : "viewer";
              setRole(next);
              try { localStorage.setItem("user_role", next); } catch {}
              push({ type: "info", message: `Role switched to ${next} (demo)` });
            }}
            className="px-2 py-1 rounded border text-sm"
            aria-label="Toggle demo role"
            title="Toggle demo role (client-side only)"
          >
            Toggle Role
          </button>
        </div>
      </div>
    </div>
  );
}
