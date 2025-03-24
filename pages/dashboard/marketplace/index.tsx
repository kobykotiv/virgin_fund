import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  status: string;
  creator: {
    id: string;
    name: string;
    profileImage: string;
  };
  stats: {
    subscribers: number;
    rating: number;
    performance: number;
  };
}

const MarketplacePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/marketplace?category=${category}&sort=${sortBy}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching marketplace products:', error);
        setError('Failed to load marketplace products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Marketplace</h1>
          <p className="text-gray-500">Discover and purchase trading bots and strategies</p>
        </div>
        <Link href="/dashboard/marketplace/my-products">
          <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            My Products
          </a>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                category === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategory('bot')}
              className={`px-3 py-1 text-sm rounded-md ${
                category === 'bot'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bots
            </button>
            <button
              onClick={() => setCategory('strategy')}
              className={`px-3 py-1 text-sm rounded-md ${
                category === 'strategy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Strategies
            </button>
            <button
              onClick={() => setCategory('signal')}
              className={`px-3 py-1 text-sm rounded-md ${
                category === 'signal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Signals
            </button>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sortBy" className="text-sm text-gray-700 mr-2">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="performance">Best Performance</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {loading ? (
        <p className="text-center py-4">Loading marketplace products...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.type === 'bot'
                      ? 'bg-purple-100 text-purple-800'
                      : product.type === 'strategy'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {product.creator.profileImage ? (
                      <img 
                        src={product.creator.profileImage} 
                        alt={product.creator.name} 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="text-gray-500 text-sm">{product.creator.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-gray-500">By</p>
                    <p className="text-sm text-gray-700">{product.creator.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-700">{product.stats.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-gray-700">
                    {product.stats.subscribers} subscribers
                  </div>
                  <div className={`${
                    product.stats.performance >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {product.stats.performance >= 0 ? '+' : ''}
                    {product.stats.performance.toFixed(2)}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  <Link href={`/dashboard/marketplace/${product.id}`}>
                    <a className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      View Details
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MarketplacePage;
