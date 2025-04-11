"use client";

import { useState, useEffect } from 'react';
import { Bot } from '@/app/(dashboard)/bots/page'; // Import Bot type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Grid, 
  BarChart2, 
  PieChart as PieChartIcon,
  RefreshCcw,
  TrendingUp,
  Network,
  Brain,
  CandlestickChart
} from 'lucide-react';

// Helper function to generate consistent avatar colors
function getAvatarColor(type: string, strategy: string): string {
  const colors = {
    dca: 'bg-blue-500',
    grid: 'bg-green-500',
    indicator: 'bg-purple-500',
    basket: 'bg-orange-500',
    momentum: 'bg-red-500'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500';
}

// Helper function to get icon based on bot type
function getBotIcon(type: string) {
  const icons = {
    dca: DollarSign,
    grid: Grid,
    indicator: BarChart2,
    basket: PieChartIcon,
    momentum: TrendingUp,
    arbitrage: RefreshCcw,
    ml: Brain,
    custom: CandlestickChart
  };
  const Icon = icons[type as keyof typeof icons] || CandlestickChart;
  return <Icon className="h-4 w-4" />;
}

// Helper function to get strategy avatar abbreviation
function getStrategyAbbr(strategy: string): string {
  if (!strategy) return '??';
  return strategy
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { TradingViewWidget } from "@/components/trading-view-widget";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';

// Custom hook for responsive chart sizing
function useChartDimensions(defaultHeight: number) {
  const [dimensions, setDimensions] = useState({ height: defaultHeight });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      // Adjust height based on screen size
      if (width < 640) { // Mobile
        setDimensions({ height: Math.min(defaultHeight * 0.6, 300) });
      } else if (width < 1024) { // Tablet
        setDimensions({ height: Math.min(defaultHeight * 0.8, 350) });
      } else { // Desktop
        setDimensions({ height: defaultHeight });
      }
    }

    handleResize(); // Initial sizing
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defaultHeight]);

  return dimensions;
}

// Colors for the pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#F06292', '#BA68C8', '#4DD0E1', '#FFA726'
];

