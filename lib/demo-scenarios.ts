import { Portfolio } from "@/types/portfolio"
import { DollarSign } from "lucide-react"

export const DEMO_SCENARIOS: Record<string, Portfolio> = {
  general: {
    id: "general",
    name: "$10M Portfolio",
    focus: "General trading with a large portfolio",
    icon: DollarSign,
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
      // ...remaining positions from the schema
    ]
  },
  // Add other scenarios following the same pattern
}

