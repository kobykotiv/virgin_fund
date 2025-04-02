import Image from 'next/image';
import Link from 'next/link';

export function ApiIntegrationSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Seamless Integration with Alpaca.markets</h2>
            <p className="text-gray-300 mb-6">
              Virgin Fund integrates directly with Alpaca's powerful trading API, enabling you to:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full p-1 mr-3 mt-1">✓</span>
                <span>Execute trades instantly with no commission fees</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full p-1 mr-3 mt-1">✓</span>
                <span>Access real-time market data and price feeds</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full p-1 mr-3 mt-1">✓</span>
                <span>Monitor your portfolio performance 24/7</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full p-1 mr-3 mt-1">✓</span>
                <span>Trade U.S. stocks, ETFs, and cryptocurrencies</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full p-1 mr-3 mt-1">✓</span>
                <span>Paper trading for risk-free strategy testing</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link 
                href="https://alpaca.markets" 
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-all inline-flex items-center"
              >
                Learn more about Alpaca
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-gray-700/30 p-8 rounded-xl">
            <div className="text-sm font-mono bg-gray-800 p-4 rounded-lg overflow-auto">
              <pre className="text-green-400">
{`// Sample code for Alpaca API integration
import alpaca from '@alpacahq/alpaca-trade-api';

// Initialize Alpaca client
const alpacaClient = new alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_API_SECRET,
  paper: true // Set to false for live trading
});

// Create a simple DCA strategy
async function runDCAStrategy(symbol, amount) {
  // Get market data
  const marketData = await alpacaClient.getBars({
    symbol: symbol,
    timeframe: '1Day',
    limit: 10
  });
  
  // Execute buy order
  const order = await alpacaClient.createOrder({
    symbol: symbol,
    qty: amount,
    side: 'buy',
    type: 'market',
    time_in_force: 'day'
  });
  
  console.log(\`Order placed: \${order.id}\`);
  return order;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
