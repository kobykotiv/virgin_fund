import React from 'react';

interface Portfolio {
  currency: string;
  amount: number;
}

const PortfolioDisplay = ({ portfolios }: { portfolios: Portfolio[] }) => {
  return (
    <div>
      <h3>Portfolio</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Currency</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {portfolios.map((portfolio, index) => (
            <tr key={index}>
              <td>{portfolio.currency}</td>
              <td>{portfolio.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioDisplay;
