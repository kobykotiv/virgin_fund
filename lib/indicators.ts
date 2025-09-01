/**
 * Technical Indicators Library
 * Comprehensive collection of technical analysis indicators for trading strategies
 */

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorResult {
  timestamp: number;
  value: number;
  signal?: 'buy' | 'sell' | 'hold';
}

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(data: CandleData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
    const sma = sum / period;

    results.push({
      timestamp: data[i].timestamp,
      value: sma
    });
  }

  return results;
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(data: CandleData[], period: number): IndicatorResult[] {
  const results: IndicatorResult[] = [];
  const multiplier = 2 / (period + 1);

  // Start with SMA for first value
  if (data.length >= period) {
    const initialSMA = data.slice(0, period).reduce((acc, candle) => acc + candle.close, 0) / period;
    results.push({
      timestamp: data[period - 1].timestamp,
      value: initialSMA
    });

    // Calculate EMA for remaining values
    for (let i = period; i < data.length; i++) {
      const ema = (data[i].close - results[results.length - 1].value) * multiplier + results[results.length - 1].value;
      results.push({
        timestamp: data[i].timestamp,
        value: ema
      });
    }
  }

  return results;
}

/**
 * Relative Strength Index (RSI)
 */
export function calculateRSI(data: CandleData[], period: number = 14): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  if (data.length < period + 1) return results;

  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // Calculate initial averages
  let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;

  for (let i = period; i < data.length; i++) {
    if (i > period) {
      // Smoothed averages
      avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
    }

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    let signal: 'buy' | 'sell' | 'hold' = 'hold';
    if (rsi < 30) signal = 'buy';
    else if (rsi > 70) signal = 'sell';

    results.push({
      timestamp: data[i].timestamp,
      value: rsi,
      signal
    });
  }

  return results;
}

/**
 * Moving Average Convergence Divergence (MACD)
 */
export function calculateMACD(
  data: CandleData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  if (data.length < slowPeriod) return results;

  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  // Calculate MACD line
  const macdLine: IndicatorResult[] = [];
  for (let i = 0; i < slowEMA.length; i++) {
    const fastValue = fastEMA[i + (slowPeriod - fastPeriod)]?.value || 0;
    const slowValue = slowEMA[i].value;

    macdLine.push({
      timestamp: slowEMA[i].timestamp,
      value: fastValue - slowValue
    });
  }

  // Calculate signal line (EMA of MACD)
  const signalLine = calculateEMA(
    macdLine.map(m => ({ timestamp: m.timestamp, open: m.value, high: m.value, low: m.value, close: m.value, volume: 0 })),
    signalPeriod
  );

  // Calculate histogram and generate signals
  for (let i = 0; i < signalLine.length; i++) {
    const macdValue = macdLine[i + (signalPeriod - 1)].value;
    const signalValue = signalLine[i].value;
    const histogram = macdValue - signalValue;

    let signal: 'buy' | 'sell' | 'hold' = 'hold';
    if (macdValue > signalValue && histogram > 0) signal = 'buy';
    else if (macdValue < signalValue && histogram < 0) signal = 'sell';

    results.push({
      timestamp: signalLine[i].timestamp,
      value: histogram,
      signal
    });
  }

  return results;
}

/**
 * Bollinger Bands
 */
export function calculateBollingerBands(
  data: CandleData[],
  period: number = 20,
  standardDeviations: number = 2
): Array<IndicatorResult & { upper: number; middle: number; lower: number }> {
  const results: Array<IndicatorResult & { upper: number; middle: number; lower: number }> = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const closes = slice.map(candle => candle.close);

    // Calculate SMA (middle band)
    const sma = closes.reduce((sum, close) => sum + close, 0) / period;

    // Calculate standard deviation
    const variance = closes.reduce((sum, close) => sum + Math.pow(close - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    // Calculate bands
    const upper = sma + (standardDeviations * stdDev);
    const lower = sma - (standardDeviations * stdDev);

    // Generate signal based on price position relative to bands
    const currentPrice = data[i].close;
    let signal: 'buy' | 'sell' | 'hold' = 'hold';
    if (currentPrice <= lower) signal = 'buy';
    else if (currentPrice >= upper) signal = 'sell';

    results.push({
      timestamp: data[i].timestamp,
      value: currentPrice,
      upper,
      middle: sma,
      lower,
      signal
    });
  }

  return results;
}

/**
 * Stochastic Oscillator
 */
export function calculateStochastic(
  data: CandleData[],
  kPeriod: number = 14,
  dPeriod: number = 3
): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  for (let i = kPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - kPeriod + 1, i + 1);

    const highest = Math.max(...slice.map(candle => candle.high));
    const lowest = Math.min(...slice.map(candle => candle.low));
    const currentClose = data[i].close;

    const k = ((currentClose - lowest) / (highest - lowest)) * 100;

    results.push({
      timestamp: data[i].timestamp,
      value: k
    });
  }

  // Calculate D line (SMA of K)
  if (results.length >= dPeriod) {
    for (let i = dPeriod - 1; i < results.length; i++) {
      const kValues = results.slice(i - dPeriod + 1, i + 1).map(r => r.value);
      const d = kValues.reduce((sum, value) => sum + value, 0) / dPeriod;

      // Generate signals
      let signal: 'buy' | 'sell' | 'hold' = 'hold';
      if (results[i].value < 20 && d < 20) signal = 'buy';
      else if (results[i].value > 80 && d > 80) signal = 'sell';

      results[i] = {
        ...results[i],
        value: d,
        signal
      };
    }
  }

  return results;
}

