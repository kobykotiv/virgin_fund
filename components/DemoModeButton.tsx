import React from 'react';

const DemoModeButton = () => {
  const handleDemoModeClick = async () => {
    const response = await fetch('/api/create-guest-user', {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Guest user created:', data.user);
      // Redirect or update UI to reflect guest mode
    } else {
      console.error('Failed to create guest user');
    }
  };

  return (
    <button onClick={handleDemoModeClick} className="bg-blue-500 text-white px-4 py-2 rounded">
      Try Demo Mode
    </button>
  );
};

export default DemoModeButton;
