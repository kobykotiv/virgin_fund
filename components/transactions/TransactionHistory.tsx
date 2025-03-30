import React from 'react';
import { Transaction } from '../../app/models/Transaction';
import { Asset } from '../../app/models/Asset';

interface TransactionHistoryProps {
  transactions: Transaction[];
  assets: Record<string, Asset>;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  assets
}) => {
  // Sort transactions by timestamp (newest first)
  const sortedTransactions = [...transactions]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      
      {sortedTransactions.length === 0 ? (
        <p className="no-transactions">No transactions recorded</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Asset</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(transaction => {
              const asset = assets[transaction.assetId];
              const total = transaction.quantity * transaction.price;
              
              return (
                <tr key={transaction.id} className={transaction.type === 'buy' ? 'buy' : 'sell'}>
                  <td>{transaction.timestamp.toLocaleDateString()}</td>
                  <td>{asset?.symbol || 'Unknown'}</td>
                  <td className={`type-${transaction.type}`}>
                    {transaction.type.toUpperCase()}
                  </td>
                  <td>{transaction.quantity}</td>
                  <td>${transaction.price.toFixed(2)}</td>
                  <td>${total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
