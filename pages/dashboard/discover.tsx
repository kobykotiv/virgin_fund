import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  profileImage: string;
  bio: string;
  isFollowing: boolean;
  stats: {
    followers: number;
    following: number;
    sharedPositions: number;
    performance: {
      avgReturn: number;
      bestTrade: number;
    };
  };
}

const DiscoverPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/discover?filter=${filter}&search=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter, searchQuery]);

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerId: userId }),
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                isFollowing: !user.isFollowing,
                stats: {
                  ...user.stats,
                  followers: user.isFollowing 
                    ? user.stats.followers - 1 
                    : user.stats.followers + 1
                }
              } 
            : user
        ));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Discover Users</h1>
        <p className="text-gray-500">Find and follow signal providers and traders</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setFilter('popular')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              filter === 'popular'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setFilter('performance')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'performance'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border-t border-b border-gray-300 hover:bg-gray-50'
            }`}
          >
            Best Performance
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Most Active
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      {loading ? (
        <p className="text-center py-4">Loading users...</p>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-500 text-lg">{user.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <div className="flex text-sm text-gray-500 space-x-2">
                      <span>{user.stats.followers} followers</span>
                      <span>•</span>
                      <span>{user.stats.sharedPositions} positions</span>
                    </div>
                  </div>
                </div>
                
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{user.bio || 'No bio available'}</p>
                
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Avg. Return</p>
                      <p className={`text-sm font-medium ${
                        user.stats.performance.avgReturn >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {user.stats.performance.avgReturn >= 0 ? '+' : ''}
                        {user.stats.performance.avgReturn.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Best Trade</p>
                      <p className="text-sm font-medium text-green-600">
                        +{user.stats.performance.bestTrade.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <Link href={`/dashboard/users/${user.id}`}>
                    <a className="text-sm text-blue-600 hover:text-blue-800">View Profile</a>
                  </Link>
                  <button
                    onClick={() => handleFollow(user.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      user.isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DiscoverPage;
