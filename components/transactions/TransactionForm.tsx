import React, { useState } from 'react';
import { Asset } from '../../app/models/Asset';

interface TransactionFormProps {
  portfolioId: string;
  asset?: Asset;
  assets: Asset[];
  onSubmit: (transaction: {
    portfolioId: string;
    assetId: string;
    type: 'buy' | 'sell';
    symbol?: string; // For new assets
    quantity: number;
    price: number;
  }) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  portfolioId,
  asset,
  assets,
  onSubmit,
  onCancel
}) => {
  const [assetId, setAssetId] = useState(asset?.id || '');
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isNewAsset, setIsNewAsset] = useState(!asset);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (isNewAsset && !symbol.trim()) {
      newErrors.symbol = 'Asset symbol is required';
    }
    
    if (!isNewAsset && !assetId) {
      newErrors.assetId = 'Please select an asset';
    }
    
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        portfolioId,
        assetId: isNewAsset ? 'new' : assetId,
        type,
        symbol: isNewAsset ? symbol : undefined,
        quantity: Number(quantity),
        price: Number(price)
      });
    }
  };

  return (
    <div className="transaction-form-container">
      <h2>Record Transaction</h2>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="transaction-type">Transaction Type</label>
          <select
            id="transaction-type"
            value={type}
            onChange={(e) => setType(e.target.value as 'buy' | 'sell')}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isNewAsset}
              onChange={(e) => setIsNewAsset(e.target.checked)}
            />
            New Asset
          </label>
        </div>
        
        {isNewAsset ? (
          <div className="form-group">
            <label htmlFor="symbol">Asset Symbol</label>
            <input
              id="symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className={errors.symbol ? 'error' : ''}
              placeholder="e.g., AAPL"
            />
            {errors.symbol && <div className="error-message">{errors.symbol}</div>}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="asset">Select Asset</label>
            <select
              id="asset"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className={errors.assetId ? 'error' : ''}
            >
              <option value="">-- Select Asset --</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol} ({asset.quantity} shares)
                </option>
              ))}
            </select>
            {errors.assetId && <div className="error-message">{errors.assetId}</div>}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="0.000001"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <div className="error-message">{errors.quantity}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price Per Unit</label>
          <div className="price-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              id="price"
              type="number"
              min="0.01"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={errors.price ? 'error' : ''}
            />
          </div>
          {errors.price && <div className="error-message">{errors.price}</div>}
        </div>
        
        <div className="total-calculation">
          Total: ${(Number(quantity) * Number(price) || 0).toFixed(2)}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Record Transaction
          </button>
        </div>
      </form>
    </div>
  );
};
