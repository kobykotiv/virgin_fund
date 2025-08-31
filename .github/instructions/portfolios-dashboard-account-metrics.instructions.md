---
applyTo: '**/portfolio.tsx'
---

# Portfolios Dashboard - Account Metrics Section

## Overview
The Account Metrics section displays real-time financial data from the authenticated Alpaca account, providing users with immediate visibility into their trading account status.

## Key Components

### Account Metrics Cards
- **Buying Power**: Displays available capital for new trades
- **Portfolio Value**: Shows total current portfolio value
- **Cash**: Displays available cash balance

### Data Source
- Fetched from `/api/account` endpoint
- Uses secure Alpaca API authentication
- Updates on page load and manual refresh

## Implementation Guidelines

### Data Fetching
```typescript
const fetchAccount = async () => {
  try {
    const response = await fetch('/api/account');
    if (response.ok) {
      const data = await response.json();
      setAccount(data);
    }
  } catch (error) {
    console.error('Failed to fetch account:', error);
  }
};
```

### Display Format
- Use consistent number formatting: `parseFloat(value).toFixed(2)`
- Display as currency with $ prefix
- Handle loading states gracefully
- Show error states when data unavailable

### UI Requirements
- Responsive grid layout (1 column mobile, 3 columns desktop)
- Card-based design using shadcn/ui components
- Consistent spacing and typography
- Loading skeleton states

## Security Considerations
- Never expose API keys to client-side
- All Alpaca API calls must go through server-side endpoints
- Validate data before display
- Handle API rate limits gracefully

## Performance Optimization
- Cache account data for short periods
- Implement proper loading states
- Use React.memo for expensive re-renders
- Debounce refresh operations

## Error Handling
- Display user-friendly error messages
- Provide retry mechanisms
- Log errors for debugging
- Graceful degradation when API unavailable

## Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Clear visual hierarchy
