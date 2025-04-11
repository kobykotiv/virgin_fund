"use client";

import { useState, useEffect } from 'react';
import { Bot } from '@/app/(dashboard)/bots/page'; // Import Bot type
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

interface BotFormProps {
  bot?: Bot | null; // Bot data for editing, null for creating
  onSuccess: () => void; // Callback on successful save/update
  onCancel: () => void; // Callback to cancel/close the form
  availableAssets: string[];
  botTypes: { value: string; label: string }[];
}

// Define available bot types and strategies (expand later)
const BOT_TYPES = ['DCA', 'Indicator', 'BasketRebalance'];
const STRATEGIES_BY_TYPE: Record<string, string[]> = {
  DCA: ['Simple DCA'],
  Indicator: ['RSI Basic', 'MACD Crossover'],
  BasketRebalance: ['Periodic Rebalance', 'Threshold Rebalance'],
};

// Basic settings structure for DCA (expand later)
interface DcaSettings {
  symbol: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'biweekly' | 'monthly';
}

export default function BotForm({ bot, onSuccess, onCancel }: BotFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>(BOT_TYPES[0]); // Default to first type
  const [strategy, setStrategy] = useState<string>('');
  const [settings, setSettings] = useState<Partial<DcaSettings>>({}); // Start with DCA settings structure
  const [isLoading, setIsLoading] = useState(false);
  const [availableStrategies, setAvailableStrategies] = useState<string[]>([]);

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
      setType(BOT_TYPES[0]);
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
        if (type === 'DCA') {
            setSettings({ symbol: '', amount: 10, interval: 'weekly' });
        } else {
            setSettings({}); // Clear for other types initially
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

  const handleSettingsChange = (field: keyof DcaSettings, value: string | number) => {
     // Ensure settings update correctly, especially for numeric fields
     if (type === 'DCA') {
        // For amount, parse as float, otherwise keep as string (for symbol/interval)
        const processedValue = field === 'amount' ? parseFloat(value as string) || 0 : value;
        setSettings(prev => ({ ...prev, [field]: processedValue }));
     }
     // Add logic for other bot types later
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure settings are valid before submitting (basic example)
    if (type === 'DCA') {
        const dcaSettings = settings as Partial<DcaSettings>;
        if (!dcaSettings.symbol || !dcaSettings.amount || dcaSettings.amount <= 0 || !dcaSettings.interval) {
            toast({ title: "Error", description: "Please fill all DCA settings correctly (Symbol, Amount > 0, Interval).", variant: "destructive" });
            setIsLoading(false);
            return;
        }
    }
    // Add validation for other types later

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
      <CardHeader>
        <CardTitle>{bot ? 'Edit Bot' : 'Create New Bot'}</CardTitle>
        <CardDescription>Configure your trading bot details.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Weekly DCA Bot"
              required
              minLength={10} // Enforce min length from schema
              disabled={isLoading}
            />
             <p className="text-xs text-muted-foreground">Minimum 10 characters.</p>
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
                 <SelectTrigger id="type">
                   <SelectValue placeholder="Select type" />
                 </SelectTrigger>
                 <SelectContent>
                   {BOT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-1">
               <Label htmlFor="strategy">Strategy</Label>
               <Select value={strategy} onValueChange={setStrategy} disabled={isLoading || availableStrategies.length === 0}>
                 <SelectTrigger id="strategy">
                   <SelectValue placeholder="Select strategy" />
                 </SelectTrigger>
                 <SelectContent>
                   {availableStrategies.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                 </SelectContent>
               </Select>
             </div>
          </div>

          {/* --- Type-Specific Settings --- */}
          {type === 'DCA' && (
            <Card className="bg-muted/30 p-4 mt-4"> {/* Added margin top */}
               <h4 className="mb-3 font-medium text-sm">DCA Settings</h4>
               <div className="space-y-3">
                  <div className="space-y-1">
                     <Label htmlFor="dca-symbol">Asset Symbol</Label>
                     <Input 
                        id="dca-symbol" 
                        placeholder="e.g., AAPL or BTC/USD" 
                        value={settings.symbol || ''}
                        onChange={(e) => handleSettingsChange('symbol', e.target.value)}
                        required
                        disabled={isLoading}
                     />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <Label htmlFor="dca-amount">Amount per Interval ($)</Label>
                         <Input 
                            id="dca-amount" 
                            type="number" 
                            min="1" 
                            step="0.01"
                            value={settings.amount || ''}
                            onChange={(e) => handleSettingsChange('amount', e.target.value)} // Pass string directly
                            required
                            disabled={isLoading}
                         />
                      </div>
                      <div className="space-y-1">
                         <Label htmlFor="dca-interval">Interval</Label>
                         <Select 
                            value={settings.interval || 'weekly'} 
                            onValueChange={(value) => handleSettingsChange('interval', value as DcaSettings['interval'])} // Cast value
                            disabled={isLoading}
                         >
                           <SelectTrigger id="dca-interval">
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
            </Card>
          )}
          {/* Add sections for other bot types (Indicator, BasketRebalance) here later */}

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
