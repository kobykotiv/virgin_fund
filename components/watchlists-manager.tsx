"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, X, AlertCircle, Save, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
}

export function WatchlistsManager() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/alpaca/watchlists');
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch watchlists');
      }
      
      setWatchlists(result.data);
      if (result.data.length > 0 && !activeWatchlist) {
        setActiveWatchlist(result.data[0]);
      }
    } catch (err) {
      console.error('Error fetching watchlists:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createWatchlist = async () => {
    if (!newWatchlistName.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/alpaca/watchlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWatchlistName,
          symbols: [],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create watchlist');
      }
      
      setNewWatchlistName('');
      setIsCreating(false);
      fetchWatchlists();
    } catch (err) {
      console.error('Error creating watchlist:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteWatchlist = async (id: string) => {
    if (!confirm('Are you sure you want to delete this watchlist?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/alpaca/watchlists/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete watchlist');
      }
      
      setActiveWatchlist(null);
      fetchWatchlists();
    } catch (err) {
      console.error('Error deleting watchlist:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addSymbol = () => {
    if (!newSymbol.trim() || !activeWatchlist) return;
    
    const symbol = newSymbol.toUpperCase();
    if (activeWatchlist.symbols.includes(symbol)) {
      setNewSymbol('');
      return;
    }
    
    const updatedSymbols = [...activeWatchlist.symbols, symbol];
    setActiveWatchlist({
      ...activeWatchlist,
      symbols: updatedSymbols,
    });
    setNewSymbol('');
    setHasChanges(true);
  };

  const removeSymbol = (symbol: string) => {
    if (!activeWatchlist) return;
    
    const updatedSymbols = activeWatchlist.symbols.filter(s => s !== symbol);
    setActiveWatchlist({
      ...activeWatchlist,
      symbols: updatedSymbols,
    });
    setHasChanges(true);
  };

  const saveWatchlist = async () => {
    if (!activeWatchlist || !hasChanges) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/alpaca/watchlists/${activeWatchlist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbols: activeWatchlist.symbols,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update watchlist');
      }
      
      setHasChanges(false);
      setEditMode(false);
      fetchWatchlists();
    } catch (err) {
      console.error('Error updating watchlist:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setHasChanges(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Watchlists</CardTitle>
          <Button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? <X className="h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            {isCreating ? 'Cancel' : 'New Watchlist'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isCreating && (
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Watchlist name"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
            />
            <Button onClick={createWatchlist} disabled={loading || !newWatchlistName.trim()}>
              Create
            </Button>
          </div>
        )}
        
        {loading && watchlists.length === 0 ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : watchlists.length === 0 ? (
          <div className="text-center py-6 border rounded">
            <p className="text-muted-foreground mb-2">No watchlists found</p>
            <Button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setIsCreating(true)}>
              Create your first watchlist
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {watchlists.map((watchlist) => (
                <Badge
                  key={watchlist.id}
                  className={`${badgeVariants({ variant: activeWatchlist?.id === watchlist.id ? 'default' : 'outline' })} cursor-pointer`}
                  onClick={() => {
                    if (hasChanges && 
                        !confirm('You have unsaved changes. Discard them?')) {
                      return;
                    }
                    setActiveWatchlist(watchlist);
                    setHasChanges(false);
                    setEditMode(false);
                  }}
                >
                  {watchlist.name} ({watchlist.symbols.length})
                </Badge>
              ))}
            </div>
            
            {activeWatchlist && (
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{activeWatchlist.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button className={buttonVariants({ variant: editMode ? 'default' : 'outline', size: "sm" })} onClick={toggleEditMode}>
                      {editMode ? 'Exit Edit' : 'Edit'}
                    </Button>
                    
                    {editMode && (
                      <>
                        <Button className={buttonVariants({ variant: "destructive", size: "sm" })} onClick={() => deleteWatchlist(activeWatchlist.id)} disabled={loading}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        
                        <Button className={buttonVariants({ variant: "default", size: "sm" })} onClick={saveWatchlist} disabled={loading || !hasChanges}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {editMode && (
                  <div className="flex items-center space-x-2 mb-4">
                    <Input
                      placeholder="Add symbol (e.g., AAPL)"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSymbol();
                        }
                      }}
                    />
                    <Button onClick={addSymbol} disabled={!newSymbol.trim()}>
                      Add
                    </Button>
                  </div>
                )}
                
                {activeWatchlist.symbols.length === 0 ? (
                  <div className="text-center py-6 border rounded">
                    <p className="text-muted-foreground">
                      This watchlist is empty.
                      {editMode ? ' Add some symbols above.' : ''}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          {editMode && <TableHead className="w-24">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Remove duplicates to prevent React key errors */}
                        {Array.from(new Set(activeWatchlist.symbols)).map((symbol) => (
                          <TableRow key={symbol}>
                            <TableCell>{symbol}</TableCell>
                            {editMode && (
                              <TableCell>
                                <Button className={buttonVariants({ variant: "ghost", size: "sm" })} onClick={() => removeSymbol(symbol)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
