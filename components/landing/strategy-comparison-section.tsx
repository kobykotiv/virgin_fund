import { Check, X } from "lucide-react";

export function StrategyComparisonSection() {
  const strategies = [
    {
      name: "1% DCA Strategy",
      description: "Dollar-Cost Averaging with 1% allocation",
      bestFor: "Long-term investors, retirement accounts",
      complexity: "Low",
      advantages: [
        "Reduces market timing risk",
        "Consistent investment approach",
        "Works in all market conditions",
        "Emotionless execution"
      ],
      disadvantages: [
        "May underperform in strong bull markets",
        "Regular monitoring required for rebalancing"
      ]
    },
    {
      name: "Technical Indicator",
      description: "Using indicators like RSI, MACD, Bollinger Bands",
      bestFor: "Active traders, swing trading",
      complexity: "Medium",
      advantages: [
        "Based on mathematical formulas",
        "Can identify overbought/oversold conditions",
        "Adaptable to different timeframes",
        "Visual confirmation of trends"
      ],
      disadvantages: [
        "Can generate false signals",
        "Lagging indicators in fast-moving markets"
      ]
    },
    {
      name: "Custom Signal-Based",
      description: "Custom algorithmic signals you create",
      bestFor: "Algorithmic traders, quantitative analysts",
      complexity: "High",
      advantages: [
        "Fully customizable to your strategy",
        "Can combine multiple data sources",
        "Potential for unique market edge",
        "Adaptable to changing conditions"
      ],
      disadvantages: [
        "Requires programming knowledge",
        "More complex to backtest properly",
        "Risk of overfitting to historical data"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Choose Your Strategy</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compare different trading approaches to find what works for your investment goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 flex flex-col"
            >
              <div className="py-6 px-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-gray-700/50">
                <h3 className="text-xl font-bold mb-2">{strategy.name}</h3>
                <p className="text-gray-400 text-sm">{strategy.description}</p>
              </div>
              
              <div className="p-6 flex-grow">
                <div className="mb-4">
                  <span className="text-sm text-gray-400">Best for:</span>
                  <p className="font-medium">{strategy.bestFor}</p>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-400">Complexity:</span>
                  <p className="font-medium">{strategy.complexity}</p>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm text-gray-400">Advantages:</span>
                  <ul className="mt-2 space-y-1">
                    {strategy.advantages.map((advantage, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-1 shrink-0" />
                        <span className="text-sm">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">Disadvantages:</span>
                  <ul className="mt-2 space-y-1">
                    {strategy.disadvantages.map((disadvantage, i) => (
                      <li key={i} className="flex items-start">
                        <X className="w-4 h-4 text-red-500 mr-2 mt-1 shrink-0" />
                        <span className="text-sm">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="p-6 bg-gray-800/80 border-t border-gray-700/50">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all">
                  Try This Strategy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
