"use client";

import React, { useMemo, useState } from "react";
import BotCard from "./BotCard";
import useBots from "@/hooks/useBots";
import type { Bot } from "@/types/api";
import BotForm from "@/components/bot-configuration/BotForm";
import { useCreateBot } from "@/hooks/useBots";
import type { CreateBotPayload } from '@/types/api'
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { randomName } from '@/lib/utils/names'

const MOCK_BOTS: Bot[] = [
	{
		id: "1",
		name: "Alpha Grid",
	type: "grid" as any,
	strategy: "grid",
		assets: ["BTCUSD"],
		status: "active",
		currentPnL: 125.5,
		allocation: 5000,
		lastTradeAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	currency: 'USD',
	ownerId: 'system',
	},
	{
		id: "2",
		name: "Stat Arb",
	type: "indicator" as any,
	strategy: "indicator",
		assets: ["AAPL"],
		status: "paused",
		currentPnL: -32.1,
		allocation: 2000,
		lastTradeAt: new Date().toISOString(),
		createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	currency: 'USD',
	ownerId: 'system',
	},
	{
		id: "3",
		name: "MomentumX",
	type: "indicator" as any,
	strategy: "indicator",
		assets: ["QQQ"],
		status: "stopped",
		currentPnL: 0,
		allocation: 1000,
		lastTradeAt: undefined as any,
		createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	currency: 'USD',
	ownerId: 'system',
	},
];

export default function BotArmyGrid() {
	const { data: bots, isLoading, error } = useBots();
	const create = useCreateBot();
	const { toast } = useToast();
	const router = useRouter();
	const [showCreateModal, setShowCreateModal] = useState(false);
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
		<>
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
					<button className="btn btn-outline btn-sm" onClick={() => setShowCreateModal(true)}>Create Bot</button>
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
					<button className="btn" onClick={() => setShowCreateModal(true)}>Create your first bot</button>
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

	{/* Dialog-based BotForm for creating a new bot */}
	<BotForm
			open={showCreateModal}
			onOpenChange={(open) => setShowCreateModal(open)}
			initial={null}
			mode="create"
			onSubmit={async (bot) => {
				const payload: CreateBotPayload = {
					name: bot.name ?? randomName(),
					strategy: bot.strategy ?? 'default',
					capital: bot.capital ?? 10000,
					parameters: bot,
				}
				await create.mutateAsync(payload)
			}}
			onSuccess={() => {
				toast({ title: 'Bot created' });
				try { router.refresh() } catch (e) {}
				setShowCreateModal(false);
			}}
		/>
		</>
	);
}

// Summary of Changes:
// - Scaffolded BotArmyGrid with search, loading/error/empty states, and responsive grid.
// - Placeholders for filters, bulk actions, pagination, and BotCard.
