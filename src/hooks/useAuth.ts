import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user || null)
    setIsAuthenticated(!!session?.user)
    setLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setUser(data?.user || null)
    setIsAuthenticated(!!data?.user)
    return { data, error }
  }, [])

  const signUp = useCallback(async (email: string, password: string, captcha: string) => {
    // Wire to backend /v1/register
    const res = await fetch('/v1/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, captcha })
    })
    const result = await res.json()
    return result
  }, [])

  const signUpDemo = useCallback(async () => {
    // Wire to backend /v1/demo
    const res = await fetch('/v1/demo', { method: 'POST' })
    const result = await res.json()
    return result
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return {
    user,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signUpDemo,
    signOut,
  }
}
