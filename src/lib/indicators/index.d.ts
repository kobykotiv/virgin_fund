import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
} from "./calculations";
export type Indicator = {
  name: "sma" | "ema" | "rsi";
  periods: number;
};
export declare const INDICATORS: {
  SMA: {
    name: string;
    calculate: typeof calculateSMA;
    defaultParams: {
      period: number;
    };
    description: string;
  };
  EMA: {
    name: string;
    calculate: typeof calculateEMA;
    defaultParams: {
      period: number;
    };
    description: string;
  };
  RSI: {
    name: string;
    calculate: typeof calculateRSI;
    defaultParams: {
      period: number;
      overbought: number;
      oversold: number;
    };
    description: string;
  };
  MACD: {
    name: string;
    calculate: typeof calculateMACD;
    defaultParams: {
      fastPeriod: number;
      slowPeriod: number;
      signalPeriod: number;
    };
    description: string;
  };
  BB: {
    name: string;
    calculate: typeof calculateBollingerBands;
    defaultParams: {
      period: number;
      standardDeviations: number;
    };
    description: string;
  };
};
//# sourceMappingURL=index.d.ts.map
