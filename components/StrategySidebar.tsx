import React from 'react';

interface Props {
  strategies: string[];
  selected: string;
  onSelect: (strategy: string) => void;
}

/**
 * Sidebar for selecting trading strategies.
 */
export const StrategySidebar: React.FC<Props> = ({ strategies, selected, onSelect }) => (
  <aside style={{ width: 220, background: '#f5f5f5', padding: 16 }}>
    <h3>Strategies</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {strategies.map((s) => (
        <li key={s}>
          <button
            style={{
              width: '100%',
              padding: 8,
              margin: '4px 0',
              background: s === selected ? '#1976d2' : '#fff',
              color: s === selected ? '#fff' : '#333',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
            onClick={() => onSelect(s)}
          >
            {s}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);
