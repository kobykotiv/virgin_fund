// Dashboard sections config
export const sections = [
  {
    category: 'Trading',
    items: [
      { label: 'Trading & Signals', route: '/trading-signals', icon: 'ChartBar' },
      { label: 'Overview', route: '/overview', icon: 'Dashboard' },
      { label: 'Custom Signals', route: '/custom-signals', icon: 'Sparkles' },
      { label: 'Signal Builder', route: '/signal-builder', icon: 'Settings' },
      { label: 'Backtest', route: '/backtest', icon: 'History' },
      { label: 'Monte Carlo', route: '/monte-carlo', icon: 'Shuffle' },
      { label: 'Virgin Fund : GenEric TraDer AI', route: '/virgin-fund', icon: 'Robot' },
      { label: 'Alpaca Markets Trading Bot Manager', route: '/alpaca-manager', icon: 'Bot' },
    ],
  },
  {
    category: 'Portfolio',
    items: [
      { label: 'Portfolio', route: '/portfolio', icon: 'PieChart' },
    ],
  },
  {
    category: 'Financial Calculators',
    items: [
      { label: 'Hub', route: '/calculators', icon: 'Calculator' },
      { label: 'Savings Calculator', route: '/calculators/savings', icon: 'PiggyBank' },
      { label: 'Compound Interest', route: '/calculators/compound-interest', icon: 'Percent' },
      { label: 'Inflation Calculator', route: '/calculators/inflation', icon: 'TrendingUp' },
      { label: 'Retirement Calculator', route: '/calculators/retirement', icon: 'UserCheck' },
      { label: 'Mortgage', route: '/calculators/mortgage', icon: 'Home' },
      { label: 'Debt Payoff', route: '/calculators/debt-payoff', icon: 'CreditCard' },
      { label: 'Fee Impact', route: '/calculators/fee-impact', icon: 'Receipt' },
    ],
  },
  {
    category: 'Trading Calculators',
    items: [
      { label: 'Risk/Reward', route: '/calculators/risk-reward', icon: 'Scale' },
      { label: 'Position Size', route: '/calculators/position-size', icon: 'Ruler' },
      { label: 'Leverage', route: '/calculators/leverage', icon: 'Zap' },
      { label: 'Pivot Points', route: '/calculators/pivot-points', icon: 'Anchor' },
      { label: 'Spread', route: '/calculators/spread', icon: 'Sliders' },
      { label: 'Options Greeks', route: '/calculators/options-greeks', icon: 'Sigma' },
    ],
  },
];
