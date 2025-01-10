import React, { Suspense } from 'react';
import { Welcome } from './Welcome';
import { Progress } from '@/components/ui/progress';
import { useStrategy } from '@/context/StrategyContext';
import { ErrorBoundary } from './ErrorBoundary';

// Import components directly to avoid dynamic import issues
import BasicInfo from './Steps/BasicInfo';
import StrategyConfig from './Steps/StrategyConfig';
import TechnicalAnalysis from './Steps/TechnicalAnalysis';
import RiskManagement from './Steps/RiskManagement';

const StepComponents: Record<number, React.ComponentType> = {
  1: BasicInfo,
  2: StrategyConfig,
  3: TechnicalAnalysis,
  4: RiskManagement,
};

export function StrategyBuilder() {
  const { state } = useStrategy();
  const [showWelcome, setShowWelcome] = React.useState(true);

  if (showWelcome) {
    return <Welcome onNext={() => setShowWelcome(false)} />;
  }

  const CurrentStep = StepComponents[state.currentStep as keyof typeof StepComponents];
  const progress = (state.currentStep / 4) * 100;

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {state.currentStep} of 4
        </p>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<StepSkeleton />}>
          <CurrentStep />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function StepSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  );
}