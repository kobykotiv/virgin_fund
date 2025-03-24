/**
 * Alpaca API Service
 * Handles all interactions with the Alpaca Trading API
 */

const Alpaca = require('@alpacahq/alpaca-trade-api');
const config = require('../config');
const logger = require('../utils/logger');

// Initialize Alpaca client
const alpaca = new Alpaca({
  keyId: config.alpaca.apiKey,
  secretKey: config.alpaca.apiSecret,
  paper: config.alpaca.paperTrading,
  baseUrl: config.alpaca.baseUrl
});

/**
 * Authentication and account services
 */
const accountService = {
  /**
   * Get account information
   * @returns {Promise} - Account information
   */
  getAccount: async () => {
    try {
      return await alpaca.getAccount();
    } catch (error) {
      logger.error('Error fetching account information:', error);
      throw error;
    }
  },

  /**
   * Get account configuration
   * @returns {Promise} - Account configuration
   */
  getAccountConfig: async () => {
    try {
      return await alpaca.getAccountConfigurations();
    } catch (error) {
      logger.error('Error fetching account configuration:', error);
      throw error;
    }
  },

  /**
   * Update account configuration
   * @param {Object} config - New configuration settings
   * @returns {Promise} - Updated account configuration
   */
  updateAccountConfig: async (config) => {
    try {
      return await alpaca.updateAccountConfigurations(config);
    } catch (error) {
      logger.error('Error updating account configuration:', error);
      throw error;
    }
  }
};

/**
 * Asset services
 */
const assetService = {
  /**
   * Get all assets
   * @param {Object} params - Filter parameters
   * @returns {Promise} - List of assets
   */
  getAssets: async (params = {}) => {
    try {
      return await alpaca.getAssets(params);
    } catch (error) {
      logger.error('Error fetching assets:', error);
      throw error;
    }
  },

  /**
   * Get a specific asset
   * @param {String} symbol - Asset symbol
   * @returns {Promise} - Asset details
   */
  getAsset: async (symbol) => {
    try {
      return await alpaca.getAsset(symbol);
    } catch (error) {
      logger.error(`Error fetching asset ${symbol}:`, error);
      throw error;
    }
  }
};

/**
 * Order services
 */
