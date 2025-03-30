import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Portfolio {
  _id: string;
  name: string;
}

interface TradeFormProps {
  tradeId?: string;
  initialData?: {
    portfolioId: string;
    ticker: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    date: string;
  };
}

const TradeForm: React.FC<TradeFormProps> = ({ tradeId, initialData }) => {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [portfolioId, setPortfolioId] = useState(initialData?.portfolioId || '');
  const [ticker, setTicker] = useState(initialData?.ticker || '');
  const [type, setType] = useState<'BUY' | 'SELL'>(initialData?.type || 'BUY');
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [date, setDate] = useState(initialData?.date ? initialData.date.substring(0, 10) : new Date().toISOString().substring(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolios');
        const data = await response.json();
        setPortfolios(data);
        
        if (!portfolioId && data.length > 0) {
          setPortfolioId(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolios();
  }, [portfolioId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = tradeId 
        ? `/api/trades/${tradeId}` 
        : '/api/trades';
      
      const method = tradeId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          portfolioId, 
          ticker, 
          type,
          quantity: Number(quantity), 
          price: Number(price),
          date: new Date(date).toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save trade');
      }

      // Also create a transaction record
      if (!tradeId) {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portfolioId, 
            ticker, 
            type,
            quantity: Number(quantity), 
            price: Number(price),
            date: new Date(date).toISOString()
          }),
        });
      }

      router.push('/trades');
    } catch (err) {
      setError('An error occurred while saving the trade');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">
        {tradeId ? 'Edit Trade' : 'Record New Trade'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="portfolioId">
            Portfolio
          </label>
          <select
            id="portfolioId"
            value={portfolioId}
            onChange={(e) => setPortfolioId(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a portfolio</option>
            {portfolios.map((portfolio) => (
              <option key={portfolio._id} value={portfolio._id}>
                {portfolio.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticker">
            Ticker Symbol
          </label>
          <input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Trade Type
          </label>
          <div className="flex">
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                className="form-radio"
                value="BUY"
                checked={type === 'BUY'}
                onChange={() => setType('BUY')}
              />
              <span className="ml-2 text-green-600 font-medium">Buy</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                value="SELL"
                checked={type === 'SELL'}
                onChange={() => setType('SELL')}
              />
              <span className="ml-2 text-red-600 font-medium">Sell</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            step="0.000001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price per Share ($)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Trade Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Trade'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
