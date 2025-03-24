import { useAlpaca } from "@/context/alpaca-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  WifiOff,
  ExternalLink 
} from "lucide-react";

export function DashboardHeader() {
  const { isConnected, isLive, accountInfo, disconnectFromAlpaca } = useAlpaca();
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">GenEric TraDer</h2>
        </div>
        
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-4">
              <Badge 
                className="flex items-center gap-1"
                variant={isLive ? "destructive" : "secondary"}
              >
                {isLive ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>LIVE TRADING</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>PAPER TRADING</span>
                  </>
                )}
              </Badge>
              
              {accountInfo && (
                <div className="text-sm">
                  <span className="text-muted-foreground mr-1">Balance:</span>
                  <span className="font-medium">${parseFloat(accountInfo.portfolio_value).toLocaleString()}</span>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={disconnectFromAlpaca}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <WifiOff className="h-3.5 w-3.5" />
                <span>Not Connected</span>
              </Badge>
              <Button size="sm" asChild>
                <a href="/settings/api-keys">
                  Connect to Alpaca
                  <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
