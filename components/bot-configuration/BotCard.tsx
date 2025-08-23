// BotCard: Card UI for a single trading bot in the Bot Army grid.
// Uses shadcn/ui, Framer Motion, and is fully accessible and responsive.

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Play, Pause, StopCircle, Edit, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Bot } from "@/types/bot";

interface BotCardProps {
  bot: Bot;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onEdit?: () => void;
  onClone?: () => void;
  selected?: boolean;
  onSelect?: () => void;
}

export function BotCard({
  bot,
  onStart,
  onPause,
  onStop,
  onEdit,
  onClone,
  selected,
  onSelect,
}: BotCardProps) {
  // Metrics: allocation %, ROI, risk badge (support both camelCase and snake_case for demo/mock)
  const allocation =
    typeof bot.allocation === "number"
      ? bot.allocation
      : typeof (bot as any).capital === "number"
      ? (bot as any).capital
      : undefined;
  const allocationPct = allocation ? Math.round((allocation / 100000) * 100) : 0; // Example denominator

  // Prefer performance for PnL/ROI, fallback to direct fields
  const pnl =
    typeof bot.performance?.totalPnL === "number"
      ? bot.performance.totalPnL
      : typeof (bot as any).pnl === "number"
      ? (bot as any).pnl
      : undefined;
  const roi =
    typeof bot.performance?.pnlPercentage === "number"
      ? bot.performance.pnlPercentage.toFixed(1)
      : typeof pnl === "number" && allocation
      ? ((pnl / allocation) * 100).toFixed(1)
      : "—";

  // Risk badge: prefer metadata.risk, fallback to "medium"
  const risk =
    (bot as any).metadata?.risk ??
    (bot as any).risk ??
    "medium";

  // Status badge color
  const statusColor =
    bot.status === "active"
      ? "bg-green-500 text-white"
      : bot.status === "paused"
      ? "bg-yellow-400 text-black"
      : "bg-gray-300 text-gray-700";

  // Last trade display: prefer lastTradeAt, fallback to last_trade_at
  const lastTradeRaw =
    (bot as any).lastTradeAt ??
    (bot as any).last_trade_at ??
    (bot as any).metadata?.lastTradeAt ??
    undefined;
  const lastTrade = lastTradeRaw
    ? formatDistanceToNow(new Date(lastTradeRaw), { addSuffix: true })
    : "—";

  // Source label: prefer assets, fallback to metadata.assets
  const sourceAssets =
    Array.isArray((bot as any).assets) && (bot as any).assets.length > 0
      ? (bot as any).assets
      : Array.isArray((bot as any).metadata?.assets) && (bot as any).metadata.assets.length > 0
      ? (bot as any).metadata.assets
      : undefined;
  const sourceLabel = sourceAssets ? sourceAssets.join(", ") : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3 }}
      tabIndex={0}
      aria-label={`Bot card for ${bot.name}`}
      className="focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <Card className="rounded-2xl shadow-md bg-card flex flex-col h-full">
        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{bot.name}</CardTitle>
            <CardDescription className="text-xs">{bot.strategy}</CardDescription>
            {sourceLabel && (
              <span className="text-xs text-muted-foreground block mt-1">Assets: {sourceLabel}</span>
            )}
          </div>
          <Badge className={statusColor + " ml-auto"} aria-label={`Status: ${bot.status}`}>
            {bot.status}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono text-green-600" aria-label="Current PnL">
              PnL: {typeof pnl === "number" ? `$${pnl.toFixed(2)}` : "—"}
            </span>
            <span className="font-mono text-blue-600" aria-label="Allocated capital">
              Capital: {typeof allocation === "number" ? `$${allocation.toLocaleString()}` : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last trade: {lastTrade}</span>
          </div>
          {/* Mini-metrics */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" aria-label={`Allocation: ${allocationPct}%`}>
              Allocation: {allocationPct}%
            </Badge>
            <Badge variant="outline" aria-label={`ROI: ${roi}%`}>
              ROI: {roi}%
            </Badge>
            <Badge variant="outline" aria-label={`Risk: ${risk}`}>
              Risk: {risk}
            </Badge>
          </div>
          {/* Allocation progress */}
          <div className="mt-2">
            <Progress value={allocationPct} aria-label="Allocation progress" />
          </div>
          {/* Quick actions */}
          <div className="flex gap-2 mt-3">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Start bot"
              onClick={onStart}
              disabled={bot.status === "active"}
              tabIndex={0}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Pause bot"
              onClick={onPause}
              disabled={bot.status !== "active"}
              tabIndex={0}
            >
              <Pause className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Stop bot"
              onClick={onStop}
              disabled={bot.status === "stopped"}
              tabIndex={0}
            >
              <StopCircle className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Edit bot"
              onClick={onEdit}
              tabIndex={0}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Clone bot"
              onClick={onClone}
              tabIndex={0}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/*
Summary of Changes:
- Created BotCard component for Bot Army grid.
- Shows name, strategy, status, PnL, capital, last trade, allocation %, ROI, risk, and quick actions.
- Uses shadcn/ui, Framer Motion, and is accessible and responsive.
- All actions have ARIA labels and keyboard focus.
*/
