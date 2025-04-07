export const STOCK_UNIVERSE = {
  tech_large_cap: ["AAPL", "MSFT", "GOOGL", "META", "NVDA", "ADBE", "CRM", "INTC", "CSCO", "AMD"],
  finance: ["JPM", "BAC", "WFC", "GS", "MS", "BLK", "V", "MA", "AXP", "C"],
  healthcare: ["JNJ", "UNH", "PFE", "MRK", "ABT", "TMO", "DHR", "BMY", "AMGN", "LLY"],
  consumer: ["AMZN", "WMT", "PG", "KO", "PEP", "COST", "MCD", "NKE", "SBUX", "TGT"],
  industrial: ["GE", "HON", "UPS", "BA", "CAT", "DE", "MMM", "LMT", "RTX", "UNP"],
  energy: ["XOM", "CVX", "COP", "SLB", "EOG", "PXD", "MPC", "PSX", "VLO", "KMI"],
  etfs: ["SPY", "QQQ", "DIA", "IWM", "VTI", "VOO", "VGT", "XLK", "XLF", "XLV"],
  crypto_related: ["COIN", "MSTR", "RIOT", "MARA", "SI", "BITF", "HUT", "BTBT"],
  growth: ["TSLA", "PLTR", "SNOW", "DDOG", "NET", "CRWD", "ZS", "DASH", "ABNB", "U"],
  dividend: ["VZ", "T", "IBM", "PM", "MO", "O", "ABBV", "XOM", "CVX", "ED"]
} as const

export const SECTORS = [
  "Technology", "Financial Services", "Healthcare", "Consumer", 
  "Industrial", "Energy", "ETFs", "Crypto", "Growth", "Value"
] as const

export type Sector = typeof SECTORS[number]

export const SECTOR_THEMES = {
  "Conservative Income": { sectors: ["Value", "Consumer", "Healthcare"], risk: "Low" },
  "Growth & Tech": { sectors: ["Technology", "Growth", "Consumer"], risk: "High" },
  "Balanced Mix": { sectors: ["Financial Services", "Industrial", "Healthcare"], risk: "Moderate" },
  "Crypto & Tech": { sectors: ["Technology", "Crypto", "Growth"], risk: "High" },
  "Blue Chip": { sectors: ["Value", "Financial Services", "Consumer"], risk: "Low" },
  "Market ETFs": { sectors: ["ETFs", "Value", "Growth"], risk: "Moderate" }
} as const
