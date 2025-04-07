"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { supabase, connectMongo, getDatabaseStatus } from '@/lib/db-config'

interface AuthContextType {
  isAuthenticated: boolean
  apiKey: string | null
  secretKey: string | null
  isPaper: boolean
  isDemoMode: boolean
  login: (credentials: {apiKey: string, secretKey: string, isPaper: boolean}) => Promise<void>
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
  }, [])

  const login = async (email: string, password: string, dbType: 'sql' | 'nosql' = 'sql') => {
    try {
      if (dbType === 'sql') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        return data
      } else {
        // MongoDB login through API route
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        if (!response.ok) throw new Error('Login failed')
        return await response.json()
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('alpaca_api_key')
    localStorage.removeItem('alpaca_secret_key')
    localStorage.removeItem('alpaca_is_paper')
    localStorage.removeItem('is_demo_mode')
    
    setApiKey(null)
    setSecretKey(null)
    setIsAuthenticated(false)
    setIsDemoMode(false)
    
    toast({ 
      title: "Logged out",
      description: "You have been logged out successfully"
    })
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

