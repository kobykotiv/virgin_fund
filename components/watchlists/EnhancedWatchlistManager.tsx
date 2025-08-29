"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViewToggle, ViewMode } from '@/components/ui/view-toggle';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { WatchlistCard } from './WatchlistCard';
import { WatchlistTable } from './WatchlistTable';
import { 
  useWatchlists, 
  useCreateWatchlist, 
  useUpdateWatchlist, 
  useDeleteWatchlist,
  useAddSymbol,
  Watchlist 
} from '@/hooks/useWatchlists';
import { Search, Plus, Download, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function EnhancedWatchlistManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddSymbolDialog, setShowAddSymbolDialog] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<Watchlist | null>(null);
  const [targetWatchlistId, setTargetWatchlistId] = useState<string>('');
  
  // Form states
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistProvider, setNewWatchlistProvider] = useState<'alpaca' | 'coingecko'>('alpaca');
  const [newSymbol, setNewSymbol] = useState('');

  // Hooks
  const { data: watchlists = [], isLoading, error } = useWatchlists();
  const createWatchlistMutation = useCreateWatchlist();
  const updateWatchlistMutation = useUpdateWatchlist();
  const deleteWatchlistMutation = useDeleteWatchlist();
  const addSymbolMutation = useAddSymbol();

  // Filter watchlists based on search and filters
  const filteredWatchlists = watchlists.filter((watchlist) => {
    const matchesSearch = !searchTerm || 
      watchlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watchlist.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProvider = providerFilter === 'all' || watchlist.provider === providerFilter;
    
    return matchesSearch && matchesProvider;
  });

  // Get unique providers for filters
  const providers = Array.from(new Set(watchlists.map(watchlist => watchlist.provider)));

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) return;
    
    try {
      await createWatchlistMutation.mutateAsync({
        name: newWatchlistName,
        items: [],
        provider: newWatchlistProvider
      });
      
      toast({
        title: "✅ Watchlist Created",
        description: `${newWatchlistName} has been created successfully.`,
      });
      
      setShowCreateDialog(false);
      setNewWatchlistName('');
      setNewWatchlistProvider('alpaca');
    } catch (error) {
      toast({
        title: "❌ Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create watchlist",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWatchlist = async (watchlistData: Partial<Watchlist>) => {
    if (!editingWatchlist) return;
    
    try {
      await updateWatchlistMutation.mutateAsync({
        id: editingWatchlist.id,
        ...watchlistData
      });
      
      toast({
        title: "✅ Watchlist Updated",
        description: `${watchlistData.name || editingWatchlist.name} has been updated successfully.`,
      });
      
      setEditingWatchlist(null);
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: error instanceof Error ? error.message : "Failed to update watchlist",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWatchlist = async (id: string) => {
    const watchlist = watchlists.find(w => w.id === id);
    if (!watchlist) return;

    if (!confirm(`Are you sure you want to delete "${watchlist.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteWatchlistMutation.mutateAsync(id);
      toast({
        title: "✅ Watchlist Deleted",
        description: `${watchlist.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete watchlist",
        variant: "destructive",
      });
    }
  };

  const handleAddSymbol = async () => {
    if (!newSymbol.trim() || !targetWatchlistId) return;
    
    try {
      await addSymbolMutation.mutateAsync({
        id: targetWatchlistId,
        symbol: newSymbol.toUpperCase()
      });
      
      toast({
        title: "✅ Symbol Added",
        description: `${newSymbol.toUpperCase()} has been added to the watchlist.`,
      });
      
      setShowAddSymbolDialog(false);
      setNewSymbol('');
      setTargetWatchlistId('');
    } catch (error) {
      toast({
        title: "❌ Failed to Add Symbol",
        description: error instanceof Error ? error.message : "Failed to add symbol",
        variant: "destructive",
      });
    }
  };

  const handleEditWatchlist = (watchlist: Watchlist) => {
    setEditingWatchlist(watchlist);
    // For simplicity, we'll just show a toast - in a real app you'd open an edit dialog
    toast({
      title: "🔧 Edit Mode",
      description: `Editing ${watchlist.name} - Feature coming soon!`,
    });
  };

  const handleViewWatchlist = (watchlist: Watchlist) => {
    // Navigate to detailed view or open modal
    toast({
      title: "👁️ Watchlist Details",
      description: `Viewing details for ${watchlist.name}`,
    });
  };

  const handleAddSymbolToWatchlist = (watchlistId: string) => {
    setTargetWatchlistId(watchlistId);
    setShowAddSymbolDialog(true);
  };

  const handleBulkAction = async (action: string, watchlistIds: string[]) => {
    try {
      const promises = watchlistIds.map(id => {
        switch (action) {
          case 'delete': 
            return deleteWatchlistMutation.mutateAsync(id);
          default: 
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      
      toast({
        title: "✅ Bulk Action Complete",
        description: `${action} action applied to ${watchlistIds.length} watchlist(s).`,
      });
    } catch (error) {
      toast({
        title: "❌ Bulk Action Failed",
        description: error instanceof Error ? error.message : "Some operations failed",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    const data = JSON.stringify(filteredWatchlists, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watchlists-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📊 Export Complete",
      description: `${filteredWatchlists.length} watchlist(s) exported successfully.`,
    });
  };

  const getTotalStats = () => {
    const totalSymbols = watchlists.reduce((sum, watchlist) => sum + watchlist.items.length, 0);
    const avgSymbolsPerWatchlist = watchlists.length > 0 ? totalSymbols / watchlists.length : 0;
    const providerCounts = watchlists.reduce((counts, watchlist) => {
      counts[watchlist.provider] = (counts[watchlist.provider] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    return { totalSymbols, avgSymbolsPerWatchlist, providerCounts };
  };

  const stats = getTotalStats();

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">❌ Error loading watchlists: {error.message}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              🔄 Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👁️</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Watchlists</p>
                <p className="text-2xl font-bold">{watchlists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Symbols</p>
                <p className="text-2xl font-bold">{stats.totalSymbols}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-sm text-muted-foreground">Avg per Watchlist</p>
                <p className="text-2xl font-bold">{stats.avgSymbolsPerWatchlist.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <div>
                <p className="text-sm text-muted-foreground">Providers</p>
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(stats.providerCounts).map(([provider, count]) => (
                    <Badge key={provider} variant="secondary" className="text-xs">
                      {provider}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              👁️ Watchlist Management
              <Badge variant="secondary">{filteredWatchlists.length}</Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Watchlist
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="🔍 Search watchlists by name or symbols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              className="px-3 py-2 border rounded-md"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              <option value="all">All Providers</option>
              {providers.map(provider => (
                <option key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Watchlist list */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl">🔄</div>
              <p className="mt-2 text-muted-foreground">Loading watchlists...</p>
            </div>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWatchlists.map((watchlist) => (
                <WatchlistCard
                  key={watchlist.id}
                  watchlist={watchlist}
                  onEdit={handleEditWatchlist}
                  onDelete={handleDeleteWatchlist}
                  onView={handleViewWatchlist}
                  onAddSymbol={handleAddSymbolToWatchlist}
                  loading={isLoading}
                />
              ))}
            </div>
          ) : (
            <WatchlistTable
              watchlists={filteredWatchlists}
              onEdit={handleEditWatchlist}
              onDelete={handleDeleteWatchlist}
              onView={handleViewWatchlist}
              onAddSymbol={handleAddSymbolToWatchlist}
              onBulkAction={handleBulkAction}
              loading={isLoading}
            />
          )}

          {!isLoading && filteredWatchlists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👁️</div>
              <h3 className="text-lg font-semibold mb-2">No watchlists found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || providerFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first watchlist to get started'
                }
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Watchlist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Watchlist Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📝 Create New Watchlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="watchlist-name">Watchlist Name</Label>
              <Input
                id="watchlist-name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="e.g., Tech Stocks"
              />
            </div>
            <div>
              <Label htmlFor="watchlist-provider">Provider</Label>
              <select
                id="watchlist-provider"
                className="w-full p-2 border rounded-md"
                value={newWatchlistProvider}
                onChange={(e) => setNewWatchlistProvider(e.target.value as 'alpaca' | 'coingecko')}
              >
                <option value="alpaca">🏦 Alpaca (Stocks)</option>
                <option value="coingecko">🦎 CoinGecko (Crypto)</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateWatchlist}
                disabled={!newWatchlistName.trim() || createWatchlistMutation.isPending}
              >
                {createWatchlistMutation.isPending ? '🔄 Creating...' : '✅ Create Watchlist'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Symbol Dialog */}
      <Dialog open={showAddSymbolDialog} onOpenChange={setShowAddSymbolDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>➕ Add Symbol to Watchlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="e.g., AAPL, BTC"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSymbol();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddSymbolDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddSymbol}
                disabled={!newSymbol.trim() || addSymbolMutation.isPending}
              >
                {addSymbolMutation.isPending ? '🔄 Adding...' : '✅ Add Symbol'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}