export interface ExitStrategy {
  type: "take_profit" | "stop_loss" | "trailing_stop" | "time_based" | "custom"
  parameters: {
    [key: string]: any
    value: number
    unit: "percentage" | "fixed" | "pips"
    trailingDistance?: number
    timeFrame?: string
    customCondition?: string
  }
}

export interface BotConfig {
  signals: any[]
  conditions: any[]
  actions: any[]
  exitStrategies: ExitStrategy[]
  riskManagement: {
    maxPositionSize: number
    stopLoss?: number
    takeProfit?: number
    maxDrawdown?: number
    trailingStop?: boolean
    trailingStopDistance?: number
    maxOpenTrades?: number
    leverageEnabled?: boolean
    maxLeverage?: number
    marginCallLevel?: number
    rebalanceThreshold?: number
  }
}

// Bot Prototype
export abstract class TradingBot {
  protected name: string = ""
  protected type: string = ""
  protected config: BotConfig = {
    signals: [],
    conditions: [],
    actions: [],
    exitStrategies: [],
    riskManagement: {
      maxPositionSize: 5,
    },
  }

  abstract validate(): boolean
  abstract clone(): TradingBot

  setName(name: string): void {
    this.name = name
  }

  setType(type: string): void {
    this.type = type
  }

  addSignal(signal: any): void {
    this.config.signals.push(signal)
  }

  addCondition(condition: any): void {
    this.config.conditions.push(condition)
  }

  addAction(action: any): void {
    this.config.actions.push(action)
  }

  addExitStrategy(strategy: ExitStrategy): void {
    this.config.exitStrategies.push(strategy)
  }

  setRiskManagement(riskManagement: Partial<BotConfig["riskManagement"]>): void {
    this.config.riskManagement = {
      ...this.config.riskManagement,
      ...riskManagement,
    }
  }

  getConfig(): BotConfig {
    return this.config
  }
}

// Concrete Bot Types
export class IndicatorBot extends TradingBot {
  validate(): boolean {
    return this.config.signals.length > 0 && this.config.conditions.length > 0
  }

  clone(): TradingBot {
    const clone = new IndicatorBot()
    clone.setName(this.name)
    clone.setType(this.type)
    clone.config = JSON.parse(JSON.stringify(this.config))
    return clone
  }
}

export class GridBot extends TradingBot {
  validate(): boolean {
    return this.config.actions.some(action => 
      action.type === "LIMIT_BUY" || action.type === "LIMIT_SELL"
    )
  }

  clone(): TradingBot {
    const clone = new GridBot()
    clone.setName(this.name)
    clone.setType(this.type)
    clone.config = JSON.parse(JSON.stringify(this.config))
    return clone
  }
}

export class DCABot extends TradingBot {
  validate(): boolean {
    return this.config.actions.some(action => action.type === "MARKET_BUY")
  }

  clone(): TradingBot {
    const clone = new DCABot()
    clone.setName(this.name)
    clone.setType(this.type)
    clone.config = JSON.parse(JSON.stringify(this.config))
    return clone
  }
}

export class BasketBot extends TradingBot {
  validate(): boolean {
    return this.config.actions.length > 0
  }

  clone(): TradingBot {
    const clone = new BasketBot()
    clone.setName(this.name)
    clone.setType(this.type)
    clone.config = JSON.parse(JSON.stringify(this.config))
    return clone
  }
}

// Bot Builder
export class TradingBotBuilder {
  private bot: TradingBot

  constructor(type: string) {
    switch (type) {
      case "indicator":
        this.bot = new IndicatorBot()
        break
      case "grid":
        this.bot = new GridBot()
        break
      case "dca":
        this.bot = new DCABot()
        break
      case "basket":
        this.bot = new BasketBot()
        break
      default:
        throw new Error(`Invalid bot type: ${type}`)
    }
    this.bot.setType(type)
  }

  withName(name: string): TradingBotBuilder {
    this.bot.setName(name)
    return this
  }

  withSignal(signal: any): TradingBotBuilder {
    this.bot.addSignal(signal)
    return this
  }

  withCondition(condition: any): TradingBotBuilder {
    this.bot.addCondition(condition)
    return this
  }

  withAction(action: any): TradingBotBuilder {
    this.bot.addAction(action)
    return this
  }

  withExitStrategy(strategy: ExitStrategy): TradingBotBuilder {
    this.bot.addExitStrategy(strategy)
    return this
  }

  withRiskManagement(riskManagement: Partial<BotConfig["riskManagement"]>): TradingBotBuilder {
    this.bot.setRiskManagement(riskManagement)
    return this
  }

  build(): TradingBot {
    if (!this.bot.validate()) {
      throw new Error("Invalid bot configuration")
    }
    return this.bot.clone()
  }
}