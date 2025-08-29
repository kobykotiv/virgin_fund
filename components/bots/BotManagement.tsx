"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViewToggle, ViewMode } from '@/components/ui/view-toggle';
import { Badge } from '@/components/ui/badge';
import { BotCard } from './BotCard';
import { BotTable } from './BotTable';
import { BotWizard } from './BotWizard';
import useBots, { 
  useCreateBot, 
  useUpdateBot, 
  useDeleteBot, 
  useStartBot, 
  usePauseBot, 
  useStopBot 
} from '@/hooks/useBots';
import { Bot } from '@/types/api';
import { Search, Plus, Filter, Download, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function BotManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [strategyFilter, setStrategyFilter] = useState<string>('all');
  const [showWizard, setShowWizard] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);

  // Hooks
  const { data: bots = [], isLoading, error } = useBots();
  const createBotMutation = useCreateBot();
  const updateBotMutation = useUpdateBot();
  const deleteBotMutation = useDeleteBot();
  const startBotMutation = useStartBot();
  const pauseBotMutation = usePauseBot();
  const stopBotMutation = useStopBot();

  // Filter bots based on search and filters
  const filteredBots = bots.filter((bot) => {
    const matchesSearch = !searchTerm || 
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.assets?.some(asset => asset.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || bot.status === statusFilter;
    
    const matchesStrategy = strategyFilter === 'all' || bot.strategy === strategyFilter;
    
    return matchesSearch && matchesStatus && matchesStrategy;
  });

  // Get unique statuses and strategies for filters
  const statuses = Array.from(new Set(bots.map(bot => bot.status)));
  const strategies = Array.from(new Set(bots.map(bot => bot.strategy).filter(Boolean)));

  const handleCreateBot = async (botData: Partial<Bot>) => {
    try {
      await createBotMutation.mutateAsync(botData);
      toast({
        title: "✅ Bot Created",
        description: `${botData.name} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create bot",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBot = async (botData: Partial<Bot>) => {
    if (!editingBot) return;
    
    try {
      await updateBotMutation.mutateAsync({ id: editingBot.id, ...botData });
      toast({
        title: "✅ Bot Updated",
        description: `${botData.name} has been updated successfully.`,
      });
      setEditingBot(null);
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: error instanceof Error ? error.message : "Failed to update bot",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBot = async (id: string) => {
    const bot = bots.find(b => b.id === id);
    if (!bot) return;

    if (!confirm(`Are you sure you want to delete "${bot.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteBotMutation.mutateAsync(id);
      toast({
        title: "✅ Bot Deleted",
        description: `${bot.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete bot",
        variant: "destructive",
      });
    }
  };

  const handleStartBot = async (id: string) => {
    try {
      await startBotMutation.mutateAsync(id);
      const bot = bots.find(b => b.id === id);
      toast({
        title: "▶️ Bot Started",
        description: `${bot?.name} is now running.`,
      });
    } catch (error) {
      toast({
        title: "❌ Start Failed",
        description: error instanceof Error ? error.message : "Failed to start bot",
        variant: "destructive",
      });
    }
  };

  const handlePauseBot = async (id: string) => {
    try {
      await pauseBotMutation.mutateAsync(id);
      const bot = bots.find(b => b.id === id);
      toast({
        title: "⏸️ Bot Paused",
        description: `${bot?.name} has been paused.`,
      });
    } catch (error) {
      toast({
        title: "❌ Pause Failed",
        description: error instanceof Error ? error.message : "Failed to pause bot",
        variant: "destructive",
      });
    }
  };

  const handleStopBot = async (id: string) => {
    try {
      await stopBotMutation.mutateAsync(id);
      const bot = bots.find(b => b.id === id);
      toast({
        title: "⏹️ Bot Stopped",
        description: `${bot?.name} has been stopped.`,
      });
    } catch (error) {
      toast({
        title: "❌ Stop Failed",
        description: error instanceof Error ? error.message : "Failed to stop bot",
        variant: "destructive",
      });
    }
  };

  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot);
    setShowWizard(true);
  };

  const handleBulkAction = async (action: string, botIds: string[]) => {
    try {
      const promises = botIds.map(id => {
        switch (action) {
          case 'start': return startBotMutation.mutateAsync(id);
          case 'pause': return pauseBotMutation.mutateAsync(id);
          case 'stop': return stopBotMutation.mutateAsync(id);
          case 'delete': return deleteBotMutation.mutateAsync(id);
          default: return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      
      toast({
        title: "✅ Bulk Action Complete",
        description: `${action} action applied to ${botIds.length} bot(s).`,
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
    const data = JSON.stringify(filteredBots, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bots-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📊 Export Complete",
      description: `${filteredBots.length} bot(s) exported successfully.`,
    });
  };

  const getTotalStats = () => {
    const running = bots.filter(bot => bot.status === 'running').length;
    const totalCapital = bots.reduce((sum, bot) => sum + (bot.capital || 0), 0);
    const totalPnL = bots.reduce((sum, bot) => sum + (bot.currentPnL || 0), 0);
    
    return { running, totalCapital, totalPnL };
  };

  const stats = getTotalStats();

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600">❌ Error loading bots: {error.message}</p>
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
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Bots</p>
                <p className="text-2xl font-bold">{bots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold">{stats.running}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Capital</p>
                <p className="text-2xl font-bold">
                  ${stats.totalCapital.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stats.totalPnL >= 0 ? '📈' : '📉'}</span>
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${stats.totalPnL.toLocaleString()}
                </p>
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
              🤖 Bot Management
              <Badge variant="secondary">{filteredBots.length}</Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Bot
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
                placeholder="🔍 Search bots by name or assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              className="px-3 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              className="px-3 py-2 border rounded-md"
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
            >
              <option value="all">All Strategies</option>
              {strategies.map(strategy => (
                <option key={strategy} value={strategy}>
                  {strategy?.charAt(0).toUpperCase() + strategy?.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Bot list */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl">🔄</div>
              <p className="mt-2 text-muted-foreground">Loading bots...</p>
            </div>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBots.map((bot) => (
                <BotCard
                  key={bot.id}
                  bot={bot}
                  onStart={handleStartBot}
                  onPause={handlePauseBot}
                  onStop={handleStopBot}
                  onDelete={handleDeleteBot}
                  onEdit={handleEditBot}
                  loading={isLoading}
                />
              ))}
            </div>
          ) : (
            <BotTable
              bots={filteredBots}
              onStart={handleStartBot}
              onPause={handlePauseBot}
              onStop={handleStopBot}
              onDelete={handleDeleteBot}
              onEdit={handleEditBot}
              onBulkAction={handleBulkAction}
              loading={isLoading}
            />
          )}

          {!isLoading && filteredBots.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">No bots found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || strategyFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first trading bot to get started'
                }
              </p>
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Bot
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bot creation/editing wizard */}
      <BotWizard
        open={showWizard}
        onClose={() => {
          setShowWizard(false);
          setEditingBot(null);
        }}
        onSubmit={editingBot ? handleUpdateBot : handleCreateBot}
        editingBot={editingBot}
      />
    </div>
  );
}