import React, { useState } from "react";
import { useBots } from "@/hooks/useBots";
import { Bot } from "@/types/bot";
import { cn } from "@/lib/utils";
import { BotCard } from "./BotCard";

/**
 * BotArmyGrid
 * - Responsive grid/list of bots with loading, error, and empty states.
 * - Placeholders for filters, search, bulk actions, and pagination.
 * - To be extended with BotCard, filters, and actions.
 */
export default function BotArmyGrid() {
  const { data: bots, isLoading, error } = useBots();
  const [search, setSearch] = useState("");
  // TODO: Add filter/sort/pagination state

  // Filter bots by search
  // Use any for runtime safety (API may return partials)
  const filteredBots = (bots as any[])?.filter((bot) =>
    (bot.name?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
    ((bot.strategy?.toLowerCase() ?? bot.type?.toLowerCase() ?? "")).includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* Search box */}
        <input
          className="input input-sm w-64"
          placeholder="Search bots..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* TODO: Add filter/sort dropdowns */}
        {/* TODO: Add bulk actions bar */}
      </div>
      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">Loading bots...</div>
      )}
      {error && (
        <div className="text-center py-8 text-red-500">Failed to load bots</div>
      )}
      {!isLoading && !error && filteredBots.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No bots found</div>
      )}
      <div className={cn(
        "grid gap-4",
        "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}>
        {filteredBots.map((bot: any) => (
          <BotCard key={bot.id ?? bot.name ?? Math.random()} bot={bot} />
        ))}
      </div>
      {/* TODO: Pagination/virtualized list */}
    </div>
  );
}

// Summary of Changes:
// - Scaffolded BotArmyGrid with search, loading/error/empty states, and responsive grid.
// - Placeholders for filters, bulk actions, pagination, and BotCard.
