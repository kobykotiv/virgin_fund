import { useState } from "react";

/**
 * hooks/useAuth.ts
 *
 * Minimal client-side hook to call server auth endpoints and rely on httponly cookie session.
 * - login(email, password): POST /api/auth/login -> on success, server sets cookie
 * - logout(): POST /api/auth/logout -> clears cookie
 * - refresh(): POST /api/auth/refresh -> rotates tokens if needed
 *
 * Note: client does not store tokens in localStorage.
 */

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login failed");
        setLoading(false);
        return null;
      }
      setLoading(false);
      return json.user;
    } catch (e: any) {
      setError(e?.message || "Network error");
      setLoading(false);
      return null;
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      return res.ok;
    } catch {
      return false;
    }
  }

  return {
    loading,
    error,
    login,
    logout,
    refresh,
  };
}
