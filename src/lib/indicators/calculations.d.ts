type Price = {
    timestamp: number;
    value: number;
};
export declare function calculateSMA(prices: Price[], period: number): number[];
export declare function calculateEMA(prices: Price[], period: number): number[];
export declare function calculateRSI(prices: Price[], period: number): number[];
export declare function calculateMACD(prices: Price[], { fastPeriod, slowPeriod, signalPeriod, }: {
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
}): {
    macd: number[];
    signal: number[];
    histogram: number[];
};
export declare function calculateBollingerBands(prices: Price[], { period, standardDeviations, }: {
    period: number;
    standardDeviations: number;
}): {
    upper: number[];
    middle: number[];
    lower: number[];
};
export {};
//# sourceMappingURL=calculations.d.ts.map