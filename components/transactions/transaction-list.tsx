import React, { useState, useEffect } from 'react';

interface Transaction {
  _id: string;
  portfolioId: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
  totalValue: number;
}

interface TransactionListProps {
  portfolioId?: string; // Optional: to filter by portfolio
}

const TransactionList: React.FC<TransactionListProps> = ({ portfolioId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = portfolioId 
          ? `/api/portfolios/${portfolioId}/transactions` 
          : '/api/transactions';
        
        const response = await fetch(url);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [portfolioId]);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Ticker</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-right">Quantity</th>
                <th className="py-2 px-4 text-right">Price</th>
                <th className="py-2 px-4 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t">
                  <td className="py-2 px-4">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 font-medium">{transaction.ticker}</td>
                  <td className={`py-2 px-4 ${
                    transaction.type === 'BUY' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type}
                  </td>
                  <td className="py-2 px-4 text-right">{transaction.quantity}</td>
                  <td className="py-2 px-4 text-right">${transaction.price.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right">${transaction.totalValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
