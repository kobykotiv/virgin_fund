"use client";

import { useState } from 'react';

type Signal = { id: string; type: string; params: Record<string, any> };

export default function StrategyBuilder() {
  const [name, setName] = useState('');
  const [timeframe, setTimeframe] = useState('1h');
  const [entrySignals, setEntrySignals] = useState<Signal[]>([]);
  const [exitSignals, setExitSignals] = useState<Signal[]>([]);

  const addEntry = () => setEntrySignals((s) => [...s, { id: Date.now().toString(), type: 'rsi', params: { period: 14, threshold: 30 } }]);
  const addExit = () => setExitSignals((s) => [...s, { id: Date.now().toString(), type: 'take-profit', params: { pct: 2 } }]);

  const exportJson = () => {
    const payload = { name, timeframe, entrySignals, exitSignals };
    const data = JSON.stringify(payload, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'strategy'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Strategy Builder</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gray-800 p-4 rounded">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1" />
          </div>
          <div className="mt-3">
            <label className="text-sm text-gray-300">Timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1">
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="1h">1h</option>
              <option value="1d">1d</option>
            </select>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Entry Signals</h3>
            <div className="space-y-2 mt-2">
              {entrySignals.map((s) => (
                <div key={s.id} className="bg-gray-900 p-3 rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{s.type}</div>
                    <div className="text-sm text-gray-400">{JSON.stringify(s.params)}</div>
                  </div>
                </div>
              ))}
              <button onClick={addEntry} className="mt-2 bg-indigo-600 px-3 py-1 rounded">
                Add Entry Signal
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Exit Signals</h3>
            <div className="space-y-2 mt-2">
              {exitSignals.map((s) => (
                <div key={s.id} className="bg-gray-900 p-3 rounded">
                  <div className="font-medium">{s.type}</div>
                  <div className="text-sm text-gray-400">{JSON.stringify(s.params)}</div>
                </div>
              ))}
              <button onClick={addExit} className="mt-2 bg-indigo-600 px-3 py-1 rounded">
                Add Exit Signal
              </button>
            </div>
          </div>
        </div>

        <aside className="bg-gray-900 p-4 rounded">
          <h3 className="font-semibold">Strategy Summary</h3>
          <div className="mt-3 text-gray-300">
            <div>
              <strong>Name:</strong> {name || '—'}
            </div>
            <div>
              <strong>Timeframe:</strong> {timeframe}
            </div>
            <div className="mt-2">
              <strong>Entries:</strong> {entrySignals.length}
            </div>
            <div>
              <strong>Exits:</strong> {exitSignals.length}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button className="w-full bg-indigo-600 p-2 rounded">Save Strategy</button>
            <button onClick={exportJson} className="w-full bg-gray-700 p-2 rounded">
              Export to JSON
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
