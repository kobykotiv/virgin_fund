export const STRATEGIES = {
    DCA: {
        name: 'Dollar Cost Averaging',
        description: 'Invest a fixed amount at regular intervals regardless of price',
        indicators: [],
        defaultConfig: {
            investmentAmount: 100,
            frequency: 'monthly',
        },
    },
    MOMENTUM: {
        name: 'Momentum Strategy',
        description: 'Buy assets showing strong upward momentum and sell when momentum weakens',
        indicators: ['RSI', 'MACD'],
        defaultConfig: {
            rsiThreshold: { overbought: 70, oversold: 30 },
            macdSignal: { fast: 12, slow: 26, signal: 9 },
        },
    },
    TREND_FOLLOWING: {
        name: 'Trend Following',
        description: 'Follow established market trends using moving averages',
        indicators: ['SMA', 'EMA'],
        defaultConfig: {
            fastPeriod: 20,
            slowPeriod: 50,
            crossoverSignal: true,
        },
    },
    MEAN_REVERSION: {
        name: 'Mean Reversion',
        description: 'Trade on the assumption that prices will return to their historical average',
        indicators: ['BB'],
        defaultConfig: {
            period: 20,
            standardDeviations: 2,
            meanReversionStrength: 0.5,
        },
    },
};
export function validateStrategy(strategy) {
    const errors = [];
    // Basic validation
    if (!strategy.name)
        errors.push('Strategy name is required');
    if (strategy.selectedAssets.length === 0)
        errors.push('At least one asset must be selected');
    if (strategy.selectedAssets.length > 10)
        errors.push('Maximum 10 assets allowed');
    // Strategy-specific validation
    const strategyConfig = STRATEGIES[strategy.strategyType];
    if (!strategyConfig)
        errors.push('Invalid strategy type');
    return {
        isValid: errors.length === 0,
        errors,
    };
}
export function generateSignals(strategy, assets, prices) {
    const signals = [];
    for (const asset of assets) {
        const assetPrices = prices[asset.symbol];
        if (!assetPrices)
            continue;
        let signal = 'HOLD';
        let confidence = 0;
        // Strategy-specific signal generation
        switch (strategy.strategyType) {
            case 'DCA':
                // DCA strategy always returns HOLD
                signal = 'HOLD';
                confidence = 1;
                break;
            case 'MOMENTUM':
            case 'TREND_FOLLOWING':
            case 'MEAN_REVERSION':
                // Placeholder for strategy-specific implementations
                signal = 'HOLD';
                confidence = 0.5;
                break;
        }
        signals.push({ asset: asset.symbol, action: signal, confidence });
    }
    return signals;
}
