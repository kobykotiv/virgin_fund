"use client"
import React, { useState, useEffect, createContext, useContext } from 'react'
import { createClient } from '@supabase/supabase-js'
import { twMerge } from 'tailwind-merge'
import { LayoutDashboard, Palette, GalleryHorizontal, Boxes, Grid3X3, PlugZap, ScrollText, BadgeDollarSign, UserCog, ChevronLeft, Menu, X, Loader } from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'

// Supabase client - expects NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Minimal theme context (from provided file)
const themes = ['dark', 'light', 'solarized']
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => { }, setTheme: (t: string) => { } })

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(themes[0])
  useEffect(() => {
    // apply minimal theme CSS class
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(prev => themes[(themes.indexOf(prev) + 1) % themes.length])
  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}

// Simple components from the provided UI (trimmed)
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={twMerge('p-6 rounded-xl border-2 bg-white/5', className)}>{children}</div>
)

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }: any) => (
  <button type={type} onClick={onClick} className={twMerge('px-6 py-3 rounded-lg font-bold', className)}>{children}</button>
)

// Authentication modal adapted to Supabase
const AuthenticationModal = ({ onAuthSuccess, onSetDemoUser, message, setMessage }: any) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onAuthSuccess({ uid: data.user?.id, email: data.user?.email, role: 'free' })
    } catch (err: any) {
      setMessage(err?.message || 'Auth failed')
    } finally { setLoading(false) }
  }

  const handleDemo = (role: string) => onSetDemoUser({ uid: `demo-${role}-${Date.now()}`, email: `${role}@demo.local`, role })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-xl p-8 rounded-xl bg-[var(--color-bg-primary)] text-white border-2">
        <button className="absolute top-4 right-4" onClick={() => { }}><X size={20} /></button>
        <h2 className="text-2xl font-bold mb-4">Sign in to PrintVision</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {message && <div className="bg-red-600 p-2 rounded">{message}</div>}
          <input className="w-full p-3 rounded border" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full p-3 rounded border" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">{loading ? <Loader className="animate-spin" /> : 'Sign In'}</Button>
        </form>
        <div className="mt-4 text-center">
          <p className="mb-2">Or try a demo account</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => handleDemo('free')}>Free</Button>
            <Button variant="outline" onClick={() => handleDemo('pro')}>Pro</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PrintVisionEntry() {
  const [user, setUser] = useState<any | null>(null)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    // Listen to Supabase auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ uid: session.user.id, email: session.user.email })
      } else {
        setUser(null)
      }
      setIsAuthReady(true)
    })
    // cleanup
    return () => data.subscription.unsubscribe()
  }, [])

  const handleAuthSuccess = (u: any) => { setUser(u); setAuthMessage(null) }
  const handleSetDemoUser = (demoUser: any) => { setUser(demoUser); setAuthMessage(null) }

  if (!isAuthReady) return <div className="min-h-screen flex items-center justify-center"><Loader size={48} className="animate-spin" /></div>

  return (
    <ThemeProvider>
      {!user ? (
        <AuthenticationModal onAuthSuccess={handleAuthSuccess} onSetDemoUser={handleSetDemoUser} message={authMessage} setMessage={setAuthMessage} />
      ) : (
        <DashboardLayout>
          {/* Simple dashboard content injected as children */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-[var(--color-text-default)]">Welcome, {user.email || user.uid}</h1>
            <p className="text-[var(--color-text-muted)]">Use the sidebar to navigate the PrintVision demo.</p>
          </div>
        </DashboardLayout>
      )}
    </ThemeProvider>
  )
}
