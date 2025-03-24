import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AlpacaStatusCard from '../../components/trading/AlpacaStatusCard';
import TradingPositions from '../../components/trading/TradingPositions';
import TradingOrderForm from '../../components/trading/TradingOrderForm';

const TradingDashboardPage = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check if user has configured Alpaca API keys
    const checkApiKeys = async () => {
      try {
        const response = await fetch('/api/user/has-alpaca-keys');
        if (response.ok) {
          const data = await response.json();
          setHasApiKey(data.hasKey);
        }
      } catch (error) {
        console.error('Error checking API keys:', error);
      }
    };

    checkApiKeys();
  }, []);

  const handleOrderCreated = () => {
    // Refresh the positions list when an order is created
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Trading Dashboard</h1>

      {!hasApiKey ? (
        <div className="bg-yellow-50 p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Alpaca API Keys Required</h3>
          <p className="text-yellow-700 mb-4">
            You need to add your Alpaca API keys before you can start trading.
          </p>
          <a 
            href="/dashboard/api-keys" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Add API Keys
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AlpacaStatusCard />
            </div>
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a 
                    href="https://app.alpaca.markets/paper" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-gray-50 text-blue-600 rounded hover:bg-gray-100"
                  >
                    Alpaca Paper Trading Dashboard
                  </a>
                  <a 
                    href="https://docs.alpaca.markets/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-gray-50 text-blue-600 rounded hover:bg-gray-100"
                  >
                    Alpaca API Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Current Positions */}
          <div>
            <h2 className="text-xl font-medium mb-4">Current Positions</h2>
            <TradingPositions key={`positions-${refreshKey}`} />
          </div>

          {/* Place Order Form */}
          <div>
            <h2 className="text-xl font-medium mb-4">Place New Order</h2>
            <TradingOrderForm onOrderCreated={handleOrderCreated} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TradingDashboardPage;
