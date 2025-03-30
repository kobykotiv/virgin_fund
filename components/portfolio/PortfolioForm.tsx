import React, { useState } from 'react';
import { Portfolio } from '../../app/models/Portfolio';

interface PortfolioFormProps {
  portfolio?: Portfolio;
  userId: string;
  onSubmit: (portfolioData: {
    name: string;
    type: 'standard' | 'margin';
    risk: 'conservative' | 'moderate' | 'aggressive';
  }) => void;
  onCancel: () => void;
}

export const PortfolioForm: React.FC<PortfolioFormProps> = ({
  portfolio,
  userId,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(portfolio?.name || '');
  const [type, setType] = useState<'standard' | 'margin'>(portfolio?.type || 'standard');
  const [risk, setRisk] = useState<'conservative' | 'moderate' | 'aggressive'>(
    portfolio?.risk || 'moderate'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Portfolio name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name,
        type,
        risk
      });
    }
  };

  return (
    <div className="portfolio-form-container">
      <h2>{portfolio ? 'Edit Portfolio' : 'Create New Portfolio'}</h2>
      
      <form onSubmit={handleSubmit} className="portfolio-form">
        <div className="form-group">
          <label htmlFor="name">Portfolio Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Portfolio Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'standard' | 'margin')}
          >
            <option value="standard">Standard</option>
            <option value="margin">Margin</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="risk">Risk Level</label>
          <select
            id="risk"
            value={risk}
            onChange={(e) => setRisk(e.target.value as 'conservative' | 'moderate' | 'aggressive')}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {portfolio ? 'Update Portfolio' : 'Create Portfolio'}
          </button>
        </div>
      </form>
    </div>
  );
};
