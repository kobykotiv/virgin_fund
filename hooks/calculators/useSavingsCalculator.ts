import { useState } from 'react';

export function useSavingsCalculator() {
  const [initial, setInitial] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(1);
  const [result, setResult] = useState<{ label: string; value: string | number }[]>([]);

  function calculate() {
    let total = initial;
    for (let i = 0; i < years * 12; i++) {
      total = total * (1 + rate / 100 / 12) + monthly;
    }
    setResult([
      { label: 'Total Savings', value: total.toFixed(2) },
      { label: 'Years', value: years },
    ]);
  }

  return {
    initial,
    setInitial,
    monthly,
    setMonthly,
    rate,
    setRate,
    years,
    setYears,
    result,
    calculate,
  };
}
