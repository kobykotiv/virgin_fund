import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  alpacaApiKey?: string
  alpacaSecretKey?: string
  isPaper?: boolean
}

interface SessionContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      // In demo mode, create a demo user
      if (typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true') {
        setUser({
          id: 'demo-user',
          email: 'demo@virginfund.com',
          name: 'Demo User',
          alpacaApiKey: process.env.NEXT_PUBLIC_ALPACA_API_KEY || '',
          alpacaSecretKey: process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY || '',
          isPaper: true
        })
        setIsLoading(false)
        return
      }

      // Check if we have a session cookie
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const sessionData = await response.json()
        setUser(sessionData.user)
      }
    } catch (error) {
      console.error('Session check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In demo mode, simulate login
      if (localStorage.getItem('demoMode') === 'true') {
        setUser({
          id: 'demo-user',
          email: email,
          name: 'Demo User',
          alpacaApiKey: process.env.NEXT_PUBLIC_ALPACA_API_KEY || '',
          alpacaSecretKey: process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY || '',
          isPaper: true
        })
        return
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // In demo mode, just clear user
      if (localStorage.getItem('demoMode') === 'true') {
        setUser(null)
        return
      }

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear user anyway
      setUser(null)
    }
  }

  return (
    <SessionContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
