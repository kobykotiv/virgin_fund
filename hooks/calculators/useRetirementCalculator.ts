import { useState } from 'react';

export function useRetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [result, setResult] = useState<{ label: string; value: string | number }[]>([]);

  function calculate() {
    const years = retirementAge - currentAge;
    let total = 0;
    for (let i = 0; i < years * 12; i++) {
      total = total * (1 + 0.05 / 12) + monthlySavings; // Assume 5% annual return
    }
    setResult([
      { label: 'Total at Retirement', value: total.toFixed(2) },
      { label: 'Years Saving', value: years },
    ]);
  }

  return {
    currentAge,
    setCurrentAge,
    retirementAge,
    setRetirementAge,
    monthlySavings,
    setMonthlySavings,
    result,
    calculate,
  };
}
