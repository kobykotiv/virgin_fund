import { useState } from 'react';

export function useInflationCalculator() {
  const [current, setCurrent] = useState(0);
  const [rate, setRate] = useState(0);
  const [years, setYears] = useState(1);
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

  function calculate() {
    const data = [];
    let value = current;
    for (let i = 1; i <= years; i++) {
      value = value * (1 + rate / 100);
      data.push({ x: i, y: parseFloat(value.toFixed(2)) });
    }
    setChartData(data);
  }

  return {
    current,
    setCurrent,
    rate,
    setRate,
    years,
    setYears,
    chartData,
    calculate,
  };
}
