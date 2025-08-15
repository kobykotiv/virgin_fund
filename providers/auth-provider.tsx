"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'

interface AuthContextType {
  isAuthenticated: boolean
  apiKey: string | null
  secretKey: string | null
  isPaper: boolean
  isDemoMode: boolean
  tier: string // e.g., 'free', 'basic', 'premium'
  user: { email?: string; id?: string } | null
  loading: boolean
  getAccessToken: () => Promise<string | null>
  login: (credentials: {apiKey: string, secretKey: string, isPaper: boolean}) => Promise<void>
  logout: () => void
  enableDemoMode: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple function to verify Alpaca API credentials
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
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [secretKey, setSecretKey] = useState<string | null>(null)
  const [isPaper, setIsPaper] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [tier, setTier] = useState<string>("free") // default tier
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Sync Supabase auth session and listen for changes
  useEffect(() => {
    let mounted = true
    async function init() {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session && mounted) {
        setUser({ email: session.user.email ?? undefined, id: session.user.id })
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_IN' && session) {
        setUser({ email: session.user.email ?? undefined, id: session.user.id })
        setIsAuthenticated(true)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => {
      mounted = false
      try { listener.subscription.unsubscribe() } catch (_) {}
    }
  }, [])

  // Check for stored Alpaca credentials on mount (keeps existing behavior)
  useEffect(() => {
    const storedApiKey = localStorage.getItem('alpaca_api_key')
    const storedSecretKey = localStorage.getItem('alpaca_secret_key')
    const storedIsPaper = localStorage.getItem('alpaca_is_paper') === 'true'
    const storedIsDemoMode = localStorage.getItem('is_demo_mode') === 'true'
    const storedTier = localStorage.getItem('user_tier') || 'free'
    setTier(storedTier)
    if (storedIsDemoMode) {
      setIsDemoMode(true)
      setIsAuthenticated(true)
    } else if (storedApiKey && storedSecretKey) {
      setApiKey(storedApiKey)
      setSecretKey(storedSecretKey)
      setIsPaper(storedIsPaper)
      setIsAuthenticated(true)
    }
  }, [])

  const getAccessToken = async () => {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  const login = async (credentials: {apiKey: string, secretKey: string, isPaper: boolean}) => {
    try {
      // Verify Alpaca credentials if provided
      if (credentials.apiKey && credentials.secretKey) {
        const result = await verifyCredentials(
          credentials.apiKey, 
          credentials.secretKey, 
          credentials.isPaper
        );

        if (!result.valid) throw new Error(result.error || 'Invalid credentials')

        // Store Alpaca credentials in localStorage
        localStorage.setItem('alpaca_api_key', credentials.apiKey)
        localStorage.setItem('alpaca_secret_key', credentials.secretKey)
        localStorage.setItem('alpaca_is_paper', String(credentials.isPaper))
        // Set tier from backend/user profile in future
        localStorage.setItem('user_tier', tier)
        setApiKey(credentials.apiKey)
        setSecretKey(credentials.secretKey)
        setIsPaper(credentials.isPaper)
        setIsAuthenticated(true)
      }

      toast({ 
        title: "Authenticated successfully",
        description: "You are now connected to Alpaca"
      })
    } catch (error) {
      toast({ 
        title: "Authentication failed",
        description: "Could not verify your Alpaca API credentials",
        variant: "destructive"
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {}

    localStorage.removeItem('alpaca_api_key')
    localStorage.removeItem('alpaca_secret_key')
    localStorage.removeItem('alpaca_is_paper')
    localStorage.removeItem('is_demo_mode')
    localStorage.removeItem('user_tier')
    setApiKey(null)
    setSecretKey(null)
    setIsAuthenticated(false)
    setIsDemoMode(false)
    setTier('free')
    setUser(null)

    toast({ 
      title: "Logged out",
      description: "You have been logged out successfully"
    })
  }

  const enableDemoMode = () => {
    localStorage.setItem('is_demo_mode', 'true')
    setIsDemoMode(true)
    setIsAuthenticated(true)
    setTier('free')

    toast({ 
      title: "Demo mode enabled",
      description: "You are now using the platform with simulated data"
    })
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      apiKey,
      secretKey,
      isPaper,
      isDemoMode,
      tier,
      user,
      loading,
      getAccessToken,
      login,
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

