"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Bot, AlarmBell, Play, Pause, BarChart3, RefreshCw, Info, Save, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'

interface BotInterface {
  id?: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  assets: string[];
  parameters: Record<string, any>;
}

export function TradingBotInterface({ 
  initialData, 
  onSave 
}: { 
  initialData?: BotInterface; 
  onSave: (data: BotInterface) => Promise<void>; 
}) {
  const [botData, setBotData] = useState<BotInterface>(initialData || {
    name: '',
    strategy: 'meanReversion',
    status: 'paused',
    assets: ['AAPL'],
    parameters: {
      threshold: 2,
      period: 14,
      stopLoss: 5,
      takeProfit: 10
    }
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const { toast } = useToast();
  const { apiKey, secretKey, isPaper, isDemoMode } = useAuth();

  const strategies = [
    { id: 'meanReversion', name: 'Mean Reversion' },
    { id: 'trendFollowing', name: 'Trend Following' },
    { id: 'gridTrading', name: 'Grid Trading' },
    { id: 'movingAverageCrossover', name: 'Moving Average Crossover' }
  ];

  const availableAssets = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC/USD', 'ETH/USD'
  ];

  const handleChange = (field: string, value: any) => {
    setBotData(prev => ({ ...prev, [field]: value }));
  };

  const handleParameterChange = (param: string, value: any) => {
    setBotData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [param]: value
      }
    }));
  };

  const handleAssetChange = (asset: string, isSelected: boolean) => {
    if (isSelected) {
      setBotData(prev => ({
        ...prev,
        assets: [...prev.assets, asset]
      }));
    } else {
      setBotData(prev => ({
        ...prev,
        assets: prev.assets.filter(a => a !== asset)
      }));
    }
  };

  const handleSimulate = async () => {
    if (!botData.name || botData.assets.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and select at least one asset.",
        variant: "destructive"
      });
      return;
    }

    setIsSimulating(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // to run a backtest simulation with the current bot settings
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock simulation results
      setSimulationResults({
        profitLoss: Math.random() * 20 - 5,
        trades: Math.floor(Math.random() * 50) + 10,
        winRate: Math.random() * 30 + 50,
        maxDrawdown: Math.random() * 10 + 2
      });
      
      toast({
        title: "Simulation Complete",
        description: "Backtest results are now available.",
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to run backtest simulation.",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = async () => {
    if (!botData.name || botData.assets.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and select at least one asset.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSave(botData);
      toast({
        title: "Success",
        description: "Bot configuration saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bot configuration.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>Configure your trading bot settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input 
              id="bot-name" 
              value={botData.name} 
              onChange={e => handleChange('name', e.target.value)}
              placeholder="My Trading Bot"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strategy">Strategy</Label>
            <Select 
              value={botData.strategy} 
              onValueChange={value => handleChange('strategy', value)}
            >
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map(strategy => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Assets</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableAssets.map(asset => (
                <div key={asset} className="flex items-center space-x-2">
                  <Switch 
                    id={`asset-${asset}`}
                    checked={botData.assets.includes(asset)}
                    onCheckedChange={checked => handleAssetChange(asset, checked)}
                  />
                  <Label htmlFor={`asset-${asset}`}>{asset}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Parameters</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold (%)</Label>
                <Input 
                  id="threshold" 
                  type="number" 
                  value={botData.parameters.threshold} 
                  onChange={e => handleParameterChange('threshold', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period (days)</Label>
                <Input 
                  id="period" 
                  type="number" 
                  value={botData.parameters.period} 
                  onChange={e => handleParameterChange('period', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input 
                  id="stopLoss" 
                  type="number" 
                  value={botData.parameters.stopLoss} 
                  onChange={e => handleParameterChange('stopLoss', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <Input 
                  id="takeProfit" 
                  type="number" 
                  value={botData.parameters.takeProfit} 
                  onChange={e => handleParameterChange('takeProfit', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSimulate} disabled={isSimulating}>
            {isSimulating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bot Status</CardTitle>
            <CardDescription>Monitor and control your bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-medium">{botData.name || "Unnamed Bot"}</span>
              </div>
              <Badge variant={
                botData.status === 'active' ? 'default' : 
                botData.status === 'paused' ? 'secondary' : 'destructive'
              }>
                {botData.status.charAt(0).toUpperCase() + botData.status.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Strategy:</span>
                <span>{strategies.find(s => s.id === botData.strategy)?.name || botData.strategy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assets:</span>
                <span>{botData.assets.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trading Environment:</span>
                <span>{isPaper ? 'Paper Trading' : 'Live Trading'}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                className="w-full" 
                variant={botData.status === 'active' ? 'secondary' : 'default'}
                onClick={() => handleChange('status', botData.status === 'active' ? 'paused' : 'active')}
                disabled={!apiKey && !isDemoMode}
              >
                {botData.status === 'active' ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Bot
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate Bot
                  </>
                )}
              </Button>
            </div>
            
            {!apiKey && !isDemoMode && (
              <div className="flex items-center mt-2 text-amber-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>API credentials required to activate bot</span>
              </div>
            )}
          </CardContent>
        </Card>

        {simulationResults && (
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
              <CardDescription>Simulated performance based on historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Profit/Loss</p>
                    <p className={`text-xl font-bold ${
                      simulationResults.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {simulationResults.profitLoss >= 0 ? '+' : ''}
                      {simulationResults.profitLoss.toFixed(2)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-xl font-bold">{simulationResults.trades}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-xl font-bold">{simulationResults.winRate.toFixed(2)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Max Drawdown</p>
                    <p className="text-xl font-bold text-amber-500">-{simulationResults.maxDrawdown.toFixed(2)}%</p>
                  </div>
                </div>
                
                <div className="h-32 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  Simulation chart placeholder
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
