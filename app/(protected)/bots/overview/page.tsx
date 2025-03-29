"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Plus, AlertTriangle, Robot } from "lucide-react"
import { BotList } from "@/components/bot-list"
import type { Bot as BotType } from "@/types/bot"
import { fetchBots } from "@/lib/bot-api"
import Link from "next/link"

export default function BotsOverviewPage() {
  const [bots, setBots] = useState<BotType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBots()
  }, [])

  const loadBots = async () => {
    try {
      const data = await fetchBots()
      setBots(data)
    } catch (err) {
      setError("Failed to load bots. Please try again later.")
      console.error("Error loading bots:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const activeBots = bots.filter(bot => bot.status === "active")
  const errorBots = bots.filter(bot => bot.status === "error")

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trading Bots</h1>
        <Link href="/bots/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Bot
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBots.length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
            <Robot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeBots.reduce((acc, bot) => acc + (bot.performance?.totalTrades || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all bots</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Win Rate</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeBots.length > 0
                ? `${(
                    (activeBots.reduce(
                      (acc, bot) => acc + (bot.performance?.winRate || 0),
                      0
                    ) /
                      activeBots.length) *
                    100
                  ).toFixed(1)}%`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Active bots only</p>
          </CardContent>
        </Card>
        {errorBots.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Errors Detected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{errorBots.length}</div>
              <p className="text-xs text-red-600">Bots need attention</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bot Status</CardTitle>
          <CardDescription>Overview of all your trading bots and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <BotList 
            bots={bots}
            onEdit={() => {}}
            onDelete={async () => { await loadBots() }}
            onToggleStatus={async () => { await loadBots() }}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}