/* @ts-nocheck */
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Settings, Play, Pause, Trash, Plus, ChevronRight } from "lucide-react"
import Image from "next/image"
type ServerBot = {
  id: string;
  user_id?: string;
  name: string;
  strategy?: string;
  status?: string;
  capital?: number;
  pnl?: number;
  last_trade_at?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};
import { SimpleBotConfig, ComplexBotConfig } from "@/components/bot-configuration"
import { useState } from "react"
import { useBots, useCreateBot, useUpdateBot, useDeleteBot } from "@/hooks/useBots"
import { SimpleBotOverview, AdvancedBotOverview, ExpertBotOverview } from "./bot-configuration/bot-overview"
import { BotMainView } from "./bot-configuration/bot-main-view"
import useServerRealtime from "@/hooks/useServerRealtime"
import { motion, AnimatePresence } from "framer-motion"

interface BotHeroProps {
  bot: ServerBot
  onAction: (action: 'start' | 'stop' | 'delete') => void
  isLoading?: boolean
}

export function BotHero({ bot, onAction, isLoading }: BotHeroProps) {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
        <Badge className="w-fit mb-3">{(bot.metadata as any)?.type ?? 'bot'}</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {bot.name}
        </h1>
        <p className="text-white/90 text-lg max-w-3xl mb-6">
          {(bot.metadata as any)?.description ?? ""}
        </p>
        <div className="flex items-center text-white/80 mb-4">
          <Clock className="mr-2 h-4 w-4" />
          <span className="mr-4">Active since {bot.created_at ? new Date(bot.created_at).toLocaleDateString() : '—'}</span>
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>
            Last trade: {((bot.metadata as any)?.lastTradeAt ?? bot.last_trade_at)
              ? new Date(((bot.metadata as any)?.lastTradeAt ?? bot.last_trade_at) as string).toLocaleString()
              : 'No trades yet'}
          </span>
        </div>
        <div className="flex gap-4">
          {/* @ts-ignore */}
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
          {/* @ts-ignore */}
          <Button variant="outline" size="lg">
            <Settings className="mr-2 h-5 w-5" />
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}

export function BotGrid({ bots, onAction }: { bots: ServerBot[], onAction: (botId: string, action: string) => void }) {
  // Start realtime subscription to server SSE endpoint; invalidation handled in the hook
  useServerRealtime();

  const [showConfig, setShowConfig] = useState<'simple' | 'complex' | null>(null)
  const [viewMode, setViewMode] = useState<'simple' | 'advanced' | 'expert'>('simple')

  const renderBotCard = (bot: ServerBot) => {
    switch (viewMode) {
      case 'expert':
        return <ExpertBotOverview bot={bot as any} />
      case 'advanced':
        return <AdvancedBotOverview bot={bot as any} />
      default:
        return <SimpleBotOverview bot={bot as any} />
    }
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {bots.map(bot => (
          <motion.div
            key={bot.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <BotMainView 
              bot={bot as any}
              onAction={(action) => onAction(bot.id, action)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * High-level component that wires hooks -> UI.
 * Uses server-backed React Query hooks to fetch and mutate bots.
 */
export function BotManagement() {
  const { data: bots, isLoading } = useBots();
  const createBot = useCreateBot();
  const updateBot = useUpdateBot();
  const deleteBot = useDeleteBot();

  const handleAction = async (botId: string, action: string) => {
    try {
      if (action === "delete") {
        await deleteBot.mutateAsync(botId);
      } else if (action === "start" || action === "stop") {
        await updateBot.mutateAsync({
          id: botId,
          // map action to status
          ...(action === "start" ? { status: "active" } : { status: "paused" }),
        } as any);
      }
    } catch (e) {
      // swallow; callers can show toast if desired
      console.warn("Bot action failed", e);
    }
  };

  return (
    <div>
      {/* Could add toolbar here (create, filter, etc) */}
      <BotGrid bots={bots ?? []} onAction={handleAction} />
    </div>
  );
}
