"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { DEMO_ACCOUNT } from "@/lib/demo-data"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  email: string
  name: string
  image?: string
  isDemoAccount?: boolean
  demoScenario?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isDemoMode: boolean
  apiKey: string | null
  secretKey: string | null
  isPaper: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  enableDemoMode: (demoScenario?: string) => void
  disableDemoMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [secretKey, setSecretKey] = useState<string | null>(null)
  const [isPaper, setIsPaper] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = () => {
      try {
        const auth = localStorage.getItem("isAuthenticated")
        const userData = localStorage.getItem("user")
        const demoMode = localStorage.getItem("demoMode") === "true"

        setIsDemoMode(demoMode)

        if (auth === "true" && userData) {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        } else if (demoMode) {
          // Auto-login with demo account if demo mode is enabled
          const demoScenario = localStorage.getItem("demo-scenario") || "general"

          // Validate that the demo scenario exists
          if (DEMO_SCENARIOS[demoScenario]) {
            setUser({
              id: "user_" + Math.random().toString(36).substr(2, 9),
              email: "admin@example.com",
              name: "Demo User",
              isDemoAccount: true,
              demoScenario,
            })
            setIsAuthenticated(true)
          } else {
            console.error(`Invalid demo scenario: ${demoScenario}`)
            // Fall back to general demo if the specified scenario doesn't exist
            localStorage.setItem("demo-scenario", "general")
            setUser({
              id: "user_" + Math.random().toString(36).substr(2, 9),
              email: "admin@example.com",
              name: "Demo User",
              isDemoAccount: true,
              demoScenario: "general",
            })
            setIsAuthenticated(true)
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        // Reset to a safe state
        setUser(null)
        setIsAuthenticated(false)
        setIsDemoMode(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Only redirect if we've finished loading and the user is not authenticated
    // AND we're not already on the login page or a public page
    if (
      !isLoading &&
      !isAuthenticated &&
      pathname !== "/login" &&
      !pathname.startsWith("/public") &&
      pathname !== "/"
    ) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Check if this is the demo account login
      if (
        (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) ||
        (email === "admin@example.com" && password === "admin123")
      ) {
        const demoScenario = localStorage.getItem("demo-scenario") || "general"

        const user = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email: email,
          name: "Demo User",
          image: "/placeholder.svg?height=128&width=128",
          isDemoAccount: true,
          demoScenario,
        }
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("demoMode", "true")

        setUser(user)
        setIsAuthenticated(true)
        setIsDemoMode(true)
        router.push("/")
        return
      }

      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0], // Generate a name from the email
      }
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)
      setIsAuthenticated(true)
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to create a new user
      // For this demo, we'll simulate a successful signup
      const mockUser = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        email,
        name
      }
      
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setApiKey(null)
    setSecretKey(null)
    setIsAuthenticated(false)
    setIsDemoMode(false)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("demoMode")
    localStorage.removeItem("demo-scenario")
    setUser(null)
    setIsAuthenticated(false)
    setIsDemoMode(false)
    router.push("/login")
  }

  const enableDemoMode = (demoScenario?: string) => {
    setIsDemoMode(true)

    // Set the demo scenario if provided, otherwise use general
    const scenarioToUse = demoScenario && DEMO_SCENARIOS[demoScenario] ? demoScenario : "general"

    localStorage.setItem("demo-scenario", scenarioToUse)

    // Create a demo user
    const demoUser = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      email: "admin@example.com",
      name: "Demo User",
      image: "/placeholder.svg?height=128&width=128",
      isDemoAccount: true,
      demoScenario: scenarioToUse,
    }

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(demoUser))
    localStorage.setItem("demoMode", "true")
    localStorage.setItem("isAuthenticated", "true")

    // Update state
    setUser(demoUser)
    setIsAuthenticated(true)
  }

  const disableDemoMode = () => {
    localStorage.removeItem("demoMode")
    localStorage.removeItem("demo-scenario")
    setIsDemoMode(false)
    // If the user was only authenticated via demo mode, log them out
    if (user?.isDemoAccount) {
      logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isDemoMode,
        apiKey,
        secretKey,
        isPaper,
        login,
        signup,
        logout,
        enableDemoMode,
        disableDemoMode,
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

