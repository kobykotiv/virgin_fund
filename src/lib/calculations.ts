export function calculateMetrics(transactions: Transaction[], currentPrices: Record<string, number>) {
  const totalInvestment = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  const currentValue = transactions.reduce((sum, t) => {
    const currentPrice = currentPrices[t.symbol] || 0;
    return sum + (t.shares * currentPrice);
  }, 0);

  const roi = ((currentValue - totalInvestment) / totalInvestment) * 100;

  // Calculate daily returns for volatility
  const dailyReturns: number[] = [];
  let prevValue = totalInvestment;

  transactions.forEach(t => {
    const value = t.shares * currentPrices[t.symbol];
    const dailyReturn = (value - prevValue) / prevValue;
    dailyReturns.push(dailyReturn);
    prevValue = value;
  });

  // Calculate volatility (standard deviation of returns)
  const avgReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized

  // Calculate maximum drawdown
  let peak = -Infinity;
  let maxDrawdown = 0;

  transactions.forEach(t => {
    const value = t.shares * currentPrices[t.symbol];
    peak = Math.max(peak, value);
    const drawdown = (peak - value) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  return {
    totalInvestment,
    currentValue,
    roi,
    volatility,
    maxDrawdown,
  };
}