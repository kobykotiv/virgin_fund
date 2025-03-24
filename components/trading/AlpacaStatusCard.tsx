import React, { useEffect, useState } from 'react';

interface AlpacaAccount {
  account_number: string;
  status: string;
  equity: string;
  cash: string;
  buying_power: string;
  portfolio_value: string;
}

const AlpacaStatusCard: React.FC = () => {
  const [account, setAccount] = useState<AlpacaAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/alpaca/account');
        
        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }
        
        const data = await response.json();
        setAccount(data);
      } catch (err) {
        setError(err.message || 'An error occurred fetching account data');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-red-800">Account Error</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <p className="mt-4 text-sm text-gray-700">
          Make sure you have configured your Alpaca API keys in the API Keys section.
        </p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-yellow-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-yellow-800">Account Not Found</h3>
        <p className="mt-2 text-sm text-yellow-700">
          No Alpaca account connected. Please add your API keys in the settings.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Alpaca Trading Account</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${
            account.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
          }`}>
            {account.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Account #</span>
          <span className="font-medium">{account.account_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Portfolio Value</span>
          <span className="font-medium">${parseFloat(account.portfolio_value).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Cash</span>
          <span className="font-medium">${parseFloat(account.cash).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Buying Power</span>
          <span className="font-medium">${parseFloat(account.buying_power).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AlpacaStatusCard;
