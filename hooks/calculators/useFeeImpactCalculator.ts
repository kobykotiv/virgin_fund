import { useState } from 'react';

export function useFeeImpactCalculator() {
  const [investment, setInvestment] = useState(0);
  const [fee, setFee] = useState(0);
  const [years, setYears] = useState(1);
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

  function calculate() {
    const data = [];
    let value = investment;
    for (let i = 1; i <= years; i++) {
      value = value * (1 - fee / 100);
      data.push({ x: i, y: parseFloat(value.toFixed(2)) });
    }
    setChartData(data);
  }

  return {
    investment,
    setInvestment,
    fee,
    setFee,
    years,
    setYears,
    chartData,
    calculate,
  };
}
