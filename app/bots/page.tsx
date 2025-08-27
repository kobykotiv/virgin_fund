"use client";
import React from 'react';
import { useState } from 'react';
import { useBots } from '../../hooks/useBots';
import BotCard from '../../components/BotCard';

export default function BotsPage() {
  const [q, setQ] = useState('');
  const { data, error, isLoading } = useBots({ q });

  if (isLoading) return <div>Loading bots...</div>;
  if (error) return <div>Error loading bots</div>;
  const items = data?.items || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bots" className="border p-2 rounded w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b: any) => (
          <BotCard key={b.id} id={b.id} name={b.name} strategy={b.strategy} status={b.status} currentPnL={b.currentPnL} allocatedCapital={b.allocatedCapital} />
        ))}
      </div>
      {items.length === 0 && <div className="mt-6 text-center text-muted-foreground">No bots found</div>}
    </div>
  );
}
// Bots page for Trading Bot Social Platform

import BotArmyGrid from "@/components/bot-configuration/BotArmyGrid";

export default function BotsPage() {
  return (
    <main className="space-y-8">
      <h1 className="text-2xl font-bold">Your Bots</h1>
      <section className="rounded-lg border bg-card p-6">
        <BotArmyGrid />
      </section>
    </main>
  );
}

// Summary of Changes:
// - Created Bots page with placeholder for bot list and management UI.
