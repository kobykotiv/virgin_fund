"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, X, RefreshCw, PlusCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useWatchlists, useWatchlist, useCreateWatchlist, useAddSymbol } from '@/hooks/useWatchlists';

interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
}

interface SymbolData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function Watchlists() {
  const { data: watchlists = [], isLoading, error } = useWatchlists();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { data: activeWatchlist } = useWatchlist(activeId ?? undefined);
  const [symbolsData, setSymbolsData] = useState<Record<string, SymbolData>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const createWatchlistMutation = useCreateWatchlist();
  const addSymbolMutation = useAddSymbol(activeId ?? undefined);

  useEffect(() => {
    if (!activeId && watchlists.length > 0) setActiveId(watchlists[0].id);
  }, [watchlists, activeId]);

  async function fetchSymbolsData(symbols: string[]) {
    try {
      const data: Record<string, SymbolData> = {};
      
      for (const symbol of symbols) {
        // This would be replaced with a real API call to get current prices
        // For now, we'll use mock data
        data[symbol] = {
          symbol,
          price: Math.random() * 1000 + 50,
          change: (Math.random() * 20) - 10,
          changePercent: (Math.random() * 0.05) - 0.025
        };
      }
      
      setSymbolsData(data);
    } catch (err) {
      console.error('Error fetching symbols data:', err);
    }
  }
  async function createWatchlist() {
    if (!newWatchlistName) return;
    try {
      await createWatchlistMutation.mutateAsync({ name: newWatchlistName, items: [] });
      setIsCreating(false);
      setNewWatchlistName('');
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (activeWatchlist?.symbols && activeWatchlist.symbols.length > 0) {
      fetchSymbolsData(activeWatchlist.symbols);
    } else {
      setSymbolsData({});
    }
  }, [activeWatchlist?.symbols]);

  async function addSymbol() {
    if (!newSymbol || !activeWatchlist) return;
    const symbol = newSymbol.toUpperCase();
    try {
      await addSymbolMutation.mutateAsync(symbol);
      // fetch price for the symbol locally
      fetchSymbolsData([symbol]);
      setNewSymbol('');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Watchlists</CardTitle>
          <Button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setIsCreating(true)} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            New Watchlist
          </Button>
        </div>
      </CardHeader>
      <CardContent>
    {isLoading && watchlists.length === 0 ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
      Error: {error instanceof Error ? error.message : String(error)}
          </div>
        ) : (
          <>
            {isCreating && (
              <div className="flex mb-4 p-2 border rounded">
                <Input
                  placeholder="New watchlist name"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  className="mr-2"
                />
                <Button className={buttonVariants({ size: "sm" })} onClick={createWatchlist}>Create</Button>
                <Button className={buttonVariants({ variant: "ghost", size: "sm" })} onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {watchlists.map((watchlist) => (
                  <Badge
                    key={watchlist.id}
                    className={`${badgeVariants({ variant: activeWatchlist?.id === watchlist.id ? "default" : "outline" })} cursor-pointer`}
                    onClick={() => setActiveId(watchlist.id)}
                  >
                    {watchlist.name}
                  </Badge>
                ))}
            </div>
            
            {activeWatchlist && (
              <>
                <div className="flex mb-4">
                  <Input
                    placeholder="Add symbol (e.g., AAPL)"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={addSymbol}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {activeWatchlist.symbols.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No symbols in this watchlist. Add some symbols to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right">% Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeWatchlist.symbols.map((symbol) => {
                        const data = symbolsData[symbol];
                        return (
                          <TableRow key={symbol}>
                            <TableCell className="font-medium">{symbol}</TableCell>
                            <TableCell className="text-right">
                              {data ? formatCurrency(data.price) : <Skeleton className="h-4 w-20 ml-auto" />}
                            </TableCell>
                            <TableCell className={`text-right ${data && data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {data ? formatCurrency(data.change) : <Skeleton className="h-4 w-16 ml-auto" />}
                            </TableCell>
                            <TableCell className={`text-right ${data && data.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {data ? `${(data.changePercent * 100).toFixed(2)}%` : <Skeleton className="h-4 w-12 ml-auto" />}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
