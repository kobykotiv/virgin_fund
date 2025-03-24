import React, { useState } from 'react';

const FeedbackForm = ({ userId }: { userId: string }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content, type }),
    });

    if (response.ok) {
      setMessage('Feedback submitted successfully!');
      setContent('');
      setType('general');
    } else {
      setMessage('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium">Feedback Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="general">General</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature Request</option>
        </select>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium">Feedback</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Feedback
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};

export default FeedbackForm;
