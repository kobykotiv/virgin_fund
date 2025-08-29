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
import { Bot } from '@/types/api';
import { MoreHorizontal, Play, Pause, Square, Trash2, Settings, TrendingUp, TrendingDown } from 'lucide-react';

interface BotCardProps {
  bot: Bot;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (bot: Bot) => void;
  loading?: boolean;
}

export function BotCard({ bot, onStart, onPause, onStop, onDelete, onEdit, loading }: BotCardProps) {
  const [isActioning, setIsActioning] = useState(false);

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

  const handleAction = async (action: () => void) => {
    setIsActioning(true);
    try {
      await action();
    } finally {
      setIsActioning(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              🤖 {bot.name}
              <Badge variant="outline" className="text-xs">
                {bot.strategy || 'Unknown'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                {getStatusEmoji(bot.status)} {bot.status}
              </span>
              {bot.assets && bot.assets.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  📈 {bot.assets.slice(0, 2).join(', ')}
                  {bot.assets.length > 2 && ` +${bot.assets.length - 2}`}
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={loading || isActioning}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(bot)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {bot.status !== 'running' && (
                <DropdownMenuItem onClick={() => handleAction(() => onStart(bot.id))}>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </DropdownMenuItem>
              )}
              {bot.status === 'running' && (
                <DropdownMenuItem onClick={() => handleAction(() => onPause(bot.id))}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleAction(() => onStop(bot.id))}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleAction(() => onDelete(bot.id))}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">💰 Capital</div>
            <div className="text-lg font-semibold">
              {formatCurrency(bot.capital || bot.initialBalance)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">📊 P&L</div>
            <div className={`text-lg font-semibold flex items-center gap-1 ${
              (bot.currentPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(bot.currentPnL || 0) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatCurrency(bot.currentPnL)}
            </div>
          </div>
          
          {bot.performance && (
            <>
              <div>
                <div className="text-sm text-muted-foreground">🎯 Win Rate</div>
                <div className="text-lg font-semibold">
                  {formatPercentage(bot.performance.winRate)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">🔄 Trades</div>
                <div className="text-lg font-semibold">
                  {bot.performance.totalTrades || 0}
                </div>
              </div>
            </>
          )}
        </div>
        
        {bot.lastTradeAt && (
          <div className="mt-4 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              🕒 Last trade: {new Date(bot.lastTradeAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}