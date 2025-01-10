import { AxiosError } from 'axios';

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  technical: string;
  stage: 'cache' | 'database' | 'api' | 'validation' | 'processing';
  origin: 'client' | 'server' | 'third-party';
  timestamp: number;
  troubleshooting: string[];
  referenceCode?: string;
}

export class SearchError extends Error {
  details: ErrorDetails;

  constructor(details: Partial<ErrorDetails>) {
    super(details.message);
    this.name = 'SearchError';
    this.details = {
      code: details.code || 'UNKNOWN_ERROR',
      message: details.message || 'An unknown error occurred',
      userMessage: details.userMessage || 'Something went wrong. Please try again.',
      technical: details.technical || details.message || 'Unknown technical details',
      stage: details.stage || 'processing',
      origin: details.origin || 'client',
      timestamp: Date.now(),
      troubleshooting: details.troubleshooting || ['Try refreshing the page'],
      referenceCode: generateErrorCode(details.code || 'UNKNOWN'),
    };
  }
}

export function handleSearchError(error: unknown): SearchError {
  if (error instanceof SearchError) {
    return error;
  }

  if (error instanceof AxiosError) {
    return handleApiError(error);
  }

  if (error instanceof Error) {
    return new SearchError({
      code: 'GENERAL_ERROR',
      message: error.message,
      userMessage: 'An unexpected error occurred while searching',
      technical: error.stack,
      stage: 'processing',
      origin: 'client',
      troubleshooting: [
        'Check your internet connection',
        'Try refreshing the page',
        'If the problem persists, contact support'
      ]
    });
  }

  return new SearchError({
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    userMessage: 'Something went wrong. Please try again.',
    technical: JSON.stringify(error),
    stage: 'processing',
    origin: 'client'
  });
}

function handleApiError(error: AxiosError): SearchError {
  const baseDetails = {
    stage: 'api' as const,
    origin: 'third-party' as const,
    timestamp: Date.now(),
  };

  if (error.code === 'ECONNABORTED') {
    return new SearchError({
      ...baseDetails,
      code: 'API_TIMEOUT',
      message: 'API request timed out',
      userMessage: 'The search is taking longer than expected. Please try again.',
      technical: `Request to ${error.config?.url} timed out after ${error.config?.timeout}ms`,
      troubleshooting: [
        'Check your internet connection',
        'Try again in a few moments',
        'If the problem persists, the service might be experiencing high load'
      ]
    });
  }

  if (error.response?.status === 429) {
    return new SearchError({
      ...baseDetails,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'API rate limit exceeded',
      userMessage: 'You\'ve reached the maximum number of searches. Please wait a moment before trying again.',
      technical: 'Alpha Vantage API rate limit exceeded',
      troubleshooting: [
        'Wait for a minute before making another search',
        'Try using cached results if available',
        'Consider upgrading to a higher API tier if this happens frequently'
      ]
    });
  }

  if (error.response?.status === 401) {
    return new SearchError({
      ...baseDetails,
      code: 'API_AUTH_ERROR',
      message: 'API authentication failed',
      userMessage: 'Unable to access financial data service. Please try again later.',
      technical: 'Invalid or expired Alpha Vantage API key',
      troubleshooting: [
        'Contact support to report the authentication issue',
        'Try again later'
      ]
    });
  }

  return new SearchError({
    ...baseDetails,
    code: 'API_ERROR',
    message: error.message,
    userMessage: 'Unable to fetch financial data. Please try again.',
    technical: `API Error: ${error.message}. Status: ${error.response?.status}`,
    troubleshooting: [
      'Check your internet connection',
      'Try again in a few moments',
      'If the problem persists, contact support'
    ]
  });
}

function generateErrorCode(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}_${random}`.toUpperCase();
}