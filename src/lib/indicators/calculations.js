export function calculateSMA(prices, period) {
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
        const sum = prices.slice(i - period + 1, i + 1).reduce((acc, p) => acc + p.value, 0);
        sma.push(sum / period);
    }
    return sma;
}
export function calculateEMA(prices, period) {
    const ema = [];
    const multiplier = 2 / (period + 1);
    // First EMA is SMA
    let prevEMA = prices.slice(0, period).reduce((acc, p) => acc + p.value, 0) / period;
    ema.push(prevEMA);
    for (let i = period; i < prices.length; i++) {
        prevEMA = (prices[i].value - prevEMA) * multiplier + prevEMA;
        ema.push(prevEMA);
    }
    return ema;
}
export function calculateRSI(prices, period) {
    const rsi = [];
    const gains = [];
    const losses = [];
    // Calculate price changes
    for (let i = 1; i < prices.length; i++) {
        const change = prices[i].value - prices[i - 1].value;
        gains.push(Math.max(0, change));
        losses.push(Math.max(0, -change));
    }
    // Calculate initial averages
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
    // Calculate RSI values
    for (let i = period; i < prices.length; i++) {
        avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
        avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
    }
    return rsi;
}
export function calculateMACD(prices, { fastPeriod, slowPeriod, signalPeriod }) {
    const fastEMA = calculateEMA(prices, fastPeriod);
    const slowEMA = calculateEMA(prices, slowPeriod);
    // Calculate MACD line
    const macd = fastEMA.map((fast, i) => fast - slowEMA[i]);
    // Calculate signal line (EMA of MACD)
    const signal = calculateEMA(macd.map((value, i) => ({ timestamp: prices[i].timestamp, value })), signalPeriod);
    // Calculate histogram
    const histogram = macd.map((value, i) => value - signal[i]);
    return { macd, signal, histogram };
}
export function calculateBollingerBands(prices, { period, standardDeviations }) {
    const sma = calculateSMA(prices, period);
    const upper = [];
    const lower = [];
    for (let i = period - 1; i < prices.length; i++) {
        const slice = prices.slice(i - period + 1, i + 1).map(p => p.value);
        const std = calculateStandardDeviation(slice);
        upper.push(sma[i - period + 1] + (standardDeviations * std));
        lower.push(sma[i - period + 1] - (standardDeviations * std));
    }
    return { upper, middle: sma, lower };
}
function calculateStandardDeviation(values) {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
}