const orderService = {
  /**
   * Create a new order
   * @param {Object} params - Order parameters
   * @returns {Promise} - Created order
   */
  createOrder: async (params) => {
    try {
      return await alpaca.createOrder(params);
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Get all orders
   * @param {Object} params - Filter parameters
   * @returns {Promise} - List of orders
   */
  getOrders: async (params = {}) => {
    try {
      return await alpaca.getOrders(params);
    } catch (error) {
      logger.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get a specific order
   * @param {String} orderId - Order ID
   * @returns {Promise} - Order details
   */
  getOrder: async (orderId) => {
    try {
      return await alpaca.getOrder(orderId);
    } catch (error) {
      logger.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {String} orderId - Order ID
   * @returns {Promise} - Cancellation result
   */
  cancelOrder: async (orderId) => {
    try {
      return await alpaca.cancelOrder(orderId);
    } catch (error) {
      logger.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Cancel all orders
   * @returns {Promise} - Cancellation results
   */
  cancelAllOrders: async () => {
    try {
      return await alpaca.cancelAllOrders();
    } catch (error) {
      logger.error('Error cancelling all orders:', error);
      throw error;
    }
  }
};

/**
 * Position services
 */
const positionService = {
  /**
   * Get all positions
   * @returns {Promise} - List of positions
   */
  getPositions: async () => {
    try {
      return await alpaca.getPositions();
    } catch (error) {
      logger.error('Error fetching positions:', error);
      throw error;
    }
  },

  /**
   * Get a specific position
   * @param {String} symbol - Asset symbol
   * @returns {Promise} - Position details
   */
  getPosition: async (symbol) => {
    try {
      return await alpaca.getPosition(symbol);
    } catch (error) {
      logger.error(`Error fetching position for ${symbol}:`, error);
      throw error;
    }
  },

  /**
   * Close a position
   * @param {String} symbol - Asset symbol
   * @param {Object} params - Close parameters
   * @returns {Promise} - Close result
   */
  closePosition: async (symbol, params = {}) => {
    try {
      return await alpaca.closePosition(symbol, params);
    } catch (error) {
      logger.error(`Error closing position for ${symbol}:`, error);
      throw error;
    }
  },

  /**
   * Close all positions
   * @returns {Promise} - Close results
   */
  closeAllPositions: async () => {
    try {
      return await alpaca.closeAllPositions();
    } catch (error) {
      logger.error('Error closing all positions:', error);
      throw error;
    }
  }
};

/**
 * Market data services
 */
const marketDataService = {
  /**
   * Get bars (candlestick) data
   * @param {Object} params - Bar parameters
   * @returns {Promise} - Bar data
   */
  getBars: async (params) => {
    try {
      return await alpaca.getBars(params.timeframe, params.symbols, {
        start: params.start,
        end: params.end,
        limit: params.limit
      });
    } catch (error) {
      logger.error('Error fetching bars:', error);
      throw error;
    }
  },

  /**
   * Get last quote for a symbol
   * @param {String} symbol - Asset symbol
   * @returns {Promise} - Last quote
   */
  getLastQuote: async (symbol) => {
    try {
      return await alpaca.getLastQuote(symbol);
    } catch (error) {
      logger.error(`Error fetching last quote for ${symbol}:`, error);
      throw error;
    }
  },

  /**
   * Get last trade for a symbol
   * @param {String} symbol - Asset symbol
   * @returns {Promise} - Last trade
   */
  getLastTrade: async (symbol) => {
    try {
      return await alpaca.getLastTrade(symbol);
    } catch (error) {
      logger.error(`Error fetching last trade for ${symbol}:`, error);
      throw error;
    }
  }
};

/**
 * WebSocket streaming services
 */
const streamingService = {
  /**
   * Get the WebSocket client for data streaming
   * @returns {Object} - WebSocket client
   */
  getDataStream: () => {
    return alpaca.data_stream_v2;
  },

  /**
   * Initialize WebSocket connection and subscriptions
   * @param {Array} symbols - Symbols to subscribe to
   * @param {Function} quoteCallback - Callback for quote events
   * @param {Function} tradeCallback - Callback for trade events
   * @param {Function} barCallback - Callback for bar events
   */
  initializeStream: (symbols, quoteCallback, tradeCallback, barCallback) => {
    const stream = alpaca.data_stream_v2;

    stream.onConnect(() => {
      logger.info('Connected to Alpaca WebSocket');
      
      // Subscribe to market data
      if (symbols && symbols.length > 0) {
        stream.subscribeForQuotes(symbols);
        stream.subscribeForTrades(symbols);
        stream.subscribeForBars(symbols);
      }
    });

    stream.onDisconnect(() => {
      logger.warn('Disconnected from Alpaca WebSocket');
    });

    stream.onError((error) => {
      logger.error('Alpaca WebSocket error:', error);
    });

    if (quoteCallback) stream.onStockQuote(quoteCallback);
    if (tradeCallback) stream.onStockTrade(tradeCallback);
    if (barCallback) stream.onStockBar(barCallback);

    // Connect to the WebSocket
    stream.connect();
    
    return stream;
  }
};

/**
 * Crypto trading services
 */
const cryptoService = {
  /**
   * Create a crypto order
   * @param {Object} params - Order parameters
   * @returns {Promise} - Created order
   */
  createCryptoOrder: async (params) => {
    try {
      return await alpaca.createOrder({
        ...params,
        side: params.side,
        type: params.type || 'market',
        time_in_force: params.timeInForce || 'gtc'
      });
    } catch (error) {
      logger.error('Error creating crypto order:', error);
      throw error;
    }
  },

  /**
   * Get crypto assets
   * @returns {Promise} - List of crypto assets
   */
  getCryptoAssets: async () => {
    try {
      return await alpaca.getAssets({
        asset_class: 'crypto'
      });
    } catch (error) {
      logger.error('Error fetching crypto assets:', error);
      throw error;
    }
  }
};

module.exports = {
  accountService,
  assetService,
  orderService,
  positionService,
  marketDataService,
  streamingService,
  cryptoService,
  alpaca // Export raw client for advanced usage
};
