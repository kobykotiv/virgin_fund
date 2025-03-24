import React, { useState } from 'react';

interface OrderFormProps {
  onOrderCreated?: () => void;
}

const TradingOrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [timeInForce, setTimeInForce] = useState('day');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        symbol: symbol.toUpperCase(),
        qty: parseFloat(quantity),
        side,
        type: orderType,
        time_in_force: timeInForce,
        ...(orderType === 'limit' && { limit_price: parseFloat(limitPrice) }),
        ...(orderType === 'stop' && { stop_price: parseFloat(stopPrice) }),
        ...(orderType === 'stop_limit' && { 
          limit_price: parseFloat(limitPrice),
          stop_price: parseFloat(stopPrice)
        }),
      };

      const response = await fetch('/api/alpaca/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const data = await response.json();
      setSuccessMessage(`Order placed successfully! Order ID: ${data.id}`);
      
      // Reset form
      setSymbol('');
      setQuantity('');
      setSide('buy');
      setOrderType('market');
      setTimeInForce('day');
      setLimitPrice('');
      setStopPrice('');
      
      // Notify parent component
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Place Order</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
              Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="0.01"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="side" className="block text-sm font-medium text-gray-700">
              Side
            </label>
            <select
              id="side"
              value={side}
              onChange={(e) => setSide(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div>
            <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">
              Order Type
            </label>
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
              <option value="stop_limit">Stop Limit</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeInForce" className="block text-sm font-medium text-gray-700">
              Time in Force
            </label>
            <select
              id="timeInForce"
              value={timeInForce}
              onChange={(e) => setTimeInForce(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="day">Day</option>
              <option value="gtc">Good Till Cancelled</option>
              <option value="ioc">Immediate or Cancel</option>
              <option value="opg">Market on Open</option>
            </select>
          </div>
          
          {(orderType === 'limit' || orderType === 'stop_limit') && (
            <div>
              <label htmlFor="limitPrice" className="block text-sm font-medium text-gray-700">
                Limit Price
              </label>
              <input
                type="number"
                id="limitPrice"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="150.00"
                min="0.01"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          
          {(orderType === 'stop' || orderType === 'stop_limit') && (
            <div>
              <label htmlFor="stopPrice" className="block text-sm font-medium text-gray-700">
                Stop Price
              </label>
              <input
                type="number"
                id="stopPrice"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="145.00"
                min="0.01"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Placing Order...' : `Place ${side.toUpperCase()} Order`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradingOrderForm;
