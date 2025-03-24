import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    strategies: 0,
    bots: 0,
    activeBots: 0,
    portfolioValue: 0,
    apiKeys: 0,
    feedback: 0,
    currencies: []
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Mock data for the recent activity - in a real app, this would come from the API
  const recentActivity = [
    { type: 'bot_activated', name: 'MACD Crossover Bot', time: '2 hours ago' },
    { type: 'strategy_created', name: 'RSI Divergence Strategy', time: 'Yesterday' },
    { type: 'portfolio_updated', name: 'Added BTC holdings', time: '3 days ago' },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Strategies</h3>
          <p className="text-3xl font-bold">{stats.strategies}</p>
          <div className="mt-2">
            <Link href="/dashboard/strategies">
              <a className="text-sm text-blue-600 hover:text-blue-800">View all strategies →</a>
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Bots</h3>
          <p className="text-3xl font-bold">{stats.bots}</p>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Active: {stats.activeBots}</span>
            <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
          </div>
          <div className="mt-1">
            <Link href="/dashboard/bots">
              <a className="text-sm text-blue-600 hover:text-blue-800">Manage bots →</a>
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Portfolio Value</h3>
          <p className="text-3xl font-bold">${stats.portfolioValue.toLocaleString()}</p>
          <div className="mt-2">
            <Link href="/dashboard/portfolio">
              <a className="text-sm text-blue-600 hover:text-blue-800">View portfolio →</a>
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">API Keys</h3>
          <p className="text-3xl font-bold">{stats.apiKeys}</p>
          <div className="mt-2">
            <Link href="/dashboard/api-keys">
              <a className="text-sm text-blue-600 hover:text-blue-800">Manage API keys →</a>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-center">
                    <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'bot_activated' 
                        ? 'bg-green-100 text-green-800'
                        : activity.type === 'strategy_created'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {activity.type === 'bot_activated' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {activity.type === 'strategy_created' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {activity.type === 'portfolio_updated' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      )}
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Portfolio Overview</h3>
          {stats.currencies && stats.currencies.length > 0 ? (
            <div className="space-y-4">
              {stats.currencies.map((currency, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                      {currency.code.substring(0, 2)}
                    </div>
                    <span className="ml-3 text-sm font-medium">{currency.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{currency.amount.toLocaleString()} {currency.code}</p>
                    <p className="text-xs text-gray-500">${currency.usdValue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/portfolio">
                <a className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-800">
                  View full portfolio
                </a>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No portfolio data available</p>
              <Link href="/dashboard/portfolio">
                <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Create Portfolio
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/strategies/new">
            <a className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="text-md font-medium mb-2">Create Strategy</h4>
              <p className="text-sm text-gray-500">Define a new trading strategy with custom indicators</p>
            </a>
          </Link>
          <Link href="/dashboard/bots/new">
            <a className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="text-md font-medium mb-2">Deploy Bot</h4>
              <p className="text-sm text-gray-500">Create a new trading bot using existing strategies</p>
            </a>
          </Link>
          <Link href="/dashboard/api-keys">
            <a className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="text-md font-medium mb-2">Connect Exchange</h4>
              <p className="text-sm text-gray-500">Add API keys to connect to trading exchanges</p>
            </a>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
