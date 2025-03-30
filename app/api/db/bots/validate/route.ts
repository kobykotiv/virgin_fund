import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Bot, BotValidation } from '@/types/bot'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const botData = await request.json()
    
    // Validate the bot strategy
    const validation = validateBotStrategy(botData)
    
    return NextResponse.json(validation)
  } catch (error) {
    console.error('Error validating bot:', error)
    return NextResponse.json({ 
      isValid: false,
      errors: ["Failed to validate bot configuration"],
      warnings: [],
      suggestions: []
    }, { status: 500 })
  }
}

function validateBotStrategy(botData: Partial<Bot>): BotValidation {
  const errors: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []
  
  // Basic validation - these would be errors
  if (!botData.name || botData.name.trim() === '') {
    errors.push("Bot name is required")
  }
  
  if (!botData.assets || botData.assets.length === 0) {
    errors.push("At least one asset must be selected")
  }
  
  // Type-specific validation
  if (botData.type === 'indicator') {
    if (!botData.indicatorConfig) {
      errors.push("Indicator configuration is required")
    } else {
      // RSI specific validations
      if (botData.indicatorConfig.type === 'rsi') {
        // Warn if entry/exit thresholds are too close
        if (Math.abs(botData.indicatorConfig.entryThreshold - botData.indicatorConfig.exitThreshold) < 20) {
          warnings.push("Entry and exit thresholds are very close. Consider a wider range for better results.")
        }
        
        // Suggest if thresholds are not in optimal range
        if (botData.indicatorConfig.entryThreshold > 30) {
          suggestions.push("For RSI, entry threshold values below 30 typically indicate oversold conditions.")
        }
        
        if (botData.indicatorConfig.exitThreshold < 70) {
          suggestions.push("For RSI, exit threshold values above 70 typically indicate overbought conditions.")
        }
      }
      
      // Common timeframe suggestion
      if (['1min', '5min'].includes(botData.indicatorConfig.timeframe)) {
        warnings.push("Short timeframes can lead to many false signals. Consider using longer timeframes for more reliable signals.")
      }
    }
  } else if (botData.type === 'grid') {
    if (!botData.gridConfig) {
      errors.push("Grid configuration is required")
    } else {
      // Grid specific validations
      if (botData.gridConfig.gridSize < 0.5) {
        warnings.push("Grid size is very small. This may result in frequent trades and high fees.")
      }
      
      if (botData.gridConfig.upperLimit <= botData.gridConfig.lowerLimit) {
        errors.push("Upper price limit must be greater than lower price limit")
      }
      
      // Calculate number of grid levels
      const gridLevels = Math.ceil((botData.gridConfig.upperLimit - botData.gridConfig.lowerLimit) / 
        (botData.gridConfig.lowerLimit * (botData.gridConfig.gridSize / 100)))
      
      if (gridLevels > 20) {
        suggestions.push(`Current settings create approximately ${gridLevels} grid levels. Consider fewer levels for easier management.`)
      }
    }
  } else if (botData.type === 'dca') {
    if (!botData.dcaConfig) {
      errors.push("DCA configuration is required")
    } else {
      // DCA specific validations
      if (botData.dcaConfig.amount <= 0) {
        errors.push("Purchase amount must be greater than zero")
      }
      
      // Suggestion for larger DCA amounts
      if (botData.dcaConfig.amount < 50) {
        suggestions.push("Consider a larger purchase amount to reduce the impact of fixed fees on your returns.")
      }
    }
  } else if (botData.type === 'basket') {
    if (!botData.basketConfig) {
      errors.push("Basket configuration is required")
    } else {
      // Basket specific validations
      const totalAllocation = Object.values(botData.basketConfig.targetAllocation).reduce((sum, val) => sum + val, 0)
      
      if (Math.abs(totalAllocation - 1) > 0.001) {
        errors.push("Total allocation must equal 100% (1.0)")
      }
      
      // Too many assets warning
      const assetCount = Object.keys(botData.basketConfig.targetAllocation).length
      if (assetCount > 10) {
        warnings.push(`Your basket contains ${assetCount} assets. Consider reducing for easier management.`)
      }
      
      // Check for too small allocations
      const smallAllocations = Object.entries(botData.basketConfig.targetAllocation)
        .filter(([_, val]) => val < 0.05)
        .map(([symbol]) => symbol)
      
      if (smallAllocations.length > 0) {
        suggestions.push(`Some allocations (${smallAllocations.join(', ')}) are below 5%. Consider allocating more or removing them.`)
      }
    }
  }
  
  // General risk management suggestions
  if (!botData.stopLoss && !botData.takeProfit) {
    suggestions.push("Consider adding stop-loss and take-profit levels for better risk management.")
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  }
}
