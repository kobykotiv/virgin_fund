export function SideNavigation() {
  const calculators = [
    {
      category: "Risk Analysis",
      items: [
        { name: "Monte Carlo Simulation", path: "/calculators/monte-carlo" },
        { name: "Value at Risk (VaR)", path: "/calculators/var" },
        { name: "Portfolio Stress Test", path: "/calculators/stress-test" }
      ]
    },
    {
      category: "Trading Strategy",
      items: [
        { name: "Position Sizing", path: "/calculators/position-size" },
        { name: "Risk/Reward", path: "/calculators/risk-reward" },
        { name: "Backtesting", path: "/calculators/backtest" }
      ]
    },
    {
      category: "Portfolio Analysis",
      items: [
        { name: "Asset Allocation", path: "/calculators/portfolio-allocation" },
        { name: "Correlation Matrix", path: "/calculators/correlation" },
        { name: "Performance Metrics", path: "/calculators/performance" }
      ]
    }
  ]

  return (
    <nav className="w-64 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
      {calculators.map((category) => (
        <div key={category.category} className="mb-6">
          <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">
            {category.category}
          </h3>
          <ul className="space-y-1">
            {category.items.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="block px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
