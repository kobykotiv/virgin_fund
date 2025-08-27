import React from 'react';
import { listMarketplace, strategySamples } from '../lib/mockBots';

type Props = {
  indexName?: string;
  changePct?: number;
};

export default function MarketPulse({ indexName = 'S&P 500', changePct = 0.4 }: Props) {
  const { items: forSale } = listMarketplace({ page: 1, pageSize: 5 });

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Market</div>
          <div className="text-lg font-semibold">{indexName}</div>
        </div>
        <div className={`text-sm ${changePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="col-span-1">
          <div className="text-xs text-gray-600">Hot strategies (sample)</div>
          <ul className="mt-2 space-y-2">
            {Object.keys(strategySamples).slice(0, 4).map((k) => (
              <li key={k} className="text-sm">{strategySamples[k].name} — <span className="text-xs text-gray-500">{strategySamples[k].tickers.join(', ')}</span></li>
            ))}
          </ul>
        </div>

        <div className="col-span-1">
          <div className="text-xs text-gray-600">Bots for sale</div>
          <ul className="mt-2 space-y-2">
            {forSale.length === 0 && <li className="text-xs text-gray-400">No bots listed right now.</li>}
            {forSale.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{b.name}</div>
                  {b.description && <div className="text-xs text-gray-500">{b.description}</div>}
                </div>
                <div className="text-sm font-semibold">${b.price ?? '—'}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-600">Overlay: market pulse suggests strategies and shows adoptable bots for quick discovery.</div>
    </div>
  );
}
