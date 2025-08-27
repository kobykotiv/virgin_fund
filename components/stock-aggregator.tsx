import React from 'react';
import { strategySamples, findStrategiesForTicker } from '../lib/mockBots';

type Props = {
  ticker: string;
  price?: number;
  changePct?: number;
};

export default function StockAggregator({ ticker, price = 123.45, changePct = 0.0 }: Props) {
  const strategies = findStrategiesForTicker(ticker);

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-sm text-gray-500">{ticker}</div>
          <div className="text-2xl font-semibold">${price.toFixed(2)}</div>
        </div>
        <div className={`text-sm ${changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-600">Strategies that commonly trade this ticker</div>
        <ul className="mt-2 space-y-2">
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
