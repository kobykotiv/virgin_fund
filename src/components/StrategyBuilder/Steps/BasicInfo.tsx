import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StockSearch } from '@/components/StockSearch';
import { SearchHelpPopover } from '@/components/ui/search-help-popover';
import { useStrategy } from '@/context/StrategyContext';
import { AssetSchema } from '@/types/strategy';

const BasicInfoSchema = z.object({
  name: z.string().min(1, "Strategy name is required"),
  description: z.string(),
  selectedAssets: z.array(AssetSchema).min(1, "Select at least one asset").max(20, "Maximum 20 assets allowed"),
});

type BasicInfoFormData = z.infer<typeof BasicInfoSchema>;

export default function BasicInfo() {
  const { state, dispatch } = useStrategy();
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      name: state.formData.name || '',
      description: state.formData.description || '',
      selectedAssets: state.formData.selectedAssets || [],
    },
  });

  const onSubmit = (data: BasicInfoFormData) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Let's start by naming your strategy and selecting the assets you want to trade.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Strategy Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="My Investment Strategy"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe your investment strategy..."
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Assets (Max 20)</Label>
              <SearchHelpPopover className="text-muted-foreground hover:text-primary transition-colors" />
            </div>
            <StockSearch
              onSelect={(symbol) => {
                const currentAssets = form.getValues('selectedAssets') || [];
                form.setValue('selectedAssets', [...currentAssets, { symbol, name: symbol }]);
              }}
              selectedAssets={form.watch('selectedAssets')?.map(a => a.symbol) || []}
            />
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