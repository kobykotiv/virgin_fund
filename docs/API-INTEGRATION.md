# Alpaca API Integration

This document explains how the application integrates with the Alpaca API to fetch real market data.

## Overview

Virgin Fund uses the Alpaca API to fetch real-time market data for portfolio allocation visualization. When properly configured, the application will display actual investment data instead of mock data.

## Configuration

Users need to provide their Alpaca API credentials in the Dashboard Settings page:

1. Navigate to the Settings page
2. Enter your Alpaca API Key and Secret Key
3. Click "Save Credentials"

## How It Works

### Data Storage
- API credentials are stored in the browser's localStorage
- Credentials are never sent to our servers
- All API requests are made directly from the client to Alpaca

### Security Considerations
- For security reasons, we recommend using Paper Trading API keys
- The application will never expose your API keys in the UI
- Clear your credentials when using a shared device

### Mock Data Warning

When no valid API credentials are provided, the application will:
1. Display a prominent warning in the footer
2. Use pre-defined mock data for all visualizations
3. Indicate "Mock Data" within the chart visualization

## Troubleshooting

If you experience issues with the API integration:

1. Verify your API keys are correct
2. Ensure you have proper permissions on your Alpaca account
3. Check the browser console for any error messages
4. Try clearing your credentials and re-entering them

## API Endpoints Used

The application currently uses the following Alpaca API endpoints:

- `/v2/portfolio` - To fetch portfolio allocation data

## Future Enhancements

Planned improvements to the API integration:

- Support for additional data providers
- Enhanced error handling and fallback mechanisms
- Cached data for offline access
- Real-time data updates using WebSockets
