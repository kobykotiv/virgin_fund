import React from 'react';
import { GridCalculator } from './calculators/GridCalculator';
import { MomentumCalculator } from './calculators/MomentumCalculator';
import { RSICalculator } from './calculators/RSICalculator';
import { OverboughtOversoldCalculator } from './calculators/OverboughtOversoldCalculator';
import { MeanReversionCalculator } from './calculators/MeanReversionCalculator';
import { TrendFollowingCalculator } from './calculators/TrendFollowingCalculator';
import { ArbitrageCalculator } from './calculators/ArbitrageCalculator';

interface Props {
  strategy: string;
}

/**
 * Renders the calculator and visualization for the selected strategy.
 */
export const StrategyPanel: React.FC<Props> = ({ strategy }) => {
  switch (strategy) {
    case '1% Grid':
      return <GridCalculator />;
    case 'Momentum':
      return <MomentumCalculator />;
    case 'RSI':
      return <RSICalculator />;
    case 'Overbought/Oversold':
      return <OverboughtOversoldCalculator />;
    case 'Mean Reversion':
      return <MeanReversionCalculator />;
    case 'Trend Following':
      return <TrendFollowingCalculator />;
    case 'Arbitrage':
      return <ArbitrageCalculator />;
    default:
      return <div>Select a strategy.</div>;
  }
};
