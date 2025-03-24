import { useState } from 'react';
import { BotConfig } from '@/types/bot';
import { useToast } from '@/components/ui/use-toast';
import {
  BasicInfoStep,
  StrategyStep,
  RiskManagementStep,
  AssetsStep,
  AllocationStep,
  ReviewStep,
} from './steps';

const steps = [
  'Basic Info',
  'Strategy',
  'Risk Management',
  'Assets',
  'Allocation',
  'Review',
];

export default function BotWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<Partial<BotConfig>>({});
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateConfig = (updates: Partial<BotConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!config.name?.trim()) {
          newErrors.name = 'Bot name is required';
        }
        break;
      case 1:
        if (!config.strategy?.type) {
          newErrors.strategy = 'Please select a strategy';
        }
        break;
      case 2:
        if (!config.riskManagement?.stopLoss) {
          newErrors.stopLoss = 'Stop loss is required';
        }
        if (!config.riskManagement?.takeProfit) {
          newErrors.takeProfit = 'Take profit is required';
        }
        break;
      case 3:
        if (!config.assets?.length) {
          newErrors.assets = 'Please select at least one asset';
        }
        break;
      case 4:
        if (!config.allocation?.initialAmount) {
          newErrors.initialAmount = 'Initial investment amount is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before continuing.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = () => {
    // Implement your submit logic here
    console.log('Submitting bot configuration:', config);
    toast({
      title: 'Success',
      description: 'Bot created successfully!',
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep config={config} onUpdate={updateConfig} />;
      case 1:
        return <StrategyStep config={config} onUpdate={updateConfig} />;
      case 2:
        return <RiskManagementStep config={config} onUpdate={updateConfig} />;
      case 3:
        return <AssetsStep config={config} onUpdate={updateConfig} />;
      case 4:
        return <AllocationStep config={config} onUpdate={updateConfig} />;
      case 5:
        return <ReviewStep config={config} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? 'border-blue-600 bg-blue-100'
                      : 'border-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 w-full h-0.5 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
              <span className="ml-2 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === steps.length - 1 ? 'Create Bot' : 'Next'}
        </button>
      </div>
    </div>
  );
}
