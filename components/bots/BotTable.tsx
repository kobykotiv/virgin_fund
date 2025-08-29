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
import { Bot } from '@/types/api';
import { MoreHorizontal, Play, Pause, Square, Trash2, Settings, TrendingUp, TrendingDown } from 'lucide-react';

interface BotTableProps {
  bots: Bot[];
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (bot: Bot) => void;
  onBulkAction?: (action: string, botIds: string[]) => void;
  loading?: boolean;
}

export function BotTable({ 
  bots, 
  onStart, 
  onPause, 
  onStop, 
  onDelete, 
  onEdit, 
  onBulkAction,
  loading 
}: BotTableProps) {
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [actioningBots, setActioningBots] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return '🟢';
      case 'paused': return '🟡';
      case 'stopped': return '🔴';
      default: return '⚫';
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value?: number) => {
    if (!value) return '0.00%';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBots(bots.map(bot => bot.id));
    } else {
      setSelectedBots([]);
    }
  };

  const handleSelectBot = (botId: string, checked: boolean) => {
    if (checked) {
      setSelectedBots(prev => [...prev, botId]);
    } else {
      setSelectedBots(prev => prev.filter(id => id !== botId));
    }
  };

  const handleAction = async (botId: string, action: () => void) => {
    setActioningBots(prev => [...prev, botId]);
    try {
      await action();
    } finally {
      setActioningBots(prev => prev.filter(id => id !== botId));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (onBulkAction && selectedBots.length > 0) {
      await onBulkAction(action, selectedBots);
      setSelectedBots([]);
    }
  };

  return (
    <div className="space-y-4">
      {selectedBots.length > 0 && onBulkAction && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedBots.length} bot(s) selected
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleBulkAction('start')}
          >
            ▶️ Start All
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleBulkAction('pause')}
          >
            ⏸️ Pause All
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleBulkAction('stop')}
          >
            ⏹️ Stop All
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
                    checked={selectedBots.length === bots.length && bots.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead>Bot Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Strategy</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Capital</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bots.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={onBulkAction ? 9 : 8} 
                  className="text-center py-8 text-muted-foreground"
                >
                  🤖 No bots found. Create your first trading bot!
                </TableCell>
              </TableRow>
            ) : (
              bots.map((bot) => (
                <TableRow key={bot.id}>
                  {onBulkAction && (
                    <TableCell>
                      <Checkbox
                        checked={selectedBots.includes(bot.id)}
                        onCheckedChange={(checked) => handleSelectBot(bot.id, !!checked)}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      🤖 {bot.name}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)}`} />
                      {getStatusEmoji(bot.status)} {bot.status}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">{bot.strategy || 'Unknown'}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    {bot.assets && bot.assets.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {bot.assets.slice(0, 3).map(asset => (
                          <Badge key={asset} variant="secondary" className="text-xs">
                            📈 {asset}
                          </Badge>
                        ))}
                        {bot.assets.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{bot.assets.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No assets</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="font-mono">
                    💰 {formatCurrency(bot.capital || bot.initialBalance)}
                  </TableCell>
                  
                  <TableCell>
                    <div className={`flex items-center gap-1 font-mono ${
                      (bot.currentPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(bot.currentPnL || 0) >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {formatCurrency(bot.currentPnL)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {bot.performance ? (
                      <div className="text-sm">
                        <div>🎯 {formatPercentage(bot.performance.winRate)}</div>
                        <div className="text-muted-foreground">
                          🔄 {bot.performance.totalTrades || 0} trades
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No data</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={loading || actioningBots.includes(bot.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(bot)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {bot.status !== 'running' && (
                          <DropdownMenuItem 
                            onClick={() => handleAction(bot.id, () => onStart(bot.id))}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </DropdownMenuItem>
                        )}
                        {bot.status === 'running' && (
                          <DropdownMenuItem 
                            onClick={() => handleAction(bot.id, () => onPause(bot.id))}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleAction(bot.id, () => onStop(bot.id))}
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction(bot.id, () => onDelete(bot.id))}
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