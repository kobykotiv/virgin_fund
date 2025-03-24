import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface SharedPosition {
  id: string;
  symbol: string;
  entryPrice: number;
  direction: string;
  reasoning: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
  portfolio: {
    id: string;
    name: string;
  };
  _count: {
    comments: number;
  };
}

const SocialFeedPage = () => {
  const [sharedPositions, setSharedPositions] = useState<SharedPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedPositions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shared-positions?filter=${filter}`);
        if (response.ok) {
          const data = await response.json();
          setSharedPositions(data);
        }
      } catch (error) {
        console.error('Error fetching shared positions:', error);
        setError('Failed to load shared positions');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPositions();
  }, [filter]);

  const handleLikePosition = async (id: string) => {
    try {
      const response = await fetch(`/api/shared-positions/${id}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setSharedPositions(
          sharedPositions.map(position => 
            position.id === id ? { ...position, likes: position.likes + 1 } : position
          )
        );
      }
    } catch (error) {
      console.error('Error liking position:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Social Feed</h1>
        <p className="text-gray-500">See what other traders are sharing</p>
        
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`${
                filter === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Positions
            </button>
            <button
              onClick={() => setFilter('following')}
              className={`${
                filter === 'following'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Following
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`${
                filter === 'trending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Trending
            </button>
          </nav>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {loading ? (
        <p className="text-center py-4">Loading shared positions...</p>
      ) : sharedPositions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No shared positions found.</p>
          {filter === 'following' && (
            <Link href="/dashboard/discover">
              <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                Discover users to follow
              </a>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sharedPositions.map((position) => (
            <div key={position.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {position.user.profileImage ? (
                      <img 
                        src={position.user.profileImage} 
                        alt={position.user.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="text-gray-500">{position.user.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{position.user.name}</p>
                    <p className="text-xs text-gray-500">
                      from portfolio: <Link href={`/dashboard/portfolios/${position.portfolio.id}`}>
                        <a className="hover:underline">{position.portfolio.name}</a>
                      </Link>
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    {new Date(position.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{position.symbol}</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    position.direction === 'LONG' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {position.direction}
                  </span>
                </div>
                
                <p className="mb-2 text-sm text-gray-600">Entry Price: ${position.entryPrice.toFixed(2)}</p>
                <p className="mb-4 text-sm text-gray-700">{position.reasoning}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleLikePosition(position.id)}
                      className="flex items-center text-sm text-gray-500 hover:text-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {position.likes}
                    </button>
                    <Link href={`/dashboard/shared-positions/${position.id}`}>
                      <a className="flex items-center text-sm text-gray-500 hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {position._count.comments}
                      </a>
                    </Link>
                  </div>
                  <Link href={`/dashboard/shared-positions/${position.id}`}>
                    <a className="text-sm text-blue-600 hover:text-blue-800">View Details</a>
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

export default SocialFeedPage;
