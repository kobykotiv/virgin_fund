import { Bot } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertCircle,
  Clock,
  PauseCircle,
  PlayCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BotStatusCardProps {
  bot: Bot & {
    status?: any; // Type this better once we have the full status type
  };
  compact?: boolean;
}

function getStatusIcon(state: string) {
  switch (state) {
    case "running":
      return PlayCircle;
    case "paused":
      return PauseCircle;
    case "error":
      return AlertCircle;
    case "idle":
      return Clock;
    default:
      return Activity;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatPercentage(value: number) {
  return `${value.toFixed(2)}%`;
}

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function BotStatusCard({ bot, compact = false }: BotStatusCardProps) {
  const status = bot.status || { state: "idle" };
  const StatusIcon = getStatusIcon(status.state);
  
  const performance = status.performance || {
    totalTrades: 0,
    winRate: 0,
    totalProfit: 0,
    totalFees: 0,
  };

  const netProfit = performance.totalProfit - performance.totalFees;
  const isProfitable = netProfit > 0;

  return (
    <Card className={cn(
      "p-4",
      compact ? "space-y-2" : "space-y-4"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn(
            "h-5 w-5",
            status.state === "running" && "text-green-500",
            status.state === "error" && "text-red-500",
            status.state === "paused" && "text-yellow-500",
            status.state === "idle" && "text-gray-500"
          )} />
          <Badge
            variant={status.state === "error" ? "destructive" : "secondary"}
            className="capitalize"
          >
            {status.state}
          </Badge>
        </div>
        {status.lastUpdate && (
          <span className="text-xs text-muted-foreground">
            Updated {getTimeAgo(new Date(status.lastUpdate))}
          </span>
        )}
      </div>

      {!compact && (
        <>
          {status.message && (
            <p className="text-sm text-muted-foreground">{status.message}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Performance</p>
              <div className="flex items-center gap-2">
                {isProfitable ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={cn(
                  "font-medium",
                  isProfitable ? "text-green-500" : "text-red-500"
                )}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {formatPercentage(performance.winRate)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({performance.totalTrades} trades)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
