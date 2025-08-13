"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  apiKey: string | null
  secretKey: string | null
  isPaper: boolean
  isDemoMode: boolean
  tier: string // e.g., 'free', 'basic', 'premium'
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
  const [tier, setTier] = useState<string>("free") // default tier

  // Check for stored credentials on mount
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

  const login = async (credentials: {apiKey: string, secretKey: string, isPaper: boolean}) => {
    try {
      // Verify credentials with Alpaca
      const isValid = await verifyCredentials(
        credentials.apiKey, 
        credentials.secretKey, 
        credentials.isPaper
      )

      if (!isValid) throw new Error('Invalid credentials')

  // Store credentials in localStorage
  localStorage.setItem('alpaca_api_key', credentials.apiKey)
  localStorage.setItem('alpaca_secret_key', credentials.secretKey)
  localStorage.setItem('alpaca_is_paper', String(credentials.isPaper))
  // Set tier from backend/user profile in future
  localStorage.setItem('user_tier', tier)
  setApiKey(credentials.apiKey)
  setSecretKey(credentials.secretKey) 
  setIsPaper(credentials.isPaper)
  setIsAuthenticated(true)
      
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

  const logout = () => {
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

