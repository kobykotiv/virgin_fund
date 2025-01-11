import type { Price } from '../indicators/types';
export declare const ADVANCED_STRATEGY: {
    name: string;
    timeframe: string;
    indicators: {
        trend: {
            primary: {
                type: string;
                params: {
                    fast: number;
                    slow: number;
                };
                weight: number;
            };
            confirmation: {
                type: string;
                params: {
                    period: number;
                    threshold: number;
                };
                weight: number;
            };
        };
        momentum: {
            primary: {
                type: string;
                params: {
                    period: number;
                    overbought: number;
                    oversold: number;
                };
                weight: number;
            };
        };
        volume: {
            primary: {
                type: string;
                params: {
                    period: number;
                    threshold: number;
                };
                weight: number;
            };
        };
    };
    riskManagement: {
        stopLoss: {
            type: string;
            multiplier: number;
            period: number;
        };
        takeProfit: {
            type: string;
            ratio: number;
        };
        positionSizing: {
            type: string;
            riskPerTrade: number;
        };
        timeFilter: {
            excludeWeekends: boolean;
            tradingHours: {
                start: string;
                end: string;
            };
        };
    };
};
export declare function generateAdvancedSignals(prices: Price[], volume: number[], config?: {
    name: string;
    timeframe: string;
    indicators: {
        trend: {
            primary: {
                type: string;
                params: {
                    fast: number;
                    slow: number;
                };
                weight: number;
            };
            confirmation: {
                type: string;
                params: {
                    period: number;
                    threshold: number;
                };
                weight: number;
            };
        };
        momentum: {
            primary: {
                type: string;
                params: {
                    period: number;
                    overbought: number;
                    oversold: number;
                };
                weight: number;
            };
        };
        volume: {
            primary: {
                type: string;
                params: {
                    period: number;
                    threshold: number;
                };
                weight: number;
            };
        };
    };
    riskManagement: {
        stopLoss: {
            type: string;
            multiplier: number;
            period: number;
        };
        takeProfit: {
            type: string;
            ratio: number;
        };
        positionSizing: {
            type: string;
            riskPerTrade: number;
        };
        timeFilter: {
            excludeWeekends: boolean;
            tradingHours: {
                start: string;
                end: string;
            };
        };
    };
}): {
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    meta: any;
};
//# sourceMappingURL=advanced.d.ts.map