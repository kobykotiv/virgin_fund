"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Bot } from '@/types/api';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface BotWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (botData: Partial<Bot>) => Promise<void>;
  editingBot?: Bot | null;
}

interface WizardStep {
  id: string;
  title: string;
  emoji: string;
}

const steps: WizardStep[] = [
  { id: 'basic', title: 'Basic Info', emoji: '📝' },
  { id: 'strategy', title: 'Strategy', emoji: '🎯' },
  { id: 'assets', title: 'Assets', emoji: '📈' },
  { id: 'risk', title: 'Risk Management', emoji: '🛡️' },
  { id: 'review', title: 'Review', emoji: '✅' },
];

const strategies = [
  { id: 'dca', name: 'Dollar Cost Averaging', emoji: '💰', description: 'Regular purchases regardless of price' },
  { id: 'grid', name: 'Grid Trading', emoji: '🔢', description: 'Buy low, sell high in a grid pattern' },
  { id: 'indicator', name: 'Technical Indicators', emoji: '📊', description: 'Trade based on RSI, MACD, etc.' },
  { id: 'portfolio', name: 'Portfolio Rebalancing', emoji: '⚖️', description: 'Maintain target asset allocation' },
];

export function BotWizard({ open, onClose, onSubmit, editingBot }: BotWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Bot>>({
    name: editingBot?.name || '',
    strategy: editingBot?.strategy || '',
    assets: editingBot?.assets || [],
    capital: editingBot?.capital || 1000,
    currency: editingBot?.currency || 'USD',
    stopLoss: editingBot?.stopLoss || 5,
    takeProfit: editingBot?.takeProfit || 10,
    maxDrawdown: editingBot?.maxDrawdown || 10,
    parameters: editingBot?.parameters || {},
    ...editingBot,
  });

  const updateFormData = (updates: Partial<Bot>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form for next use
      setFormData({
        name: '',
        strategy: '',
        assets: [],
        capital: 1000,
        currency: 'USD',
        stopLoss: 5,
        takeProfit: 10,
        maxDrawdown: 10,
        parameters: {},
      });
      setCurrentStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name && formData.name.trim().length > 0;
      case 1: // Strategy
        return formData.strategy && formData.strategy.length > 0;
      case 2: // Assets
        return formData.assets && formData.assets.length > 0;
      case 3: // Risk
        return (formData.stopLoss || 0) > 0 && (formData.capital || 0) > 0;
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const addAsset = (symbol: string) => {
    if (symbol && !formData.assets?.includes(symbol)) {
      updateFormData({
        assets: [...(formData.assets || []), symbol.toUpperCase()]
      });
    }
  };

  const removeAsset = (symbol: string) => {
    updateFormData({
      assets: formData.assets?.filter(asset => asset !== symbol) || []
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="e.g., My DCA Bot"
              />
            </div>
            <div>
              <Label htmlFor="capital">Initial Capital</Label>
              <Input
                id="capital"
                type="number"
                value={formData.capital || ''}
                onChange={(e) => updateFormData({ capital: Number(e.target.value) })}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.currency || 'USD'}
                onChange={(e) => updateFormData({ currency: e.target.value })}
              >
                <option value="USD">💵 USD</option>
                <option value="EUR">💶 EUR</option>
                <option value="BTC">₿ BTC</option>
                <option value="ETH">Ξ ETH</option>
              </select>
            </div>
          </div>
        );

      case 1: // Strategy
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {strategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className={`cursor-pointer transition-all ${
                    formData.strategy === strategy.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => updateFormData({ strategy: strategy.id })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{strategy.emoji}</span>
                      <div>
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                      {formData.strategy === strategy.id && (
                        <Check className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2: // Assets
        const [newAsset, setNewAsset] = useState('');
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="newAsset">Add Assets</Label>
              <div className="flex gap-2">
                <Input
                  id="newAsset"
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value)}
                  placeholder="e.g., AAPL"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAsset(newAsset);
                      setNewAsset('');
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addAsset(newAsset);
                    setNewAsset('');
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            
            {formData.assets && formData.assets.length > 0 && (
              <div>
                <Label>Selected Assets</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.assets.map((asset) => (
                    <Badge
                      key={asset}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeAsset(asset)}
                    >
                      📈 {asset} ✕
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3: // Risk Management
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="stopLoss">Stop Loss (%)</Label>
              <Input
                id="stopLoss"
                type="number"
                value={formData.stopLoss || ''}
                onChange={(e) => updateFormData({ stopLoss: Number(e.target.value) })}
                placeholder="5"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Bot will stop if losses exceed this percentage
              </p>
            </div>
            <div>
              <Label htmlFor="takeProfit">Take Profit (%)</Label>
              <Input
                id="takeProfit"
                type="number"
                value={formData.takeProfit || ''}
                onChange={(e) => updateFormData({ takeProfit: Number(e.target.value) })}
                placeholder="10"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Bot will take profits when this percentage is reached
              </p>
            </div>
            <div>
              <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
              <Input
                id="maxDrawdown"
                type="number"
                value={formData.maxDrawdown || ''}
                onChange={(e) => updateFormData({ maxDrawdown: Number(e.target.value) })}
                placeholder="10"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum allowed drawdown before bot pauses
              </p>
            </div>
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🤖 Bot Configuration Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Name</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Strategy</span>
                    <p className="font-medium">
                      {strategies.find(s => s.id === formData.strategy)?.name || formData.strategy}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Capital</span>
                    <p className="font-medium">{formData.currency} {formData.capital}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Assets</span>
                    <p className="font-medium">{formData.assets?.join(', ') || 'None'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Stop Loss</span>
                    <p className="font-medium">{formData.stopLoss}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Take Profit</span>
                    <p className="font-medium">{formData.takeProfit}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    <p className="font-medium">{formData.maxDrawdown}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🚀 {editingBot ? 'Edit Bot' : 'Create New Bot'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-muted'
                  }`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : step.emoji}
                </div>
                <span className="text-xs mt-1 max-w-16 leading-tight">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {steps[currentStep].emoji} {steps[currentStep].title}
            </h3>
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting || !isStepValid()}>
                {isSubmitting ? '🔄 Creating...' : `✅ ${editingBot ? 'Update' : 'Create'} Bot`}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}