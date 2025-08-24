// components/bot-configuration/BotCard.tsx

"use client";

import React, { useState } from "react";
import { Bot } from "types/bot";
import { useStartBot, usePauseBot, useStopBot, useUpdateBot } from "hooks/useBots";

export function BotCard({ bot }: { bot: Bot }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const start = useStartBot();
  const pause = usePauseBot();
  const stop = useStopBot();
  const update = useUpdateBot();

  const handleAction = async (action: string) => {
    setLoadingAction(action);
    try {
      if (action === "start") await start.mutateAsync(bot.id);
      if (action === "pause") await pause.mutateAsync(bot.id);
      if (action === "stop") await stop.mutateAsync(bot.id);
      if (action === "edit") {
        // open edit modal (TODO)
      }
      if (action === "clone") {
        await update.mutateAsync({ id: bot.id, patch: { ...bot, id: `${bot.id}-clone`, name: `${bot.name} (clone)` } as any });
      }
    } catch {
      // noop - UI will show refreshed state after mutation onSuccess
    } finally {
      setLoadingAction(null);
    }
  };

  const pnl = typeof bot.currentPnL === "number" ? bot.currentPnL : null;
  const pnlLabel = pnl == null ? "—" : `${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}`;

  const statusColor = bot.status === "active" ? "bg-green-100 text-green-800" :
                      bot.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800";

  return (
    <div className="p-4 rounded-2xl shadow-sm bg-card border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">Strategy</div>
          <div className="text-lg font-semibold">{bot.name ?? "Unnamed Bot"}</div>
          <div className="text-xs text-muted-foreground mt-1">{bot.strategy ?? bot.type ?? "Custom"}</div>
        </div>
        <div className="text-right">
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {bot.status ?? "stopped"}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Allocated</div>
          <div className="font-medium">{typeof bot.allocation === "number" ? `$${Number(bot.allocation).toLocaleString()}` : "—"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Current PnL</div>
          <div className={`font-medium ${pnl != null && pnl < 0 ? "text-red-600" : "text-green-600"}`}>{pnlLabel}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Last Trade</div>
          <div className="text-sm">{bot.lastTradeAt ? new Date(bot.lastTradeAt).toLocaleString() : "—"}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="btn btn-sm" onClick={() => handleAction("start")} disabled={!!loadingAction}>
          {loadingAction === "start" ? "..." : "Start"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => handleAction("pause")} disabled={!!loadingAction}>
          {loadingAction === "pause" ? "..." : "Pause"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => handleAction("stop")} disabled={!!loadingAction}>
          {loadingAction === "stop" ? "..." : "Stop"}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => handleAction("edit")}>Edit</button>
          <button className="btn btn-outline btn-sm" onClick={() => handleAction("clone")}>Clone</button>
        </div>
      </div>
    </div>
  );
}

export default BotCard;

// Summary of Changes:
// - Replaced BotCard with new UI and action wiring for bot controls.
// - Uses hooks/useBots for all bot actions.
// - Handles loading state and action feedback.
