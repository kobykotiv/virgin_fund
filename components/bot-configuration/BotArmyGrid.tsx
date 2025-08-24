"use client";

import React, { useMemo, useState } from "react";
import BotCard from "./BotCard";
import useBots from "@/hooks/useBots";
import { Bot } from "@/types/bot";

const MOCK_BOTS: Bot[] = [
	{
		id: "1",
		name: "Alpha Grid",
		strategy: "Grid",
		status: "running",
		currentPnL: 125.5,
		allocatedCapital: 5000,
		lastTrade: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Stat Arb",
		strategy: "Arbitrage",
		status: "paused",
		currentPnL: -32.1,
		allocatedCapital: 2000,
		lastTrade: new Date().toISOString(),
	},
	{
		id: "3",
		name: "MomentumX",
		strategy: "Momentum",
		status: "stopped",
		currentPnL: 0,
		allocatedCapital: 1000,
		lastTrade: null,
	},
];

export default function BotArmyGrid() {
	const { data: bots, isLoading, error } = useBots();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "running" | "paused" | "stopped">("all");
	const [page, setPage] = useState(1);
	const perPage = 12;

	const items: Bot[] = useMemo(() => {
		const source = bots ?? MOCK_BOTS;
		return source;
	}, [bots]);

	const filteredBots: Bot[] = useMemo(() => {
		return (items ?? []).filter((bot) => {
			if (statusFilter !== "all" && bot.status !== statusFilter) return false;
			const q = search.trim().toLowerCase();
			if (!q) return true;
			return (bot.name ?? "").toLowerCase().includes(q) ||
				(bot.strategy ?? bot.type ?? "").toLowerCase().includes(q) ||
				(bot.id ?? "").toLowerCase().includes(q);
		});
	}, [items, search, statusFilter]);

	const total = filteredBots.length;
	const pages = Math.max(1, Math.ceil(total / perPage));
	const pageItems = filteredBots.slice((page - 1) * perPage, page * perPage);

	return (
		<div className="w-full">
			<div className="flex flex-wrap gap-2 mb-4 items-center">
				<input
					className="input input-sm w-64"
					placeholder="Search bots..."
					value={search}
					onChange={e => { setSearch(e.target.value); setPage(1); }}
				/>

				<select
					className="select select-sm"
					value={statusFilter}
					onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
				>
					<option value="all">All statuses</option>
					<option value="running">Running</option>
					<option value="paused">Paused</option>
					<option value="stopped">Stopped</option>
				</select>

				<div className="ml-auto flex items-center gap-2">
					<button className="btn btn-sm">Bulk Start</button>
					<button className="btn btn-sm">Bulk Stop</button>
					<button className="btn btn-outline btn-sm">Create Bot</button>
				</div>
			</div>

			{isLoading && (
				<div className="text-center py-8 text-muted-foreground">Loading bots...</div>
			)}

			{error && !isLoading && (
				<div className="p-4 rounded-lg bg-destructive/5 text-destructive">
					Error loading bots. <span className="font-medium">Try refreshing</span>.
				</div>
			)}

			{!isLoading && !error && filteredBots.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					<div className="mb-4">No bots found.</div>
					<button className="btn">Create your first bot</button>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{pageItems.map((bot) => (
					<BotCard key={bot.id ?? bot.name} bot={bot} />
				))}
			</div>

			<div className="flex items-center justify-between mt-4">
				<div className="text-sm text-muted-foreground">
					Showing {Math.min(total, (page - 1) * perPage + 1)}–{Math.min(total, page * perPage)} of {total}
				</div>
				<div className="space-x-2">
					<button
						className="btn btn-sm"
						disabled={page <= 1}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
					>
						Prev
					</button>
					<button
						className="btn btn-sm"
						disabled={page >= pages}
						onClick={() => setPage((p) => Math.min(pages, p + 1))}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}

// Summary of Changes:
// - Scaffolded BotArmyGrid with search, loading/error/empty states, and responsive grid.
// - Placeholders for filters, bulk actions, pagination, and BotCard.
export interface Bot {
  id: string;
  name: string;
  strategy: string;
  status: string;
  currentPnL: number;
  allocatedCapital: number;
  lastTrade: string | null;
}

type BotWithPnL = Bot & { currentPnL: number };

const item: BotWithPnL = { ...someBotData, currentPnL: 123 };
