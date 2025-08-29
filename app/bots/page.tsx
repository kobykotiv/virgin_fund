"use client"

// Bots page for Trading Bot Social Platform

import { BotArmyGrid } from "@/components/bot-configuration/BotArmyGrid"

export default function BotsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🤖 Bot Army</h1>
        <p className="text-muted-foreground">
          Manage your automated trading bots with full CRUD operations, real-time monitoring, and performance analytics.
        </p>
      </div>

      <BotArmyGrid />
    </div>
  )
}

// Summary of Changes:
// - Created Bots page with placeholder for bot list and management UI.
