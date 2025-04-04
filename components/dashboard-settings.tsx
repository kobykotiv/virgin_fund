"use client"

import { useState, useEffect } from 'react'

/**
 * Dashboard Settings component for configuring API credentials
 * 
 * @component
 * @example
 * ```tsx
 * <DashboardSettings />
 * ```
 * 
 * @description
 * Provides a form interface for users to input their Alpaca API key and secret key.
 * Stores credentials in local storage for persistent access.
 * 
 * @accessibility
 * - Form labels are properly associated with inputs
 * - Error states are communicated visually and via aria
 * - Focus management for better keyboard navigation
 */
export function DashboardSettings() {
  const [apiKey, setApiKey] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')
  const [isSaved, setIsSaved] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Load saved credentials on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('alpaca_api_key')
    const savedSecretKey = localStorage.getItem('alpaca_secret_key')
    
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedSecretKey) setSecretKey(savedSecretKey)
  }, [])

  /**
   * Validates the form inputs before saving
   * @returns {boolean} Whether validation passed
   */
  const validateForm = (): boolean => {
    if (!apiKey.trim()) {
      setIsError(true)
      setErrorMessage('API Key is required')
      return false
    }
    
    if (!secretKey.trim()) {
      setIsError(true)
      setErrorMessage('Secret Key is required')
      return false
    }
    
    // Basic format validation - API keys are typically alphanumeric
    const alphanumericRegex = /^[a-zA-Z0-9]+$/
    if (!alphanumericRegex.test(apiKey) || !alphanumericRegex.test(secretKey)) {
      setIsError(true)
      setErrorMessage('Keys should contain only letters and numbers')
      return false
    }
    
    setIsError(false)
    setErrorMessage('')
    return true
  }

  /**
   * Handles form submission and saves credentials to local storage
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Save to local storage
    localStorage.setItem('alpaca_api_key', apiKey)
    localStorage.setItem('alpaca_secret_key', secretKey)
    
    // Show success message
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  /**
   * Clears saved credentials from local storage and resets form
   */
  const clearCredentials = () => {
    localStorage.removeItem('alpaca_api_key')
    localStorage.removeItem('alpaca_secret_key')
    setApiKey('')
    setSecretKey('')
    setIsSaved(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard Settings</h1>
      
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">Alpaca API Configuration</h2>
        <p className="text-blue-700 dark:text-blue-300 mb-2">
          Connect to Alpaca to view real market data instead of mock data.
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          You can obtain API credentials by signing up at <a href="https://alpaca.markets" className="underline font-medium" target="_blank" rel="noopener noreferrer">alpaca.markets</a>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alpaca API Key
          </label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            placeholder="Enter your Alpaca API key"
          />
        </div>
        
        <div>
          <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alpaca Secret Key
          </label>
          <input
            id="secretKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            placeholder="Enter your Alpaca Secret key"
          />
        </div>
        
        {isError && (
          <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {isSaved && (
          <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md" role="alert">
            <p>API credentials saved successfully!</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Credentials
          </button>
          
          <button
            type="button"
            onClick={clearCredentials}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear Credentials
          </button>
        </div>
      </form>
      
      <div className="mt-10 p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">About API Keys</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your API keys are stored locally in your browser and are never sent to our servers.
          They are used only to fetch market data directly from Alpaca's API.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          For security, we recommend using Paper Trading API keys rather than live trading credentials.
        </p>
      </div>
    </div>
  )
}
