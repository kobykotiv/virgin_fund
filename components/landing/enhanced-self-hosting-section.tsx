"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Database, 
  Lock, 
  Code, 
  BarChart3, 
  Globe, 
  ClipboardEdit,
  LineChart,
  CreditCard,
  BarChart4,
  Wallet,
  Bell,
  UserCog,
  Clock,
  Network,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export function EnhancedSelfHostingSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'white-label' | 'individual' | 'database' | 'technical'>('overview');
  const [activeExample, setActiveExample] = useState<'docker' | 'postgres' | 'realtime' | 'custom'>('docker');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">Complete Control of Your Trading Environment</h3>
              <p className="mb-4 text-gray-300">
                Virgin Fund is designed to be fully self-hosted, giving you complete control over your data, 
                infrastructure, and trading strategies. Our fair code license allows you to deploy the platform 
                on your own servers, customize it to your needs, and scale it according to your requirements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-2 rounded mr-3 mt-1">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Data Privacy</h4>
                    <p className="text-sm text-gray-400">Keep all your trading data and API keys on your own infrastructure</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-900/30 p-2 rounded mr-3 mt-1">
                    <Code className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Full Customization</h4>
                    <p className="text-sm text-gray-400">Modify and extend the platform to meet your specific needs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-900/30 p-2 rounded mr-3 mt-1">
                    <Server className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Scalable Performance</h4>
                    <p className="text-sm text-gray-400">Scale the infrastructure according to your trading volume</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-400" />
                  White-Label Solution
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Offer this powerful trading bot platform under your own brand. Ideal for financial advisors, 
                  trading educators, and fintech startups.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Fully customizable branding and interface</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Create tiered subscription models</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Integrate your educational resources</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <button 
                    onClick={() => setActiveTab('white-label')} 
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    Learn more about white-labeling
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50 flex flex-col h-full">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-400" />
                  Database Integration
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Connect to your preferred database for storing trading data, user information, 
                  and historical market data. Build custom widgets and dashboards.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="bg-green-500/20 text-green-400 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Support for PostgreSQL, MySQL, MongoDB</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-500/20 text-green-400 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Historical data storage and backtesting</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-500/20 text-green-400 p-1 rounded-full mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Create custom dashboard widgets</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <button 
                    onClick={() => setActiveTab('database')} 
                    className="text-sm text-green-400 hover:text-green-300 flex items-center"
                  >
                    Explore database integration options
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-bold mb-4">Quick Deployment Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <button 
                  className={`p-4 rounded-lg text-left transition ${activeExample === 'docker' ? 'bg-blue-900/30 border border-blue-600/30' : 'bg-gray-700/30 hover:bg-gray-700/60 border border-gray-600/30'}`}
                  onClick={() => setActiveExample('docker')}
                >
                  <h4 className="font-medium mb-1 flex items-center">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 5H11V7H13V5Z" fill="currentColor" />
                      <path d="M13 9H11V11H13V9Z" fill="currentColor" />
                      <path d="M9 5H7V7H9V5Z" fill="currentColor" />
                      <path d="M9 9H7V11H9V9Z" fill="currentColor" />
                      <path d="M9 13H7V15H9V13Z" fill="currentColor" />
                      <path d="M17 5H15V7H17V5Z" fill="currentColor" />
                      <path d="M17 9H15V11H17V9Z" fill="currentColor" />
                      <path d="M21 13H3V15H21V13Z" fill="currentColor" />
                      <path d="M21 17H3V19H21V17Z" fill="currentColor" />
                    </svg>
                    Docker Compose
                  </h4>
                  <p className="text-xs text-gray-400">Quick setup with containers</p>
                </button>
                
                <button 
                  className={`p-4 rounded-lg text-left transition ${activeExample === 'postgres' ? 'bg-blue-900/30 border border-blue-600/30' : 'bg-gray-700/30 hover:bg-gray-700/60 border border-gray-600/30'}`}
                  onClick={() => setActiveExample('postgres')}
                >
                  <h4 className="font-medium mb-1 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    PostgreSQL Setup
                  </h4>
                  <p className="text-xs text-gray-400">Database configuration</p>
                </button>
                
                <button 
                  className={`p-4 rounded-lg text-left transition ${activeExample === 'realtime' ? 'bg-blue-900/30 border border-blue-600/30' : 'bg-gray-700/30 hover:bg-gray-700/60 border border-gray-600/30'}`}
                  onClick={() => setActiveExample('realtime')}
                >
                  <h4 className="font-medium mb-1 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Real-time Data
                  </h4>
                  <p className="text-xs text-gray-400">Market data streaming</p>
                </button>
                
                <button 
                  className={`p-4 rounded-lg text-left transition ${activeExample === 'custom' ? 'bg-blue-900/30 border border-blue-600/30' : 'bg-gray-700/30 hover:bg-gray-700/60 border border-gray-600/30'}`}
                  onClick={() => setActiveExample('custom')}
                >
                  <h4 className="font-medium mb-1 flex items-center">
                    <ClipboardEdit className="h-4 w-4 mr-2" />
                    Custom Widget
                  </h4>
                  <p className="text-xs text-gray-400">Create dashboard widgets</p>
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center bg-gray-800 px-4 py-2">
                  <Code className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">
                    {activeExample === 'docker' ? 'docker-compose.yml' : 
                     activeExample === 'postgres' ? 'database-setup.sql' :
                     activeExample === 'realtime' ? 'real-time-stream.ts' :
                     'custom-widget.tsx'}
                  </span>
                </div>
                <pre className="p-4 text-sm font-mono overflow-auto text-gray-300 max-h-80">
                  <code>
                    {activeExample === 'docker' ? 
`version: '3'

services:
  virgin-fund-app:
    image: virginfund/trading-platform:latest
    container_name: virgin-fund-app
    restart: unless-stopped
    ports:
      - "3000:3000"  # Web UI
      - "5000:5000"  # API
    volumes:
      - ./data:/app/data
      - ./config.json:/app/config.json
    environment:
      - NODE_ENV=production
      - POSTGRES_HOST=db
      - POSTGRES_DB=virginfund
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - ALPACA_API_KEY=your_alpaca_key
      - ALPACA_API_SECRET=your_alpaca_secret
    depends_on:
      - db
      
  db:
    image: postgres:14
    container_name: virgin-fund-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_USER=user
      - POSTGRES_DB=virginfund

volumes:
  postgres_data:` : 

activeExample === 'postgres' ? 
`-- Create tables for trading bot data

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  api_key VARCHAR(255),
  api_secret VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trading bots table
CREATE TABLE bots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  strategy_type VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT false,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trading history
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  bot_id INTEGER REFERENCES bots(id),
  symbol VARCHAR(20) NOT NULL,
  order_type VARCHAR(20) NOT NULL,
  side VARCHAR(10) NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  profit_loss NUMERIC
);

-- Create indexes for performance
CREATE INDEX idx_bots_user_id ON bots(user_id);
CREATE INDEX idx_trades_bot_id ON trades(bot_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);` :

activeExample === 'realtime' ? 
`// Real-time market data streaming from Alpaca
import { AlpacaClient } from '@/lib/alpaca';
import { io } from 'socket.io-client';

export class MarketDataStream {
  private alpaca: AlpacaClient;
  private socket: any;
  private subscribers: Map<string, Array<(data: any) => void>> = new Map();
  
  constructor(alpacaClient: AlpacaClient) {
    this.alpaca = alpacaClient;
    this.initializeWebsocket();
  }
  
  private initializeWebsocket() {
    // Connect to your self-hosted websocket server
    this.socket = io('wss://your-server.com/market-data');
    
    this.socket.on('connect', () => {
      console.log('Connected to market data stream');
      
      // Subscribe to market data from Alpaca
      this.alpaca.subscribeToTrades(['SPY', 'AAPL', 'MSFT'], (trade) => {
        // Forward the trade data to your websocket server
        this.socket.emit('trade', trade);
        
        // Notify all subscribers
        if (this.subscribers.has(trade.symbol)) {
          this.subscribers.get(trade.symbol)?.forEach(callback => {
            callback(trade);
          });
        }
      });
    });
  }
  
  // Allow components to subscribe to specific symbols
  public subscribe(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)?.push(callback);
    
    return () => {
      // Return unsubscribe function
      const callbacks = this.subscribers.get(symbol) || [];
      this.subscribers.set(
        symbol,
        callbacks.filter(cb => cb !== callback)
      );
    };
  }
}` :

`// Custom Portfolio Performance Widget Component
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  date: string;
  balance: number;
  benchmark: number;
}

export function PortfolioPerformanceWidget() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1M'|'3M'|'6M'|'1Y'>('3M');
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Connect to your self-hosted database API
        const response = await fetch(
          \`/api/portfolio/performance?timeframe=\${timeframe}\`,
          { credentials: 'include' }
        );
        const data = await response.json();
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [timeframe]);
  
  if (isLoading) {
    return <div className="loading-spinner" />;
  }
  
  return (
    <div className="widget portfolio-performance">
      <div className="widget-header">
        <h3>Portfolio Performance</h3>
        <div className="timeframe-selector">
          {['1M', '3M', '6M', '1Y'].map(tf => (
            <button
              key={tf}
              className={\`\${timeframe === tf ? 'active' : ''}\`}
              onClick={() => setTimeframe(tf as any)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#8884d8" 
            name="Your Portfolio" 
          />
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#82ca9d" 
            name="S&P 500" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        );
      
      case 'white-label':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Globe className="h-6 w-6 mr-2 text-blue-400" />
                White-Label Solution
              </h3>
              
              <p className="mb-6 text-gray-300">
                Offer this powerful trading bot platform under your own brand. Self-hosting enables you to customize 
                the interface, features, and branding to suit your client's needs. Ideal for financial advisors, 
                trading educators, and fintech startups.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/30 p-5 rounded-lg">
                  <div className="bg-blue-900/30 p-3 rounded-lg inline-block mb-3">
                    <ClipboardEdit className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Custom Branding</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Custom logo, colors, and branding</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Tailored UI/UX to match your brand</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Custom domain and SSL integration</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/30 p-5 rounded-lg">
                  <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-3">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Subscription Models</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <div className="bg-purple-500/20 text-purple-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Create tiered access levels</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-500/20 text-purple-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Integrated payment processing</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-500/20 text-purple-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Client management dashboard</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/30 p-5 rounded-lg">
                  <div className="bg-green-900/30 p-3 rounded-lg inline-block mb-3">
                    <BarChart4 className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Educational Content</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <div className="bg-green-500/20 text-green-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Integrate your educational resources</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-500/20 text-green-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Custom trading signals and alerts</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-500/20 text-green-400 p-1 rounded-full mr-2 mt-0.5">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Strategy marketplace for your clients</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 mb-6">
                <h4 className="text-lg font-semibold mb-4">Use Cases</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Financial Advisory Firms</h5>
                    <p className="text-sm text-gray-400">
                      Offer automated trading as a value-added service to your clients. Monitor and manage all client 
                      portfolios from a unified dashboard.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Trading Education Companies</h5>
                    <p className="text-sm text-gray-400">
                      Provide students with practical tools to implement your trading methodologies. Create custom 
                      strategies based on your educational material.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Broker Services</h5>
                    <p className="text-sm text-gray-400">
                      Enhance your brokerage offering with algorithmic trading capabilities. Differentiate your 
                      service with advanced trading tools.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Fintech Startups</h5>
                    <p className="text-sm text-gray-400">
                      Leverage our platform as the foundation for your fintech product. Reduce development costs 
                      while providing professional-grade trading features.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Request White-Label Documentation
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'individual':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <UserCog className="h-6 w-6 mr-2 text-purple-400" />
                Individual Self-Hosting
              </h3>
              
              <p className="mb-6 text-gray-300">
                Gain complete control over your trading environment. Run the bot on your own servers for maximum 
                security and customization. Tailor the platform to your specific trading strategies and risk 
                management preferences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700/30 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">Performance Optimization</h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start">
                      <div className="bg-purple-500/20 text-purple-400 p-1 rounded-full mr-2 mt-0.5">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Ultra-Low Latency Trading</span>
                        <p className="text-xs text-gray-400 mt-1">Host the bot closer to your broker's servers to minimize execution delays</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-500/20 text-purple-400 p-1 rounded-full mr-2 mt-0.5">
                        <Server className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Resource Allocation</span>
                        <p className="text-xs text-gray-400 mt-1">Fine-tune server resources to match your trading volume and strategy complexity</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-purple-500/20 text-purple-400 p-1 rounded-full mr-2 mt-0.5">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Optimized Database</span>
                        <p className="text-xs text-gray-400 mt-1">Configure database indexes and caching for maximum performance</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/30 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-3">Custom Development</h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                        <Code className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Custom Indicators</span>
                        <p className="text-xs text-gray-400 mt-1">Develop and integrate proprietary technical indicators</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                        <FileCode className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">Strategy Modifications</span>
                        <p className="text-xs text-gray-400 mt-1">Modify trading algorithms to suit your specific approach</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-500/20 text-blue-400 p-1 rounded-full mr-2 mt-0.5">
                        <Network className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">External API Integration</span>
                        <p className="text-xs text-gray-400 mt-1">Connect to additional data sources and third-party services</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 mb-6">
                <h4 className="text-lg font-semibold mb-4">Data Privacy and Security</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <ShieldCheck className="h-5 w-5 text-green-400 mr-2" />
                      <h5 className="font-medium">Private Trading Data</h5>
                    </div>
                    <p className="text-sm text-gray-400">
                      Keep your trading data and strategies completely private. Self-hosting eliminates reliance on third-party servers.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Lock className="h-5 w-5 text-green-400 mr-2" />
                      <h5 className="font-medium">API Key Security</h5>
                    </div>
                    <p className="text-sm text-gray-400">
                      Store your broker API keys securely on your own infrastructure, with full control over encryption methods.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-green-400 mr-2" />
                      <h5 className="font-medium">Regulatory Compliance</h5>
                    </div>
                    <p className="text-sm text-gray-400">
                      Comply with strict data privacy regulations by storing all data within your own jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/docs/self-hosting">
                  <Button className="bg-purple-600 hover:bg-purple-700 mr-4">
                    Self-Hosting Guide
                  </Button>
                </Link>
                <Link href="/docs/api">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    API Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      
      case 'database':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2 text-green-400" />
                Database Integration & Widgets
              </h3>
              
              <p className="mb-6 text-gray-300">
                Connect the platform to your preferred database system for storing trading data, user information, and historical market data.
                Build custom widgets and dashboards that visualize data in real-time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-blue-400" />
                    Historical Data Widgets
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Interactive Price Charts</span>
                      <p className="text-gray-400">Display customizable timeframes, indicators, and chart types from your historical database</p>
                    </li>
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Backtesting Results</span>
                      <p className="text-gray-400">Visualize strategy performance metrics, risk analysis, and effectiveness graphs</p>
                    </li>
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Strategy Comparison</span>
                      <p className="text-gray-400">Compare multiple strategies side-by-side with historical performance data</p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                    Real-Time Data Widgets
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Market Data Streams</span>
                      <p className="text-gray-400">Display live prices, order book depth, and trade volumes with automatic updates</p>
                    </li>
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Custom Alerts</span>
                      <p className="text-gray-400">Create notifications based on real-time data conditions from your database</p>
                    </li>
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Live Trading Dashboard</span>
                      <p className="text-gray-400">Monitor all active trades and bot performance in real-time</p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-green-400" />
                    Portfolio Widgets
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Performance Visualization</span>
                      <p className="text-gray-400">Display interactive portfolio charts showing profit, allocation, and risk metrics</p>
                    </li>
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Trading History</span>
                      <p className="text-gray-400">Track historical trades with searchable, filterable transaction logs</p>
                    </li>
                    <li className="bg-gray-700/30 p-3 rounded-lg">
                      <span className="font-medium block mb-1">Account Balance</span>
                      <p className="text-gray-400">Monitor real-time balance, margin, and buying power from your database</p>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Custom Dashboard Example</h4>
                <div className="bg-gray-900 rounded-xl border border-gray-700/50 p-3 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">Custom dashboard screenshot</p>
                    <p className="text-xs">Placeholder for dashboard widgets visualization</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 mb-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-yellow-400" />
                  Technical Considerations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Database Compatibility</h5>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• PostgreSQL - Best for structured trading data</li>
                      <li>• MongoDB - Ideal for flexible, document-based storage</li>
                      <li>• MySQL - Good option for simpler deployments</li>
                      <li>• TimescaleDB - Optimized for time-series market data</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">API Endpoints</h5>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• RESTful API for CRUD operations</li>
                      <li>• WebSocket endpoints for real-time data</li>
                      <li>• GraphQL support for complex data queries</li>
                      <li>• JWT authentication and authorization</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Data Security</h5>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• End-to-end encryption for sensitive data</li>
                      <li>• API key management and rotation</li>
                      <li>• Role-based access control</li>
                      <li>• Audit logging for all database changes</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800/60 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Performance Optimization</h5>
                    <ul className="space-y-1 text-sm text-gray-400">
                      <li>• Efficient query optimization</li>
                      <li>• Data caching for frequent queries</li>
                      <li>• Database connection pooling</li>
                      <li>• Sharding for high-volume historical data</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/docs/database-integration">
                  <Button className="bg-green-600 hover:bg-green-700 mr-4">
                    Database Integration Guide
                  </Button>
                </Link>
                <Link href="/docs/custom-widgets">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Widget Development
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
        
      case 'technical':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
              <p className="mb-6 text-gray-300">
                Detailed technical information about our platform's architecture, requirements, and integration capabilities.
              </p>
              
              {/* Technical content would go here */}
              <div className="text-center text-gray-500">
                <p>Technical specifications coming soon</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-blue-900/30 text-blue-400 py-1 px-3 rounded-full text-sm font-medium mb-4 inline-block">
            COMPLETE CONTROL
          </span>
          <h2 className="text-3xl font-bold mb-4">Self-Hosting & Database Integration</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Take full ownership of your trading infrastructure with our comprehensive self-hosting options
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'overview' 
                ? 'bg-blue-900/30 text-white border border-blue-500/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('white-label')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeTab === 'white-label' 
                ? 'bg-blue-900/30 text-white border border-blue-500/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700/50'
            }`}
          >
            <Globe className="h-4 w-4 mr-2" />
            White-Label Solution
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeTab === 'individual' 
                ? 'bg-blue-900/30 text-white border border-blue-500/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700/50'
            }`}
          >
            <UserCog className="h-4 w-4 mr-2" />
            Individual Self-Hosting
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeTab === 'database' 
                ? 'bg-blue-900/30 text-white border border-blue-500/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700/50'
            }`}
          >
            <Database className="h-4 w-4 mr-2" />
            Database & Widgets
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-4 py-2 rounded-lg transition flex items-center ${
              activeTab === 'technical' 
                ? 'bg-blue-900/30 text-white border border-blue-500/50' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700/50'
            }`}
          >
            <FileCode className="h-4 w-4 mr-2" />
            Technical Specs
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </section>
  );
}
