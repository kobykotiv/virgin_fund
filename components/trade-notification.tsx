import { Trade } from "@prisma/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface TradeNotificationProps {
  trade: Trade;
  onClose?: () => void;
}

export function TradeNotification({ trade, onClose }: TradeNotificationProps) {
  const isProfit = (trade.profitLoss || 0) > 0;
  const isBuy = trade.side.toLowerCase() === 'buy';

  return (
    <div className="flex items-start space-x-4 w-full max-w-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg">
      <Avatar className={cn(
        "h-10 w-10",
        isBuy ? "bg-green-500" : "bg-red-500"
      )}>
        <AvatarFallback className="text-background">
          {isBuy ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-semibold">
              {trade.symbol}
            </p>
            <Badge variant={isBuy ? "default" : "secondary"}>
              {trade.side.toUpperCase()}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Quantity: {trade.quantity}
          </span>
          <span>
            ${trade.price.toFixed(2)}
          </span>
        </div>

        {trade.profitLoss !== null && (
          <div className="flex items-center gap-2 mt-2">
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              "font-medium",
              isProfit ? "text-green-500" : "text-red-500"
            )}>
              ${Math.abs(trade.profitLoss).toFixed(2)}
              {isProfit ? " profit" : " loss"}
            </span>
          </div>
        )}

        {trade.commission !== null && trade.commission > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <CircleDollarSign className="h-3 w-3" />
            <span>Commission: ${trade.commission.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
