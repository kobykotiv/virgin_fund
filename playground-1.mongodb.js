/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// // Select the database to use.
// use('mongodbVSCodePlaygroundDB');
use('mongodbVSCodePlaygroundDB');

// DEMO PORTFOLIO
// This is a demo portfolio to show how to use the MongoDB Playground.
// It includes a collection named 'demo_portfolio' with sample sales data.

// Create and populate demo_portfolio collection with holdings
db.getCollection('demo_portfolio').insertMany([
    {
        positions: [
            { 'symbol': 'AAPL', 'quantity': 100, 'purchasePrice': 150.25, 'purchaseDate': new Date('2023-01-15') },
            { 'symbol': 'GOOGL', 'quantity': 50, 'purchasePrice': 2800.75, 'purchaseDate': new Date('2023-02-01') },
            { 'symbol': 'MSFT', 'quantity': 75, 'purchasePrice': 285.30, 'purchaseDate': new Date('2023-03-10') },
            { 'symbol': 'AMZN', 'quantity': 30, 'purchasePrice': 3200.50, 'purchaseDate': new Date('2023-04-05') },
            { 'symbol': 'TSLA', 'quantity': 200, 'purchasePrice': 190.75, 'purchaseDate': new Date('2023-05-20') }
        ],
        accountType: 'growth'
    },
    {
        positions: [
            { 'symbol': 'VTI', 'quantity': 300, 'purchasePrice': 220.15, 'purchaseDate': new Date('2023-01-20') },
            { 'symbol': 'BND', 'quantity': 500, 'purchasePrice': 70.25, 'purchaseDate': new Date('2023-02-15') },
            { 'symbol': 'VXUS', 'quantity': 200, 'purchasePrice': 55.80, 'purchaseDate': new Date('2023-03-01') }
        ],
        accountType: 'conservative'
    },
    {
        positions: [
            { 'symbol': 'QQQ', 'quantity': 150, 'purchasePrice': 380.50, 'purchaseDate': new Date('2023-02-10') },
            { 'symbol': 'ARKK', 'quantity': 100, 'purchasePrice': 45.75, 'purchaseDate': new Date('2023-03-15') },
            { 'symbol': 'NVDA', 'quantity': 40, 'purchasePrice': 450.25, 'purchaseDate': new Date('2023-04-20') },
            { 'symbol': 'AMD', 'quantity': 200, 'purchasePrice': 120.30, 'purchaseDate': new Date('2023-05-01') }
        ],
        accountType: 'aggressive'
    }
]);

// Function to calculate the current value of the portfolio
// This function assumes you have access to current market prices for the symbols.


// Calculate portfolio value and track trades
function calculatePortfolioValue(portfolio, currentPrices) {
    return portfolio.positions.reduce((total, position) => {
        const currentPrice = currentPrices[position.symbol] || position.purchasePrice;
        return total + (position.quantity * currentPrice);
    }, 0);
}

// Schema for trading signals
db.createCollection('trading_signals', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['symbol', 'signalType', 'timestamp', 'source'],
            properties: {
                symbol: { bsonType: 'string' },
                signalType: { enum: ['BUY', 'SELL', 'HOLD'] },
                timestamp: { bsonType: 'date' },
                source: { bsonType: 'string' },
                confidence: { bsonType: 'double' },
                indicators: {
                    bsonType: 'object',
                    properties: {
                        rsi: { bsonType: 'double' },
                        macd: { bsonType: 'double' },
                        volume: { bsonType: 'double' }
                    }
                }
            }
        }
    }
});

// Schema for trades
db.createCollection('trades', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['symbol', 'type', 'quantity', 'price', 'timestamp'],
            properties: {
                symbol: { bsonType: 'string' },
                type: { enum: ['BUY', 'SELL'] },
                quantity: { bsonType: 'double' },
                price: { bsonType: 'double' },
                timestamp: { bsonType: 'date' },
                signalId: { bsonType: 'objectId' }
            }
        }
    }
});

// Schema for portfolio performance tracking
db.createCollection('portfolio_performance', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['date', 'totalValue', 'accountType'],
            properties: {
                date: { bsonType: 'date' },
                totalValue: { bsonType: 'double' },
                accountType: { enum: ['growth', 'conservative', 'aggressive'] },
                returns: {
                    bsonType: 'object',
                    properties: {
                        daily: { bsonType: 'double' },
                        monthly: { bsonType: 'double' },
                        ytd: { bsonType: 'double' }
                    }
                },
                metrics: {
                    bsonType: 'object',
                    properties: {
                        sharpeRatio: { bsonType: 'double' },
                        volatility: { bsonType: 'double' },
                        beta: { bsonType: 'double' }
                    }
                }
            }
        }
    }
});

db.createCollection('bots', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'strategy', 'status', 'createdAt'],
            properties: {
                name: { bsonType: 'string' },
                // strategy: ,// forign key to a strategy collection if exists
                // e.g., 'mean_reversion', 'momentum', 'arbitrage'
                strategy: {
                    bsonType: 'identifier', // This can be an ObjectId referencing a strategy collection
                    // If you have a separate strategies collection, you can use ObjectId
                    enum: ['mean_reversion', 'momentum', 'arbitrage', 'custom'] // Add more strategies as needed
                },
                // e.g., 'active', 'inactive', 'error' 
                status: { enum: ['active', 'inactive', 'error'] },
                createdAt: { bsonType: 'date' },
                lastRun: { bsonType: 'date' },
                parameters: {
                    bsonType: 'object',
                    additionalProperties: { bsonType: 'double' } // e.g., thresholds, lookback periods
                }
            }
        }
    }
});










// Note: Actual current prices would need to be fetched from an external API
// This is just a demonstration schema

// // Insert a few documents into the sales collection.
// db.getCollection('sales').insertMany([
//   { 'item': 'abc', 'price': 10, 'quantity': 2, 'date': new Date('2014-03-01T08:00:00Z') },
//   { 'item': 'jkl', 'price': 20, 'quantity': 1, 'date': new Date('2014-03-01T09:00:00Z') },
//   { 'item': 'xyz', 'price': 5, 'quantity': 10, 'date': new Date('2014-03-15T09:00:00Z') },
//   { 'item': 'xyz', 'price': 5, 'quantity': 20, 'date': new Date('2014-04-04T11:21:39.736Z') },
//   { 'item': 'abc', 'price': 10, 'quantity': 10, 'date': new Date('2014-04-04T21:23:13.331Z') },
//   { 'item': 'def', 'price': 7.5, 'quantity': 5, 'date': new Date('2015-06-04T05:08:13Z') },
//   { 'item': 'def', 'price': 7.5, 'quantity': 10, 'date': new Date('2015-09-10T08:43:00Z') },
//   { 'item': 'abc', 'price': 10, 'quantity': 5, 'date': new Date('2016-02-06T20:20:13Z') },
// ]);

// // Run a find command to view items sold on April 4th, 2014.
// const salesOnApril4th = db.getCollection('sales').find({
//   date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
// }).count();

// // Print a message to the output window.
// console.log(`${salesOnApril4th} sales occurred in 2014.`);

// // Here we run an aggregation and open a cursor to the results.
// // Use '.toArray()' to exhaust the cursor to return the whole result set.
// // You can use '.hasNext()/.next()' to iterate through the cursor page by page.
// db.getCollection('sales').aggregate([
//   // Find all of the sales that occurred in 2014.
//   { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
//   // Group the total sales for each product.
//   { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
// ]);
