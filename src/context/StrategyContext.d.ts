import React from 'react';
import { Strategy } from '@/types/strategy';
interface StrategyState {
    currentStep: number;
    formData: Partial<Strategy>;
    isValid: boolean;
    isDirty: boolean;
}
type StrategyAction = {
    type: 'SET_STEP';
    payload: number;
} | {
    type: 'UPDATE_FORM';
    payload: Partial<Strategy>;
} | {
    type: 'SET_VALID';
    payload: boolean;
} | {
    type: 'SET_DIRTY';
    payload: boolean;
};
export declare function StrategyProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useStrategy(): {
    state: StrategyState;
    dispatch: React.Dispatch<StrategyAction>;
};
export {};
//# sourceMappingURL=StrategyContext.d.ts.map