/**
 * Average True Range (ATR)
 */
export function calculateATR(data: CandleData[], period: number = 14): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  if (data.length < period + 1) return results;

  // Calculate True Range for each period
  const trueRanges: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    trueRanges.push(tr);
  }

  // Calculate ATR using Wilder's smoothing
  let atr = trueRanges.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period;

  results.push({
    timestamp: data[period].timestamp,
    value: atr
  });

  for (let i = period; i < trueRanges.length; i++) {
    atr = (atr * (period - 1) + trueRanges[i]) / period;
    results.push({
      timestamp: data[i + 1].timestamp,
      value: atr
    });
  }

  return results;
}

/**
 * Commodity Channel Index (CCI)
 */
export function calculateCCI(data: CandleData[], period: number = 20): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);

    // Calculate Typical Price for each period
    const typicalPrices = slice.map(candle => (candle.high + candle.low + candle.close) / 3);

    // Calculate SMA of Typical Price
    const smaTP = typicalPrices.reduce((sum, tp) => sum + tp, 0) / period;

    // Calculate Mean Deviation
    const meanDeviation = typicalPrices.reduce((sum, tp) => sum + Math.abs(tp - smaTP), 0) / period;

    // Calculate CCI
    const cci = meanDeviation === 0 ? 0 : (typicalPrices[typicalPrices.length - 1] - smaTP) / (0.015 * meanDeviation);

    let signal: 'buy' | 'sell' | 'hold' = 'hold';
    if (cci < -100) signal = 'buy';
    else if (cci > 100) signal = 'sell';

    results.push({
      timestamp: data[i].timestamp,
      value: cci,
      signal
    });
  }

  return results;
}

/**
 * Williams %R
 */
export function calculateWilliamsR(data: CandleData[], period: number = 14): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);

    const highest = Math.max(...slice.map(candle => candle.high));
    const lowest = Math.min(...slice.map(candle => candle.low));
    const currentClose = data[i].close;

    const williamsR = ((highest - currentClose) / (highest - lowest)) * -100;

    let signal: 'buy' | 'sell' | 'hold' = 'hold';
    if (williamsR < -80) signal = 'buy';
    else if (williamsR > -20) signal = 'sell';

    results.push({
      timestamp: data[i].timestamp,
      value: williamsR,
      signal
    });
  }

  return results;
}

/**
 * On-Balance Volume (OBV)
 */
export function calculateOBV(data: CandleData[]): IndicatorResult[] {
  const results: IndicatorResult[] = [];

  if (data.length === 0) return results;

  let obv = 0;
  results.push({
    timestamp: data[0].timestamp,
    value: obv
  });

  for (let i = 1; i < data.length; i++) {
    if (data[i].close > data[i - 1].close) {
      obv += data[i].volume;
    } else if (data[i].close < data[i - 1].close) {
      obv -= data[i].volume;
    }
    // If close prices are equal, OBV remains unchanged

    results.push({
      timestamp: data[i].timestamp,
      value: obv
    });
  }

  return results;
}

/**
 * calculateIndicators: convenience wrapper that runs a set of common indicators
 * and returns a map of results. This helps other modules expect a single export.
 */
export function calculateIndicators(data: CandleData[]) {
  return {
    sma20: calculateSMA(data, 20),
    ema12: calculateEMA(data, 12),
    rsi14: calculateRSI(data, 14),
    macd: calculateMACD(data),
    atr14: calculateATR(data, 14),
    bollinger: calculateBollingerBands(data, 20, 2),
  }
}
