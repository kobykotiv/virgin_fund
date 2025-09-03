import { useState } from 'react';

export function useCompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(1);
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

  function calculate() {
    const data = [];
    let total = principal;
    for (let i = 1; i <= years; i++) {
      total = total * (1 + rate / 100);
      data.push({ x: i, y: parseFloat(total.toFixed(2)) });
    }
    setChartData(data);
  }

  return {
    principal,
    setPrincipal,
    rate,
    setRate,
    years,
    setYears,
    chartData,
    calculate,
  };
}
