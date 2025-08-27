import React from 'react';
import { findStrategiesForTicker } from '../lib/mockBots';

type StrategyLite = { key: string; name: string; description?: string };

type Props = {
  ticker: string;
  price?: number | string; // allow string for flexibility from APIs
  changePct?: number | string; // allow string values from APIs
  strategiesOverride?: StrategyLite[]; // injectable list for tests or live data
};

export default function StockAggregator({
  ticker,
  price = 123.45,
  changePct = 0.0,
  strategiesOverride,
}: Props) {
  const rawPrice = Number(price);
  const rawChange = Number(changePct);
  const displayPrice = Number.isFinite(rawPrice) ? rawPrice : 0;
  const displayChange = Number.isFinite(rawChange) ? rawChange : 0;
  const strategies = strategiesOverride ?? findStrategiesForTicker(ticker);

  return (
    <div className="p-4 border rounded bg-white shadow-sm" role="region" aria-label={`stock-aggregator-${ticker}`}>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-sm text-gray-500" data-testid="ticker">{ticker}</div>
          <div className="text-2xl font-semibold" data-testid="price">${displayPrice.toFixed(2)}</div>
        </div>
        <div
          className={`text-sm ${displayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
            data-testid="changePct"
            aria-live="polite"
        >
          {displayChange >= 0 ? '+' : ''}{displayChange.toFixed(2)}%
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-600">Strategies that commonly trade this ticker</div>
        <ul className="mt-2 space-y-2" data-testid="strategies-list">
          {strategies.length === 0 && <li className="text-xs text-gray-400">No strategy samples for this ticker.</li>}
          {strategies.map((s) => (
            <li key={s.key} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded mr-2 mt-1" />
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-gray-500">{s.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-xs text-gray-600">Overlay: shows strategy signals and sample bots waiting for adoption in the marketplace.</div>
    </div>
  );
}
