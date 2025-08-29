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
import { Portfolio, Allocation } from '@/hooks/usePortfolios';
import { ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';

interface PortfolioWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (portfolioData: Partial<Portfolio>) => Promise<void>;
  editingPortfolio?: Portfolio | null;
}

interface WizardStep {
  id: string;
  title: string;
  emoji: string;
}

const steps: WizardStep[] = [
  { id: 'basic', title: 'Basic Info', emoji: '📝' },
  { id: 'allocation', title: 'Asset Allocation', emoji: '🎯' },
  { id: 'settings', title: 'Settings', emoji: '⚙️' },
  { id: 'review', title: 'Review', emoji: '✅' },
];

const presetAllocations = [
  {
    name: 'Conservative',
    emoji: '🛡️',
    allocations: [
      { symbol: 'SPY', percent: 60 },
      { symbol: 'BND', percent: 30 },
      { symbol: 'GLD', percent: 10 },
    ]
  },
  {
    name: 'Balanced',
    emoji: '⚖️',
    allocations: [
      { symbol: 'SPY', percent: 70 },
      { symbol: 'QQQ', percent: 20 },
      { symbol: 'BND', percent: 10 },
    ]
  },
  {
    name: 'Aggressive',
    emoji: '🚀',
    allocations: [
      { symbol: 'QQQ', percent: 50 },
      { symbol: 'SPY', percent: 30 },
      { symbol: 'VTI', percent: 20 },
    ]
  },
  {
    name: 'Crypto',
    emoji: '₿',
    allocations: [
      { symbol: 'BTC', percent: 60 },
      { symbol: 'ETH', percent: 30 },
      { symbol: 'SOL', percent: 10 },
    ]
  },
];

export function PortfolioWizard({ open, onClose, onSubmit, editingPortfolio }: PortfolioWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Portfolio>>({
    name: editingPortfolio?.name || '',
    description: editingPortfolio?.description || '',
    currency: editingPortfolio?.currency || 'USD',
    balance: editingPortfolio?.balance || 10000,
    allocation: editingPortfolio?.allocation || [],
    ...editingPortfolio,
  });

  const updateFormData = (updates: Partial<Portfolio>) => {
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
        description: '',
        currency: 'USD',
        balance: 10000,
        allocation: [],
      });
      setCurrentStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name && formData.name.trim().length > 0 && (formData.balance || 0) > 0;
      case 1: // Allocation
        const totalPercent = (formData.allocation || []).reduce((sum, alloc) => sum + alloc.percent, 0);
        return formData.allocation && formData.allocation.length > 0 && Math.abs(totalPercent - 100) < 0.01;
      case 2: // Settings
        return true;
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const addAllocation = (symbol: string, percent: number) => {
    if (symbol && percent > 0) {
      const existing = formData.allocation?.find(a => a.symbol === symbol.toUpperCase());
      if (existing) {
        updateFormData({
          allocation: formData.allocation?.map(a => 
            a.symbol === symbol.toUpperCase() ? { ...a, percent } : a
          )
        });
      } else {
        updateFormData({
          allocation: [...(formData.allocation || []), { symbol: symbol.toUpperCase(), percent }]
        });
      }
    }
  };

  const removeAllocation = (symbol: string) => {
    updateFormData({
      allocation: formData.allocation?.filter(a => a.symbol !== symbol) || []
    });
  };

  const applyPreset = (allocations: Allocation[]) => {
    updateFormData({ allocation: [...allocations] });
  };

  const getTotalAllocationPercent = () => {
    return (formData.allocation || []).reduce((sum, alloc) => sum + alloc.percent, 0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Portfolio Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="e.g., Growth Portfolio"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Describe your investment strategy..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="balance">Initial Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  value={formData.balance || ''}
                  onChange={(e) => updateFormData({ balance: Number(e.target.value) })}
                  placeholder="10000"
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
          </div>
        );

      case 1: // Allocation
        const [newSymbol, setNewSymbol] = useState('');
        const [newPercent, setNewPercent] = useState<number>(0);
        const totalPercent = getTotalAllocationPercent();
        const remainingPercent = 100 - totalPercent;

        return (
          <div className="space-y-4">
            {/* Preset allocations */}
            <div>
              <Label>Quick Start Presets</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {presetAllocations.map((preset) => (
                  <Card
                    key={preset.name}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => applyPreset(preset.allocations)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{preset.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-sm">{preset.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {preset.allocations.map(a => `${a.symbol}:${a.percent}%`).join(' • ')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Manual allocation */}
            <div>
              <Label>Custom Allocation</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Symbol (e.g., AAPL)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Percent"
                  value={newPercent || ''}
                  onChange={(e) => setNewPercent(Number(e.target.value))}
                  max={remainingPercent}
                />
                <Button
                  type="button"
                  onClick={() => {
                    addAllocation(newSymbol, newPercent);
                    setNewSymbol('');
                    setNewPercent(0);
                  }}
                  disabled={!newSymbol || !newPercent || newPercent > remainingPercent}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {remainingPercent > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Remaining: {remainingPercent.toFixed(1)}%
                </p>
              )}
            </div>

            {/* Current allocations */}
            {formData.allocation && formData.allocation.length > 0 && (
              <div>
                <Label>Current Allocation</Label>
                <div className="space-y-2 mt-2">
                  {formData.allocation.map((allocation) => (
                    <div key={allocation.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">📈 {allocation.symbol}</Badge>
                        <span className="font-medium">{allocation.percent.toFixed(1)}%</span>
                        <Progress value={allocation.percent} className="w-20 h-2" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAllocation(allocation.symbol)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Allocation:</span>
                    <span className={`font-bold ${
                      Math.abs(totalPercent - 100) < 0.01 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {totalPercent.toFixed(1)}%
                    </span>
                  </div>
                  {Math.abs(totalPercent - 100) >= 0.01 && (
                    <p className="text-sm text-red-600 mt-1">
                      Total must equal 100% to proceed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Settings
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔄 Rebalancing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rebalancing Frequency</Label>
                  <select className="w-full p-2 border rounded-md mt-1">
                    <option value="manual">Manual Only</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <Label>Threshold for Rebalancing (%)</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Rebalance when any allocation drifts beyond this threshold
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💼 Portfolio Configuration Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Name</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Currency</span>
                    <p className="font-medium">{formData.currency}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Initial Balance</span>
                    <p className="font-medium">{formData.currency} {formData.balance?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Assets</span>
                    <p className="font-medium">{formData.allocation?.length || 0} assets</p>
                  </div>
                </div>
                
                {formData.description && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">Description</span>
                      <p className="font-medium">{formData.description}</p>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div>
                  <span className="text-sm text-muted-foreground">Asset Allocation</span>
                  <div className="space-y-2 mt-2">
                    {formData.allocation?.map((allocation) => (
                      <div key={allocation.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">📈 {allocation.symbol}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{allocation.percent.toFixed(1)}%</span>
                          <Progress value={allocation.percent} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💼 {editingPortfolio ? 'Edit Portfolio' : 'Create New Portfolio'}
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
          <div className="min-h-[400px]">
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
                {isSubmitting ? '🔄 Creating...' : `✅ ${editingPortfolio ? 'Update' : 'Create'} Portfolio`}
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