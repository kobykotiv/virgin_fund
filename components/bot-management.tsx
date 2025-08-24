"use client"

import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
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
import { BotForm } from "@/components/bot-form"
import useBots, { useCreateBot, useUpdateBot, useDeleteBot } from "@/hooks/useBots"
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
  const router = useRouter()
  const { toast } = useToast()
  const { data: bots, isLoading } = useBots();
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBotForEdit, setSelectedBotForEdit] = useState<ServerBot | null>(null)
  const createBot = useCreateBot();
  const updateBot = useUpdateBot();
  const deleteBot = useDeleteBot();

  const handleAction = async (botId: string, action: string) => {
    try {
      // support opening the edit modal from child views
      if (action === "edit") {
        const botToEdit = bots?.find((b: any) => b.id === botId)
        if (botToEdit) {
          setSelectedBotForEdit(botToEdit)
        }
        return
      }

      if (action === "delete") {
        const confirmed = window.confirm("Delete this bot? This action cannot be undone.")
        if (!confirmed) return
        await deleteBot.mutateAsync(botId);
        toast({
          title: "Bot deleted",
          description: "The bot was removed successfully.",
          variant: "destructive",
        })
      } else if (action === "start" || action === "stop") {
        await updateBot.mutateAsync({
          id: botId,
          ...(action === "start" ? { status: "active" } : { status: "paused" }),
        } as any);
        toast({
          title: action === "start" ? "Bot started" : "Bot paused",
          description: `Bot ${action === "start" ? "is now running" : "has been paused"}.`,
        })
      }

      // refresh server-side data if available
      try {
        router.refresh()
      } catch (e) {
        // router.refresh may not be available in some contexts — ignore
      }
    } catch (e) {
      console.error("Bot action failed", e);
      toast({
        title: "Action failed",
        description: e instanceof Error ? e.message : "Failed to perform bot action",
        variant: "destructive",
      })
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">Manage your trading bots</div>
        <div className="flex items-center space-x-2">
          <Button
            className={buttonVariants({ variant: "outline", size: "sm" })}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Bot
          </Button>
        </div>
      </div>

      <BotGrid bots={bots ?? []} onAction={handleAction} />
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            key="create-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-background rounded-lg w-full max-w-3xl shadow-lg"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Create Bot</h2>
                  <button className="text-muted-foreground" onClick={() => setShowCreateModal(false)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <BotForm
                  initialBot={null}
                  onCancel={() => setShowCreateModal(false)}
                  onSubmit={async (botData) => {
                    try {
                      await createBot.mutateAsync(botData as any)
                      toast({ title: "Bot created", description: "Your bot was created successfully." })
                      setShowCreateModal(false)
                      try { router.refresh() } catch (e) {}
                    } catch (e) {
                      toast({ title: "Failed to create bot", description: e instanceof Error ? e.message : "Failed to create bot", variant: "destructive" })
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedBotForEdit && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              transition={{ duration: 0.18 }}
              className="bg-background rounded-lg w-full max-w-3xl shadow-lg"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Edit Bot</h2>
                  <button className="text-muted-foreground" onClick={() => setSelectedBotForEdit(null)} aria-label="Close">
                    ✕
                  </button>
                </div>
                <BotForm
                  initialBot={mapServerBot(selectedBotForEdit)}
                  onCancel={() => setSelectedBotForEdit(null)}
                  onSubmit={async (botData) => {
                    try {
                      await updateBot.mutateAsync({ id: selectedBotForEdit!.id, ...botData } as any)
                      toast({ title: "Bot updated", description: "Your bot changes were saved." })
                      setSelectedBotForEdit(null)
                      try { router.refresh() } catch (e) {}
                    } catch (e) {
                      toast({ title: "Failed to update bot", description: e instanceof Error ? e.message : "Failed to update bot", variant: "destructive" })
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
