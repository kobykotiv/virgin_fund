import React, { useEffect, useState } from 'react';
import FeedbackForm from '../components/FeedbackForm';

const FeedbackPage = ({ userId }: { userId: string }) => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    async function fetchFeedback() {
      const response = await fetch(`/api/feedback?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      }
    }

    fetchFeedback();
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Feedback</h1>
      <FeedbackForm userId={userId} />
      <h2 className="text-xl font-semibold mt-8">Your Feedback</h2>
      <ul className="mt-4 space-y-2">
        {feedback.map((item) => (
          <li key={item.id} className="border p-4 rounded">
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackPage;
