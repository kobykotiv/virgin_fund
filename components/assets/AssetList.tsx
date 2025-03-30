import React from 'react';
import { Asset } from '../../app/models/Asset';

interface AssetListProps {
  assets: Asset[];
  onAddAsset: () => void;
  onRemoveAsset: (assetId: string) => void;
}

export const AssetList: React.FC<AssetListProps> = ({ 
  assets, 
  onAddAsset, 
  onRemoveAsset 
}) => {
  return (
    <div className="asset-list">
      <h3>Portfolio Assets</h3>
      
      <button onClick={onAddAsset} className="add-asset-btn">
        Add Asset
      </button>
      
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Quantity</th>
            <th>Avg Price</th>
            <th>Current Price</th>
            <th>Value</th>
            <th>P&L</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => {
            const currentPrice = asset.currentPrice || asset.averagePrice;
            const value = asset.quantity * currentPrice;
            const pnl = asset.quantity * (currentPrice - asset.averagePrice);
            const pnlPercentage = ((currentPrice - asset.averagePrice) / asset.averagePrice) * 100;
            
            return (
              <tr key={asset.id}>
                <td>{asset.symbol}</td>
                <td>{asset.quantity}</td>
                <td>${asset.averagePrice.toFixed(2)}</td>
                <td>${currentPrice.toFixed(2)}</td>
                <td>${value.toFixed(2)}</td>
                <td className={pnl >= 0 ? 'positive' : 'negative'}>
                  ${pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                </td>
                <td>
                  <button onClick={() => onRemoveAsset(asset.id)} className="remove-btn">
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