// Asset selection component
function AssetSelect({
  value,
  onChange,
  assets,
  disabled,
  required
}: {
  value: string;
  onChange: (value: string) => void;
  assets: string[];
  disabled?: boolean;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? value : "Select asset..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search assets..." />
          <CommandEmpty>No asset found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {assets.map((asset) => (
              <CommandItem
                key={asset}
                value={asset}
                onSelect={() => {
                  onChange(asset);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === asset ? "opacity-100" : "opacity-0"
                  )}
                />
                {asset}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface BotFormProps {
  bot?: Bot | null; // Bot data for editing, null for creating
  onSuccess: () => void; // Callback on successful save/update
  onCancel: () => void; // Callback to cancel/close the form
  availableAssets: string[];
  botTypes: { value: string; label: string }[];
}

// Define available strategies by type (expand later)
const STRATEGIES_BY_TYPE: Record<string, string[]> = {
  dca: ['Simple DCA', 'Value Averaging', 'Time Weighted'],
  grid: ['Grid Trading', 'Adaptive Grid', 'Volatility Grid'],
  indicator: ['RSI Basic', 'MACD Crossover', 'Moving Average', 'Bollinger Bands', 'Ichimoku Cloud'],
  basket: ['Periodic Rebalance', 'Threshold Rebalance', 'Volatility Weighted'],
  // Include additional bot types to ensure comprehensive coverage
  momentum: ['Trend Following', 'Price Breakout', 'Volume Based'],
  // arbitrage: ['Exchange Arbitrage', 'Statistical Arbitrage', 'Triangular Arbitrage'],
  // ml: ['Regression Model', 'Classification Model', 'Reinforcement Learning'],
  // options: ['Covered Call', 'Cash Secured Put', 'Iron Condor'],
  // custom: ['Custom Strategy'] // Fallback for user-defined strategies
};

// Settings interfaces for different bot types
interface DcaSettings {
  symbol: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
}

interface GridSettings {
  symbol: string;
  upperPrice: number;
  lowerPrice: number;
  gridLines: number;
  investmentAmount: number;
}

interface IndicatorSettings {
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  entryAmount: number;
  stopLoss?: number;
  takeProfit?: number;
  // Strategy-specific settings
  rsiPeriod?: number;
  rsiOverbought?: number;
  rsiOversold?: number;
  macdFast?: number;
  macdSlow?: number;
  macdSignal?: number;
}

interface BasketSettings {
  assets: Array<{
    symbol: string;
    weight: number;
  }>;
  rebalanceThreshold?: number; // Percentage difference to trigger rebalance
  rebalanceInterval?: 'daily' | 'weekly' | 'monthly';
  totalAmount: number;
}

// Union type for all possible settings
type BotSettings = 
  | { type: 'dca'; settings: DcaSettings }
  | { type: 'grid'; settings: GridSettings }
  | { type: 'indicator'; settings: IndicatorSettings }
  | { type: 'basket'; settings: BasketSettings };

export default function BotForm({ bot, onSuccess, onCancel, availableAssets, botTypes }: BotFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>(botTypes[0]?.value || 'dca'); // Default to first type from props or 'dca'
  const [strategy, setStrategy] = useState<string>('');
  const [settings, setSettings] = useState<Partial<any>>({}); // Will be typed based on bot type
  const [isLoading, setIsLoading] = useState(false);
  const [availableStrategies, setAvailableStrategies] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validate settings in real-time
  const validateSettings = () => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (name.length < 10) {
      errors.name = "Name must be at least 10 characters";
    }

    switch (type) {
      case 'dca': {
        const dcaSettings = settings as Partial<DcaSettings>;
        if (!dcaSettings.symbol) errors.symbol = "Symbol is required";
        if (!dcaSettings.amount || dcaSettings.amount <= 0) errors.amount = "Amount must be greater than 0";
        if (!dcaSettings.interval) errors.interval = "Interval is required";
        break;
      }
      case 'grid': {
        const gridSettings = settings as Partial<GridSettings>;
        if (!gridSettings.symbol) errors.symbol = "Symbol is required";
        if (!gridSettings.upperPrice || gridSettings.upperPrice <= 0) errors.upperPrice = "Upper price must be greater than 0";
        if (!gridSettings.lowerPrice || gridSettings.lowerPrice <= 0) errors.lowerPrice = "Lower price must be greater than 0";
        
        const upperPrice = gridSettings.upperPrice ?? 0;
        const lowerPrice = gridSettings.lowerPrice ?? 0;
        const gridLines = gridSettings.gridLines ?? 0;
        
        if (upperPrice > 0 && lowerPrice > 0 && upperPrice <= lowerPrice) {
          errors.upperPrice = "Upper price must be greater than lower price";
        }
        if (!gridLines || gridLines < 2) errors.gridLines = "At least 2 grid lines required";
        if (gridLines > 100) errors.gridLines = "Maximum 100 grid lines allowed";
        if (!gridSettings.investmentAmount || gridSettings.investmentAmount <= 0) errors.investmentAmount = "Investment amount must be greater than 0";
        break;
      }
      case 'indicator': {
        const indicatorSettings = settings as Partial<IndicatorSettings>;
        if (!indicatorSettings.symbol) errors.symbol = "Symbol is required";
        if (!indicatorSettings.timeframe) errors.timeframe = "Timeframe is required";
        if (!indicatorSettings.entryAmount || indicatorSettings.entryAmount <= 0) errors.entryAmount = "Entry amount must be greater than 0";
        
        if (strategy === 'RSI Basic') {
          if (!indicatorSettings.rsiPeriod) errors.rsiPeriod = "RSI period is required";
          if (!indicatorSettings.rsiOverbought) errors.rsiOverbought = "Overbought level is required";
          if (!indicatorSettings.rsiOversold) errors.rsiOversold = "Oversold level is required";
        }
        break;
      }
      case 'basket': {
        const basketSettings = settings as Partial<BasketSettings>;
        const assets = basketSettings.assets ?? [];
        
        if (assets.length < 2) errors.assets = "At least 2 assets required";
        if (assets.length > 20) errors.assets = "Maximum 20 assets allowed";
        
        const totalWeight = assets.reduce((sum: number, asset: { weight: number }) => sum + (asset.weight || 0), 0);
        if (Math.abs(totalWeight - 100) > 0.01) errors.weights = "Total weight must equal 100%";
        
        if (!basketSettings.rebalanceInterval) errors.rebalanceInterval = "Rebalance interval is required";
        if (!basketSettings.totalAmount || basketSettings.totalAmount <= 0) errors.totalAmount = "Investment amount must be greater than 0";
        break;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate on settings change
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      validateSettings();
    }
  }, [settings, name, type, strategy]); // Re-validate when important fields change

  // Populate form if editing
  useEffect(() => {
    if (bot) {
      setName(bot.name);
      setDescription(bot.description || '');
      setType(bot.type);
      setStrategy(bot.strategy || '');
      // Ensure settings are treated as an object, even if null/undefined from DB
      setSettings(typeof bot.settings === 'object' && bot.settings !== null ? bot.settings : {}); 
    } else {
      // Reset form for creation
      setName('');
      setDescription('');
      setType(botTypes[0]?.value || 'dca');
      setStrategy('');
      setSettings({ symbol: '', amount: 10, interval: 'weekly' }); // Default DCA settings for new bot
    }
  }, [bot]);

  // Update available strategies and default settings when type changes
  useEffect(() => {
    const strategies = STRATEGIES_BY_TYPE[type] || [];
    setAvailableStrategies(strategies);
    
    // Only reset strategy if editing an existing bot and the type changes OR if creating a new bot
    if (!bot || (bot && bot.type !== type)) {
        const defaultStrategy = strategies[0] || '';
        setStrategy(defaultStrategy);
        // Reset settings based on the new type
        switch (type) {
          case 'dca':
            setSettings({
              symbol: '',
              amount: 10,
              interval: 'weekly'
            });
            break;
          case 'grid':
            setSettings({
              symbol: '',
              upperPrice: 0,
              lowerPrice: 0,
              gridLines: 10,
              investmentAmount: 1000
            });
            break;
          case 'indicator':
            const defaultSettings = {
              symbol: '',
              timeframe: '1h',
              entryAmount: 100,
              stopLoss: 2,
              takeProfit: 4
            };
            // Add strategy-specific defaults
            if (strategy === 'RSI Basic') {
              Object.assign(defaultSettings, {
                rsiPeriod: 14,
                rsiOverbought: 70,
                rsiOversold: 30
              });
            } else if (strategy === 'MACD Crossover') {
              Object.assign(defaultSettings, {
                macdFast: 12,
                macdSlow: 26,
                macdSignal: 9
              });
            }
            setSettings(defaultSettings);
            break;
          case 'basket':
            setSettings({
              assets: [
                { symbol: '', weight: 50 },
                { symbol: '', weight: 50 }
              ],
              rebalanceThreshold: 5,
              rebalanceInterval: 'weekly',
              totalAmount: 1000
            });
            break;
          default:
            setSettings({}); // Clear for other types
        }
    } else if (bot && bot.type === type) {
        // If type hasn't changed during edit, keep existing strategy if valid
        if (!strategies.includes(bot.strategy || '')) {
             setStrategy(strategies[0] || ''); // Fallback if existing strategy invalid for type
        } else {
             setStrategy(bot.strategy || ''); // Keep existing valid strategy
        }
        // Keep existing settings when type hasn't changed during edit
        setSettings(typeof bot.settings === 'object' && bot.settings !== null ? bot.settings : {});
    }

  }, [type, bot]); // Depend on type and bot

  const handleSettingsChange = (field: string, value: string | number) => {
    // Helper to parse numeric values
    const parseNumericValue = (val: string | number): number => {
      if (typeof val === 'number') return val;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Process value based on bot type and field
    let processedValue: string | number = value;

    // List of numeric fields for each bot type
    const numericFields = {
      dca: ['amount'],
      grid: ['upperPrice', 'lowerPrice', 'gridLines', 'investmentAmount'],
      indicator: ['entryAmount', 'stopLoss', 'takeProfit', 'rsiPeriod', 'rsiOverbought', 'rsiOversold', 'macdFast', 'macdSlow', 'macdSignal'],
      basket: ['rebalanceThreshold', 'totalAmount', 'weight']
    };

    // Check if the field should be numeric based on bot type
    const shouldBeNumeric = numericFields[type as keyof typeof numericFields]?.includes(field);
    if (shouldBeNumeric) {
      processedValue = parseNumericValue(value);
    }

    setSettings(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate settings based on bot type
    try {
      switch (type) {
        case 'dca': {
          const dcaSettings = settings as Partial<DcaSettings>;
          if (!dcaSettings.symbol || !dcaSettings.amount || dcaSettings.amount <= 0 || !dcaSettings.interval) {
            throw new Error("Please fill all DCA settings correctly (Symbol, Amount > 0, Interval).");
          }
          break;
        }
        case 'grid': {
          const gridSettings = settings as Partial<GridSettings>;
          if (!gridSettings.symbol || !gridSettings.upperPrice || !gridSettings.lowerPrice || 
              !gridSettings.gridLines || !gridSettings.investmentAmount) {
            throw new Error("Please fill all Grid Trading settings.");
          }
          if (gridSettings.upperPrice <= gridSettings.lowerPrice) {
            throw new Error("Upper price must be greater than lower price.");
          }
          if (gridSettings.gridLines < 2 || gridSettings.gridLines > 100) {
            throw new Error("Grid lines must be between 2 and 100.");
          }
          if (gridSettings.investmentAmount <= 0) {
            throw new Error("Investment amount must be greater than 0.");
          }
          break;
        }
        case 'indicator': {
          const indicatorSettings = settings as Partial<IndicatorSettings>;
          if (!indicatorSettings.symbol || !indicatorSettings.timeframe || !indicatorSettings.entryAmount) {
            throw new Error("Please fill all required Indicator Trading settings.");
          }
          if (indicatorSettings.entryAmount <= 0) {
            throw new Error("Entry amount must be greater than 0.");
          }
          // Validate strategy-specific settings
          if (strategy === 'RSI Basic') {
            if (!indicatorSettings.rsiPeriod || !indicatorSettings.rsiOverbought || !indicatorSettings.rsiOversold) {
              throw new Error("Please fill all RSI settings.");
            }
          }
          if (strategy === 'MACD Crossover') {
            if (!indicatorSettings.macdFast || !indicatorSettings.macdSlow || !indicatorSettings.macdSignal) {
              throw new Error("Please fill all MACD settings.");
            }
          }
          break;
        }
        case 'basket': {
          const basketSettings = settings as Partial<BasketSettings>;
          if (!basketSettings.assets || !basketSettings.totalAmount || !basketSettings.rebalanceInterval) {
            throw new Error("Please fill all Basket Trading settings.");
          }
          if (basketSettings.assets.length < 2 || basketSettings.assets.length > 10) {
            throw new Error("Basket must contain between 2 and 10 assets.");
          }
          const totalWeight = basketSettings.assets.reduce((sum, asset) => sum + (asset.weight || 0), 0);
          if (Math.abs(totalWeight - 100) > 0.01) errors.weights = "Total weight must equal 100%";
          
          if (!basketSettings.rebalanceInterval) errors.rebalanceInterval = "Rebalance interval is required";
          if (!basketSettings.totalAmount || basketSettings.totalAmount <= 0) errors.totalAmount = "Investment amount must be greater than 0";
          break;
        }
        default:
          throw new Error("Invalid bot type selected.");
      }
    } catch (validationError) {
      toast({ 
        title: "Validation Error", 
        description: validationError instanceof Error ? validationError.message : "Invalid settings.", 
        variant: "destructive" 
      });
      setIsLoading(false);
      return;
    }

    const botData = {
      name,
      description: description || null, // Send null if empty
      type,
      strategy,
      settings,
    };

    const url = bot ? `/api/bots/${bot.id}` : '/api/bots';
    const method = bot ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(botData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${bot ? 'update' : 'create'} bot`);
      }

      toast({
        title: "Success",
        description: `Bot ${bot ? 'updated' : 'created'} successfully.`,
      });
      onSuccess(); // Call the success callback (e.g., close form, refresh list)

    } catch (error) {
      console.error(`Error ${bot ? 'updating' : 'creating'} bot:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Could not ${bot ? 'update' : 'create'} bot.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className={cn("h-12 w-12", getAvatarColor(type, strategy))}>
          <AvatarFallback className="text-background">
            {getBotIcon(type)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{bot ? 'Edit Bot' : 'Create New Bot'}</CardTitle>
          <CardDescription>Configure your trading bot details.</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="name">Bot Name</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>A unique name to identify your trading bot.</p>
                    <p className="text-xs text-muted-foreground">Must be at least 10 characters long.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Weekly DCA Bot"
              required
              minLength={10}
              disabled={isLoading}
              className={cn(
                formErrors.name && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <p className={cn(
              "text-xs",
              formErrors.name ? "text-destructive" : "text-muted-foreground"
            )}>
              {formErrors.name || "Minimum 10 characters."}
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose or strategy of this bot"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <Label htmlFor="type">Bot Type</Label>
               <Select value={type} onValueChange={setType} disabled={isLoading || !!bot}> {/* Disable type change when editing */}
                 <SelectTrigger id="type" className="flex gap-2">
                   <SelectValue placeholder="Select type">
                     <div className="flex items-center gap-2">
                       {type && (
                         <Avatar className={cn("h-6 w-6", getAvatarColor(type, ''))}>
                           <AvatarFallback className="text-background">
                             {getBotIcon(type)}
                           </AvatarFallback>
                         </Avatar>
                       )}
                       <span>{botTypes.find(t => t.value === type)?.label || 'Select type'}</span>
                     </div>
                   </SelectValue>
                 </SelectTrigger>
                 <SelectContent>
                   {botTypes.map(({ value, label }) => (
                     <SelectItem key={value} value={value} className="flex items-center gap-2">
                       <Avatar className={cn("h-6 w-6", getAvatarColor(value, ''))}>
                         <AvatarFallback className="text-background">
               <Select value={strategy} onValueChange={setStrategy} disabled={isLoading || availableStrategies.length === 0}>
                   <SelectTrigger id="strategy" className="flex gap-2">
                     <SelectValue placeholder="Select strategy">
                       <div className="flex items-center gap-2">
                         {strategy && (
                           <Avatar className={cn("h-6 w-6", getAvatarColor(type, strategy))}>
                             <AvatarFallback className="text-background">
                               {getStrategyAbbr(strategy)}
                             </AvatarFallback>
                           </Avatar>
                         )}
                         <span>{strategy || 'Select strategy'}</span>
                       </div>
                     </SelectValue>
                   </SelectTrigger>
                 <SelectContent>
                   {availableStrategies.map(s => (
                     <SelectItem key={s} value={s} className="flex items-center gap-2">
                       <Avatar className={cn("h-6 w-6", getAvatarColor(type, s))}>
                         <AvatarFallback className="text-background">
                           {getStrategyAbbr(s)}
                         </AvatarFallback>
                       </Avatar>
                       {s}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>

          {/* --- Type-Specific Settings --- */}
          {type === 'dca' && (
            <Card className="bg-muted/30 p-4 mt-4"> {/* Added margin top */}
               <h4 className="mb-3 font-medium text-sm">DCA Settings</h4>
               <div className="space-y-3">
                  <div className="space-y-1">
                     <Label htmlFor="dca-symbol">Asset Symbol</Label>
                     <AssetSelect
                        value={settings.symbol || ''}
                        onChange={(value) => handleSettingsChange('symbol', value)}
                        assets={availableAssets}
                        disabled={isLoading}
                        required
                     />
                     {formErrors.symbol && (
                       <p className="text-xs text-destructive mt-1">{formErrors.symbol}</p>
                     )}
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                       <Label htmlFor="dca-amount">Amount per Interval ($)</Label>
                       <TooltipProvider>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <HelpCircle className="h-4 w-4 text-muted-foreground" />
                           </TooltipTrigger>
                           <TooltipContent>
                             <p>The fixed amount to invest at each interval.</p>
                             <p className="text-xs text-muted-foreground">For example, $100 weekly means buying $100 worth of the asset every week.</p>
                           </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     </div>
                         <Input 
                            id="dca-amount" 
                            type="number" 
                            min="1" 
                            step="0.01"
                            value={settings.amount || ''}
                            onChange={(e) => handleSettingsChange('amount', e.target.value)} // Pass string directly
                            required
                            disabled={isLoading}
                            className={cn(
                              formErrors.amount && "border-destructive focus-visible:ring-destructive"
                            )}
                         />
                         {formErrors.amount && (
                           <p className="text-xs text-destructive mt-1">{formErrors.amount}</p>
                         )}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <Label htmlFor="dca-interval">Interval</Label>
                           <TooltipProvider>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <HelpCircle className="h-4 w-4 text-muted-foreground" />
                               </TooltipTrigger>
                               <TooltipContent>
                                 <p>How often to make purchases.</p>
                                 <p className="text-xs text-muted-foreground">
                                   Daily: Every 24 hours<br />
                                   Weekly: Every 7 days<br />
                                   Bi-weekly: Every 14 days<br />
                                   Monthly: Every 30 days
                                 </p>
                               </TooltipContent>
                             </Tooltip>
                           </TooltipProvider>
                         </div>
                         <Select 
                            value={settings.interval || 'weekly'} 
                            onValueChange={(value) => handleSettingsChange('interval', value as DcaSettings['interval'])} // Cast value
                            disabled={isLoading}
                         >
                           <SelectTrigger 
                             id="dca-interval"
                             className={cn(
                               formErrors.interval && "border-destructive focus-visible:ring-destructive"
                             )}
                           >
                             <SelectValue placeholder="Select interval" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="daily">Daily</SelectItem>
                             <SelectItem value="weekly">Weekly</SelectItem>
                             <SelectItem value="biweekly">Bi-weekly</SelectItem>
                             <SelectItem value="monthly">Monthly</SelectItem>
                           </SelectContent>
                         </Select>
                      </div>
                   </div>
               </div>

               {/* Chart for selected asset */}
               {settings.symbol && (
                 <div className="mt-4">
                   <Label>Price Chart</Label>
                   <div className="h-[400px] w-full mt-2 rounded-lg overflow-hidden border">
                     <TradingViewWidget symbol={settings.symbol} theme="dark" />
                   </div>
                 </div>
               )}
            </Card>
          )}
          {/* Grid Trading Settings */}
          {type === 'grid' && (
            <Card className="bg-muted/30 p-4 mt-4">
              <h4 className="mb-3 font-medium text-sm">Grid Trading Settings</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="grid-symbol">Asset Symbol</Label>
                  <AssetSelect
                    value={settings.symbol || ''}
                    onChange={(value) => handleSettingsChange('symbol', value)}
                    assets={availableAssets}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="grid-upper">Upper Price ($)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The highest price level for your grid.</p>
                            <p className="text-xs text-muted-foreground">The bot will sell at higher prices and buy at lower prices between your grid levels.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="grid-upper"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.upperPrice || ''}
                      onChange={(e) => handleSettingsChange('upperPrice', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.upperPrice && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {formErrors.upperPrice && (
                      <p className="text-xs text-destructive mt-1">{formErrors.upperPrice}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="grid-lower">Lower Price ($)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The lowest price level for your grid.</p>
                            <p className="text-xs text-muted-foreground">Must be lower than the upper price. The bot will operate between these price levels.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="grid-lower"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.lowerPrice || ''}
                      onChange={(e) => handleSettingsChange('lowerPrice', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.lowerPrice && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {formErrors.lowerPrice && (
                      <p className="text-xs text-destructive mt-1">{formErrors.lowerPrice}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="grid-lines">Number of Grid Lines</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>How many price levels to create between upper and lower prices.</p>
                            <p className="text-xs text-muted-foreground">More lines mean smaller price gaps but more frequent trades. Min: 2, Max: 100</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="grid-lines"
                      type="number"
                      min="2"
                      max="100"
                      value={settings.gridLines || ''}
                      onChange={(e) => handleSettingsChange('gridLines', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.gridLines && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {formErrors.gridLines ? (
                      <p className="text-xs text-destructive mt-1">{formErrors.gridLines}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Min: 2, Max: 100</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="grid-investment">Investment Amount ($)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total amount to invest across all grid levels.</p>
                            <p className="text-xs text-muted-foreground">This will be divided evenly among the grid lines for balanced trading.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="grid-investment"
                      type="number"
                      min="1"
                      step="0.01"
                      value={settings.investmentAmount || ''}
                      onChange={(e) => handleSettingsChange('investmentAmount', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.investmentAmount && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {formErrors.investmentAmount && (
                      <p className="text-xs text-destructive mt-1">{formErrors.investmentAmount}</p>
                    )}
                  </div>
                </div>

                {/* Grid Levels Preview */}
                {settings.upperPrice > settings.lowerPrice && settings.gridLines >= 2 && (
                  <div className="mt-4 space-y-2">
                    <Label>Grid Levels Preview</Label>
                    <div className="bg-background/50 p-3 rounded-md space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Upper: ${settings.upperPrice.toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          Grid Size: ${((settings.upperPrice - settings.lowerPrice) / (settings.gridLines - 1)).toFixed(2)}
                        </span>
                      </div>
                      <div className="relative h-32 bg-gradient-to-b from-green-500/10 to-red-500/10 rounded">
                        {Array.from({ length: Math.min(settings.gridLines, 20) }).map((_, index) => {
                          const progress = index / (Math.min(settings.gridLines, 20) - 1);
                          const price = settings.upperPrice - (settings.upperPrice - settings.lowerPrice) * progress;
                          return (
                            <div 
                              key={index}
                              className="absolute left-0 right-0 flex justify-between items-center px-2"
                              style={{ top: `${progress * 100}%` }}
                            >
                              <div className="h-px w-full bg-border/50" />
                              <span className="text-xs ml-2 text-muted-foreground whitespace-nowrap">
                                ${price.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Lower: ${settings.lowerPrice.toFixed(2)}</span>
                        <span className="text-muted-foreground">
                          {settings.gridLines > 20 && `+${settings.gridLines - 20} more levels`}
                        </span>
                      </div>
                      {settings.gridLines > 0 && settings.investmentAmount > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Per Grid Amount: ${(settings.investmentAmount / settings.gridLines).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chart for selected asset */}
              {settings.symbol && (
                <div className="mt-4">
                  <Label>Price Chart</Label>
                  <div className="h-[400px] w-full mt-2 rounded-lg overflow-hidden border">
                    <TradingViewWidget symbol={settings.symbol} theme="dark" />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Indicator Trading Settings */}
          {type === 'indicator' && (
            <Card className="bg-muted/30 p-4 mt-4">
              <h4 className="mb-3 font-medium text-sm">Indicator Trading Settings</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="indicator-symbol">Asset Symbol</Label>
                    <AssetSelect
                      value={settings.symbol || ''}
                      onChange={(value) => handleSettingsChange('symbol', value)}
                      assets={availableAssets}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="indicator-timeframe">Timeframe</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>How often to analyze market data.</p>
                            <p className="text-xs text-muted-foreground">
                              Lower timeframes = More frequent trades but higher noise<br />
                              Higher timeframes = Less trades but clearer trends
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      value={settings.timeframe || '1h'}
                      onValueChange={(value) => handleSettingsChange('timeframe', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger 
                        id="indicator-timeframe"
                        className={cn(
                          formErrors.timeframe && "border-destructive focus-visible:ring-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 Minute</SelectItem>
                        <SelectItem value="5m">5 Minutes</SelectItem>
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="4h">4 Hours</SelectItem>
                        <SelectItem value="1d">1 Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="entry-amount">Entry Amount ($)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Amount to invest per trade.</p>
                            <p className="text-xs text-muted-foreground">
                              The bot will use this amount for each entry position when indicator signals appear.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="entry-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={settings.entryAmount || ''}
                      onChange={(e) => handleSettingsChange('entryAmount', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.entryAmount && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {formErrors.entryAmount && (
                      <p className="text-xs text-destructive mt-1">{formErrors.entryAmount}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="stop-loss">Stop Loss (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum allowed loss per trade.</p>
                            <p className="text-xs text-muted-foreground">
                              Example: 2% means position closes if price moves 2% against you.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="stop-loss"
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={settings.stopLoss || ''}
                      onChange={(e) => handleSettingsChange('stopLoss', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="take-profit">Take Profit (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Target profit per trade.</p>
                            <p className="text-xs text-muted-foreground">
                              Example: 4% means position closes when profit reaches 4%.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="take-profit"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={settings.takeProfit || ''}
                      onChange={(e) => handleSettingsChange('takeProfit', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Strategy-specific parameters */}
                {strategy === 'RSI Basic' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="rsi-period">RSI Period</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of periods used to calculate RSI.</p>
                              <p className="text-xs text-muted-foreground">
                                14 is standard. Lower values = More sensitive signals<br />
                                Higher values = More stable but slower signals
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input 
                        id="rsi-period"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.rsiPeriod || '14'}
                        onChange={(e) => handleSettingsChange('rsiPeriod', e.target.value)}
                        disabled={isLoading}
                        className={cn(
                          formErrors.rsiPeriod && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formErrors.rsiPeriod && (
                        <p className="text-xs text-destructive mt-1">{formErrors.rsiPeriod}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="rsi-overbought">Overbought Level</Label>
                      <Input 
                        id="rsi-overbought"
                        type="number"
                        min="50"
                        max="100"
                        value={settings.rsiOverbought || '70'}
                        onChange={(e) => handleSettingsChange('rsiOverbought', e.target.value)}
                        disabled={isLoading}
                        className={cn(
                          formErrors.rsiOverbought && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formErrors.rsiOverbought && (
                        <p className="text-xs text-destructive mt-1">{formErrors.rsiOverbought}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="rsi-oversold">Oversold Level</Label>
                      <Input 
                        id="rsi-oversold"
                        type="number"
                        min="0"
                        max="50"
                        value={settings.rsiOversold || '30'}
                        onChange={(e) => handleSettingsChange('rsiOversold', e.target.value)}
                        disabled={isLoading}
                        className={cn(
                          formErrors.rsiOversold && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formErrors.rsiOversold && (
                        <p className="text-xs text-destructive mt-1">{formErrors.rsiOversold}</p>
                      )}
                    </div>
                  </div>
                )}

                {strategy === 'MACD Crossover' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="macd-fast">Fast Period</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Short-term moving average period.</p>
                              <p className="text-xs text-muted-foreground">
                                12 is standard. Lower values respond faster to price changes but may give more false signals.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input 
                        id="macd-fast"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.macdFast || '12'}
                        onChange={(e) => handleSettingsChange('macdFast', e.target.value)}
                        disabled={isLoading}
                        className={cn(
                          formErrors.macdFast && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formErrors.macdFast && (
                        <p className="text-xs text-destructive mt-1">{formErrors.macdFast}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="macd-slow">Slow Period</Label>
                      <Input 
                        id="macd-slow"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.macdSlow || '26'}
                        onChange={(e) => handleSettingsChange('macdSlow', e.target.value)}
                        disabled={isLoading}
                        className={cn(
                          formErrors.macdSlow && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formErrors.macdSlow && (
                        <p className="text-xs text-destructive mt-1">{formErrors.macdSlow}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="macd-signal">Signal Period</Label>
                      <Input 
                        id="macd-signal"
                        type="number"
                        min="1"
                        max="100"
                        value={settings.macdSignal || '9'}
                        onChange={(e) => handleSettingsChange('macdSignal', e.target.value)}
                        disabled={isLoading}
                        className={cn(
                          formErrors.macdSignal && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {formErrors.macdSignal && (
                        <p className="text-xs text-destructive mt-1">{formErrors.macdSignal}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chart for selected asset */}
              {settings.symbol && (
                <div className="mt-4">
                  <Label>Price Chart</Label>
                  <div className="h-[400px] w-full mt-2 rounded-lg overflow-hidden border">
                    <TradingViewWidget symbol={settings.symbol} theme="dark" />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Basket Trading Settings */}
          {type === 'basket' && (
            <Card className="bg-muted/30 p-4 mt-4">
              <h4 className="mb-3 font-medium text-sm">Basket Trading Settings</h4>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Label>Asset Allocation</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define the assets in your portfolio and their target weights.</p>
                            <p className="text-xs text-muted-foreground">
                              Choose 2-20 assets and assign percentage weights that sum to 100%.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newAssets = [...(settings.assets || []), { symbol: '', weight: 0 }];
                        setSettings({ ...settings, assets: newAssets });
                      }}
                      disabled={isLoading || (settings.assets?.length || 0) >= 20}
                    >
                      Add Asset
                    </Button>
                  </div>
                  {settings.assets?.map((asset: any, index: number) => (
                    <div key={index} className="grid grid-cols-8 gap-2 items-end">
                      <div className="col-span-4 space-y-1">
                        <Label htmlFor={`asset-${index}-symbol`}>Symbol</Label>
                        <AssetSelect
                          value={asset.symbol}
                          onChange={(value) => {
                            const newAssets = [...settings.assets];
                            newAssets[index].symbol = value;
                            setSettings({ ...settings, assets: newAssets });
                          }}
                          assets={availableAssets}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`asset-${index}-weight`}>Weight (%)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Target percentage allocation for this asset.</p>
                                <p className="text-xs text-muted-foreground">
                                  Higher weight = Larger position size in your portfolio.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id={`asset-${index}-weight`}
                          type="number"
                          min="1"
                          max="100"
                          step="1"
                          value={asset.weight}
                          onChange={(e) => {
                            const newAssets = [...settings.assets];
                            newAssets[index].weight = parseFloat(e.target.value);
                            setSettings({ ...settings, assets: newAssets });
                          }}
                          required
                          disabled={isLoading}
                          className={cn(
                            formErrors.weights && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => {
                            const newAssets = [...settings.assets];
                            newAssets.splice(index, 1);
                            setSettings({ ...settings, assets: newAssets });
                          }}
                          disabled={isLoading || settings.assets.length <= 2}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Add 2-20 assets. Total weight should equal 100%.
                    </p>
                    {settings.assets?.length > 0 && (
                      <div className="text-sm">
                        Total Weight:{" "}
                        <span className={cn(
                          "font-medium",
                          Math.abs((settings.assets?.reduce((sum: number, asset: { weight: number }) => sum + (asset.weight || 0), 0) || 0) - 100) > 0.01
                            ? "text-destructive"
                            : "text-green-500"
                        )}>
                          {(settings.assets?.reduce((sum: number, asset: { weight: number }) => sum + (asset.weight || 0), 0) || 0).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Portfolio Allocation Pie Chart */}
                  {settings.assets?.some(asset => asset.symbol && asset.weight > 0) && (
                    <div className="mt-4 p-4 bg-background/50 rounded-lg">
                      <h4 className="mb-2 font-medium text-sm">Portfolio Allocation</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={settings.assets
                                .filter(asset => asset.symbol && asset.weight > 0)
                                .map((asset, index) => ({
                                  name: asset.symbol,
                                  value: asset.weight,
                                }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, value }) => `${name} (${value}%)`}
                            >
                              {settings.assets
                                .filter(asset => asset.symbol && asset.weight > 0)
                                .map((_, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                  />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => `${value.toFixed(1)}%`}
                              contentStyle={{ 
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="rebalance-threshold">Rebalance Threshold (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>When to trigger rebalancing.</p>
                            <p className="text-xs text-muted-foreground">
                              Example: 5% means rebalance when any asset deviates from its target weight by ±5%.<br />
                              Lower = More frequent rebalancing and trading fees<br />
                              Higher = Less frequent rebalancing but more drift
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="rebalance-threshold"
                      type="number"
                      min="0.1"
                      max="50"
                      step="0.1"
                      value={settings.rebalanceThreshold || '5'}
                      onChange={(e) => handleSettingsChange('rebalanceThreshold', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.rebalanceThreshold && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      Trigger rebalance when allocation differs by this percentage
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="total-amount">Total Investment ($)</Label>
                    <Input
                      id="total-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={settings.totalAmount || ''}
                      onChange={(e) => handleSettingsChange('totalAmount', e.target.value)}
                      required
                      disabled={isLoading}
                      className={cn(
                        formErrors.totalAmount && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rebalance-interval">Rebalance Interval</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often to check portfolio balance.</p>
                          <p className="text-xs text-muted-foreground">
                            The bot will check allocations at this interval and rebalance if needed based on the threshold.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={settings.rebalanceInterval || 'weekly'}
                    onValueChange={(value) => handleSettingsChange('rebalanceInterval', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="rebalance-interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {bot ? 'Update Bot' : 'Create Bot'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
