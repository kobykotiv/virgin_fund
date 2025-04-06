import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Settings, Play, Pause, Trash, Plus, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Bot } from "@/types/bot"
import { SimpleBotConfig, ComplexBotConfig } from "@/components/bot-configuration"
import { useState } from "react"
import { SimpleBotOverview, AdvancedBotOverview, ExpertBotOverview } from "./bot-configuration/bot-overview"
import { BotMainView } from "./bot-configuration/bot-main-view"

interface BotHeroProps {
  bot: Bot
  onAction: (action: 'start' | 'stop' | 'delete') => void
  isLoading?: boolean
}

export function BotHero({ bot, onAction, isLoading }: BotHeroProps) {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
        <Badge className="w-fit mb-3">{bot.type}</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {bot.name}
        </h1>
        <p className="text-white/90 text-lg max-w-3xl mb-6">
          {bot.description}
        </p>
        <div className="flex items-center text-white/80 mb-4">
          <Clock className="mr-2 h-4 w-4" />
          <span className="mr-4">Active since {new Date(bot.createdAt).toLocaleDateString()}</span>
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Last trade: {bot.lastTradeAt ? new Date(bot.lastTradeAt).toLocaleString() : 'No trades yet'}</span>
        </div>
        <div className="flex gap-4">
          <Button 
            variant={bot.status === 'active' ? "destructive" : "secondary"} 
            size="lg"
            onClick={() => onAction(bot.status === 'active' ? 'stop' : 'start')}
            disabled={isLoading}
          >
            {bot.status === 'active' ? (
              <><Pause className="mr-2 h-5 w-5" /> Stop Bot</>
            ) : (
              <><Play className="mr-2 h-5 w-5" /> Start Bot</>
            )}
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="mr-2 h-5 w-5" />
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}

export function BotGrid({ bots, onAction }: { bots: Bot[], onAction: (botId: string, action: string) => void }) {
  const [showConfig, setShowConfig] = useState<'simple' | 'complex' | null>(null)
  const [viewMode, setViewMode] = useState<'simple' | 'advanced' | 'expert'>('simple')

  const renderBotCard = (bot: Bot) => {
    switch (viewMode) {
      case 'expert':
        return <ExpertBotOverview bot={bot} />
      case 'advanced':
        return <AdvancedBotOverview bot={bot} />
      default:
        return <SimpleBotOverview bot={bot} />
    }
  }

  return (
    <div className="space-y-8">
      {bots.map(bot => (
        <BotMainView 
          key={bot.id}
          bot={bot}
          onAction={(action) => onAction(bot.id, action)}
        />
      ))}
    </div>
  )
}
