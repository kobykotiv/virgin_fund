import React, { useState, useEffect } from 'react';

interface Asset {
  _id: string;
  portfolioId: string;
  ticker: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

interface AssetListProps {
  portfolioId: string;
}

const AssetList: React.FC<AssetListProps> = ({ portfolioId }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`/api/portfolios/${portfolioId}/assets`);
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) {
      fetchAssets();
    }
  }, [portfolioId]);

  if (loading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Portfolio Assets</h3>
      
      {assets.length === 0 ? (
        <p>No assets in this portfolio yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Ticker</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-right">Quantity</th>
                <th className="py-2 px-4 text-right">Purchase Price</th>
                <th className="py-2 px-4 text-right">Current Price</th>
                <th className="py-2 px-4 text-right">Value</th>
                <th className="py-2 px-4 text-right">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const currentValue = asset.quantity * asset.currentPrice;
                const purchaseValue = asset.quantity * asset.purchasePrice;
                const gainLoss = currentValue - purchaseValue;
                const gainLossPercent = (gainLoss / purchaseValue) * 100;
                
                return (
                  <tr key={asset._id} className="border-t">
                    <td className="py-2 px-4 font-medium">{asset.ticker}</td>
                    <td className="py-2 px-4">{asset.name}</td>
                    <td className="py-2 px-4 text-right">{asset.quantity}</td>
                    <td className="py-2 px-4 text-right">${asset.purchasePrice.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right">${asset.currentPrice.toFixed(2)}</td>
                    <td className="py-2 px-4 text-right">${currentValue.toFixed(2)}</td>
                    <td className={`py-2 px-4 text-right ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetList;
