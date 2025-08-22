import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Settings, Play, Pause, Trash, Plus, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { Bot as ClientBot } from "@/types/bot"

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

/**
 * Map a server-side bot row to the client-side Bot shape used by UI components.
 * Keeps mapping centralized so components can remain strongly typed.
 */
function mapServerBot(s: ServerBot): ClientBot {
  const meta = (s.metadata ?? {}) as any;
  return {
    id: s.id,
    name: s.name,
    type: (meta.type as any) ?? "basket",
    status: (s.status as any) ?? "paused",
    assets: meta.assets ?? [],
    createdAt: s.created_at ?? new Date().toISOString(),
    updatedAt: s.updated_at ?? new Date().toISOString(),
    performance: undefined,
    allocation: meta.allocation ?? undefined,
    description: meta.description ?? "",
    lastTradeAt: (meta.lastTradeAt as string) ?? (s.last_trade_at as string | undefined) ?? undefined,
    // permissive extra fields used by other UI pieces
    strategy: (s.strategy as any) ?? meta.strategy,
    parameters: meta,
  };
}

interface BotHeroProps {
  bot: ClientBot
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
          <span className="mr-4">Active since {bot.createdAt ? new Date(bot.createdAt).toLocaleDateString() : '—'}</span>
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Last trade: {bot.lastTradeAt ? new Date(bot.lastTradeAt).toLocaleString() : 'No trades yet'}</span>
        </div>
        <div className="flex gap-4">
          <Button
            className={buttonVariants({ variant: bot.status === 'active' ? 'destructive' : 'secondary', size: 'lg' })}
            onClick={() => onAction(bot.status === 'active' ? 'stop' : 'start')}
            disabled={isLoading}
          >
            {bot.status === 'active' ? (
              <><Pause className="mr-2 h-5 w-5" /> Stop Bot</>
            ) : (
              <><Play className="mr-2 h-5 w-5" /> Start Bot</>
            )}
          </Button>
          <Button className={buttonVariants({ variant: "outline", size: "lg" })}>
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

  // Map server rows to client Bot shape once per render
  const clientBots = (bots ?? []).map(mapServerBot);

  const renderBotCard = (bot: ClientBot) => {
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
      <AnimatePresence>
        {clientBots.map(bot => (
          <motion.div
            key={bot.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <BotMainView 
              bot={bot}
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
