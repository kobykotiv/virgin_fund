"use client"

import { useState } from "react"
import { BotType, TradingBot } from "@/types/bot"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Edit, Trash2, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MiniChart } from "@/components/mini-chart"

interface BotListProps {
  filter: BotType | "all"
}

export function BotList({ filter }: BotListProps) {
  // This would be replaced with actual API call/state management
  const [bots, setBots] = useState<TradingBot[]>([])

  const filteredBots = filter === "all" 
    ? bots 
    : bots.filter(bot => bot.type === filter)

  const toggleBotStatus = (botId: string) => {
    setBots(bots.map(bot => 
      bot.id === botId 
        ? { ...bot, isActive: !bot.isActive }
        : bot
    ))
  }

  const deleteBotById = async (botId: string) => {
    // API call would go here
    setBots(bots.filter(bot => bot.id !== botId))
  }

  return (
    <div className="grid gap-4">
      {filteredBots.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No bots found. Create one to get started.
        </div>
      ) : (
        filteredBots.map((bot) => (
          <Card key={bot.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{bot.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {bot.type.toUpperCase()} • {bot.pair}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBotStatus(bot.id)}
                >
                  {bot.isActive ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteBotById(bot.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {bot.performance.totalPnL}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Total P&L
                </div>
              </div>
              <div className="h-20">
                <MiniChart data={bot.performance.history} />
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

