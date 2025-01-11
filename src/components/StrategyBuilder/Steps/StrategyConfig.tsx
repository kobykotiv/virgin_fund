// import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useStrategy } from '@/context/StrategyContext';
import { Info } from 'lucide-react';

const StrategyConfigSchema = z.object({
  strategyType: z.enum(['DCA', 'TRADER', 'GRID']),
  strategyConfig: z.object({
    investmentAmount: z.number().min(1),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
    rebalanceThreshold: z.number().min(1).max(100).optional(),
  }),
});

type StrategyConfigFormData = z.infer<typeof StrategyConfigSchema>;

export default function StrategyConfig() {
  const { state, dispatch } = useStrategy();
  const form = useForm<StrategyConfigFormData>({
    resolver: zodResolver(StrategyConfigSchema),
    defaultValues: {
      strategyType: state.formData.strategyType || 'DCA',
      strategyConfig: state.formData.strategyConfig || {
        investmentAmount: 100,
        frequency: 'monthly',
        rebalanceThreshold: 5,
      },
    },
  });

  const onSubmit = (data: StrategyConfigFormData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Strategy Configuration</CardTitle>
          <CardDescription>
            Choose your strategy type and configure its parameters.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Strategy Type</Label>
            <Select
              onValueChange={(value) => form.setValue('strategyType', value as any)}
              defaultValue={form.getValues('strategyType')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DCA">
                  <div className="flex items-start gap-2">
                    <span>Dollar Cost Averaging</span>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </SelectItem>
                <SelectItem value="TRADER">
                  <div className="flex items-start gap-2">
                    <span>Active Trading</span>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </SelectItem>
                <SelectItem value="GRID">
                  <div className="flex items-start gap-2">
                    <span>Grid Trading</span>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <Label>Investment Amount ($)</Label>
              <Input
                type="number"
                {...form.register('strategyConfig.investmentAmount', { valueAsNumber: true })}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Investment Frequency</Label>
              <Select
                onValueChange={(value) => form.setValue('strategyConfig.frequency', value as any)}
                defaultValue={form.getValues('strategyConfig.frequency')}
              >
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
            </div>

            {form.watch('strategyType') !== 'DCA' && (
              <div className="space-y-2">
                <Label>Rebalance Threshold (%)</Label>
                <Input
                  type="number"
                  {...form.register('strategyConfig.rebalanceThreshold', { valueAsNumber: true })}
                  min={1}
                  max={100}
                />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          >
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}