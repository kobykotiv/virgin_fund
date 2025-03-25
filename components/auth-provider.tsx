"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication check failed", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo login - in a real app, this would validate credentials
      const mockUser = {
        id: "user-1",
        name: "Demo User",
        email,
        role: "user",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login failed", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo signup - in a real app, this would create a new user
      const mockUser = {
        id: "user-" + Date.now(),
        name,
        email,
        role: "user",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Signup failed", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
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

