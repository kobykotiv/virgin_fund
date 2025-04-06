import type { Portfolio } from "@/types/portfolio"

export async function fetchPortfolio(): Promise<Portfolio> {
  // This would be an actual API call in production
  // Using mock data for development
  return {
    id: "general",
    name: "$10M Portfolio",
    focus: "General trading with a large portfolio",
    icon: "DollarSign",
    tags: ["Stocks", "Balanced"],
    risk: "Moderate",
    value: 10245320,
    return: 8.2,
    returnClass: "text-green-500",
    chartVariant: "default",
    allocation: [
      { name: "Stocks", value: 45, color: "#4f46e5" },
      { name: "Bonds", value: 30, color: "#10b981" },
      { name: "Cash", value: 15, color: "#f59e0b" },
      { name: "Crypto", value: 10, color: "#8b5cf6" }
    ],
    positions: [
      {
        id: "pos1",
        assetType: "stock",
        ticker: "AAPL",
        quantity: 1000,
        avgPrice: 150,
        currentPrice: 160,
        basket: null,
        trades: [
          {
            tradeId: "trade1",
            action: "BUY",
            side: "LONG",
            quantity: 1000,
            price: 150,
            datetime: "2025-03-20T14:30:00Z"
          }
        ]
      },
      {
        id: "pos2",
        assetType: "basket",
        name: "Tech Giants",
        positions: [
          {
            id: "pos2a",
            assetType: "stock",
            ticker: "GOOGL",
            quantity: 500,
            avgPrice: 2000,
            currentPrice: 2050,
            basket: null,
            trades: [
              {
                tradeId: "trade2",
                action: "BUY",
                side: "LONG",
                quantity: 500,
                price: 2000,
                datetime: "2025-03-18T10:15:00Z"
              }
            ]
          {
            id: "pos2b",
            assetType: "stock",
            ticker: "MSFT",
            quantity: 600,
            avgPrice: 250,
            currentPrice: 255,
            basket: null,
            trades: [
              {
                tradeId: "trade3",
                action: "BUY",
                side: "LONG",
                quantity: 600,
                price: 250,
                datetime: "2025-03-18T10:20:00Z"
              }
            ]
          }
          }
        ]
      },
      {
        id: "pos3",
        assetType: "crypto",
        ticker: "BTC",
        quantity: 20,
        avgPrice: 30000,
        currentPrice: 35000,
        basket: null,
        trades: [
          {
            tradeId: "trade4",
            action: "BUY",
            side: "LONG",
            quantity: 20,
            price: 30000,
            datetime: "2025-03-15T09:45:00Z"
          }
        ]
      }
    ]
  }
}
