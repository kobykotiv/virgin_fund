import { BasePosition, Portfolio } from "@/types/portfolio"
import { DollarSign, Bitcoin, Signal, Grid, BarChart2Icon, Cpu } from "lucide-react"

export const portfolios: Portfolio[] = [
  {
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
          },
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
        ]
      }
    ]
  },
  {
    id: "crypto",
    name: "Crypto Trading",
    focus: "High volatility crypto portfolio",
    icon: "Bitcoin",
    tags: ["Crypto", "High Growth"],
    risk: "High",
    value: 15782910,
    return: 22.7,
    returnClass: "text-green-500",
    chartVariant: "crypto",
    allocation: [
      { name: "Bitcoin", value: 40, color: "#f7931a" },
      { name: "Ethereum", value: 30, color: "#627eea" },
      { name: "Solana", value: 15, color: "#00ffbd" },
      { name: "Others", value: 15, color: "#8b5cf6" }
    ],
    positions: [
      {
        id: "pos1",
        assetType: "crypto",
        ticker: "BTC",
        quantity: 100,
        avgPrice: 35000,
        currentPrice: 42000,
        basket: null,
        trades: [
          {
            tradeId: "trade1",
            action: "BUY",
            side: "LONG",
            quantity: 100,
            price: 35000,
            datetime: "2025-03-15T09:45:00Z"
          }
        ]
      },
      {
        id: "pos2",
        assetType: "crypto",
        ticker: "ETH",
        quantity: 1000,
        avgPrice: 2000,
        currentPrice: 2500,
        basket: null,
        trades: [
          {
            tradeId: "trade2",
            action: "BUY",
            side: "LONG",
            quantity: 1000,
            price: 2000,
            datetime: "2025-03-15T10:00:00Z"
          }
        ]
      }
    ]
  }
  // ... Add other portfolios following the same pattern
,
{
    id: "algorithmic",
    name: "Algo Trading",
    focus: "Automated high-frequency trading",
    icon: "Cpu",
    tags: ["Automated", "High Frequency"],
    risk: "High",
    value: 5431890,
    return: -4.2,
    returnClass: "text-red-500",
    chartVariant: "algo",
    allocation: [
      { name: "Futures", value: 50, color: "#dc2626" },
      { name: "Options", value: 30, color: "#2563eb" },
      { name: "Stocks", value: 20, color: "#059669" }
    ],
    positions: [
      {
        id: "pos1",
        assetType: "basket",
        ticker: "ES",
        quantity: 10,
        avgPrice: 4500,
        currentPrice: 4480,
        basket: null,
        trades: [
          {
            tradeId: "trade1",
            action: "BUY",
            side: "LONG",
            quantity: 10,
            price: 4500,
            datetime: "2025-03-21T09:00:00Z"
          }
        ]
      }
    ]
},
{
    id: "grid",
    name: "Grid Trading",
    focus: "Grid trading strategy for crypto",
    icon: "Grid",
    tags: ["Crypto", "Grid"],
    risk: "Moderate",
    value: 7894561,
    return: 12.5,
    returnClass: "text-green-500",
    chartVariant: "grid",
    allocation: [
      { name: "BTC", value: 60, color: "#f7931a" },
      { name: "ETH", value: 40, color: "#627eea" }
    ],
    positions: [
      {
        id: "pos1",
        assetType: "crypto",
        ticker: "BTC",
        quantity: 2,
        avgPrice: 248,
        currentPrice: 78000,
        basket: null,
        trades: [
          {
            tradeId: "trade1",
            action: "BUY",
            side: "LONG",
            quantity: 1,
            price: 30000,
            datetime: "2025-03-22T10:00:00Z"
          }
        ]
      }
    ]
},
{
    id: "indicator",
    name: "Indicator-Based Trading",
    focus: "Trading based on technical indicators",
    icon: "Signal",
    tags: ["Stocks", "Indicators"],
    risk: "Moderate",
    value: 4567890,
    return: 7.8,
    returnClass: "text-green-500",
    chartVariant: "indicator",
    allocation: [
      { name: "Stocks", value: 70, color: "#4f46e5" },
      { name: "Bonds", value: 30, color: "#10b981" }
    ],
    positions: [
      {
        id: "pos1",
        assetType: "stock",
        ticker: "AAPL",
        quantity: 50,
        avgPrice: 150,
        currentPrice: 155,
        basket: null,
        trades: [
            {
                tradeId: "trade1",
                action: "BUY",
                side: "LONG",
                quantity: 50,
                price: 150,
                datetime: "2025-03-23T11:00:00Z"
                    }
                ]
            }
        ]
    },
    {
        id: "pos2",
        assetType: "stock",
        ticker: "MSFT",
        quantity: 30,
        avgPrice: 250,
        currentPrice: 260,
        basket: null,
        trades: [
            {
                tradeId: "trade2",
                action: "BUY",
                side: "LONG",
                quantity: 30,
                price: 250,
                datetime: "2025-03-23T11:30:00Z"
            }
        ]
    }
]

export interface Portfolio {
  id: string;
  name: string;
  focus: string;
  icon: string;
  tags: string[];
  risk: string;
  value: number;
  return: number;
  returnClass: string;
  chartVariant: string;
  allocation: { name: string; value: number; color: string }[];
  positions: BasePosition[];
}


