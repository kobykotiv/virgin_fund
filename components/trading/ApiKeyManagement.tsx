import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';

const ApiKeyManagement = () => {
    const { user, getAccessToken } = useAuth();
    const [apiKey, setApiKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isPaper, setIsPaper] = useState(true);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchKeys = async () => {
            if (!user) return;
            setLoading(true);
            const token = await getAccessToken();
            const res = await fetch('/api/api-keys', { headers: { Authorization: `Bearer ${token}` } });
            const json = await res.json();
            if (json?.key) {
                setApiKey(json.key.api_key || '');
                setIsPaper(json.key.is_paper ?? true);
            }
            setLoading(false);
        };
        fetchKeys();
    }, [user, getAccessToken]);

    const handleSave = async () => {
        setLoading(true);
        const token = await getAccessToken();
        const res = await fetch('/api/api-keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ api_key: apiKey, secret_key: secretKey, is_paper: isPaper }),
        });
        const json = await res.json();
        if (json.error) setMessage('Error saving API keys: ' + json.error);
        else setMessage('API keys saved successfully');
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
