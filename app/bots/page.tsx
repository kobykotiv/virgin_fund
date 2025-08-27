"use client";
import React from 'react';
import { useState } from 'react';
import useBots from '../../hooks/useBots';
import BotCard from '../../components/BotCard';

export default function BotsPage() {
  const [q, setQ] = useState('');
  const { data, isError, isLoading } = useBots();

  if (isLoading) return <div>Loading bots...</div>;
  if (isError) return <div>Error loading bots</div>;
  const items = data || [];

  const filtered = q ? items.filter((b: any) => b.name.toLowerCase().includes(q.toLowerCase()) || b.strategy.toLowerCase().includes(q.toLowerCase())) : items;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bots" className="border p-2 rounded w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b: any) => (
          <BotCard key={b.id} id={b.id} name={b.name} strategy={b.strategy} status={b.status} currentPnL={b.currentPnL} allocatedCapital={b.allocatedCapital} />
        ))}
      </div>
      {filtered.length === 0 && <div className="mt-6 text-center text-muted-foreground">No bots found</div>}
    </div>
  );
}
