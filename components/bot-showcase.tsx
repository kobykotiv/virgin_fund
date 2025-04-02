"use client"

import { useEffect, useState } from 'react'
import { demoBots } from '@/data/demo-bots'
import { BotCard } from '@/components/bot-card'
import { useAuth } from "@/contexts/auth-context"

export function BotShowcase() {
  return (
    <section className="p-4 bg-white shadow rounded-lg my-4">
      <h2 className="text-xl font-semibold mb-2">Our Integrations</h2>
      <div className="flex items-center space-x-4">
        <img 
          src="/alpaca-logo.png" 
          alt="Alpaca Markets" 
          className="h-12 w-auto" 
          onError={(e) => ((e.target as HTMLImageElement).src = '/placeholder.png')}
        />
        <div>
          <h3 className="text-lg font-bold">Alpaca Markets</h3>
          <p className="text-sm text-gray-600">
            Trade and fetch real-time market data effortlessly using Alpaca's API.
          </p>
        </div>
      </div>
    </section>
  )
}
