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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Watchlist } from '@/hooks/useWatchlists';
import { MoreHorizontal, Settings, Trash2, Plus, TrendingUp } from 'lucide-react';

interface WatchlistTableProps {
  watchlists: Watchlist[];
  onEdit: (watchlist: Watchlist) => void;
  onDelete: (id: string) => void;
  onView: (watchlist: Watchlist) => void;
  onAddSymbol: (watchlistId: string) => void;
  onBulkAction?: (action: string, watchlistIds: string[]) => void;
  loading?: boolean;
}

export function WatchlistTable({ 
  watchlists, 
  onEdit, 
  onDelete, 
  onView, 
  onAddSymbol, 
  onBulkAction,
  loading 
}: WatchlistTableProps) {
  const [selectedWatchlists, setSelectedWatchlists] = useState<string[]>([]);
  const [actioningWatchlists, setActioningWatchlists] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWatchlists(watchlists.map(watchlist => watchlist.id));
    } else {
      setSelectedWatchlists([]);
    }
  };

  const handleSelectWatchlist = (watchlistId: string, checked: boolean) => {
    if (checked) {
      setSelectedWatchlists(prev => [...prev, watchlistId]);
    } else {
      setSelectedWatchlists(prev => prev.filter(id => id !== watchlistId));
    }
  };

  const handleAction = async (watchlistId: string, action: () => void) => {
    setActioningWatchlists(prev => [...prev, watchlistId]);
    try {
      await action();
    } finally {
      setActioningWatchlists(prev => prev.filter(id => id !== watchlistId));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (onBulkAction && selectedWatchlists.length > 0) {
      await onBulkAction(action, selectedWatchlists);
      setSelectedWatchlists([]);
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
    <div className="space-y-4">
      {selectedWatchlists.length > 0 && onBulkAction && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedWatchlists.length} watchlist(s) selected
          </span>
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
                    checked={selectedWatchlists.length === watchlists.length && watchlists.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead>Watchlist Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Symbols</TableHead>
              <TableHead>Symbol Count</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchlists.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={onBulkAction ? 8 : 7} 
                  className="text-center py-8 text-muted-foreground"
                >
                  👁️ No watchlists found. Create your first watchlist!
                </TableCell>
              </TableRow>
            ) : (
              watchlists.map((watchlist) => (
                <TableRow key={watchlist.id} className="cursor-pointer hover:bg-muted/50">
                  {onBulkAction && (
                    <TableCell>
                      <Checkbox
                        checked={selectedWatchlists.includes(watchlist.id)}
                        onCheckedChange={(checked) => handleSelectWatchlist(watchlist.id, !!checked)}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell className="font-medium" onClick={() => onView(watchlist)}>
                    <div className="flex items-center gap-2">
                      👁️ {watchlist.name}
                    </div>
                  </TableCell>
                  
                  <TableCell onClick={() => onView(watchlist)}>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getProviderEmoji(watchlist.provider)} {watchlist.provider}
                    </Badge>
                  </TableCell>
                  
                  <TableCell onClick={() => onView(watchlist)}>
                    {watchlist.items.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {watchlist.items.slice(0, 4).map((symbol) => (
                          <Badge key={symbol} variant="secondary" className="text-xs">
                            📈 {symbol}
                          </Badge>
                        ))}
                        {watchlist.items.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{watchlist.items.length - 4}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No symbols</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="font-mono" onClick={() => onView(watchlist)}>
                    📊 {watchlist.items.length}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground" onClick={() => onView(watchlist)}>
                    {new Date(watchlist.created_at).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground" onClick={() => onView(watchlist)}>
                    {watchlist.updated_at 
                      ? new Date(watchlist.updated_at).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={loading || actioningWatchlists.includes(watchlist.id)}
                        >
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
                          onClick={() => handleAction(watchlist.id, () => onDelete(watchlist.id))}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}