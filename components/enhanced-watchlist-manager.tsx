"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, X, RefreshCw, Bell, Trash2, Edit } from 'lucide-react';
import { useWatchlists, useCreateWatchlist, useUpdateWatchlist, useDeleteWatchlist, useCreateAlert, useAlerts } from '@/hooks/useWatchlists';
import { useTriggerAlerts } from '@/hooks/useAlerts';
import { useMarketData } from '@/hooks/useMarketData';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface WatchlistItem {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  source: 'alpaca' | 'coingecko';
}

interface AlertFormData {
  symbol: string;
  condition: {
    op: '<=' | '>=' | '==' | '!=';
    price: number;
    volume?: number;
  };
  method: 'in_app' | 'email' | 'webhook';
  webhookUrl?: string;
  name: string;
}

export function EnhancedWatchlistManager() {
  const { toast } = useToast();
  const { data: watchlists = [], isLoading, error } = useWatchlists();
  const { data: alerts = [] } = useAlerts();
  const [activeWatchlistId, setActiveWatchlistId] = useState<string | null>(null);
  const [isCreatingWatchlist, setIsCreatingWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [alertForm, setAlertForm] = useState<AlertFormData>({
    symbol: '',
    condition: { op: '<=', price: 0 },
    method: 'in_app',
    name: ''
  });

  const createWatchlistMutation = useCreateWatchlist();
  const updateWatchlistMutation = useUpdateWatchlist();
  const deleteWatchlistMutation = useDeleteWatchlist();
  const createAlertMutation = useCreateAlert();
  const triggerAlertsMutation = useTriggerAlerts();

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);
  const watchlistSymbols = activeWatchlist?.items || [];

  // Separate symbols by provider
  const alpacaSymbols = watchlistSymbols.filter(s => /^[A-Z]{1,5}$/.test(s));
  const coingeckoSymbols = watchlistSymbols.filter(s => !/^[A-Z]{1,5}$/.test(s));

  // Get live market data for watchlist symbols
  const { data: marketData, isLoading: marketLoading } = useMarketData(
    coingeckoSymbols, // coingecko symbols
    alpacaSymbols, // alpaca symbols
    { realtime: true }
  );

  // Convert market data to display format
  const watchlistItems: WatchlistItem[] = watchlistSymbols.map(symbol => {
    const data = marketData?.[symbol];
    return {
      symbol,
      name: data?.symbol || symbol,
      price: data?.price || 0,
      change: 0, // Would need historical data for proper change calculation
      changePercent: 0,
      source: data?.source || 'alpaca'
    };
  });

  useEffect(() => {
    if (!activeWatchlistId && watchlists.length > 0) {
      setActiveWatchlistId(watchlists[0].id);
    }
  }, [watchlists, activeWatchlistId]);

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) return;
    try {
      await createWatchlistMutation.mutateAsync({
        name: newWatchlistName,
        items: []
      });
      setNewWatchlistName('');
      setIsCreatingWatchlist(false);
      toast({
        title: "Success",
        description: "Watchlist created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create watchlist",
        variant: "destructive"
      });
    }
  };

  const handleAddSymbol = async (symbol: string) => {
    if (!activeWatchlist || !symbol.trim()) return;

    const currentItems = activeWatchlist.items || [];
    if (currentItems.includes(symbol.toUpperCase())) {
      toast({
        title: "Warning",
        description: "Symbol already exists in watchlist",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateWatchlistMutation.mutateAsync({
        id: activeWatchlist.id,
        changes: {
          items: [...currentItems, symbol.toUpperCase()]
        }
      });
      setNewSymbol('');
      toast({
        title: "Success",
        description: `Added ${symbol.toUpperCase()} to watchlist`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add symbol",
        variant: "destructive"
      });
    }
  };

  const handleRemoveSymbol = async (symbol: string) => {
    if (!activeWatchlist) return;

    const currentItems = activeWatchlist.items || [];
    try {
      await updateWatchlistMutation.mutateAsync({
        id: activeWatchlist.id,
        changes: {
          items: currentItems.filter(s => s !== symbol)
        }
      });
      toast({
        title: "Success",
        description: `Removed ${symbol} from watchlist`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove symbol",
        variant: "destructive"
      });
    }
  };

  const handleCreateAlert = async () => {
    if (!activeWatchlist || !alertForm.symbol || !alertForm.name) return;

    try {
      await createAlertMutation.mutateAsync({
        user_id: null, // Will be set by server
        watchlist_id: activeWatchlist.id,
        name: alertForm.name,
        condition: alertForm.condition,
        method: alertForm.method,
        payload: alertForm.method === 'webhook' ? { webhook_url: alertForm.webhookUrl } : {}
      });

      setIsCreatingAlert(false);
      setAlertForm({
        symbol: '',
        condition: { op: '<=', price: 0 },
        method: 'in_app',
        name: ''
      });

      toast({
        title: "Success",
        description: "Alert created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive"
      });
    }
  };

  const handleDeleteWatchlist = async (watchlistId: string) => {
    try {
      await deleteWatchlistMutation.mutateAsync(watchlistId);
      if (activeWatchlistId === watchlistId) {
        setActiveWatchlistId(watchlists.find(w => w.id !== watchlistId)?.id || null);
      }
      toast({
        title: "Success",
        description: "Watchlist deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete watchlist",
        variant: "destructive"
      });
    }
  };

  const handleTriggerAlerts = async () => {
    try {
      const result = await triggerAlertsMutation.mutateAsync();
      toast({
        title: "Alerts Triggered",
        description: `${result.triggeredCount} alert(s) were triggered and notifications sent.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger alerts",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">Error loading watchlists: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Watchlist Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Watchlists</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingWatchlist(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Watchlist
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Create Watchlist Dialog */}
          <Dialog open={isCreatingWatchlist} onOpenChange={setIsCreatingWatchlist}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="watchlist-name">Name</Label>
                  <Input
                    id="watchlist-name"
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                    placeholder="My Watchlist"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingWatchlist(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWatchlist}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Watchlist Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {watchlists.map((watchlist) => (
              <div key={watchlist.id} className="flex items-center gap-1">
                <Badge
                  variant={activeWatchlistId === watchlist.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveWatchlistId(watchlist.id)}
                >
                  {watchlist.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteWatchlist(watchlist.id)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Active Watchlist Content */}
          {activeWatchlist && (
            <div className="space-y-4">
              {/* Add Symbol */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add symbol (e.g., AAPL, BTC)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSymbol(newSymbol)}
                />
                <Button onClick={() => handleAddSymbol(newSymbol)}>
                  Add Symbol
                </Button>
              </div>

              {/* Symbols Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlistItems.map((item) => (
                    <TableRow key={item.symbol}>
                      <TableCell className="font-medium">{item.symbol}</TableCell>
                      <TableCell className="text-right">
                        {marketLoading ? (
                          <div className="animate-pulse h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                        ) : (
                          formatCurrency(item.price)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{item.source}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSymbol(item.symbol)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Alerts</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerAlerts}
                disabled={triggerAlertsMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${triggerAlertsMutation.isPending ? 'animate-spin' : ''}`} />
                {triggerAlertsMutation.isPending ? 'Triggering...' : 'Trigger Alerts'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingAlert(true)}
                disabled={!activeWatchlist}
              >
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Create Alert Dialog */}
          <Dialog open={isCreatingAlert} onOpenChange={setIsCreatingAlert}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alert-name">Alert Name</Label>
                  <Input
                    id="alert-name"
                    value={alertForm.name}
                    onChange={(e) => setAlertForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Price Alert"
                  />
                </div>

                <div>
                  <Label htmlFor="alert-symbol">Symbol</Label>
                  <Select
                    value={alertForm.symbol}
                    onValueChange={(value) => setAlertForm(prev => ({ ...prev, symbol: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchlistSymbols.map((symbol) => (
                        <SelectItem key={symbol} value={symbol}>
                          {symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alert-op">Condition</Label>
                    <Select
                      value={alertForm.condition.op}
                      onValueChange={(value: any) => setAlertForm(prev => ({
                        ...prev,
                        condition: { ...prev.condition, op: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<=">Price ≤</SelectItem>
                        <SelectItem value=">=">Price ≥</SelectItem>
                        <SelectItem value="==">Price =</SelectItem>
                        <SelectItem value="!=">Price ≠</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="alert-price">Target Price</Label>
                    <Input
                      id="alert-price"
                      type="number"
                      step="0.01"
                      value={alertForm.condition.price}
                      onChange={(e) => setAlertForm(prev => ({
                        ...prev,
                        condition: { ...prev.condition, price: parseFloat(e.target.value) || 0 }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="alert-method">Delivery Method</Label>
                  <Select
                    value={alertForm.method}
                    onValueChange={(value: any) => setAlertForm(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_app">In-App Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {alertForm.method === 'webhook' && (
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      type="url"
                      value={alertForm.webhookUrl || ''}
                      onChange={(e) => setAlertForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      placeholder="https://your-app.com/webhook"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingAlert(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlert}>
                    Create Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Alerts List */}
          <div className="space-y-2">
            {alerts
              .filter(alert => alert.watchlist_id === activeWatchlistId)
              .map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{alert.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.condition?.symbol} {alert.condition?.op} {formatCurrency(alert.condition?.price || 0)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{alert.method}</Badge>
                    <Switch
                      checked={alert.is_active}
                      onCheckedChange={(checked) => {
                        // Update alert active status
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
