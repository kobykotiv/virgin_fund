"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'

interface AuthContextType {
  isAuthenticated: boolean
  hasApiKey: boolean
  apiKeyHash: string | null
  // Public (non-secret) apiKey identifier; plaintext secret MUST NOT be exposed
  apiKey?: string | null
  // secretKey is intentionally typed as null to prevent accidental access to plaintext secrets in client code
  secretKey?: null
  isPaper: boolean
  isDemoMode: boolean
  tier: string
  user: { email?: string; id?: string } | null
  loading: boolean
  getAccessToken: () => Promise<string | null>
  saveApiKey: (payload: { apiKey: string; secretKey: string; isPaper: boolean }) => Promise<void>
  clearApiKey: () => Promise<void>
  logout: () => Promise<void>
  enableDemoMode: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchApiKeys() {
  try {
    const res = await fetch("/api/api-keys", { credentials: "same-origin" });
    if (!res.ok) return [];
    const json = await res.json().catch(() => ({}));
    return json.keys ?? [];
  } catch {
    return [];
  }
}

// Simple function to verify Alpaca API credentials (keeps existing behavior)
export async function verifyCredentials(apiKey: string, secretKey: string, isPaper: boolean): Promise<{ valid: boolean; error?: string }> {
  try {
    const baseUrl = isPaper ? 
      'https://paper-api.alpaca.markets' : 
      'https://api.alpaca.markets';

    const url = `${baseUrl}/v2/account`;
    const headers = {
      'APCA-API-KEY-ID': apiKey,
      'APCA-API-SECRET-KEY': secretKey,
    };

    const response = await fetch(url, { headers });
    const body = await response.text();

    if (!response.ok) {
      let errorMsg = 'Failed to verify credentials';
      try {
        const json = JSON.parse(body);
        errorMsg = json.message || errorMsg;
      } catch {}
      console.error(errorMsg, body);
      return { valid: false, error: errorMsg };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return { valid: false, error: (error instanceof Error ? error.message : 'Unknown error') };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [apiKeyHash, setApiKeyHash] = useState<string | null>(null)
  // Public identifier for the api key (never store the secret in client state)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isPaper, setIsPaper] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [tier, setTier] = useState<string>("free")
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth session and api-keys from server
  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        // Get Supabase client-side session for convenience (server sets vf_session cookie on login)
        try {
          const { data } = await supabase.auth.getSession()
          const session = data?.session
          if (session && mounted) {
            setUser({ email: session.user?.email ?? undefined, id: session.user?.id })
            setIsAuthenticated(true)
          }
        } catch (e) {
          // non-fatal; session may be server-side only
        }

        // Fetch stored API keys metadata from server (no secrets returned)
        const keys = await fetchApiKeys()
        if (!mounted) return
        if (keys && keys.length > 0) {
          // Use the first key by default
          const k = keys[0]
          setHasApiKey(true)
          setApiKeyHash(k.api_key_hash ?? null)
          setIsPaper(!!k.is_paper)
        } else {
          setHasApiKey(false)
          setApiKeyHash(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => { mounted = false }
  }, [])

  const getAccessToken = async () => {
    try {
      const { data } = await supabase.auth.getSession()
      return data.session?.access_token ?? null
    } catch {
      return null
    }
  }

  // Saves Alpaca API key/secret via server route which encrypts secret server-side.
  // Keeps client-side from storing secrets.
  const saveApiKey = async ({ apiKey, secretKey, isPaper: paper }: { apiKey: string; secretKey: string; isPaper: boolean }) => {
    try {
      // Client-side verify first to give immediate feedback
      const verify = await verifyCredentials(apiKey, secretKey, paper)
      if (!verify.valid) throw new Error(verify.error || "Invalid credentials")

      const res = await fetch("/api/api-keys", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          secret_key: secretKey,
          is_paper: paper,
          name: "Alpaca",
          provider: "alpaca",
        }),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save API key")
      }

      // Server returns key metadata including api_key_hash
      const key = json.key
      setHasApiKey(true)
      setApiKeyHash(key?.api_key_hash ?? null)
      setIsPaper(!!key?.is_paper)

      toast({
        title: "API key saved",
        description: "Your Alpaca API key has been saved securely."
      })
    } catch (e: any) {
      toast({
        title: "Failed to save API key",
        description: e?.message ?? "Unknown error",
        variant: "destructive"
      })
      throw e
    }
  }

  // Clear stored API key on server (optional: you may implement delete endpoint)
  const clearApiKey = async () => {
    try {
      // Attempt to deactivate keys on server if a delete endpoint exists; FALLBACK: inform user to remove via settings
      // For now, call API-KEYS delete endpoint if present
      try {
        const res = await fetch("/api/api-keys", {
          method: "DELETE",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "alpaca" }),
        })
        if (res.ok) {
          setHasApiKey(false)
          setApiKeyHash(null)
          setIsPaper(true)
        }
      } catch {
        // ignore
        setHasApiKey(false)
        setApiKeyHash(null)
      }
      toast({
        title: "API key removed",
        description: "Your Alpaca API key has been removed from the server."
      })
    } catch (e) {
      console.warn("clearApiKey failed", e)
      toast({
        title: "Failed to remove key",
        description: "Could not remove API key"
      })
    }
  }

  const logout = async () => {
    try {
      // Call server logout to clear vf_session cookie / revoke session
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
    } catch {}
    setIsAuthenticated(false)
    setUser(null)
    setHasApiKey(false)
    setApiKeyHash(null)
    setIsDemoMode(false)
    setTier("free")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    })
  }

  const enableDemoMode = () => {
    // Demo mode remains a client-side toggle
    setIsDemoMode(true)
    setIsAuthenticated(true)
    setTier("free")
    toast({
      title: "Demo mode enabled",
      description: "You are now using the platform with simulated data"
    })
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      hasApiKey,
      apiKeyHash,
      apiKey,
      // secretKey intentionally not available client-side
      secretKey: null,
      isPaper,
      isDemoMode,
      tier,
      user,
      loading,
      getAccessToken,
      saveApiKey,
      clearApiKey,
      logout,
      enableDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
