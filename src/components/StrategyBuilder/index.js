import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const StepComponents = {
    1: BasicInfo,
    2: StrategyConfig,
    3: TechnicalAnalysis,
    4: RiskManagement,
};
export function StrategyBuilder() {
    const { state } = useStrategy();
    const [showWelcome, setShowWelcome] = React.useState(true);
    if (showWelcome) {
        return _jsx(Welcome, { onNext: () => setShowWelcome(false) });
    }
    const CurrentStep = StepComponents[state.currentStep];
    const progress = (state.currentStep / 4) * 100;
    return (_jsxs("div", { className: "container max-w-4xl mx-auto py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx(Progress, { value: progress, className: "h-2" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: ["Step ", state.currentStep, " of 4"] })] }), _jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx(StepSkeleton, {}), children: _jsx(CurrentStep, {}) }) })] }));
}
function StepSkeleton() {
    return (_jsxs("div", { className: "space-y-4 animate-pulse", children: [_jsx("div", { className: "h-8 bg-muted rounded w-1/3" }), _jsx("div", { className: "h-4 bg-muted rounded w-2/3" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-10 bg-muted rounded" }), _jsx("div", { className: "h-10 bg-muted rounded" }), _jsx("div", { className: "h-10 bg-muted rounded" })] })] }));
}
