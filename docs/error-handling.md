# Error Handling Guide

## Overview

Virgin Fund implements a comprehensive error handling system that provides detailed error information while maintaining a good user experience.

## Error Types

### 1. SearchError

The main error class for handling search-related errors:

```typescript
interface ErrorDetails {
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
```

### 2. API Errors

Handled by `handleApiError`:

```typescript
function handleApiError(error: AxiosError): SearchError {
  if (error.code === 'ECONNABORTED') {
    return new SearchError({
      code: 'API_TIMEOUT',
      message: 'API request timed out',
      // ...
    });
  }
  // ...
}
```

### 3. Validation Errors

```typescript
new SearchError({
  code: 'VALIDATION_ERROR',
  message: 'Invalid input',
  stage: 'validation',
  origin: 'client'
});
```

## Error Components

### ErrorMessage Component

```typescript
<ErrorMessage 
  error={error}
  className="mt-2"
/>
```

Features:
- User-friendly messages
- Technical details (expandable)
- Troubleshooting steps
- Error reference codes

### Debug Popover

```typescript
<DebugPopover
  error={error}
  className="text-muted-foreground"
/>
```

Features:
- Raw error details
- Request/response information
- Timestamps
- Stack traces

## Error Handling Patterns

### 1. Component Level

```typescript
function Component() {
  const [error, setError] = useState<SearchError | null>(null);

  try {
    // Component logic
  } catch (error) {
    setError(handleSearchError(error));
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }
}
```

### 2. Hook Level

```typescript
function useFeature() {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown) => {
    const searchError = handleSearchError(error);
    toast({
      title: "Error",
      description: searchError.details.userMessage,
      variant: "destructive"
    });
  }, [toast]);
}
```

### 3. Service Level

```typescript
async function searchService() {
  try {
    // Service logic
  } catch (error) {
    throw handleSearchError(error);
  }
}
```

## Error Boundaries

```typescript
<ErrorBoundary fallback={ErrorFallback}>
  <Component />
</ErrorBoundary>
```

Features:
- Catches render errors
- Prevents app crashes
- Provides recovery options
- Logs errors

## Best Practices

1. **User Messages**
   - Clear and concise
   - Action-oriented
   - Non-technical
   - Helpful suggestions

2. **Technical Details**
   - Detailed error codes
   - Stack traces
   - Request/response data
   - Timestamps

3. **Recovery**
   - Retry mechanisms
   - Fallback options
   - Clear actions
   - State recovery

4. **Logging**
   - Error details
   - User context
   - System state
   - Performance metrics

## Error Codes

Common error codes and their meanings:

| Code | Description | Recovery |
|------|-------------|----------|
| `API_TIMEOUT` | Request timeout | Retry with backoff |
| `RATE_LIMIT` | API rate limit | Wait and retry |
| `AUTH_ERROR` | Authentication failed | Re-authenticate |
| `VALIDATION_ERROR` | Invalid input | Fix input |
| `CACHE_ERROR` | Cache operation failed | Use API |

## Testing Errors

```typescript
describe('Error Handling', () => {
  it('handles API errors', async () => {
    // Test setup
    const error = new SearchError({
      code: 'API_ERROR',
      message: 'API failed'
    });

    // Test error handling
    expect(() => handleSearchError(error))
      .toThrow('API failed');
  });
});
```