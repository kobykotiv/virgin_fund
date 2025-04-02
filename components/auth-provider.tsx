"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInDemo: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Authentication state persistence
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      const { user, isDemoMode } = JSON.parse(savedAuth)
      setUser(user)
      setIsDemoMode(isDemoMode)
    }
    setIsLoading(false)
  }, [])

  // Protected routes handling
  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup", "/blog", "/forgot-password"]
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    if (!isLoading) {
      if (!user && !isDemoMode && !isPublicPath) {
        router.push("/login")
      } else if ((user || isDemoMode) && (pathname === "/login" || pathname === "/signup")) {
        router.push("/dashboard")
      }
    }
  }, [user, isDemoMode, isLoading, pathname])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // Implement your actual authentication logic here
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error("Authentication failed")

      const userData = await response.json()
      setUser(userData)
      setIsDemoMode(false)
      localStorage.setItem("auth", JSON.stringify({ user: userData, isDemoMode: false }))
      router.push("/dashboard")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signInDemo = async () => {
    setIsLoading(true)
    try {
      setUser(null)
      setIsDemoMode(true)
      localStorage.setItem("auth", JSON.stringify({ user: null, isDemoMode: true }))
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setIsDemoMode(false)
      localStorage.removeItem("auth")
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemoMode,
        signIn,
        signOut,
        signInDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  // Return a safe default state for public routes/components
  if (!context) {
    return {
      user: null,
      isLoading: false,
      isDemoMode: false,
      isAuthenticated: false,
      signIn: async () => {
        throw new Error('Auth provider not initialized')
      },
      signOut: async () => {
        throw new Error('Auth provider not initialized')
      },
      signInDemo: async () => {
        throw new Error('Auth provider not initialized')
      }
    }
  }
  
  return context
}

// Update provider check to allow public access
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isDemoMode, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const publicPaths = ['/', '/login', '/signup', '/blog', '/forgot-password']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  useEffect(() => {
    if (!isLoading && !user && !isDemoMode && !isPublicPath) {
      router.push('/login')
    }
  }, [user, isDemoMode, isLoading, pathname])

  if (isLoading) {
    return null // Or loading spinner
  }

  return children
}

