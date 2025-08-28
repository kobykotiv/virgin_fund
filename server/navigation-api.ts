// Minimal Bun-based API to serve navigation for the DeepSidebar

const NAV = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'grid' },
  { id: 'signals', label: 'Custom Signals', path: '/signals', icon: 'zap' },
  { id: 'backtest', label: 'Backtest', path: '/backtest', icon: 'bar-chart' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio', icon: 'settings' },
  {
    id: 'financial_tools',
    label: 'Financial Tools',
    icon: 'calculator',
    children: [
      {
        id: 'financial_calculators',
        label: 'Financial Calculators',
        children: [
          { id: 'compound', label: 'Compound Interest', path: '/tools/compound-interest', icon: 'calculator' },
          { id: 'savings', label: 'Savings Calculator', path: '/tools/savings', icon: 'calculator' },
          { id: 'retirement', label: 'Retirement Calculator', path: '/tools/retirement', icon: 'calculator' },
          { id: 'inflation', label: 'Inflation Calculator', path: '/tools/inflation', icon: 'calculator' },
        ],
      },
      { id: 'market_analysis', label: 'Market Analysis', path: '/tools/market-analysis', icon: 'bar-chart' },
    ],
  },
  {
    id: 'trading_tools',
    label: 'Trading Tools',
    icon: 'zap',
    children: [
      {
        id: 'trading_calculators',
        label: 'Trading Calculators',
        children: [
          { id: 'risk_reward', label: 'Risk/Reward', path: '/tools/risk-reward', icon: 'calculator' },
          { id: 'position_size', label: 'Position Size', path: '/tools/position-size', icon: 'calculator' },
          { id: 'leverage', label: 'Leverage', path: '/tools/leverage', icon: 'calculator' },
          { id: 'pivot_points', label: 'Pivot Points', path: '/tools/pivot-points', icon: 'calculator' },
        ],
      },
      { id: 'strategy_builder', label: 'Strategy Builder', path: '/tools/strategy-builder', icon: 'settings' },
    ],
  },
];

export default {
  fetch(request: Request) {
    try {
      if (request.method !== 'GET') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify(NAV), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
};
