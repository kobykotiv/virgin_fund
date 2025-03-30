# Virgin Fund MVP API Documentation

This document outlines the API endpoints specific to the MVP version of Virgin Fund.

## Authentication

All API endpoints require authentication with a JWT token.

**Request Header:**
```
Authorization: Bearer <jwt_token>
```

## Portfolio Endpoints

### GET /api/portfolios

Retrieves all portfolios for the authenticated user.

**Response:**
```json
{
  "portfolios": [
    {
      "id": "portfolio-id-1",
      "userId": "user-id",
      "name": "Growth Portfolio",
      "type": "standard",
      "risk": "aggressive",
      "createdAt": "2023-11-01T12:00:00Z",
      "updatedAt": "2023-11-05T14:30:00Z",
      "assetCount": 5
    },
    {
      "id": "portfolio-id-2",
      "userId": "user-id",
      "name": "Retirement",
      "type": "standard",
      "risk": "conservative",
      "createdAt": "2023-10-15T09:20:00Z",
      "updatedAt": "2023-11-01T10:15:00Z",
      "assetCount": 3
    }
  ]
}
```

### POST /api/portfolios

Creates a new portfolio.

**Request Body:**
```json
{
  "name": "Tech Stocks",
  "type": "standard",
  "risk": "moderate"
}
```

**Response:**
```json
{
  "id": "new-portfolio-id",
  "userId": "user-id",
  "name": "Tech Stocks",
  "type": "standard",
  "risk": "moderate",
  "assets": [],
  "createdAt": "2023-11-10T15:30:00Z",
  "updatedAt": "2023-11-10T15:30:00Z"
}
```

### GET /api/portfolios/:id

Retrieves a specific portfolio with its assets.

**Response:**
```json
{
  "id": "portfolio-id-1",
  "userId": "user-id",
  "name": "Growth Portfolio",
  "type": "standard",
  "risk": "aggressive",
  "assets": [
    {
      "id": "asset-id-1",
      "portfolioId": "portfolio-id-1",
      "symbol": "AAPL",
      "quantity": 10,
      "averagePrice": 150.75,
      "currentPrice": 155.25,
      "lastUpdated": "2023-11-10T14:30:00Z"
    },
    {
      "id": "asset-id-2",
      "portfolioId": "portfolio-id-1",
      "symbol": "MSFT",
      "quantity": 5,
      "averagePrice": 280.50,
      "currentPrice": 290.10,
      "lastUpdated": "2023-11-10T14:30:00Z"
    }
  ],
  "createdAt": "2023-11-01T12:00:00Z",
  "updatedAt": "2023-11-05T14:30:00Z"
}
```

### PUT /api/portfolios/:id

Updates a portfolio.

**Request Body:**
```json
{
  "name": "Updated Portfolio Name",
  "risk": "moderate"
}
```

**Response:**
```json
{
  "id": "portfolio-id-1",
  "userId": "user-id",
  "name": "Updated Portfolio Name",
  "type": "standard",
  "risk": "moderate",
  "updatedAt": "2023-11-10T16:45:00Z"
}
```

### DELETE /api/portfolios/:id

Deletes a portfolio.

**Response:**
```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

## Asset Endpoints

### POST /api/portfolios/:id/assets

Adds an asset to a portfolio.

**Request Body:**
```json
{
  "symbol": "GOOGL",
  "quantity": 2,
  "price": 125.30
}
```

**Response:**
```json
{
  "id": "new-asset-id",
  "portfolioId": "portfolio-id-1",
  "symbol": "GOOGL",
  "quantity": 2,
  "averagePrice": 125.30,
  "currentPrice": 125.30,
  "lastUpdated": "2023-11-10T17:00:00Z"
}
```

### DELETE /api/portfolios/:portfolioId/assets/:assetId

Removes an asset from a portfolio.

**Response:**
```json
{
  "success": true,
  "message": "Asset removed successfully"
}
```

## Transaction Endpoints

### GET /api/portfolios/:id/transactions

Gets all transactions for a portfolio.

**Response:**
```json
{
  "transactions": [
    {
      "id": "transaction-id-1",
      "portfolioId": "portfolio-id-1",
      "assetId": "asset-id-1",
      "type": "buy",
      "quantity": 10,
      "price": 150.75,
      "timestamp": "2023-11-01T12:30:00Z"
    },
    {
      "id": "transaction-id-2",
      "portfolioId": "portfolio-id-1",
      "assetId": "asset-id-2",
      "type": "buy",
      "quantity": 5,
      "price": 280.50,
      "timestamp": "2023-11-02T10:15:00Z"
    }
  ]
}
```

### POST /api/portfolios/:id/transactions

Records a new transaction.

**Request Body:**
```json
{
  "assetId": "asset-id-1",
  "type": "buy",
  "quantity": 2,
  "price": 152.25
}
```

**Response:**
```json
{
  "id": "new-transaction-id",
  "portfolioId": "portfolio-id-1",
  "assetId": "asset-id-1",
  "type": "buy",
  "quantity": 2,
  "price": 152.25,
  "timestamp": "2023-11-10T17:30:00Z"
}
```

## Performance Endpoints

### GET /api/portfolios/:id/performance

Gets performance data for a portfolio.

**Query Parameters:**
- `timeframe`: The timeframe for performance calculation (daily, weekly, monthly, yearly, all)

**Response:**
```json
{
  "performance": {
    "portfolioId": "portfolio-id-1",
    "timeframe": "monthly",
    "totalValue": 2950.75,
    "pnl": 120.25,
    "pnlPercentage": 4.25,
    "benchmarkComparison": 1.50,
    "lastUpdated": "2023-11-10T18:00:00Z"
  }
}
```

## Market Data Endpoints

### GET /api/market-data/:symbol

Gets current price for a symbol.

**Response:**
```json
{
  "symbol": "AAPL",
  "price": 155.25,
  "timestamp": "2023-11-10T18:15:00Z"
}
```

### GET /api/market-data/:symbol/historical

Gets historical prices for a symbol.

**Query Parameters:**
- `timeframe`: The timeframe for historical data (daily, weekly, monthly, yearly)

**Response:**
```json
{
  "symbol": "AAPL",
  "timeframe": "monthly",
  "data": [
    {
      "date": "2023-10-10T00:00:00Z",
      "price": 145.50
    },
    {
      "date": "2023-10-17T00:00:00Z",
      "price": 148.75
    },
    // ... more data points
    {
      "date": "2023-11-07T00:00:00Z",
      "price": 155.25
    }
  ]
}
```

## Error Responses

All endpoints return standardized error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input parameters",
  "details": {
    "name": "Portfolio name is required"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Portfolio not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
