"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ViewToggle, ViewMode } from '@/components/ui/view-toggle';
import { Badge } from '@/components/ui/badge';
import { PortfolioCard } from './PortfolioCard';
import { PortfolioTable } from './PortfolioTable';
import { PortfolioWizard } from './PortfolioWizard';
import { 
  usePortfolios, 
  useCreatePortfolio, 
  useUpdatePortfolio, 
  useDeletePortfolio,
  useRebalancePortfolio,
  Portfolio 
} from '@/hooks/usePortfolios';
import { Search, Plus, Download, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function PortfolioManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [showWizard, setShowWizard] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);

  // Hooks
  const { data: portfolios = [], isLoading, error } = usePortfolios();
  const createPortfolioMutation = useCreatePortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();
  const rebalancePortfolioMutation = useRebalancePortfolio();

  // Filter portfolios based on search and filters
  const filteredPortfolios = portfolios.filter((portfolio) => {
    const matchesSearch = !searchTerm || 
      portfolio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.allocation?.some(alloc => 
        alloc.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCurrency = currencyFilter === 'all' || portfolio.currency === currencyFilter;
    
    return matchesSearch && matchesCurrency;
  });

  // Get unique currencies for filters
  const currencies = Array.from(new Set(portfolios.map(portfolio => portfolio.currency)));

  const handleCreatePortfolio = async (portfolioData: Partial<Portfolio>) => {
    try {
      await createPortfolioMutation.mutateAsync(portfolioData);
      toast({
        title: "✅ Portfolio Created",
        description: `${portfolioData.name} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create portfolio",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePortfolio = async (portfolioData: Partial<Portfolio>) => {
    if (!editingPortfolio) return;
    
    try {
      await updatePortfolioMutation.mutateAsync({ id: editingPortfolio.id, ...portfolioData });
      toast({
        title: "✅ Portfolio Updated",
        description: `${portfolioData.name} has been updated successfully.`,
      });
      setEditingPortfolio(null);
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: error instanceof Error ? error.message : "Failed to update portfolio",
        variant: "destructive",
      });
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    const portfolio = portfolios.find(p => p.id === id);
    if (!portfolio) return;

    if (!confirm(`Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deletePortfolioMutation.mutateAsync(id);
      toast({
        title: "✅ Portfolio Deleted",
        description: `${portfolio.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete portfolio",
        variant: "destructive",
      });
    }
  };

  const handleRebalancePortfolio = async (portfolio: Portfolio) => {
    if (!portfolio.allocation || portfolio.allocation.length === 0) {
      toast({
        title: "❌ Rebalancing Failed",
        description: "Portfolio has no allocation targets to rebalance to.",
        variant: "destructive",
      });
      return;
    }

    try {
      await rebalancePortfolioMutation.mutateAsync({
        portfolioId: portfolio.id,
        targetAllocation: portfolio.allocation
      });
      toast({
        title: "⚖️ Portfolio Rebalanced",
        description: `${portfolio.name} has been rebalanced successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Rebalancing Failed",
        description: error instanceof Error ? error.message : "Failed to rebalance portfolio",
        variant: "destructive",
      });
    }
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setShowWizard(true);
  };

  const handleViewPortfolio = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    // Here you could navigate to a detailed portfolio view
    // For now, we'll just show a toast
    toast({
      title: "📊 Portfolio Details",
      description: `Viewing details for ${portfolio.name}`,
    });
  };

  const handleBulkAction = async (action: string, portfolioIds: string[]) => {
    try {
      const promises = portfolioIds.map(id => {
        const portfolio = portfolios.find(p => p.id === id);
        if (!portfolio) return Promise.resolve();
        
        switch (action) {
          case 'rebalance': 
            return portfolio.allocation?.length 
              ? rebalancePortfolioMutation.mutateAsync({
                  portfolioId: id,
                  targetAllocation: portfolio.allocation
                })
              : Promise.resolve();
          case 'delete': 
            return deletePortfolioMutation.mutateAsync(id);
          default: 
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      
      toast({
        title: "✅ Bulk Action Complete",
        description: `${action} action applied to ${portfolioIds.length} portfolio(s).`,
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
    const data = JSON.stringify(filteredPortfolios, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolios-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "📊 Export Complete",
      description: `${filteredPortfolios.length} portfolio(s) exported successfully.`,
    });
  };

  const getTotalStats = () => {
    const totalValue = portfolios.reduce((sum, portfolio) => 
      sum + (portfolio.valueUsd || portfolio.balance || 0), 0
    );
    const totalPnL = portfolios.reduce((sum, portfolio) => 
      sum + (portfolio.pnlUsd || 0), 0
    );
    const avgDailyChange = portfolios.length > 0 
      ? portfolios.reduce((sum, portfolio) => sum + (portfolio.dailyChangePct || 0), 0) / portfolios.length
      : 0;
    
    return { totalValue, totalPnL, avgDailyChange };
  };

  const stats = getTotalStats();

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600">❌ Error loading portfolios: {error.message}</p>
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
              <span className="text-2xl">💼</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolios</p>
                <p className="text-2xl font-bold">{portfolios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">
                  ${stats.totalValue.toLocaleString()}
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
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stats.avgDailyChange >= 0 ? '🟢' : '🔴'}</span>
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily Change</p>
                <p className={`text-2xl font-bold ${
                  stats.avgDailyChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.avgDailyChange > 0 ? '+' : ''}{stats.avgDailyChange.toFixed(2)}%
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
              💼 Portfolio Management
              <Badge variant="secondary">{filteredPortfolios.length}</Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Portfolio
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
                placeholder="🔍 Search portfolios by name, description, or assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              className="px-3 py-2 border rounded-md"
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
            >
              <option value="all">All Currencies</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Portfolio list */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl">🔄</div>
              <p className="mt-2 text-muted-foreground">Loading portfolios...</p>
            </div>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPortfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onEdit={handleEditPortfolio}
                  onDelete={handleDeletePortfolio}
                  onView={handleViewPortfolio}
                  onRebalance={handleRebalancePortfolio}
                  loading={isLoading}
                />
              ))}
            </div>
          ) : (
            <PortfolioTable
              portfolios={filteredPortfolios}
              onEdit={handleEditPortfolio}
              onDelete={handleDeletePortfolio}
              onView={handleViewPortfolio}
              onRebalance={handleRebalancePortfolio}
              onBulkAction={handleBulkAction}
              loading={isLoading}
            />
          )}

          {!isLoading && filteredPortfolios.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-lg font-semibold mb-2">No portfolios found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || currencyFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first portfolio to get started'
                }
              </p>
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Portfolio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio creation/editing wizard */}
      <PortfolioWizard
        open={showWizard}
        onClose={() => {
          setShowWizard(false);
          setEditingPortfolio(null);
        }}
        onSubmit={editingPortfolio ? handleUpdatePortfolio : handleCreatePortfolio}
        editingPortfolio={editingPortfolio}
      />
    </div>
  );
}