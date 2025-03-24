import Alpaca from '@alpacahq/alpaca-trade-api';

// Singleton to ensure we only create one connection
let alpacaInstance: Alpaca | null = null;

export function getAlpacaClient(apiKey?: string, secretKey?: string, isPaper: boolean = true): Alpaca {
  // If keys are provided, create a new instance (for user-specific API calls)
  if (apiKey && secretKey) {
    return new Alpaca({
      keyId: apiKey,
      secretKey: secretKey,
      paper: isPaper,
      baseUrl: isPaper ? 'https://paper-api.alpaca.markets' : 'https://api.alpaca.markets'
    });
  }
  
  // Otherwise use the singleton with default environment variables
  if (!alpacaInstance) {
    alpacaInstance = new Alpaca({
      keyId: process.env.ALPACA_API_KEY || '',
      secretKey: process.env.ALPACA_API_SECRET || '',
      paper: process.env.ALPACA_ENVIRONMENT !== 'live',
      baseUrl: process.env.ALPACA_ENVIRONMENT !== 'live' 
        ? 'https://paper-api.alpaca.markets' 
        : 'https://api.alpaca.markets'
    });
  }
  
  return alpacaInstance;
}

// API error handling wrapper
export async function alpacaApiRequest<T>(apiCall: () => Promise<T>): Promise<{data?: T; error?: string}> {
  try {
    const result = await apiCall();
    return { data: result };
  } catch (error) {
    console.error('Alpaca API Error:', error);
    return { error: error.message || 'An unknown error occurred with the Alpaca API' };
  }
}
