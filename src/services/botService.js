/**
 * Bot Service
 * Handles trading bot operations including creation, execution, and management
 */

const mongoose = require('mongoose');
const Bot = require('../models/Bot');
const Signal = require('../models/Signal');
const alpacaService = require('./alpaca');
const indicatorService = require('./indicatorService');
const logger = require('../utils/logger');

/**
 * Bot creation and management functions
 */
const botManagement = {
  /**
   * Create a new trading bot
   * @param {Object} botData - Bot configuration data
   * @param {String} userId - User ID of the bot creator
   * @returns {Promise} - Created bot
   */
  createBot: async (botData, userId) => {
    try {
      const bot = new Bot({
        ...botData,
        creator: userId,
        createdAt: new Date(),
        active: false // Bots are inactive by default
      });
      
      return await bot.save();
    } catch (error) {
      logger.error('Error creating bot:', error);
      throw error;
    }
  },

  /**
   * Update an existing bot
   * @param {String} botId - Bot ID
   * @param {Object} updates - Updated bot data
   * @param {String} userId - User ID making the update
   * @returns {Promise} - Updated bot
   */
  updateBot: async (botId, updates, userId) => {
    try {
      // Ensure user owns the bot
      const bot = await Bot.findOne({ _id: botId, creator: userId });
      if (!bot) {
        throw new Error('Bot not found or you do not have permission to update it');
      }
      
      // Apply updates
      Object.keys(updates).forEach(key => {
        bot[key] = updates[key];
      });
      
      bot.updatedAt = new Date();
      return await bot.save();
    } catch (error) {
      logger.error(`Error updating bot ${botId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a bot
   * @param {String} botId - Bot ID
   * @param {String} userId - User ID making the deletion
   * @returns {Promise} - Deletion result
   */
  deleteBot: async (botId, userId) => {
    try {
      // Ensure user owns the bot
      const result = await Bot.deleteOne({ _id: botId, creator: userId });
      if (result.deletedCount === 0) {
        throw new Error('Bot not found or you do not have permission to delete it');
      }
      
      return { success: true, message: 'Bot deleted successfully' };
    } catch (error) {
      logger.error(`Error deleting bot ${botId}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific bot
   * @param {String} botId - Bot ID
   * @returns {Promise} - Bot details
   */
  getBot: async (botId) => {
    try {
      return await Bot.findById(botId).populate('creator', 'username email');
    } catch (error) {
      logger.error(`Error fetching bot ${botId}:`, error);
      throw error;
    }
  },

  /**
   * Get all bots for a user
   * @param {String} userId - User ID
   * @returns {Promise} - List of user's bots
   */
  getUserBots: async (userId) => {
    try {
      return await Bot.find({ creator: userId });
    } catch (error) {
      logger.error(`Error fetching bots for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Enable or disable a bot
   * @param {String} botId - Bot ID
   * @param {Boolean} active - New active status
   * @param {String} userId - User ID making the change
   * @returns {Promise} - Updated bot
   */
  toggleBotStatus: async (botId, active, userId) => {
    try {
      // Ensure user owns the bot
      const bot = await Bot.findOne({ _id: botId, creator: userId });
      if (!bot) {
        throw new Error('Bot not found or you do not have permission to update it');
      }
      
      bot.active = active;
      bot.updatedAt = new Date();
      return await bot.save();
    } catch (error) {
      logger.error(`Error toggling bot status for ${botId}:`, error);
      throw error;
    }
  }
};

/**
 * Bot execution and trading functions
 */
const botExecution = {
  /**
   * Execute a single bot's strategy
   * @param {Object} bot - Bot to execute
   * @returns {Promise} - Execution results
   */
  executeBot: async (bot) => {
    try {
      logger.info(`Executing bot: ${bot.name} (${bot._id})`);
      
      if (!bot.active) {
        logger.info(`Bot ${bot._id} is inactive, skipping execution`);
        return { executed: false, reason: 'Bot is inactive' };
      }
      
      const signals = await generateSignals(bot);
      const executionResults = [];
      
      // Execute trades based on signals
      for (const signal of signals) {
        if (signal.action === 'buy' || signal.action === 'sell') {
          const result = await executeTrade(bot, signal);
          executionResults.push(result);
          
          // Save signal to database
          await new Signal({
            bot: bot._id,
            symbol: signal.symbol,
            action: signal.action,
            price: signal.price,
            quantity: signal.quantity,
            createdAt: new Date(),
            metadata: signal.metadata
          }).save();
        }
      }
      
      return { executed: true, results: executionResults };
    } catch (error) {
      logger.error(`Error executing bot ${bot._id}:`, error);
      throw error;
    }
  },

  /**
   * Run all active bots
   * @returns {Promise} - Execution results for all bots
   */
  runAllActiveBots: async () => {
    try {
      const activeBots = await Bot.find({ active: true });
      logger.info(`Running ${activeBots.length} active bots`);
      
      const results = [];
      for (const bot of activeBots) {
        try {
          const result = await botExecution.executeBot(bot);
          results.push({ botId: bot._id, name: bot.name, ...result });
        } catch (error) {
          logger.error(`Error executing bot ${bot._id}:`, error);
          results.push({ botId: bot._id, name: bot.name, executed: false, error: error.message });
        }
      }
      
      return results;
    } catch (error) {
      logger.error('Error running active bots:', error);
      throw error;
    }
  },

  /**
   * Backtest a bot strategy with historical data
   * @param {Object} bot - Bot to backtest
   * @param {Object} params - Backtest parameters
   * @returns {Promise} - Backtest results
   */
  backtestBot: async (bot, params) => {
    try {
      const { startDate, endDate } = params;
      logger.info(`Backtesting bot ${bot._id} from ${startDate} to ${endDate}`);
      
      const results = {
        trades: [],
        performance: {
          startBalance: 10000, // Simulated starting balance
          endBalance: 10000,
          totalReturn: 0,
          maxDrawdown: 0,
          winRate: 0
        }
      };
      
      // For each symbol in the watchlist
      for (const symbol of bot.watchlist) {
        // Get historical data
        const historicalData = await alpacaService.marketDataService.getBars({
          timeframe: '1Day',
          symbols: [symbol],
          start: startDate,
          end: endDate
        });
        
        // Run strategy against historical data
        const trades = simulateStrategyOnHistoricalData(bot, historicalData);
        
        // Add trades to results
        results.trades.push(...trades);
      }
      
      // Calculate performance metrics
      calculatePerformanceMetrics(results);
      
      return results;
    } catch (error) {
      logger.error(`Error backtesting bot ${bot._id}:`, error);
      throw error;
    }
  }
};

/**
 * Helper Functions
 */

/**
 * Generate trading signals based on bot strategy
 * @param {Object} bot - Bot with strategy configuration
 * @returns {Promise} - List of generated signals
 */
async function generateSignals(bot) {
  try {
    const signals = [];
    
    // Process each symbol in the watchlist
    for (const symbol of bot.watchlist) {
      // Get market data
      const bars = await alpacaService.marketDataService.getBars({
        timeframe: bot.strategy.timeframe || '1Day',
        symbols: [symbol],
        limit: bot.strategy.lookbackPeriod || 100
      });
      
      if (!bars || !bars[symbol] || bars[symbol].length === 0) {
        logger.warn(`No data found for ${symbol}`);
        continue;
      }
      
      // Extract price data
      const prices = extractPriceData(bars[symbol]);
      
      // Apply indicators based on strategy
      const indicatorResults = {};
      for (const indicator of bot.strategy.indicators) {
        indicatorResults[indicator.name] = indicatorService.calculateIndicator(
          indicator.name,
          prices,
          indicator.params
        );
      }
      
      // Apply strategy rules to generate signals
      const signal = applyStrategyRules(
        bot.strategy,
        indicatorResults,
        prices,
        symbol
      );
      
      if (signal) {
        signals.push(signal);
      }
    }
    
    return signals;
  } catch (error) {
    logger.error('Error generating signals:', error);
    throw error;
  }
}

/**
 * Extract price data from bar data
 * @param {Array} bars - Bar data from Alpaca API
 * @returns {Object} - Extracted price data
 */
function extractPriceData(bars) {
  return {
    open: bars.map(bar => bar.o),
    high: bars.map(bar => bar.h),
    low: bars.map(bar => bar.l),
    close: bars.map(bar => bar.c),
    volume: bars.map(bar => bar.v),
    timestamp: bars.map(bar => bar.t)
  };
}

/**
 * Apply strategy rules to indicator results to generate signals
 * @param {Object} strategy - Bot strategy configuration
 * @param {Object} indicators - Calculated indicator values
 * @param {Object} prices - Price data
 * @param {String} symbol - Asset symbol
 * @returns {Object|null} - Generated signal or null if no signal
 */
function applyStrategyRules(strategy, indicators, prices, symbol) {
  // Get the most recent price
  const currentPrice = prices.close[prices.close.length - 1];
  
  // Simple example for a moving average crossover strategy
  if (strategy.type === 'MA_CROSSOVER' && 
      indicators.shortMA && indicators.longMA) {
    
    const shortMA = indicators.shortMA;
    const longMA = indicators.longMA;
    
    // Check for crossover
    const currentShortMA = shortMA[shortMA.length - 1];
    const previousShortMA = shortMA[shortMA.length - 2];
    const currentLongMA = longMA[longMA.length - 1];
    const previousLongMA = longMA[longMA.length - 2];
    
    // Buy signal: Short MA crosses above Long MA
    if (previousShortMA <= previousLongMA && currentShortMA > currentLongMA) {
      return {
        symbol,
        action: 'buy',
        price: currentPrice,
        quantity: calculatePositionSize(strategy, currentPrice),
        metadata: {
          strategy: strategy.type,
          shortMA: currentShortMA,
          longMA: currentLongMA
        }
      };
    }
    
    // Sell signal: Short MA crosses below Long MA
    if (previousShortMA >= previousLongMA && currentShortMA < currentLongMA) {
      return {
        symbol,
        action: 'sell',
        price: currentPrice,
        quantity: calculatePositionSize(strategy, currentPrice),
        metadata: {
          strategy: strategy.type,
          shortMA: currentShortMA,
          longMA: currentLongMA
        }
      };
    }
  }
  
  // Add other strategy types here
  
  return null; // No signal generated
}

/**
 * Calculate position size based on strategy rules
 * @param {Object} strategy - Bot strategy configuration
 * @param {Number} currentPrice - Current asset price
 * @returns {Number} - Position size
 */
function calculatePositionSize(strategy, currentPrice) {
  // Default to a fixed quantity if not specified
  if (strategy.positionSizing === 'fixed') {
    return strategy.quantity || 1;
  }
  
  // Position sizing based on percentage of portfolio
  if (strategy.positionSizing === 'percent') {
    // This would require fetching account balance in a real implementation
    const accountValue = 10000; // Placeholder
    const allocationAmount = accountValue * (strategy.allocationPercent / 100);
    return Math.floor(allocationAmount / currentPrice);
  }
  
  // Default fallback
  return 1;
}

/**
 * Execute a trade based on a signal
 * @param {Object} bot - Bot configuration
 * @param {Object} signal - Trading signal
 * @returns {Promise} - Trade execution result
 */
async function executeTrade(bot, signal) {
  try {
    // Check if bot has permission to trade
    if (!bot.permissions.canTrade) {
      return { executed: false, reason: 'Bot does not have trading permission' };
    }
    
    // Create order parameters
    const orderParams = {
      symbol: signal.symbol,
      qty: signal.quantity,
      side: signal.action,
      type: bot.orderType || 'market',
      time_in_force: bot.timeInForce || 'day'
    };
    
    // Add limit price if applicable
    if (bot.orderType === 'limit' && signal.price) {
      orderParams.limit_price = signal.price;
    }
    
    // Place the order
    const order = await alpacaService.orderService.createOrder(orderParams);
    
    return {
      executed: true,
      order,
      signal
    };
  } catch (error) {
    logger.error(`Error executing trade for bot ${bot._id}:`, error);
    return {
      executed: false,
      error: error.message,
      signal
    };
  }
}

/**
 * Simulate strategy execution on historical data for backtesting
 * @param {Object} bot - Bot configuration
 * @param {Object} historicalData - Historical price data
 * @returns {Array} - Simulated trades
 */
function simulateStrategyOnHistoricalData(bot, historicalData) {
  const trades = [];
  let position = null;
  
  // Process each historical data point
  for (let i = bot.strategy.lookbackPeriod; i < historicalData.length; i++) {
    const dataSlice = historicalData.slice(i - bot.strategy.lookbackPeriod, i);
    
    // Extract price data
    const prices = extractPriceData(dataSlice);
    
    // Apply indicators
    const indicatorResults = {};
    for (const indicator of bot.strategy.indicators) {
      indicatorResults[indicator.name] = indicatorService.calculateIndicator(
        indicator.name,
        prices,
        indicator.params
      );
    }
    
    // Apply strategy rules
    const signal = applyStrategyRules(
      bot.strategy,
      indicatorResults,
      prices,
      bot.watchlist[0] // Using first symbol for simplicity
    );
    
    if (signal) {
      // Process the signal
      if (signal.action === 'buy' && !position) {
        position = {
          entryPrice: signal.price,
          quantity: signal.quantity,
          entryDate: prices.timestamp[prices.timestamp.length - 1]
        };
      } else if (signal.action === 'sell' && position) {
        const trade = {
          symbol: signal.symbol,
          entry: {
            price: position.entryPrice,
            date: position.entryDate,
            quantity: position.quantity
          },
          exit: {
            price: signal.price,
            date: prices.timestamp[prices.timestamp.length - 1],
            quantity: signal.quantity
          },
          profit: (signal.price - position.entryPrice) * position.quantity,
          profitPercent: ((signal.price / position.entryPrice) - 1) * 100
        };
        
        trades.push(trade);
        position = null;
      }
    }
  }
  
  return trades;
}

/**
 * Calculate performance metrics for backtest results
 * @param {Object} results - Backtest results
 */
function calculatePerformanceMetrics(results) {
  let currentBalance = results.performance.startBalance;
  let maxBalance = currentBalance;
  let minBalance = currentBalance;
  let wins = 0;
  
  // Process each trade
  for (const trade of results.trades) {
    currentBalance += trade.profit;
    
    if (trade.profit > 0) wins++;
    
    maxBalance = Math.max(maxBalance, currentBalance);
    minBalance = Math.min(minBalance, currentBalance);
  }
  
  // Calculate metrics
  results.performance.endBalance = currentBalance;
  results.performance.totalReturn = ((currentBalance / results.performance.startBalance) - 1) * 100;
  results.performance.maxDrawdown = ((maxBalance - minBalance) / maxBalance) * 100;
  results.performance.winRate = results.trades.length > 0 ? (wins / results.trades.length) * 100 : 0;
}

module.exports = {
  ...botManagement,
  ...botExecution
};
