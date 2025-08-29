"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Watchlist } from '@/hooks/useWatchlists';
import { MoreHorizontal, Settings, Trash2, Plus, TrendingUp } from 'lucide-react';

interface WatchlistCardProps {
  watchlist: Watchlist;
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (id: string) => void;
  onView: (watchlist: Watchlist) => void;
  onAddSymbol: (watchlistId: string) => void;
  loading?: boolean;
}

export function WatchlistCard({ 
  watchlist, 
  onEdit, 
  onDelete, 
  onView, 
  onAddSymbol, 
  loading 
}: WatchlistCardProps) {
  const [isActioning, setIsActioning] = useState(false);

  const handleAction = async (action: () => void) => {
    setIsActioning(true);
    try {
      await action();
    } finally {
      setIsActioning(false);
    }
  };

  const getProviderEmoji = (provider: string) => {
    switch (provider) {
      case 'alpaca': return '🏦';
      case 'coingecko': return '🦎';
      default: return '📊';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onView(watchlist)}>
            <CardTitle className="text-lg flex items-center gap-2">
              👁️ {watchlist.name}
              <Badge variant="outline" className="text-xs">
                {getProviderEmoji(watchlist.provider)} {watchlist.provider}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {watchlist.items.length} symbol(s)
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={loading || isActioning}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(watchlist)}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(watchlist)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSymbol(watchlist.id)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Symbol
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAction(() => onDelete(watchlist.id))}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={() => onView(watchlist)}>
        <div className="space-y-3">
          {/* Symbol Preview */}
          {watchlist.items.length > 0 ? (
            <div>
              <div className="text-sm text-muted-foreground mb-2">📈 Symbols</div>
              <div className="flex flex-wrap gap-1">
                {watchlist.items.slice(0, 6).map((symbol) => (
                  <Badge key={symbol} variant="secondary" className="text-xs">
                    {symbol}
                  </Badge>
                ))}
                {watchlist.items.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{watchlist.items.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">📝 Empty watchlist</p>
              <p className="text-xs">Add symbols to get started</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-2 border-t text-xs text-muted-foreground">
            🕒 Created {new Date(watchlist.created_at).toLocaleDateString()}
            {watchlist.updated_at && (
              <span> • Updated {new Date(watchlist.updated_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}