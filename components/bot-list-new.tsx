"use client";

import { useEffect, useState } from "react";
import { Bot } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { getBots, toggleBotStatus } from "@/lib/bot-api";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Grid, 
  BarChart2, 
  PieChart,
  RefreshCcw,
  TrendingUp,
  Brain,
  CandlestickChart,
  Pencil,
  Trash2,
  MoreVertical,
  LineChart,
  History
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BotStatusCard } from "@/components/bot-status-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BotListProps {
  onEdit: (bot: Bot) => void;
  onDelete: (bot: Bot) => void;
  onViewDetails?: (bot: Bot) => void;
  onViewTrades?: (bot: Bot) => void;
}

function getBotIcon(type: string) {
  const icons = {
    dca: DollarSign,
    grid: Grid,
    indicator: BarChart2,
    basket: PieChart,
    momentum: TrendingUp,
    ml: Brain,
    custom: CandlestickChart
  };
  const Icon = icons[type as keyof typeof icons] || CandlestickChart;
  return <Icon className="h-4 w-4" />;
}

function getAvatarColor(type: string): string {
  const colors = {
    dca: 'bg-blue-500',
    grid: 'bg-green-500',
    indicator: 'bg-purple-500',
    basket: 'bg-orange-500',
    momentum: 'bg-red-500',
    ml: 'bg-indigo-500',
    custom: 'bg-gray-500'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500';
}

export function BotList({ onEdit, onDelete, onViewDetails, onViewTrades }: BotListProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchBots();
  }, []);

  async function fetchBots() {
    try {
      const data = await getBots();
      setBots(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusToggle(bot: Bot) {
    setStatusUpdating(prev => ({ ...prev, [bot.id]: true }));
    try {
      await toggleBotStatus(bot.id, !bot.active);
      setBots(bots.map(b => 
        b.id === bot.id ? { ...b, active: !b.active } : b
      ));
      toast({
        title: "Success",
        description: `Bot ${!bot.active ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update bot status",
        variant: "destructive",
      });
    } finally {
      setStatusUpdating(prev => ({ ...prev, [bot.id]: false }));
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bot</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No bots found. Create your first bot to get started.
              </TableCell>
            </TableRow>
          ) : (
            bots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className={cn("h-8 w-8", getAvatarColor(bot.type))}>
                      <AvatarFallback className="text-background">
                        {getBotIcon(bot.type)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{bot.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {bot.strategy || 'No strategy'}
                        </Badge>
                        {bot.description && (
                          <span className="text-xs text-muted-foreground">
                            {bot.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex w-[200px] items-center gap-2">
                    <Switch
                      checked={bot.active}
                      onCheckedChange={() => handleStatusToggle(bot)}
                      disabled={statusUpdating[bot.id]}
                      className={cn(
                        bot.active ? "bg-green-500" : "",
                        statusUpdating[bot.id] && "opacity-50 cursor-not-allowed"
                      )}
                    />
                    <BotStatusCard bot={bot} compact />
                  </div>
                </TableCell>
                <TableCell>
                  <BotStatusCard bot={bot} compact />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Bot Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(bot)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {onViewDetails && (
                        <DropdownMenuItem onClick={() => onViewDetails(bot)}>
                          <LineChart className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      {onViewTrades && (
                        <DropdownMenuItem onClick={() => onViewTrades(bot)}>
                          <History className="mr-2 h-4 w-4" />
                          View Trades
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(bot)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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
    </Card>
  );
}
