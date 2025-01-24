import React, { useState } from 'react';

const BeginningBacktest: React.FC = () => {
    const [ticker, setTicker] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [frequency, setFrequency] = useState('monthly');
    const [investmentAmount, setInvestmentAmount] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Backtest logic here
    };

    return (
        <div>
            <h1>Beginning Backtest</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="Stock Ticker"
                    required
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    placeholder="Investment Amount"
                    required
                />
                <button type="submit">Run Backtest</button>
            </form>
        </div>
    );
};

export default BeginningBacktest;
