"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, X, RefreshCw, PlusCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<Watchlist | null>(null);
  const [symbolsData, setSymbolsData] = useState<Record<string, SymbolData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    fetchWatchlists();
  }, []);

  useEffect(() => {
    if (activeWatchlist) {
      fetchSymbolsData(activeWatchlist.symbols);
    }
  }, [activeWatchlist]);

  async function fetchWatchlists() {
    try {
      setLoading(true);
      const response = await fetch('/api/market/watchlists');
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch watchlists');
      }
      
      setWatchlists(result.data);
      if (result.data.length > 0) {
        setActiveWatchlist(result.data[0]);
      }
    } catch (err) {
      console.error('Error fetching watchlists:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

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
      const response = await fetch('/api/market/watchlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWatchlistName,
          symbols: []
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create watchlist');
      }
      
      // Refresh watchlists
      fetchWatchlists();
      setIsCreating(false);
      setNewWatchlistName('');
    } catch (err) {
      console.error('Error creating watchlist:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }

  function addSymbol() {
    if (!newSymbol || !activeWatchlist) return;
    
    // In a real app, you would call the API to add a symbol to the watchlist
    // For this mockup, we'll just update the local state
    const symbol = newSymbol.toUpperCase();
    if (activeWatchlist.symbols.includes(symbol)) {
      setNewSymbol('');
      return;
    }
    
    const updatedWatchlist = {
      ...activeWatchlist,
      symbols: [...activeWatchlist.symbols, symbol]
    };
    
    setActiveWatchlist(updatedWatchlist);
    setWatchlists(watchlists.map(w => 
      w.id === updatedWatchlist.id ? updatedWatchlist : w
    ));
    
    // Fetch data for the new symbol
    fetchSymbolsData([symbol]);
    setNewSymbol('');
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Watchlists</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsCreating(true)} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            New Watchlist
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && watchlists.length === 0 ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            Error: {error}
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
                <Button size="sm" onClick={createWatchlist}>Create</Button>
                <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {watchlists.map((watchlist) => (
                <Badge
                  key={watchlist.id}
                  variant={activeWatchlist?.id === watchlist.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveWatchlist(watchlist)}
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
