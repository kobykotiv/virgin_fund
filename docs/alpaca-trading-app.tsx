  import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, ChevronDown, DollarSign, Calendar, RefreshCw, LineChart } from 'lucide-react';
import TradingViewWidget from '../components/TradingViewWidget';

// Define interfaces for Position and Order
interface Position {
  symbol: string;
  quantity: number;
  value: number;
  avgPrice: number;
}

interface Order {
  id: string;
  symbol: string;
  amount: number;
  status: 'pending' | 'filled' | 'failed'; // Added 'failed' as a possible status
  date: string;
  price: number;
  shares: number | string; // Shares can be string from toFixed
}

const App = () => {
  // Authentication state
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // DCA configuration state
  const [symbol, setSymbol] = useState('AAPL');
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState('weekly');
  const [isActive, setIsActive] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]); // Apply Position type
  const [orders, setOrders] = useState<Order[]>([]); // Apply Order type
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('setup');
  const [symbolList, setSymbolList] = useState([
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'BTC/USD', 'ETH/USD'
  ]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chartTheme, setChartTheme] = useState<'light' | 'dark'>('dark');
  
  // Simulation of authentication with Alpaca
  const authenticate = () => {
    setLoading(true);
    setAuthError('');
    
    // Simulate API authentication delay
    setTimeout(() => {
      if (apiKey.length > 10 && apiSecret.length > 10) {
        setIsAuthenticated(true);
        // Simulate fetching mock positions
        setPositions([
          { symbol: 'AAPL', quantity: 5.23, value: 1045.67, avgPrice: 199.93 },
          { symbol: 'BTC/USD', quantity: 0.05, value: 3250.45, avgPrice: 65009.00 }
        ]);
        // Simulate fetching mock orders
        setOrders([
          { id: '1', symbol: 'AAPL', amount: 100, status: 'filled', date: '2025-04-09', price: 201.34, shares: 0.49 }
        ]);
      } else {
        setAuthError('Invalid API credentials. Keys must be at least 10 characters long.');
      }
      setLoading(false);
    }, 1000);
  };

  // Simulate starting DCA strategy
  const startDCA = () => {
    setIsActive(true);
    // Simulate new order
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: symbol,
      amount: amount,
      status: 'pending' as Order['status'], // Explicitly cast status
      date: new Date().toISOString().split('T')[0],
      price: symbol === 'AAPL' ? 201.34 : (symbol === 'BTC/USD' ? 65432.10 : 2500.00),
      shares: symbol === 'AAPL' ? (amount / 201.34).toFixed(2) : (symbol === 'BTC/USD' ? (amount / 65432.10).toFixed(5) : (amount / 2500).toFixed(3))
    };
    
    setOrders([newOrder, ...orders]);
    
    // Simulate order being filled after a delay
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === newOrder.id ? {...order, status: 'filled' as Order['status']} : order // Explicitly cast status
      ));
      
      // Update positions to reflect the new order
      const existingPosition = positions.find(pos => pos.symbol === symbol);
      if (existingPosition) {
        setPositions(prev => prev.map(pos => 
          pos.symbol === symbol ? 
            { 
              ...pos, 
              quantity: parseFloat(pos.quantity) + parseFloat(newOrder.shares),
              value: parseFloat(pos.value) + parseFloat(amount) 
            } : pos
        ));
      } else {
        setPositions([...positions, {
          symbol: symbol,
          quantity: parseFloat(newOrder.shares),
          value: parseFloat(amount),
          avgPrice: newOrder.price
        }]);
      }
    }, 3000);
  };
  
  // Simulate stopping DCA strategy
  const stopDCA = () => {
    setIsActive(false);
  };
  
  // Sign out function
  const signOut = () => {
    setIsAuthenticated(false);
    setApiKey('');
    setApiSecret('');
    setAuthError('');
    setPositions([]);
    setOrders([]);
    setIsActive(false);
  };

  // Calculate total portfolio value
  const portfolioValue = positions.reduce((sum, pos) => sum + pos.value, 0);

  // Add a new tab for charts
  const renderChartTab = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Market Chart</h2>
          <button 
            onClick={() => setChartTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Toggle Theme
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg" style={{ height: "500px" }}>
          <TradingViewWidget symbol={symbol} theme={chartTheme} />
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Alpaca DCA Trading</h1>
          {isAuthenticated && (
            <button 
              onClick={signOut}
              className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 rounded transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto flex-grow p-4">
        {/* Authentication form */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Connect to Alpaca</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your Alpaca API key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your Alpaca API secret"
                />
              </div>
              
              {authError && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={16} />
                  {authError}
                </div>
              )}
              
              <button
                onClick={authenticate}
                disabled={loading}
                className={`w-full py-2 px-4 rounded font-medium text-white ${
                  loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } transition`}
              >
                {loading ? 'Connecting...' : 'Connect Account'}
              </button>
              
              <div className="text-xs text-gray-500 mt-2">
                Your credentials are never stored on our servers and are only used to communicate with Alpaca.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500">Total Value</h3>
                  <p className="text-2xl font-bold">${portfolioValue.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500">Positions</h3>
                  <p className="text-2xl font-bold">{positions.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-500">DCA Strategy</h3>
                  <p className="text-2xl font-bold flex items-center">
                    {isActive ? (
                      <span className="text-green-600 flex items-center">
                        <Check size={20} className="mr-1" /> Active
                      </span>
                    ) : (
                      <span className="text-gray-600">Inactive</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => setTab('setup')}
                    className={`px-5 py-3 text-sm font-medium ${
                      tab === 'setup'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    DCA Setup
                  </button>
                  <button
                    onClick={() => setTab('chart')}
                    className={`px-5 py-3 text-sm font-medium ${
                      tab === 'chart'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    } flex items-center`}
                  >
                    <LineChart size={16} className="mr-2" /> Chart
                  </button>
                  <button
                    onClick={() => setTab('positions')}
                    className={`px-5 py-3 text-sm font-medium ${
                      tab === 'positions'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Positions
                  </button>
                  <button
                    onClick={() => setTab('orders')}
                    className={`px-5 py-3 text-sm font-medium ${
                      tab === 'orders'
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Orders
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {/* DCA Setup tab */}
                {tab === 'setup' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium">Configure Dollar-Cost Averaging</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asset
                        </label>
                        <div className="relative">
                          <div 
                            className="flex justify-between items-center w-full p-2 border border-gray-300 rounded cursor-pointer"
                            onClick={() => setShowDropdown(!showDropdown)}
                          >
                            <span>{symbol}</span>
                            <ChevronDown size={18} />
                          </div>
                          {showDropdown && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                              {symbolList.map((sym) => (
                                <li 
                                  key={sym}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setSymbol(sym);
                                    setShowDropdown(false);
                                  }}
                                >
                                  {sym}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount per Period
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={18} className="text-gray-500" />
                          </div>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter amount"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={18} className="text-gray-500" />
                          </div>
                          <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full pl-10 p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={18} className="text-gray-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-sm text-gray-600">
                          You will invest <span className="font-semibold">${amount}</span> in <span className="font-semibold">{symbol}</span> {frequency === 'daily' ? 'every day' : 
                             frequency === 'weekly' ? 'every week' : 
                             frequency === 'biweekly' ? 'every two weeks' : 'every month'}.
                        </p>
                      </div>
                      
                      {isActive ? (
                        <button
                          onClick={stopDCA}
                          className="w-full py-2 px-4 rounded font-medium text-white bg-red-600 hover:bg-red-700 transition flex items-center justify-center"
                        >
                          <RefreshCw size={18} className="mr-2" /> Stop DCA Strategy
                        </button>
                      ) : (
                        <button
                          onClick={startDCA}
                          className="w-full py-2 px-4 rounded font-medium text-white bg-green-600 hover:bg-green-700 transition flex items-center justify-center"
                        >
                          <RefreshCw size={18} className="mr-2" /> Start DCA Strategy
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Chart tab */}
                {tab === 'chart' && renderChartTab()}
                
                {/* Positions tab */}
                {tab === 'positions' && (
                  <div>
                    <h2 className="text-lg font-medium mb-4">Your Positions</h2>
                    
                    {positions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {positions.map((position, index) => (
                              <tr key={index} 
                                  className="hover:bg-gray-50 cursor-pointer" 
                                  onClick={() => {
                                    setSymbol(position.symbol);
                                    setTab('chart');
                                  }}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{position.symbol}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {position.symbol.includes('/') 
                                    ? position.quantity.toFixed(5) 
                                    : position.quantity.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">${position.avgPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${position.value.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No positions found</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Orders tab */}
                {tab === 'orders' && (
                  <div>
                    <h2 className="text-lg font-medium mb-4">Order History</h2>
                    
                    {orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                              <tr key={order.id} 
                                  className="hover:bg-gray-50 cursor-pointer"
                                  onClick={() => {
                                    setSymbol(order.symbol);
                                    setTab('chart');
                                  }}>
                                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{order.symbol}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${order.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${order.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.shares}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span 
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      order.status === 'filled' 
                                        ? 'bg-green-100 text-green-800' 
                                        : order.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No orders found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>This is a demo application. Not financial advice. Use at your own risk.</p>
          <p className="mt-1">© 2025 Alpaca DCA Trading App</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
