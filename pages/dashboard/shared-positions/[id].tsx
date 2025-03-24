import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
}

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
  comments: Comment[];
}

const SharedPositionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [position, setPosition] = useState<SharedPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSharedPosition = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shared-positions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shared position');
        }
        const data = await response.json();
        setPosition(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPosition();
  }, [id]);

  const handleLike = async () => {
    if (!position) return;
    
    try {
      const response = await fetch(`/api/shared-positions/${id}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setPosition({
          ...position,
          likes: position.likes + 1
        });
      }
    } catch (error) {
      console.error('Error liking position:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !position) return;
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/shared-positions/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentText }),
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setPosition({
          ...position,
          comments: [...position.comments, newComment]
        });
        setCommentText('');
      } else {
        throw new Error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading shared position...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!position) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <p className="text-red-500">Shared position not found</p>
          <Link href="/dashboard/social-feed">
            <a className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Back to Social Feed
            </a>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/dashboard/social-feed">
          <a className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Social Feed
          </a>
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 mb-6 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              {position.user.profileImage ? (
                <img 
                  src={position.user.profileImage} 
                  alt={position.user.name} 
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="text-gray-500 text-lg">{position.user.name.charAt(0)}</div>
              )}
            </div>
            <div className="ml-4">
              <p className="text-md font-medium text-gray-900">{position.user.name}</p>
              <p className="text-sm text-gray-500">
                from portfolio: <Link href={`/dashboard/portfolios/${position.portfolio.id}`}>
                  <a className="hover:underline">{position.portfolio.name}</a>
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                Shared on {new Date(position.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-900">{position.symbol}</h2>
              <span className={`ml-3 px-3 py-1 text-sm font-semibold rounded-full ${
                position.direction === 'LONG' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {position.direction}
              </span>
            </div>
            
            <p className="mb-3 text-md text-gray-800">Entry Price: ${position.entryPrice.toFixed(2)}</p>
            
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Trading Thesis:</h3>
              <p className="text-gray-700">{position.reasoning}</p>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={handleLike}
                className="flex items-center text-gray-500 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="font-medium">{position.likes}</span>
                <span className="ml-1 text-gray-500">likes</span>
              </button>
              
              <div className="ml-4 flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{position.comments.length}</span>
                <span className="ml-1 text-gray-500">comments</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Comments</h3>
            
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow border border-gray-300 rounded-l-md shadow-sm p-2"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
            
            {position.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="space-y-4">
                {position.comments.map((comment) => (
                  <div key={comment.id} className="flex pb-4 border-b border-gray-200">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      {comment.user.profileImage ? (
                        <img 
                          src={comment.user.profileImage} 
                          alt={comment.user.name} 
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="text-gray-500 text-sm">{comment.user.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SharedPositionDetailPage;
