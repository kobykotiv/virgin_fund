"use client";

import { useState } from 'react';

function CompoundInterest() {
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);

  const future = () => {
    const r = rate / 100;
    let fv = principal;
    for (let i = 0; i < years * 12; i++) {
      fv = fv * (1 + r / 12) + monthly;
    }
    return fv;
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Compound Interest</h3>
      <div className="mt-2 grid gap-2">
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <div className="text-indigo-400 text-lg font-bold mt-2">${future().toFixed(2)}</div>
      </div>
    </div>
  );
}

function InflationCalculator() {
  const [amount, setAmount] = useState(1000);
  const [inflation, setInflation] = useState(2);
  const [years, setYears] = useState(10);
  const future = () => amount * Math.pow(1 + inflation / 100, years);
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Inflation Calculator</h3>
      <div className="mt-2 grid gap-2">
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="bg-gray-700 p-2 rounded" />
        <div className="text-indigo-400 text-lg font-bold mt-2">${future().toFixed(2)}</div>
      </div>
    </div>
  );
}

export default function FinancialCalculators() {
  const [active, setActive] = useState<'compound' | 'inflation'>('compound');

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Financial Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <nav className="md:col-span-1 bg-gray-900 p-3 rounded">
          <button className={`w-full text-left py-2 px-3 rounded ${active === 'compound' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`} onClick={() => setActive('compound')}>
            Compound Interest
          </button>
          <button className={`w-full text-left py-2 px-3 rounded mt-2 ${active === 'inflation' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`} onClick={() => setActive('inflation')}>
            Inflation Calculator
          </button>
        </nav>
        <main className="md:col-span-3">{active === 'compound' ? <CompoundInterest /> : <InflationCalculator />}</main>
      </div>
    </div>
  );
}
