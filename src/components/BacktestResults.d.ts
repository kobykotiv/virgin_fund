import React from 'react';
import type { StrategyResult } from '@/types';
interface BacktestResultsProps {
    results: StrategyResult;
    onSave: () => void;
    onRetest: () => void;
}
export declare function BacktestResults({ results, onSave, onRetest }: BacktestResultsProps): React.JSX.Element;
export {};
//# sourceMappingURL=BacktestResults.d.ts.map