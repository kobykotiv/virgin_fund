"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import useAuthClient from "@/hooks/useAuth"

interface User {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  refresh: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Reuse the thin client helper that calls server endpoints
  const authClient = useAuthClient()

  // Fetch current user from server on mount. Server reads httpOnly vf_session cookie.
  useEffect(() => {
    let mounted = true
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" })
        if (!mounted) return
        if (!res.ok) {
          setUser(null)
          return
        }
        const json = await res.json().catch(() => null)
        if (json && json.user) {
          setUser(json.user)
        } else {
          setUser(null)
        }
      } catch (e) {
        console.error("Failed to fetch current user", e)
        setUser(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    fetchMe()

    return () => {
      mounted = false
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const result = await authClient.login(email, password)
      // login may set cookie server-side; fetch the user
      const meRes = await fetch("/api/auth/me")
      if (meRes.ok) {
        const json = await meRes.json().catch(() => null)
        setUser(json?.user ?? null)
        return true
      }
      return !!result
    } catch (error) {
      console.error("Login error", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authClient.logout()
      setUser(null)
    } catch (e) {
      console.error("Logout failed", e)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Attempt to call a server-side register endpoint if present.
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        // If register endpoint not present or failed, surface false.
        return false
      }

      // After successful registration, the server may set the session cookie.
      const meRes = await fetch("/api/auth/me")
      if (meRes.ok) {
        const json = await meRes.json().catch(() => null)
        setUser(json?.user ?? null)
      }
      return true
    } catch (e) {
      console.error("Signup failed", e)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const ok = await authClient.refresh()
      if (ok) {
        // refresh may rotate session; re-fetch user
        const meRes = await fetch("/api/auth/me")
        if (meRes.ok) {
          const json = await meRes.json().catch(() => null)
          setUser(json?.user ?? null)
        }
      }
      return ok
    } catch {
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
        refresh,
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
