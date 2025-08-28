import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import useBots from '@/hooks/useBots';
import type { Bot as ApiBot } from '@/types/api';

export const BotArmyOverview: React.FC = () => {
  const qc = useQueryClient();
  const { data: bots = [], isLoading, error } = useBots();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(12);

  const startMutation = useMutation({
    mutationFn: async (id: string) => fetch(`/api/bots/${id}/start`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bots'] }),
  });
  const stopMutation = useMutation({
    mutationFn: async (id: string) => fetch(`/api/bots/${id}/stop`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bots'] }),
  });
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => fetch('/api/bots/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }), headers: { 'Content-Type': 'application/json' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bots'] }),
  });

  const filtered = (bots as ApiBot[])
    .filter(b => (b.name || '').toLowerCase().includes(search.toLowerCase()))
    .filter(b => filterStatus === 'all' || (b.status || '').toLowerCase() === filterStatus.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'pnl') return (b.currentPnL || 0) - (a.currentPnL || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  // pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const handleBulk = (action: 'start' | 'stop' | 'delete') => {
    if (action === 'delete') deleteMutation.mutate(selectedBots);
    else selectedBots.forEach(id => action === 'start' ? startMutation.mutate(id) : stopMutation.mutate(id));
    setSelectedBots([]);
  };

  if (isLoading)
    return (
      <div className="p-6">
        <div className="text-lg font-medium">Loading bots...</div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="text-lg font-medium text-red-400">Error loading bots</div>
        <div className="mt-2">
          <Button onClick={() => qc.invalidateQueries({ queryKey: ['bots'] })}>Retry</Button>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bot Army Overview</h2>
        <Button>Create Bot</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Input placeholder="Search bots..." value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="pnl">PnL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedBots.length > 0 && (
        <div className="flex gap-2 mb-4">
          <Button onClick={() => handleBulk('start')}>Start Selected</Button>
          <Button onClick={() => handleBulk('stop')}>Stop Selected</Button>
          <Button variant="destructive" onClick={() => handleBulk('delete')}>Delete Selected</Button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">{total} bot{total !== 1 ? 's' : ''}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm">Per page</div>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {total === 0 ? (
        <div className="p-6 bg-gray-900 rounded">No bots found. Try adjusting filters or create a new bot.</div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" layout>
          {paginated.map((bot) => (
            <motion.div key={bot.id} layout>
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {bot.name}
                  <input
                    type="checkbox"
                    checked={selectedBots.includes(bot.id)}
                    onChange={(e) => setSelectedBots(e.target.checked ? [...selectedBots, bot.id] : selectedBots.filter(id => id !== bot.id))}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Strategy: {bot.strategy || 'N/A'}</p>
                <Badge variant={(bot.status || '').toLowerCase() === 'running' ? 'default' : 'secondary'}>{bot.status}</Badge>
                <p>PnL: ${bot.currentPnL ?? 0}</p>
                <p>Allocated: {bot.capital ? `$${bot.capital}` : 'N/A'}</p>
                <p>Last Trade: {bot.lastTradeAt || 'N/A'}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => startMutation.mutate(bot.id)}>Start</Button>
                  <Button size="sm" onClick={() => stopMutation.mutate(bot.id)}>Stop</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Clone</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          ))}
        </motion.div>
      )}

      {/* pagination controls */}
      {total > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">Page {page + 1} / {totalPages}</div>
          <div className="flex gap-2">
            <Button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</Button>
            <Button disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};
