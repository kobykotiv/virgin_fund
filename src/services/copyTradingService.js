/**
 * Copy Trading Service
 * Handles copy trading functionality including following traders and copying trades
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Trade = require('../models/Trade');
const Signal = require('../models/Signal');
const alpacaService = require('./alpaca');
const logger = require('../utils/logger');

/**
 * Subscription management
 */
const subscriptionManagement = {
  /**
   * Subscribe to a signal provider
   * @param {String} followerId - ID of the follower
   * @param {String} providerId - ID of the signal provider
   * @param {Object} settings - Subscription settings
   * @returns {Promise} - Subscription details
   */
  subscribe: async (followerId, providerId, settings) => {
    try {
      // Check if user is trying to follow themselves
      if (followerId === providerId) {
        throw new Error('You cannot follow yourself');
      }
      
      // Check if subscription already exists
      const existingSubscription = await Subscription.findOne({
        follower: followerId,
        provider: providerId
      });
      
      if (existingSubscription) {
        throw new Error('You are already following this provider');
      }
      
      // Create new subscription
      const subscription = new Subscription({
        follower: followerId,
        provider: providerId,
        settings: {
          active: true,
          allocationPercentage: settings.allocationPercentage || 10,
          maxRiskPerTrade: settings.maxRiskPerTrade || 2,
          enableStopLoss: settings.enableStopLoss || true,
          stopLossPercentage: settings.stopLossPercentage || 5,
          enableTakeProfit: settings.enableTakeProfit || false,
          takeProfitPercentage: settings.takeProfitPercentage || 10
        },
        startDate: new Date()
      });
      
      await subscription.save();
      
      // Update provider's followers count
      await User.findByIdAndUpdate(providerId, {
        $inc: { followersCount: 1 }
      });
      
      return subscription;
    } catch (error) {
      logger.error(`Error subscribing to provider ${providerId}:`, error);
      throw error;
    }
  },

  /**
   * Unsubscribe from a signal provider
   * @param {String} followerId - ID of the follower
   * @param {String} providerId - ID of the signal provider
   * @returns {Promise} - Unsubscription result
   */
  unsubscribe: async (followerId, providerId) => {
    try {
      // Find and delete subscription
      const result = await Subscription.deleteOne({
        follower: followerId,
        provider: providerId
      });
      
      if (result.deletedCount === 0) {
        throw new Error('Subscription not found');
      }
      
      // Update provider's followers count
      await User.findByIdAndUpdate(providerId, {
        $inc: { followersCount: -1 }
      });
      
      return { success: true, message: 'Unsubscribed successfully' };
    } catch (error) {
      logger.error(`Error unsubscribing from provider ${providerId}:`, error);
      throw error;
    }
  },

  /**
   * Update subscription settings
   * @param {String} subscriptionId - ID of the subscription
   * @param {String} followerId - ID of the follower
   * @param {Object} newSettings - Updated settings
   * @returns {Promise} - Updated subscription
   */
  updateSubscriptionSettings: async (subscriptionId, followerId, newSettings) => {
    try {
      // Find subscription
      const subscription = await Subscription.findOne({
        _id: subscriptionId,
        follower: followerId
      });
      
      if (!subscription) {
        throw new Error('Subscription not found or you do not have permission to update it');
      }
      
      // Update settings
      subscription.settings = {
        ...subscription.settings,
        ...newSettings
      };
      
      subscription.updatedAt = new Date();
      return await subscription.save();
    } catch (error) {
      logger.error(`Error updating subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  /**
   * Get all providers a user is following
   * @param {String} followerId - ID of the follower
   * @returns {Promise} - List of subscriptions
   */
  getFollowingProviders: async (followerId) => {
    try {
      return await Subscription.find({ follower: followerId })
        .populate('provider', 'username email profileImage performance');
    } catch (error) {
      logger.error(`Error fetching followed providers for user ${followerId}:`, error);
      throw error;
    }
  },

  /**
   * Get all followers of a provider
   * @param {String} providerId - ID of the provider
   * @returns {Promise} - List of followers
   */
  getProviderFollowers: async (providerId) => {
    try {
      return await Subscription.find({ provider: providerId })
        .populate('follower', 'username email profileImage');
    } catch (error) {
      logger.error(`Error fetching followers for provider ${providerId}:`, error);
      throw error;
    }
  }
};

/**
 * Signal copying and execution
 */
const tradeCopying = {
  /**
   * Process a new signal from a provider and copy to followers
   * @param {Object} signal - Trading signal
   * @param {String} providerId - ID of the signal provider
   * @returns {Promise} - Processing results
   */
  processProviderSignal: async (signal, providerId) => {
    try {
      logger.info(`Processing signal from provider ${providerId} for ${signal.symbol}`);
      
      // Find all active followers
      const activeSubscriptions = await Subscription.find({
        provider: providerId,
        'settings.active': true
      });
      
      logger.info(`Found ${activeSubscriptions.length} active followers`);
      
      const results = [];
      
      // Process for each follower
      for (const subscription of activeSubscriptions) {
        try {
          // Scale the trade based on follower settings
          const scaledSignal = scaleSignalForFollower(signal, subscription.settings);
          
          // Execute the trade for the follower
          const result = await executeFollowerTrade(subscription.follower, scaledSignal);
          
          results.push({
            followerId: subscription.follower,
            signal: scaledSignal,
            result
          });
        } catch (error) {
          logger.error(`Error processing signal for follower ${subscription.follower}:`, error);
          results.push({
            followerId: subscription.follower,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      logger.error(`Error processing provider signal:`, error);
      throw error;
    }
  },

  /**
   * Get copy trading performance for a user
   * @param {String} userId - User ID
   * @returns {Promise} - Performance metrics
   */
  getCopyTradingPerformance: async (userId) => {
    try {
      // Get all copied trades
      const trades = await Trade.find({
        user: userId,
        copyTraded: true
      });
      
      // Calculate performance metrics
      const performance = calculatePerformanceMetrics(trades);
      
      return {
        tradeCount: trades.length,
        performance
      };
    } catch (error) {
      logger.error(`Error getting copy trading performance for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get all copied trades for a user
   * @param {String} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise} - List of copied trades
   */
  getCopiedTrades: async (userId, filters = {}) => {
    try {
      const query = {
        user: userId,
        copyTraded: true
      };
      
      // Apply additional filters
      if (filters.provider) {
        query.provider = filters.provider;
      }
      
      if (filters.symbol) {
        query.symbol = filters.symbol;
      }
      
      if (filters.startDate && filters.endDate) {
        query.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }
      
      return await Trade.find(query)
        .populate('provider', 'username email')
        .sort({ createdAt: -1 });
    } catch (error) {
      logger.error(`Error fetching copied trades for user ${userId}:`, error);
      throw error;
    }
  }
};

/**
 * Helper Functions
 */

/**
 * Scale a signal based on follower's settings
 * @param {Object} signal - Original signal
 * @param {Object} settings - Follower's subscription settings
 * @returns {Object} - Scaled signal
 */
function scaleSignalForFollower(signal, settings) {
  // Clone the signal
  const scaledSignal = { ...signal };
  
  // Scale quantity based on allocation percentage
  scaledSignal.quantity = Math.floor(signal.quantity * (settings.allocationPercentage / 100));
  
  // Ensure at least 1 quantity
  if (scaledSignal.quantity < 1) {
    scaledSignal.quantity = 1;
  }
  
  // Add stop loss if enabled
  if (settings.enableStopLoss) {
    if (signal.action === 'buy') {
      scaledSignal.stopPrice = signal.price * (1 - settings.stopLossPercentage / 100);
    } else {
      scaledSignal.stopPrice = signal.price * (1 + settings.stopLossPercentage / 100);
    }
  }
  
  // Add take profit if enabled
  if (settings.enableTakeProfit) {
    if (signal.action === 'buy') {
      scaledSignal.takeProfitPrice = signal.price * (1 + settings.takeProfitPercentage / 100);
    } else {
      scaledSignal.takeProfitPrice = signal.price * (1 - settings.takeProfitPercentage / 100);
    }
  }
  
  return scaledSignal;
}

/**
 * Execute a trade for a follower based on a signal
 * @param {String} followerId - Follower's user ID
 * @param {Object} signal - Trading signal
 * @returns {Promise} - Trade execution result
 */
async function executeFollowerTrade(followerId, signal) {
  try {
    // Create order parameters
    const orderParams = {
      symbol: signal.symbol,
      qty: signal.quantity,
      side: signal.action,
      type: 'market',
      time_in_force: 'day'
    };
    
    // Add stop loss if specified
    if (signal.stopPrice) {
      orderParams.stop_price = signal.stopPrice;
      orderParams.type = 'stop';
    }
    
    // Add take profit in a separate order if needed
    let takeProfitOrder = null;
    if (signal.takeProfitPrice) {
      // We'll place this after the main order is executed
    }
    
    // Place the order
    const order = await alpacaService.orderService.createOrder(orderParams);
    
    // Create a trade record
    const trade = new Trade({
      user: followerId,
      provider: signal.provider,
      symbol: signal.symbol,
      action: signal.action,
      quantity: signal.quantity,
      price: signal.price,
      orderType: orderParams.type,
      orderStatus: 'filled', // Assuming immediate fill for simplicity
      orderId: order.id,
      copyTraded: true,
      metadata: {
        originalSignal: signal.metadata,
        stopPrice: signal.stopPrice,
        takeProfitPrice: signal.takeProfitPrice
      },
      createdAt: new Date()
    });
    
    await trade.save();
    
    // Place take profit order if specified
    if (signal.takeProfitPrice) {
      const tpOrderParams = {
        symbol: signal.symbol,
        qty: signal.quantity,
        side: signal.action === 'buy' ? 'sell' : 'buy', // Opposite of original action
        type: 'limit',
        time_in_force: 'gtc',
        limit_price: signal.takeProfitPrice
      };
      
      takeProfitOrder = await alpacaService.orderService.createOrder(tpOrderParams);
    }
    
    return {
      success: true,
      order,
      takeProfitOrder,
      trade: trade._id
    };
  } catch (error) {
    logger.error(`Error executing trade for follower ${followerId}:`, error);
    throw error;
  }
}

/**
 * Calculate performance metrics from trades
 * @param {Array} trades - List of trades
 * @returns {Object} - Performance metrics
 */
function calculatePerformanceMetrics(trades) {
  if (trades.length === 0) {
    return {
      totalPnL: 0,
      winRate: 0,
      averageProfit: 0,
      averageLoss: 0,
      profitFactor: 0
    };
  }
  
  let totalPnL = 0;
  let wins = 0;
  let losses = 0;
  let totalProfit = 0;
  let totalLoss = 0;
  
  for (const trade of trades) {
    const pnl = trade.pnl || 0;
    totalPnL += pnl;
    
    if (pnl > 0) {
      wins++;
      totalProfit += pnl;
    } else if (pnl < 0) {
      losses++;
      totalLoss += Math.abs(pnl);
    }
  }
  
  const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
  const averageProfit = wins > 0 ? totalProfit / wins : 0;
  const averageLoss = losses > 0 ? totalLoss / losses : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  
  return {
    totalPnL,
    winRate,
    averageProfit,
    averageLoss,
    profitFactor
  };
}

module.exports = {
  ...subscriptionManagement,
  ...tradeCopying
};
