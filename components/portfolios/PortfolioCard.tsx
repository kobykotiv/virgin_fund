"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Portfolio } from '@/hooks/usePortfolios';
import { MoreHorizontal, TrendingUp, TrendingDown, BarChart3, Rebalance, Trash2, Settings } from 'lucide-react';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
  onView: (portfolio: Portfolio) => void;
  onRebalance: (portfolio: Portfolio) => void;
  loading?: boolean;
}

export function PortfolioCard({ 
  portfolio, 
  onEdit, 
  onDelete, 
  onView, 
  onRebalance, 
  loading 
}: PortfolioCardProps) {
  const [isActioning, setIsActioning] = useState(false);

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

  const handleAction = async (action: () => void) => {
    setIsActioning(true);
    try {
      await action();
    } finally {
      setIsActioning(false);
    }
  };

  const totalValue = portfolio.valueUsd || portfolio.balance || 0;
  const dailyChange = portfolio.dailyChangePct || 0;
  const totalPnL = portfolio.pnlUsd || 0;
  const topAllocations = portfolio.allocation?.slice(0, 3) || [];

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onView(portfolio)}>
            <CardTitle className="text-lg flex items-center gap-2">
              💼 {portfolio.name}
              <Badge variant="outline" className="text-xs">
                {portfolio.currency}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {portfolio.description || 'No description'}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={loading || isActioning}>
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
              <DropdownMenuItem onClick={() => handleAction(() => onRebalance(portfolio))}>
                <Rebalance className="h-4 w-4 mr-2" />
                Rebalance
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAction(() => onDelete(portfolio.id))}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={() => onView(portfolio)}>
        <div className="space-y-4">
          {/* Value and Performance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">💰 Total Value</div>
              <div className="text-xl font-bold">
                {formatCurrency(totalValue, portfolio.currency)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">📊 Daily Change</div>
              <div className={`text-xl font-bold flex items-center gap-1 ${
                dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {dailyChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {formatPercentage(dailyChange)}
              </div>
            </div>
          </div>

          {/* P&L */}
          {totalPnL !== 0 && (
            <div>
              <div className="text-sm text-muted-foreground">📈 Total P&L</div>
              <div className={`text-lg font-semibold ${
                totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalPnL, portfolio.currency)}
              </div>
            </div>
          )}

          {/* Top Allocations */}
          {topAllocations.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">🎯 Top Allocations</div>
              <div className="space-y-2">
                {topAllocations.map((allocation) => (
                  <div key={allocation.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        📈 {allocation.symbol}
                      </Badge>
                      <span className="text-sm">{allocation.percent.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={allocation.percent} 
                      className="w-16 h-2" 
                    />
                  </div>
                ))}
                {(portfolio.allocation?.length || 0) > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{(portfolio.allocation?.length || 0) - 3} more assets
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Positions Count */}
          {portfolio.positions && portfolio.positions.length > 0 && (
            <div className="pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                🏛️ {portfolio.positions.length} position(s) • Created {new Date(portfolio.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}