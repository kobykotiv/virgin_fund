import { SearchError } from '../errors/searchErrors';

export function validateSearchQuery(query: string): void {
  // Empty query check
  if (!query.trim()) {
    throw new SearchError({
      code: 'EMPTY_QUERY',
      message: 'Search query cannot be empty',
      userMessage: 'Please enter at least 1 character and press Enter to search, or 3+ characters for automatic search',
      stage: 'validation',
      origin: 'client',
      troubleshooting: [
        'Enter a search term',
        'For automatic search, enter 3 or more characters',
        'Press Enter to force search with 1-2 characters'
      ]
    });
  }

  // Length validation
  if (query.length > 50) {
    throw new SearchError({
      code: 'QUERY_TOO_LONG',
      message: 'Search query exceeds maximum length',
      userMessage: 'Search term cannot be longer than 50 characters',
      stage: 'validation',
      origin: 'client'
    });
  }

  // Character validation
  const validChars = /^[a-zA-Z0-9\s.-]*$/;
  if (!validChars.test(query)) {
    throw new SearchError({
      code: 'INVALID_CHARACTERS',
      message: 'Search query contains invalid characters',
      userMessage: 'Only letters, numbers, spaces, dots, and hyphens are allowed',
      stage: 'validation',
      origin: 'client'
    });
  }
}