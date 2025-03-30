'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [alpacaApiKey, setAlpacaApiKey] = useState('')
  const [alpacaSecretKey, setAlpacaSecretKey] = useState('')
  const [hasAlpacaKeys, setHasAlpacaKeys] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const res = await fetch('/api/user/profile')
        
        if (res.ok) {
          const data = await res.json()
          setName(data.name || '')
          setEmail(data.email || '')
          setHasAlpacaKeys(!!data.hasAlpacaKeys)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        setMessage({ type: 'error', text: 'Failed to load your profile' })
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      loadUserProfile()
    }
  }, [user])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          alpacaApiKey: alpacaApiKey || undefined,
          alpacaSecretKey: alpacaSecretKey || undefined
        })
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' })
        // Clear sensitive fields
        setAlpacaApiKey('')
        setAlpacaSecretKey('')
        setHasAlpacaKeys(true)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={saveProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mt-8 mb-4">
            <h2 className="text-lg font-semibold mb-4">Alpaca API Integration</h2>
            <p className="text-sm text-gray-600 mb-4">
              Connect to Alpaca to automatically sync your trades and positions. 
              Your API keys are encrypted and stored securely.
            </p>
            
            {hasAlpacaKeys && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4">
                You have already set up Alpaca API keys. Enter new values only if you want to update them.
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alpacaApiKey">
                Alpaca API Key
              </label>
              <input
                id="alpacaApiKey"
                type="password"
                value={alpacaApiKey}
                onChange={(e) => setAlpacaApiKey(e.target.value)}
                placeholder={hasAlpacaKeys ? "••••••••" : "Enter your Alpaca API key"}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alpacaSecretKey">
                Alpaca Secret Key
              </label>
              <input
                id="alpacaSecretKey"
                type="password"
                value={alpacaSecretKey}
                onChange={(e) => setAlpacaSecretKey(e.target.value)}
                placeholder={hasAlpacaKeys ? "••••••••" : "Enter your Alpaca Secret key"}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            
            {hasAlpacaKeys && (
              <button
                type="button"
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                onClick={() => window.location.href = '/sync-alpaca'}
              >
                Sync with Alpaca
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

