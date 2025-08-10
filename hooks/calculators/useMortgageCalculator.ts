import { useState } from 'react';

export function useMortgageCalculator() {
  const [loan, setLoan] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(30);
  const [result, setResult] = useState<{ label: string; value: string | number }[]>([]);

  function calculate() {
    const n = years * 12;
    const r = rate / 100 / 12;
    const payment = loan * r / (1 - Math.pow(1 + r, -n));
    setResult([
      { label: 'Monthly Payment', value: payment.toFixed(2) },
      { label: 'Total Payments', value: (payment * n).toFixed(2) },
    ]);
  }

  return {
    loan,
    setLoan,
    rate,
    setRate,
    years,
    setYears,
    result,
    calculate,
  };
}
