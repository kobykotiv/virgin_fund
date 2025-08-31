"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  user: { id?: string; email?: string; name?: string; role?: string } | null
  apiKey: string | null
  secretKey: string | null
  isPaper: boolean
  isDemoMode: boolean
  /**
   * Login accepts either server credentials { email, password } or Alpaca credentials { apiKey, secretKey, isPaper }
   */
  login: (credentials: any) => Promise<void>
  logout: () => void
  enableDemoMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple function to verify Alpaca API credentials
async function verifyCredentials(apiKey: string, secretKey: string, isPaper: boolean): Promise<boolean> {
  try {
    const baseUrl = isPaper ? 
      'https://paper-api.alpaca.markets' : 
      'https://api.alpaca.markets'
    
    const response = await fetch(`${baseUrl}/v2/account`, {
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey,
        'Content-Type': 'application/json',
      },
    })
    
    return response.ok
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return false
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ id?: string; email?: string; name?: string; role?: string } | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [secretKey, setSecretKey] = useState<string | null>(null)
  const [isPaper, setIsPaper] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Check for stored credentials on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('alpaca_api_key')
    const storedSecretKey = localStorage.getItem('alpaca_secret_key')
    const storedIsPaper = localStorage.getItem('alpaca_is_paper') === 'true'
    const storedIsDemoMode = localStorage.getItem('is_demo_mode') === 'true'
    
    if (storedIsDemoMode) {
      setIsDemoMode(true)
      setIsAuthenticated(true)
    } else if (storedApiKey && storedSecretKey) {
      setApiKey(storedApiKey)
      setSecretKey(storedSecretKey)
      setIsPaper(storedIsPaper)
      setIsAuthenticated(true)
    }

    // Try to fetch server session (vf_session cookie) to populate user
    ;(async () => {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' })
        if (res.ok) {
          const json = await res.json()
          if (json.user) {
            setUser(json.user)
            setIsAuthenticated(true)
          }
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const login = async (credentials: any) => {
    // If credentials look like Alpaca config, run existing flow
    if (credentials && credentials.apiKey && credentials.secretKey) {
      try {
        const isValid = await verifyCredentials(credentials.apiKey, credentials.secretKey, credentials.isPaper)
        if (!isValid) throw new Error('Invalid credentials')

        localStorage.setItem('alpaca_api_key', credentials.apiKey)
        localStorage.setItem('alpaca_secret_key', credentials.secretKey)
        localStorage.setItem('alpaca_is_paper', String(credentials.isPaper))

        setApiKey(credentials.apiKey)
        setSecretKey(credentials.secretKey)
        setIsPaper(credentials.isPaper)
        setIsAuthenticated(true)

        toast({ title: 'Authenticated successfully', description: 'You are now connected to Alpaca' })
      } catch (error) {
        toast({ title: 'Authentication failed', description: 'Could not verify your Alpaca API credentials', variant: 'destructive' })
        throw error
      }
      return
    }

    // Otherwise assume server email/password login
    if (credentials && credentials.email && credentials.password) {
      try {
        const res = await fetch('/api/auth/server-login', { method: 'POST', body: JSON.stringify({ email: credentials.email, password: credentials.password }), headers: { 'Content-Type': 'application/json' } })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(json.error || 'Login failed')
        }

        // Server sets vf_session cookie; populate user from response
        if (json.user) setUser(json.user)
        setIsAuthenticated(true)
        localStorage.removeItem('is_demo_mode')
      } catch (error) {
        toast({ title: 'Login failed', description: (error as any)?.message || 'Unable to login', variant: 'destructive' })
        throw error
      }
      return
    }

    throw new Error('Unsupported login credentials')
  }

  const logout = () => {
    // Call server logout to clear cookie
    try {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    } catch (e) {
      // ignore
    }

    localStorage.removeItem('alpaca_api_key')
    localStorage.removeItem('alpaca_secret_key')
    localStorage.removeItem('alpaca_is_paper')
    localStorage.removeItem('is_demo_mode')

    setApiKey(null)
    setSecretKey(null)
    setIsAuthenticated(false)
    setIsDemoMode(false)
    setUser(null)

    toast({ title: 'Logged out', description: 'You have been logged out successfully' })
  }

  const enableDemoMode = () => {
    localStorage.setItem('is_demo_mode', 'true')
    setIsDemoMode(true)
    setIsAuthenticated(true)
    
    toast({ 
      title: "Demo mode enabled",
      description: "You are now using the platform with simulated data"
    })
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
  user,
      apiKey,
      secretKey,
      isPaper,
      isDemoMode,
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

