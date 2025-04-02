"use client"

import { useEffect, useState } from 'react'
import { demoBots } from '@/data/demo-bots'
import { BotCard } from '@/components/bot-card'
import { useAuth } from "@/contexts/auth-context"

export function BotShowcase() {
  const [isClient, setIsClient] = useState(false)
  const { user = null, isDemoMode = true, loading = false } = (() => {
    try {
      return useAuth()
    } catch (error) {
      console.warn("Auth context not available, using demo mode")
      return { user: null, isDemoMode: true, loading: false }
    }
  })()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || loading) return null

  const botsToShow = isDemoMode || !user ? demoBots : []

  return (
    <section className="py-20 overflow-hidden">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {isDemoMode ? "Demo Trading Bots" : "Active Trading Bots"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {botsToShow.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      </div>
    </section>
  )
}
