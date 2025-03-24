# Alpaca Trading API Integration Guide

This guide provides a comprehensive overview of integrating the Alpaca Trading API into the Virgin Fund platform.

## 1. Authentication

Alpaca's Trading API uses API key authentication for secure access:

### API Keys and Secrets
- Two keys required: API Key ID (public) and Secret Key (private)
- Obtain from the Alpaca dashboard under "Paper Trading" or "Live Trading"
- Different keys for paper and live environments

### Authentication Implementation
```javascript
// Basic authentication
const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_API_SECRET,
  paper: true, // Switch to false for live trading
  baseUrl: process.env.ALPACA_API_BASE_URL
});

// REST API manual authentication
const headers = {
  'APCA-API-KEY-ID': process.env.ALPACA_API_KEY,
  'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET
};
```

### Security Best Practices
- Never expose keys in client-side code
- Store secrets in environment variables or a secure vault
- Implement key rotation and least privilege access
- Consider using OAuth for user-based authentication

## 2. Getting Started with Trading API

### Initial Setup
1. Create an Alpaca account at https://app.alpaca.markets/signup
2. Navigate to the Paper Trading section to get API keys
3. Install the official client library:
   ```bash
   npm install @alpacahq/alpaca-trade-api
   ```

### Making Your First API Call
```javascript
// Initialize the client
const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_API_SECRET,
  paper: true,
});

// Get account information
alpaca.getAccount().then((account) => {
  console.log('Current account:', account);
});
```

### Base URLs
- Paper Trading: https://paper-api.alpaca.markets
- Live Trading: https://api.alpaca.markets

## 3. Working with Assets

Assets represent tradable securities on the Alpaca platform.

### Retrieving Assets
```javascript
// Get all assets
const assets = await alpaca.getAssets();

// Filter active assets
const activeAssets = await alpaca.getAssets({
  status: 'active'
});

// Get specific asset
const appleStock = await alpaca.getAsset('AAPL');
```

### Asset Properties
- `id`: Unique identifier
- `symbol`: Trading symbol (e.g., 'AAPL')
- `name`: Full name (e.g., 'Apple Inc.')
- `status`: Trading status ('active', 'inactive')
- `tradable`: Boolean indicating if the asset can be traded
- `fractionable`: Boolean indicating if fractional shares are supported

### Asset Types
- `us_equity`: U.S. stocks
- `crypto`: Cryptocurrencies (if enabled)

## 4. Working with Orders

Orders are instructions to buy or sell securities.

### Creating Orders
```javascript
// Market order
const marketOrder = await alpaca.createOrder({
  symbol: 'AAPL',
  qty: 1,
  side: 'buy',
  type: 'market',
  time_in_force: 'day'
});

// Limit order
const limitOrder = await alpaca.createOrder({
  symbol: 'AAPL',
  qty: 1,
  side: 'buy',
  type: 'limit',
  time_in_force: 'day',
  limit_price: 150.00
});
```

### Order Types
- `market`: Execute at current market price
- `limit`: Execute at specified price or better
- `stop`: Convert to market order when price reaches stop price
- `stop_limit`: Convert to limit order when price reaches stop price

### Time-in-Force Options
- `day`: Valid until end of trading day
- `gtc`: Good-til-canceled
- `ioc`: Immediate-or-cancel
- `opg`: Execute at opening price

### Managing Orders
```javascript
// Get all orders
const orders = await alpaca.getOrders();

// Get a specific order
const order = await alpaca.getOrder(orderId);

// Cancel an order
await alpaca.cancelOrder(orderId);
```

## 5. Working with Positions

Positions represent your current holdings in securities.

### Retrieving Positions
```javascript
// Get all positions
const positions = await alpaca.getPositions();

// Get a specific position
const aaplPosition = await alpaca.getPosition('AAPL');
```

### Position Properties
- `symbol`: Asset symbol
- `qty`: Quantity of shares or units
- `side`: Position direction ('long' or 'short')
- `market_value`: Current market value
- `cost_basis`: Original cost
- `unrealized_pl`: Unrealized profit/loss
- `unrealized_plpc`: Unrealized profit/loss percentage

### Closing Positions
```javascript
// Close a specific position
await alpaca.closePosition('AAPL');

// Close all positions
await alpaca.closeAllPositions();
```

## 6. Working with Account

Account endpoints provide information about your trading account status.

### Getting Account Information
```javascript
const account = await alpaca.getAccount();
console.log(`Account value: $${account.equity}`);
console.log(`Buying power: $${account.buying_power}`);
```

### Key Account Properties
- `account_number`: Your Alpaca account number
- `status`: Account status ('ACTIVE', 'SUSPENDED', etc.)
- `cash`: Cash balance
- `portfolio_value`: Total account value
- `equity`: Cash + market value of positions
- `buying_power`: Available funds for trading
- `initial_margin`: Required margin for opening positions
- `maintenance_margin`: Required margin to maintain positions
- `daytrading_buying_power`: Buying power for day trading

### Account Configuration
```javascript
// Update account configurations
await alpaca.updateAccountConfigurations({
  dtbp_check: 'entry', // Day trading buying power check
  trade_confirm_email: 'none'
});
```

## 7. Paper Trading

Paper trading provides a simulated environment for testing strategies.

### Key Features
- Identical API to live trading
- Simulated execution with realistic order fills
- Separate API keys from live trading
- $100,000 starting balance (customizable)

### Switching Between Paper and Live
```javascript
// Paper trading
const papperAlpaca = new Alpaca({
  keyId: process.env.PAPER_API_KEY,
  secretKey: process.env.PAPER_SECRET_KEY,
  paper: true
});

// Live trading
const liveAlpaca = new Alpaca({
  keyId: process.env.LIVE_API_KEY,
  secretKey: process.env.LIVE_SECRET_KEY,
  paper: false
});
```

### Paper Trading Limitations
- Simulated liquidity may differ from real market
- No actual order book depth
- Settlement happens immediately
- Clock synchronization may differ from real market

## Implementation Tips

1. **Error Handling**: Implement robust error handling for API responses
2. **Rate Limiting**: Respect Alpaca's rate limits (200 requests per minute)
3. **Webhook Integration**: Use webhooks for real-time trade notifications
4. **Testing**: Thoroughly test all trading logic in paper environment before going live
5. **Monitoring**: Implement monitoring for detecting issues with API connectivity

## Additional Resources

- [Alpaca API Documentation](https://docs.alpaca.markets/)
- [Alpaca GitHub](https://github.com/alpacahq)
- [Community Forum](https://forum.alpaca.markets/)
- [Status Page](https://status.alpaca.markets/)
