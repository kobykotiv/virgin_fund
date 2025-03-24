import React, { useEffect, useState } from 'react';
import PortfolioDisplay from '../components/PortfolioDisplay';

const DemoPage = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    async function fetchGuestPortfolio() {
      const response = await fetch('/api/get-guest-portfolio'); // Replace with actual API endpoint
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data.portfolios);
      }
    }

    fetchGuestPortfolio();
  }, []);

  return (
    <div>
      <h1>Demo Mode</h1>
      <PortfolioDisplay portfolios={portfolios} />
    </div>
  );
};

export default DemoPage;
