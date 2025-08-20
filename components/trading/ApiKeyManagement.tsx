import React, { useEffect, useState } from 'react';
import { encrypt, decrypt } from '@/lib/crypto';

const ApiKeyManagement = () => {
    const [apiKey, setApiKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isPaper, setIsPaper] = useState(true);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // On mount, try to load encrypted keys from localStorage
        const fetchKeys = async () => {
            setLoading(true);
            try {
                // Fetch data from the API
                const response = await fetch('/api/keys'); // Replace with your actual API endpoint
                const data = await response.json();
                
                // Assuming the API returns an object with apiKey, secretKey, and isPaper
                if (data.apiKey && data.secretKey) {
                    setApiKey(data.apiKey);
                    setSecretKey(data.secretKey);
                    setIsPaper(data.isPaper);
                }
            } catch (e) {
                setMessage('Failed to load API keys');
            }
            setLoading(false);
        };
        fetchKeys();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const encApiKey = await encrypt(apiKey);
            const encSecretKey = await encrypt(secretKey);
            localStorage.setItem('alpaca_api_key_enc', encApiKey);
            localStorage.setItem('alpaca_secret_key_enc', encSecretKey);
            localStorage.setItem('alpaca_is_paper', isPaper ? 'true' : 'false');
            setMessage('API keys saved securely in your browser');
        } catch (e) {
            setMessage('Error encrypting or saving API keys');
        }
        setLoading(false);
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Alpaca API Keys</h2>
            <label className="block text-sm mb-1">API Key</label>
            <input
                className="border p-2 w-full mb-2"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
            />
            <label className="block text-sm mb-1">Secret Key</label>
            <input
                className="border p-2 w-full mb-2"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
            />
            <label className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    checked={isPaper}
                    onChange={(e) => setIsPaper(e.target.checked)}
                />
                <span className="text-sm">Use Paper Trading</span>
            </label>
            <div className="flex gap-2">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save keys'}
                </button>
            </div>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};

export default ApiKeyManagement;
