import { useState } from 'react';

export function useDebtPayoffCalculator() {
  const [debt, setDebt] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(0);
  const [result, setResult] = useState<{ label: string; value: string | number }[]>([]);

  function calculate() {
    let months = 0;
    let balance = debt;
    while (balance > 0 && months < 1000) {
      balance = balance * (1 + rate / 100 / 12) - monthly;
      months++;
    }
    setResult([
      { label: 'Months to Payoff', value: months },
      { label: 'Total Paid', value: (monthly * months).toFixed(2) },
    ]);
  }

  return {
    debt,
    setDebt,
    monthly,
    setMonthly,
    rate,
    setRate,
    result,
    calculate,
  };
}
