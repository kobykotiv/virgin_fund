/**
 * Demo Accounts API Utilities
 *
 * This module provides utilities for fetching and managing demo accounts
 * from the JSON data source. It includes type-safe functions for getting
 * demo accounts, filtering, and integration with the trading platform.
 */

export interface DemoAccount {
  id: string;
  email: string;
  name: string;
  accountType: string;
  balance: number;
  portfolioValue: number;
  buyingPower: number;
  dayTradeCount: number;
  patternDayTrade: boolean;
  createdAt: string;
  lastLogin: string;
  status: string;
  permissions: string[];
  preferences: {
    theme: string;
    notifications: boolean;
    autoRefresh: boolean;
    defaultTimeframe: string;
  };
  portfolio: {
    totalValue: number;
    cash: number;
    positions: Array<{
      symbol: string;
      quantity: number;
      avgPrice: number;
      currentPrice: number;
      marketValue: number;
      unrealizedPnL: number;
      unrealizedPnLPercent: number;
    }>;
  };
  bots: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    assets: string[];
    allocation: number;
    performance: {
      totalPnL: number;
      pnlPercentage: number;
      totalTrades: number;
      winRate: number;
    };
  }>;
  orders: Array<{
    id: string;
    symbol: string;
    side: string;
    type: string;
    quantity: number;
    status: string;
    price: number;
    timestamp: string;
  }>;
}

export interface DemoAccountsResponse {
  success: boolean;
  data: DemoAccount[];
  count: number;
  total: number;
  error?: string;
}

/**
 * Fetch all demo accounts
 */
export async function fetchDemoAccounts(
  filters?: {
    accountType?: string;
    status?: string;
    limit?: number;
  }
): Promise<DemoAccountsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters?.accountType) {
      params.append('accountType', filters.accountType);
    }

    if (filters?.status) {
      params.append('status', filters.status);
    }

    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = `/api/demo-accounts${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching demo accounts:', error);
    return {
      success: false,
      data: [],
      count: 0,
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch a specific demo account by ID
 */
export async function fetchDemoAccount(id: string): Promise<{
  success: boolean;
  data?: DemoAccount;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/demo-accounts/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Demo account not found'
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching demo account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get demo accounts from the static JSON file (client-side)
 * This is useful when you want to avoid API calls and load directly from the public folder
 */
export async function getDemoAccountsFromJSON(): Promise<DemoAccount[]> {
  try {
    const response = await fetch('/demo-accounts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading demo accounts from JSON:', error);
    return [];
  }
}

/**
 * Get a random demo account for quick testing
 */
export async function getRandomDemoAccount(): Promise<DemoAccount | null> {
  try {
    const accounts = await getDemoAccountsFromJSON();
    if (accounts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * accounts.length);
    return accounts[randomIndex];
  } catch (error) {
    console.error('Error getting random demo account:', error);
    return null;
  }
}

/**
 * Get demo accounts by type (paper, live, etc.)
 */
export async function getDemoAccountsByType(accountType: string): Promise<DemoAccount[]> {
  try {
    const accounts = await getDemoAccountsFromJSON();
    return accounts.filter((account: DemoAccount) => account.accountType === accountType);
  } catch (error) {
    console.error('Error getting demo accounts by type:', error);
    return [];
  }
}

/**
 * Get demo accounts with active bots
 */
export async function getDemoAccountsWithBots(): Promise<DemoAccount[]> {
  try {
    const accounts = await getDemoAccountsFromJSON();
    return accounts.filter((account: DemoAccount) => account.bots.length > 0);
  } catch (error) {
    console.error('Error getting demo accounts with bots:', error);
    return [];
  }
}

/**
 * Calculate total portfolio value across all demo accounts
 */
export async function getTotalDemoPortfolioValue(): Promise<number> {
  try {
    const accounts = await getDemoAccountsFromJSON();
    return accounts.reduce((total: number, account: DemoAccount) => total + account.portfolioValue, 0);
  } catch (error) {
    console.error('Error calculating total demo portfolio value:', error);
    return 0;
  }
}

/**
 * Get demo account statistics
 */
export async function getDemoAccountStats(): Promise<{
  totalAccounts: number;
  totalValue: number;
  activeAccounts: number;
  paperTradingAccounts: number;
  liveTradingAccounts: number;
  accountsWithBots: number;
  totalBots: number;
}> {
  try {
    const accounts = await getDemoAccountsFromJSON();

    const stats = {
      totalAccounts: accounts.length,
      totalValue: accounts.reduce((sum: number, acc: DemoAccount) => sum + acc.portfolioValue, 0),
      activeAccounts: accounts.filter((acc: DemoAccount) => acc.status === 'active').length,
      paperTradingAccounts: accounts.filter((acc: DemoAccount) => acc.accountType === 'paper').length,
      liveTradingAccounts: accounts.filter((acc: DemoAccount) => acc.accountType === 'live').length,
      accountsWithBots: accounts.filter((acc: DemoAccount) => acc.bots.length > 0).length,
      totalBots: accounts.reduce((sum: number, acc: DemoAccount) => sum + acc.bots.length, 0)
    };

    return stats;
  } catch (error) {
    console.error('Error getting demo account stats:', error);
    return {
      totalAccounts: 0,
      totalValue: 0,
      activeAccounts: 0,
      paperTradingAccounts: 0,
      liveTradingAccounts: 0,
      accountsWithBots: 0,
      totalBots: 0
    };
  }
}

/**
 * Search demo accounts by name or email
 */
export async function searchDemoAccounts(query: string): Promise<DemoAccount[]> {
  try {
    const accounts = await getDemoAccountsFromJSON();
    const lowercaseQuery = query.toLowerCase();

    return accounts.filter((account: DemoAccount) =>
      account.name.toLowerCase().includes(lowercaseQuery) ||
      account.email.toLowerCase().includes(lowercaseQuery) ||
      account.id.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching demo accounts:', error);
    return [];
  }
}

/**
 * Get demo account positions summary
 */
export async function getDemoAccountPositions(accountId: string): Promise<{
  positions: DemoAccount['portfolio']['positions'];
  totalValue: number;
  totalPnL: number;
  winningPositions: number;
  losingPositions: number;
} | null> {
  try {
    const result = await fetchDemoAccount(accountId);

    if (!result.success || !result.data) {
      return null;
    }

    const positions = result.data.portfolio.positions;
    const totalValue = positions.reduce((sum: number, pos) => sum + pos.marketValue, 0);
    const totalPnL = positions.reduce((sum: number, pos) => sum + pos.unrealizedPnL, 0);
    const winningPositions = positions.filter(pos => pos.unrealizedPnL > 0).length;
    const losingPositions = positions.filter(pos => pos.unrealizedPnL < 0).length;

    return {
      positions,
      totalValue,
      totalPnL,
      winningPositions,
      losingPositions
    };
  } catch (error) {
    console.error('Error getting demo account positions:', error);
    return null;
  }
}
