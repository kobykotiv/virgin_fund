"use client"

import { BotGrid } from "@/components/bot/bot-grid"
import { BotStats } from "@/components/bot/bot-stats"
import { NewBotButton } from "@/components/bot/new-bot-button"

export default function BotsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Trading Bots</h2>
        <NewBotButton />
      </div>

      <BotStats />
      
      <div className="border-t">
        <BotGrid />
      </div>
    </div>
  )
}
