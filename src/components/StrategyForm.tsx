import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calculator, X, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StockSearch } from './StockSearch';

interface FormData {
  name: string;
  initialInvestment: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  durationYears: number;
}

export function StrategyForm() {
  const { session } = useAuth();
  const [selectedAssets, setSelectedAssets] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>('');
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      frequency: 'monthly',
      durationYears: 1,
      initialInvestment: 1000
    }
  });

  const handleAssetSelect = (symbol: string) => {
    if (selectedAssets.length < 10 && !selectedAssets.includes(symbol)) {
      setSelectedAssets([...selectedAssets, symbol]);
    }
  };

  const handleAssetRemove = (symbol: string) => {
    setSelectedAssets(selectedAssets.filter(s => s !== symbol));
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!session?.user) {
        setError('You must be logged in to create a strategy');
        return;
      }

      if (selectedAssets.length === 0) {
        setError('Please select at least one asset');
        return;
      }

      const { error: insertError } = await supabase.from('strategies').insert({
        name: data.name,
        initial_investment: data.initialInvestment,
        frequency: data.frequency,
        duration_years: data.durationYears,
        assets: selectedAssets,
        start_date: new Date().toISOString(),
        user_id: session.user.id,
      });

      if (insertError) {
        console.error('Error creating strategy:', insertError);
        setError(insertError.message);
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating strategy:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Create New Investment Strategy
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Strategy Name</Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Strategy name is required' }}
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="My Investment Strategy"
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
              <Controller
                name="initialInvestment"
                control={control}
                rules={{
                  required: 'Initial investment is required',
                  min: { value: 100, message: 'Minimum investment is $100' },
                  max: { value: 100000, message: 'Maximum investment is $100,000' }
                }}
                render={({ field }) => (
                  <Input
                    id="initialInvestment"
                    type="number"
                    min="100"
                    max="100000"
                    {...field}
                  />
                )}
              />
              {errors.initialInvestment && (
                <p className="text-sm text-red-600">{errors.initialInvestment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Investment Frequency</Label>
              <Controller
                name="frequency"
                control={control}
                rules={{ required: 'Frequency is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.frequency && (
                <p className="text-sm text-red-600">{errors.frequency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationYears">Duration (Years)</Label>
              <Controller
                name="durationYears"
                control={control}
                rules={{
                  required: 'Duration is required',
                  min: { value: 1, message: 'Minimum duration is 1 year' },
                  max: { value: 20, message: 'Maximum duration is 20 years' }
                }}
                render={({ field }) => (
                  <Input
                    id="durationYears"
                    type="number"
                    min="1"
                    max="20"
                    {...field}
                  />
                )}
              />
              {errors.durationYears && (
                <p className="text-sm text-red-600">{errors.durationYears.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Select Assets (Max 10)</Label>
              <StockSearch onSelect={handleAssetSelect} selectedAssets={selectedAssets} />
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAssets.map((symbol) => (
                  <div
                    key={symbol}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded"
                  >
                    {symbol}
                    <button
                      type="button"
                      onClick={() => handleAssetRemove(symbol)}
                      className="text-primary hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
