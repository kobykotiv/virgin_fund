import type { Strategy } from "@/types/strategy";
import { validateTicker } from "../search";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export async function validateStrategyParams(strategy: Partial<Strategy>): Promise<ValidationResult> {
  const errors: string[] = [];

  // Required fields
  if (!strategy.name) {
    errors.push("Strategy name is required");
  }

  if (!strategy.selectedAssets || strategy.selectedAssets.length === 0) {
    errors.push("Select at least one asset");
  }

  // Validate tickers
  if (strategy.tickers && strategy.tickers.length > 0) {
    for (const ticker of strategy.tickers) {
      try {
        const isValid = await validateTicker(ticker);
        if (!isValid) {
          errors.push(`Invalid ticker: ${ticker}`);
        }
      } catch (error) {
        errors.push(`Error validating ticker ${ticker}`);
      }
    }
  }

  // DCA specific validations
  if (strategy.strategyType === "DCA") {
    if (!strategy.frequency) {
      errors.push("Investment frequency is required for DCA strategy");
    }

    if (strategy.strategyConfig?.investmentAmount <= 0) {
      errors.push("Investment amount must be greater than 0");
    }

    if (strategy.rebalanceThreshold && 
        (strategy.rebalanceThreshold < 0 || strategy.rebalanceThreshold > 100)) {
      errors.push("Rebalance threshold must be between 0 and 100");
    }
  }

  // Risk management validations
  if (strategy.riskManagement) {
    const { stopLoss, takeProfit, trailingStop, positionSize } = strategy.riskManagement;

    if (stopLoss < 0 || stopLoss > 100) {
      errors.push("Stop loss must be between 0 and 100");
    }

    if (takeProfit < 0) {
      errors.push("Take profit must be greater than 0");
    }

    if (trailingStop !== undefined && (trailingStop < 0 || trailingStop > 100)) {
      errors.push("Trailing stop must be between 0 and 100");
    }

    if (positionSize < 0 || positionSize > 100) {
      errors.push("Position size must be between 0 and 100");
    }
  } else {
    errors.push("Risk management parameters are required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function prepareStrategyParams(strategy: Partial<Strategy>): Partial<Strategy> {
  return {
    ...strategy,
    // Extract tickers from selected assets if not already present
    tickers: strategy.tickers || strategy.selectedAssets?.map(asset => asset.symbol) || [],
    
    // Ensure strategy type defaults to DCA
    strategyType: strategy.strategyType || "DCA",
    
    // Set default values for DCA configuration
    frequency: strategy.frequency || "monthly",
    rebalanceFrequency: strategy.rebalanceFrequency || "monthly",
    rebalanceThreshold: strategy.rebalanceThreshold ?? 5,
    
    // Ensure strategy config exists with default investment amount
    strategyConfig: {
      ...strategy.strategyConfig,
      investmentAmount: strategy.strategyConfig?.investmentAmount || 1000,
    },
    
    // Set default risk management parameters if not provided
    riskManagement: {
      stopLoss: strategy.riskManagement?.stopLoss ?? 10,
      takeProfit: strategy.riskManagement?.takeProfit ?? 20,
      trailingStop: strategy.riskManagement?.trailingStop ?? 5,
      positionSize: strategy.riskManagement?.positionSize ?? 5,
    }
  };
}
