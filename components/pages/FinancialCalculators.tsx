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

function SavingsCalculator() {
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(3); // annual %
  const months = years * 12;
  const r = rate / 100 / 12;
  // future value of annuity due vs ordinary; we treat as end-of-period contributions
  const fv = r === 0 ? monthly * months : monthly * (Math.pow(1 + r, months) - 1) / r;
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="font-semibold">Savings Growth</h3>
      <div className="mt-2 grid gap-2">
        <input type="number" value={monthly} onChange={(e)=>setMonthly(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={years} onChange={(e)=>setYears(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded" />
        <input type="number" value={rate} onChange={(e)=>setRate(Number(e.target.value)||0)} className="bg-gray-700 p-2 rounded" />
        <div className="text-indigo-400 text-lg font-bold mt-2">${fv.toFixed(2)}</div>
      </div>
    </div>
  );
}

type FinTab = 'compound' | 'inflation' | 'savings';
export default function FinancialCalculators() {
  const [active, setActive] = useState<FinTab>('compound');

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Financial Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <nav className="md:col-span-1 bg-gray-900 p-3 rounded space-y-2">
          <NavBtn label="Compound Interest" active={active==='compound'} onClick={()=>setActive('compound')} />
          <NavBtn label="Inflation" active={active==='inflation'} onClick={()=>setActive('inflation')} />
          <NavBtn label="Savings" active={active==='savings'} onClick={()=>setActive('savings')} />
        </nav>
        <main className="md:col-span-3">
          {active === 'compound' && <CompoundInterest />}
          {active === 'inflation' && <InflationCalculator />}
          {active === 'savings' && <SavingsCalculator />}
        </main>
      </div>
    </div>
  );
}

function NavBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button className={`w-full text-left py-2 px-3 rounded transition ${active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={onClick}>{label}</button>;
}
