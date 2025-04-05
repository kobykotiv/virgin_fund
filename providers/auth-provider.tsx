"use client"

import { createContext, useContext, useState, useEffect } from "react"

export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise" | "xl"

type User = {
  email: string
  name?: string
  image?: string
  isDemoAccount?: boolean
  demoScenario?: string
  subscriptionTier: SubscriptionTier
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  enableDemoMode: (demoType: string) => void
  updateSubscription: (tier: SubscriptionTier) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth state
    const checkAuth = () => {
      try {
        const isAuth = localStorage.getItem("isAuthenticated") === "true"
        const storedUser = localStorage.getItem("user")
        if (isAuth && storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth state check failed:", error)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login for demo - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const user = { email, name: "Demo User", subscriptionTier: "free" }
      setUser(user)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("demoMode")
  }

  const enableDemoMode = (demoType: string) => {
    const demoUser = {
      email: "demo@example.com",
      name: "Demo User",
      isDemoAccount: true,
      demoScenario: demoType,
      subscriptionTier: "free"
    }
    setUser(demoUser)
    localStorage.setItem("demoMode", "true")
    localStorage.setItem("user", JSON.stringify(demoUser))
  }

  const updateSubscription = (tier: SubscriptionTier) => {
    if (user) {
      const updatedUser = { ...user, subscriptionTier: tier }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      localStorage.setItem("subscription-tier", tier)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        logout, 
        enableDemoMode,
        updateSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useSubscription() {
  const { user } = useAuth()
  return {
    currentTier: user?.subscriptionTier || "free",
    tierLimits: tierLimitsMap[user?.subscriptionTier || "free"],
    isSubscribed: user?.subscriptionTier !== "free"
  }
}

