import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import FeedbackForm from '../../components/FeedbackForm';

interface Feedback {
  id: string;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // In a real app, you'd get this from your authentication context
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const user = await response.json();
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/feedback?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFeedback(data);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [userId]);

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedbackId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setFeedback(
          feedback.map((item) =>
            item.id === feedbackId ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Feedback</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Submit New Feedback</h2>
          {userId ? (
            <FeedbackForm userId={userId} />
          ) : (
            <p>Loading user information...</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Your Feedback History</h2>
        {loading ? (
          <p>Loading feedback...</p>
        ) : feedback.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">You haven't submitted any feedback yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-medium">{item.type}</h3>
                    <p className="mt-2 text-gray-700">{item.content}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'reviewed'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'implemented'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPage;
