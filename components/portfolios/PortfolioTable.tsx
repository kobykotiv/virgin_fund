"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Portfolio } from '@/hooks/usePortfolios';
import { MoreHorizontal, TrendingUp, TrendingDown, BarChart3, RotateCcw as Rebalance, Trash2, Settings } from 'lucide-react';

interface PortfolioTableProps {
  portfolios: Portfolio[];
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
  onView: (portfolio: Portfolio) => void;
  onRebalance: (portfolio: Portfolio) => void;
  onBulkAction?: (action: string, portfolioIds: string[]) => void;
  loading?: boolean;
}

export function PortfolioTable({ 
  portfolios, 
  onEdit, 
  onDelete, 
  onView, 
  onRebalance, 
  onBulkAction,
  loading 
}: PortfolioTableProps) {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([]);
  const [actioningPortfolios, setActioningPortfolios] = useState<string[]>([]);

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPortfolios(portfolios.map(portfolio => portfolio.id));
    } else {
      setSelectedPortfolios([]);
    }
  };

  const handleSelectPortfolio = (portfolioId: string, checked: boolean) => {
    if (checked) {
      setSelectedPortfolios(prev => [...prev, portfolioId]);
    } else {
      setSelectedPortfolios(prev => prev.filter(id => id !== portfolioId));
    }
  };

  const handleAction = async (portfolioId: string, action: () => void) => {
    setActioningPortfolios(prev => [...prev, portfolioId]);
    try {
      await action();
    } finally {
      setActioningPortfolios(prev => prev.filter(id => id !== portfolioId));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (onBulkAction && selectedPortfolios.length > 0) {
      await onBulkAction(action, selectedPortfolios);
      setSelectedPortfolios([]);
    }
  };

  return (
    <div className="space-y-4">
      {selectedPortfolios.length > 0 && onBulkAction && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedPortfolios.length} portfolio(s) selected
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleBulkAction('rebalance')}
          >
            ⚖️ Rebalance All
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => handleBulkAction('delete')}
          >
            🗑️ Delete All
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onBulkAction && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPortfolios.length === portfolios.length && portfolios.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead>Portfolio Name</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Daily Change</TableHead>
              <TableHead>Total P&L</TableHead>
              <TableHead>Allocations</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolios.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={onBulkAction ? 9 : 8} 
                  className="text-center py-8 text-muted-foreground"
                >
                  💼 No portfolios found. Create your first portfolio!
                </TableCell>
              </TableRow>
            ) : (
              portfolios.map((portfolio) => {
                const totalValue = portfolio.valueUsd || portfolio.balance || 0;
                const dailyChange = portfolio.dailyChangePct || 0;
                const totalPnL = portfolio.pnlUsd || 0;
                const topAllocations = portfolio.allocation?.slice(0, 2) || [];
                
                return (
                  <TableRow key={portfolio.id} className="cursor-pointer hover:bg-muted/50">
                    {onBulkAction && (
                      <TableCell>
                        <Checkbox
                          checked={selectedPortfolios.includes(portfolio.id)}
                          onCheckedChange={(checked) => handleSelectPortfolio(portfolio.id, !!checked)}
                        />
                      </TableCell>
                    )}
                    
                    <TableCell className="font-medium" onClick={() => onView(portfolio)}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          💼 {portfolio.name}
                          <Badge variant="outline" className="text-xs">
                            {portfolio.currency}
                          </Badge>
                        </div>
                        {portfolio.description && (
                          <div className="text-sm text-muted-foreground">
                            {portfolio.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="font-mono" onClick={() => onView(portfolio)}>
                      💰 {formatCurrency(totalValue, portfolio.currency)}
                    </TableCell>
                    
                    <TableCell onClick={() => onView(portfolio)}>
                      <div className={`flex items-center gap-1 font-mono ${
                        dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {dailyChange >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercentage(dailyChange)}
                      </div>
                    </TableCell>
                    
                    <TableCell className="font-mono" onClick={() => onView(portfolio)}>
                      {totalPnL !== 0 && (
                        <div className={`flex items-center gap-1 ${
                          totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {totalPnL >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatCurrency(totalPnL, portfolio.currency)}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell onClick={() => onView(portfolio)}>
                      {topAllocations.length > 0 ? (
                        <div className="space-y-1">
                          {topAllocations.map((allocation, index) => (
                            <div key={allocation.symbol} className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                📈 {allocation.symbol}
                              </Badge>
                              <span className="text-xs">{allocation.percent.toFixed(1)}%</span>
                              <Progress 
                                value={allocation.percent} 
                                className="w-12 h-1" 
                              />
                            </div>
                          ))}
                          {(portfolio.allocation?.length || 0) > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{(portfolio.allocation?.length || 0) - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No allocations</span>
                      )}
                    </TableCell>
                    
                    <TableCell onClick={() => onView(portfolio)}>
                      <div className="text-sm">
                        🏛️ {portfolio.positions?.length || 0} position(s)
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-sm text-muted-foreground" onClick={() => onView(portfolio)}>
                      {new Date(portfolio.created_at).toLocaleDateString()}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={loading || actioningPortfolios.includes(portfolio.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(portfolio)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(portfolio)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(portfolio.id, () => onRebalance(portfolio))}
                          >
                            <Rebalance className="h-4 w-4 mr-2" />
                            Rebalance
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(portfolio.id, () => onDelete(portfolio.id))}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}