import { INDICATORS } from '../indicators';
import type { Strategy, Asset } from '@/types/strategy';
export type StrategyType = 'DCA' | 'MOMENTUM' | 'TREND_FOLLOWING' | 'MEAN_REVERSION';
export declare const STRATEGIES: Record<StrategyType, {
    name: string;
    description: string;
    indicators: (keyof typeof INDICATORS)[];
    defaultConfig: Record<string, any>;
}>;
export declare function validateStrategy(strategy: Strategy): {
    isValid: boolean;
    errors: string[];
};
export declare function generateSignals(strategy: Strategy, assets: Asset[], prices: Record<string, {
    timestamp: number;
    value: number;
}[]>): {
    asset: string;
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
}[];
//# sourceMappingURL=index.d.ts.map