# Financial Search Service Documentation

## 1. Service Overview

The `searchFinancialData` service provides a robust solution for retrieving and caching financial market data with a multi-level caching strategy.

### Purpose

- Fetch real-time financial data for stock symbols
- Implement efficient caching to reduce API calls
- Track user search history for analytics

### Input Parameters

- `symbol`: String (e.g., 'AAPL', 'MSFT')
  - Must be 1-5 characters
  - Case-insensitive
  - Alphanumeric characters only

### Return Data Structure

```typescript
interface FinancialData {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}
```

## 2. Implementation Steps

### Required Dependencies

```typescript
import { searchFinancialData } from "@/lib/services/financialSearch";
```

### Configuration Requirements

- Environment Variables:
  ```env
  VITE_ALPHA_VANTAGE_API_KEY=your_api_key
  ```

### Error Handling

```typescript
try {
  const data = await searchFinancialData("AAPL");
  // Handle success
} catch (error) {
  if (error.message.includes("not authenticated")) {
    // Handle authentication error
  } else if (error.message.includes("API request failed")) {
    // Handle API error
  } else {
    // Handle other errors
  }
}
```

### Rate Limiting

- Alpha Vantage limits: 5 API calls per minute, 500 per day
- Use caching to minimize API calls
- Implement exponential backoff for retries

## 3. Technical Specifications

### Cache Strategy

1. Browser Cache (localStorage)

   - Duration: 24 hours
   - Key format: `financial_data_${userId}_${symbol}`

2. Database Cache (Supabase)
   - Table: search_history
   - Duration: 24 hours
   - Includes search analytics

### Security Requirements

- User must be authenticated
- API key must be protected
- Data validation on symbol input
- Sanitize API responses

### Performance Considerations

- Average response time: < 200ms from cache
- API response time: 500ms - 2s
- Cache hit ratio target: > 80%

## 4. Integration Guidelines

### Basic Integration

```typescript
import { searchFinancialData } from "@/lib/services/financialSearch";
import { useAuth } from "@/hooks/useAuth";

function YourComponent() {
  const { session } = useAuth();

  async function handleSearch(symbol: string) {
    if (!session) return;

    try {
      const data = await searchFinancialData(symbol);
      // Handle the data
    } catch (error) {
      // Handle errors
    }
  }
}
```

### Error Boundary Implementation

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <StockSearch />
</ErrorBoundary>
```

### State Management

- Use React Query for cache management
- Implement optimistic updates
- Handle loading and error states

## 5. Troubleshooting

Common Issues:

1. "User not authenticated"

   - Ensure user is logged in
   - Check session validity

2. "API request failed"

   - Verify API key
   - Check rate limits
   - Validate symbol format

3. "Cache read error"
   - Clear browser cache
   - Check localStorage permissions
   - Verify database connection
