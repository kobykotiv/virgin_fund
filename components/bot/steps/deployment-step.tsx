import { useState } from "react";
import { type BotConfig } from "@/types/bot";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAlpaca } from "@/context/alpaca-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface Props {
  config: Partial<BotConfig>;
  onUpdate: (updates: Partial<BotConfig>) => void;
}

export function DeploymentStep({ config, onUpdate }: Props) {
  const { isLive, accountInfo } = useAlpaca();
  const [maxCapitalPercentage, setMaxCapitalPercentage] = useState(10); // Default to 10% of account
  
  const updateDeployment = (field: string, value: any) => {
    onUpdate({
      deployment: {
        ...config.deployment,
        [field]: value
      }
    });
  };

  // Calculate actual dollar amount based on percentage
  const calculateDollarAmount = () => {
    if (!accountInfo) return 0;
    const portfolioValue = parseFloat(accountInfo.portfolio_value);
    return (portfolioValue * maxCapitalPercentage / 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bot Deployment Settings</CardTitle>
          <CardDescription>Configure how your bot will execute trades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="capital-allocation">Capital Allocation</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{maxCapitalPercentage}%</span>
                <span className="text-sm text-muted-foreground">
                  (${calculateDollarAmount()})
                </span>
              </div>
            </div>
            <Slider
              id="capital-allocation"
              min={1}
              max={100}
              step={1}
              value={[maxCapitalPercentage]}
              onValueChange={(values) => {
                setMaxCapitalPercentage(values[0]);
                updateDeployment("maxCapitalPercentage", values[0]);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Maximum percentage of your account balance the bot can use
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="execution-type">Order Execution</Label>
            <Select 
              defaultValue="market" 
              onValueChange={(value) => updateDeployment("executionType", value)}
            >
              <SelectTrigger id="execution-type">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Orders</SelectItem>
                <SelectItem value="limit">Limit Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="fractional-enabled">Enable Fractional Trading</Label>
                <p className="text-xs text-muted-foreground">
                  Allow the bot to buy partial shares
                </p>
              </div>
              <Switch 
                id="fractional-enabled"
                checked={config.deployment?.fractionalTrading ?? true}
                onCheckedChange={(checked) => updateDeployment("fractionalTrading", checked)}
              />
            </div>
          </div>

          {isLive && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label htmlFor="margin-enabled">Enable Margin Trading</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Margin trading involves borrowing funds to amplify potential returns, but also increases risk.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch 
                  id="margin-enabled"
                  checked={config.deployment?.marginTrading ?? false}
                  onCheckedChange={(checked) => updateDeployment("marginTrading", checked)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Trade Notification Settings</Label>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-trades" className="text-sm font-normal">
                  Send notifications on trades
                </Label>
                <Switch 
                  id="notify-trades"
                  checked={config.deployment?.notifications?.trades ?? true}
                  onCheckedChange={(checked) => 
                    updateDeployment("notifications", {
                      ...config.deployment?.notifications,
                      trades: checked
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-errors" className="text-sm font-normal">
                  Send notifications on errors
                </Label>
                <Switch 
                  id="notify-errors"
                  checked={config.deployment?.notifications?.errors ?? true}
                  onCheckedChange={(checked) => 
                    updateDeployment("notifications", {
                      ...config.deployment?.notifications,
                      errors: checked
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
