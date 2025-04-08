import { Portfolio } from "@/types/portfolio"
import {
  RocketIcon,
  DollarSignIcon,
  AwardIcon,
  TrendingUpIcon,
  LeafIcon,
  BitcoinIcon,
  BrainIcon,
  ActivityIcon,
//   BalanceIcon,
  UtensilsIcon,
  ShoppingCartIcon,
  CloudIcon,
  HomeIcon,
  GlobeIcon,
  HeadsetIcon,
  ShipIcon,
  CrownIcon,
  Globe2Icon,
  UsersIcon,
//   TrendingIcon,
  BarChartIcon,
  BatteryIcon,
  ShieldIcon,
  Building2Icon,
  MicrochipIcon,
  CreditCardIcon,
  AtomIcon,
  BuildingIcon,
  ScaleIcon,
  BriefcaseIcon,
  HeadphonesIcon,
  GemIcon, // Add fallback icon
} from "lucide-react"

// Add helper function for getting scenario icon
export function getScenarioIcon(icon: any) {
  if (!icon || typeof icon !== 'function') {
    return BriefcaseIcon
  }
  return icon
}

export const PORTFOLIO_SCENARIOS = {
    // [Previous scenarios remain unchanged...]

    chipotle2015: {
        id: "cmg-2015",
        name: "Chipotle Crisis Recovery",
        focus: "Investing during food safety crisis",
        icon: getScenarioIcon(UtensilsIcon),
        tags: ["Food", "Recovery", "Growth"],
        risk: "High",
        value: 1850000,
        return: 720,
        returnClass: "text-green-500",
        chartVariant: "growth",
        allocation: [{ name: "Chipotle", value: 100, color: "#451400" }],
        positions: [{
            id: "cmg-2015",
            assetType: "stock",
            ticker: "CMG",
            quantity: 1000,
            avgPrice: 425,
            currentPrice: 1850,
            basket: null,
            trades: [{
                tradeId: "cmg-crisis",
                action: "BUY",
                side: "LONG",
                quantity: 1000,
                price: 425,
                datetime: "2015-12-15T10:00:00Z"
            }]
        }]
    },

    costcoGrowth: {
        id: "cost-2000",
        name: "Costco Long-Term Growth",
        focus: "20+ years of Costco membership growth",
        icon: getScenarioIcon(ShoppingCartIcon),
        tags: ["Retail", "Membership", "Growth"],
        risk: "Moderate",
        value: 3400000,
        return: 1600,
        returnClass: "text-green-500",
        chartVariant: "growth",
        allocation: [{ name: "Costco", value: 100, color: "#005DAA" }],
        positions: [{
            id: "cost-2000",
            assetType: "stock",
            ticker: "COST",
            quantity: 5000,
            avgPrice: 42,
            currentPrice: 680,
            basket: null,
            trades: [{
                tradeId: "cost-entry",
                action: "BUY",
                side: "LONG",
                quantity: 5000,
                price: 42,
                datetime: "2000-01-03T10:00:00Z"
            }]
        }]
    },

    microsoftNadella: {
        id: "msft-2014",
        name: "Microsoft's Cloud Era",
        focus: "Microsoft's transformation under Nadella",
        icon: getScenarioIcon(CloudIcon),
        tags: ["Tech", "Cloud", "Growth"],
        risk: "Moderate",
        value: 2800000,
        return: 850,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Microsoft", value: 100, color: "#00A4EF" }],
        positions: [{
            id: "msft-2014",
            assetType: "stock",
            ticker: "MSFT",
            quantity: 8000,
            avgPrice: 38,
            currentPrice: 350,
            basket: null,
            trades: [{
                tradeId: "msft-nadella",
                action: "BUY",
                side: "LONG",
                quantity: 8000,
                price: 38,
                datetime: "2014-02-04T10:00:00Z"
            }]
        }]
    },

    meta2022: {
        id: "meta-2022",
        name: "Meta's Metaverse Dip",
        focus: "Meta during peak metaverse skepticism",
        icon: getScenarioIcon(HeadsetIcon),
        tags: ["Tech", "Social", "Recovery"],
        risk: "High",
        value: 1500000,
        return: 200,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Meta", value: 100, color: "#0668E1" }],
        positions: [{
            id: "meta-2022",
            assetType: "stock",
            ticker: "META",
            quantity: 5000,
            avgPrice: 88,
            currentPrice: 300,
            basket: null,
            trades: [{
                tradeId: "meta-dip",
                action: "BUY",
                side: "LONG",
                quantity: 5000,
                price: 88,
                datetime: "2022-11-03T10:00:00Z"
            }]
        }]
    },

    airbnbCovid: {
        id: "abnb-2020",
        name: "Airbnb IPO Investment",
        focus: "Airbnb's pandemic IPO timing",
        icon: getScenarioIcon(HomeIcon),
        tags: ["Travel", "Tech", "IPO"],
        risk: "High",
        value: 950000,
        return: 140,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Airbnb", value: 100, color: "#FF5A5F" }],
        positions: [{
            id: "abnb-2020",
            assetType: "stock",
            ticker: "ABNB",
            quantity: 7000,
            avgPrice: 68,
            currentPrice: 135,
            basket: null,
            trades: [{
                tradeId: "abnb-ipo",
                action: "BUY",
                side: "LONG",
                quantity: 7000,
                price: 68,
                datetime: "2020-12-10T10:00:00Z"
            }]
        }]
    },
    // Add more scenarios as needed
    // ...
    // Short housing market scenario
    housingMarketShort: {
        id: "housing-short",
        name: "Housing Market Short",
        focus: "Shorting the housing market",
        icon: getScenarioIcon(HomeIcon),
        tags: ["Real Estate", "Short", "Market"],
        risk: "High",
        value: 2000000,
        return: 300,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [{ name: "Housing Short", value: 100, color: "#FF0000" }],
        positions: [{
            id: "housing-short",
            assetType: "stock",
            ticker: "SHM",
            quantity: 10000,
            avgPrice: 10,
            currentPrice: 40,
            basket: null,
            trades: [{
                tradeId: "housing-short",
                action: "BUY",
                side: "SHORT",
                quantity: 10000,
                price: 10,
                datetime: "2022-01-01T10:00:00Z"
            }]
        }]
    },
    // Shorting the housing market
    housingMarketLong: {
        id: "housing-long",
        name: "Housing Market Long",
        focus: "Longing the housing market",
        icon: getScenarioIcon(HomeIcon),
        tags: ["Real Estate", "Long", "Market"],
        risk: "High",
        value: 2000000,
        return: 300,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [{ name: "Housing Long", value: 100, color: "#00FF00" }],
        positions: [{
            id: "housing-long",
            assetType: "stock",
            ticker: "HOM",
            quantity: 10000,
            avgPrice: 10,
            currentPrice: 40,
            basket: null,
            trades: [{
                tradeId: "housing-long",
                action: "BUY",
                side: "LONG",
                quantity: 10000,
                price: 10,
                datetime: "2022-01-01T10:00:00Z"
            }]
        }]
    },
    // Add a Crypto Index Fund in the form of a Basket. Assuming you got into this in 2014.
    cryptoIndexFund: {
        id: "crypto-index-fund",
        name: "Crypto Index Fund",
        focus: "Investing in a crypto index fund",
        icon: getScenarioIcon(BitcoinIcon),
        tags: ["Crypto", "Index Fund", "Long"],
        risk: "High",
        value: 1000000,
        return: 1000,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [{ name: "Crypto Index Fund", value: 100, color: "#F7931A" }],
        positions: [{
            id: "crypto-index-fund",
            assetType: "basket",
            name: "Crypto Index Fund",
            positions: [
                {
                    id: "btc",
                    assetType: "crypto",
                    ticker: "BTC",
                    quantity: 0.5,
                    avgPrice: 1000,
                    currentPrice: 20000,
                    basket: null,
                    trades: [{
                        tradeId: "btc-trade",
                        action: "BUY",
                        side: "LONG",
                        quantity: 0.5,
                        price: 1000,
                        datetime: "2014-01-01T10:00:00Z"
                    }]
                },
                {
                    id: "eth",
                    assetType: "crypto",
                    ticker: "ETH",
                    quantity: 5,
                    avgPrice: 100,
                    currentPrice: 2000,
                    basket: null,
                    trades: [{
                        tradeId: "eth-trade",
                        action: "BUY",
                        side: "LONG",
                        quantity: 5,
                        price: 100,
                        datetime: "2014-01-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },
    // Add a Crypto Index Fund in the form of a Basket. Assuming you got into this in 2014.
    cryptoMemeIndex: {
        id: "crypto-meme-index",
        name: "Meme Coin Index",
        focus: "High-risk meme cryptocurrency basket",
        icon: getScenarioIcon(RocketIcon),
        tags: ["Crypto", "Meme", "High Risk"],
        risk: "Extreme",
        value: 500000,
        return: 1200,
        returnClass: "text-green-500",
        chartVariant: "crypto",
        allocation: [{ name: "Meme Coins", value: 100, color: "#FFD700" }],
        positions: [{
            id: "meme-index",
            assetType: "basket",
            name: "Meme Coin Basket",
            positions: [
                {
                    id: "doge",
                    assetType: "crypto",
                    ticker: "DOGE",
                    quantity: 100000,
                    avgPrice: 0.002,
                    currentPrice: 0.08,
                    basket: null,
                    trades: [{
                        tradeId: "doge-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 100000,
                        price: 0.002,
                        datetime: "2020-12-01T10:00:00Z"
                    }]
                },
                {
                    id: "shib",
                    assetType: "crypto",
                    ticker: "SHIB",
                    quantity: 50000000,
                    avgPrice: 0.000001,
                    currentPrice: 0.00001,
                    basket: null,
                    trades: [{
                        tradeId: "shib-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 50000000,
                        price: 0.000001,
                        datetime: "2021-05-01T10:00:00Z"
                    }]
                },
                {
                    id: "floki",
                    assetType: "crypto",
                    ticker: "FLOKI",
                    quantity: 10000000,
                    avgPrice: 0.0001,
                    currentPrice: 0.0005,
                    basket: null,
                    trades: [{
                        tradeId: "floki-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 10000000,
                        price: 0.0001,
                        datetime: "2021-06-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },
    darknetMarkets: {
        id: "darknet-markets",
        name: "Darknet Markets",
        focus: "Investing in darknet market cryptocurrencies",
        icon: getScenarioIcon(SkullIcon),
        tags: ["Crypto", "Darknet", "High Risk"],
        risk: "Extreme",
        value: 200000,
        return: 5000,
        returnClass: "text-green-500",
        chartVariant: "crypto",
        allocation: [{ name: "Monero", value: 50, color: "#000000" },{ name: "Bitcoin", value: 50, color: "#000000" }],
        positions: [{
            id: "darknet-markets",
            assetType: "basket",
            name: "Darknet Market Basket",
            positions: [
                {
                    id: "xmr",
                    assetType: "crypto",
                    ticker: "XMR",
                    quantity: 50,
                    avgPrice: 100,
                    currentPrice: 500,
                    basket: null,
                    trades: [{
                        tradeId: "xmr-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 50,
                        price: 100,
                        datetime: "2014-01-01T10:00:00Z"
                    }]
                },
                {
                    id: "btc",
                    assetType: "crypto",
                    ticker: "BTC",
                    quantity: 1,
                    avgPrice: 1000,
                    currentPrice: 20000,
                    basket: null,
                    trades: [{
                        tradeId: "btc-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 1,
                        price: 1000,
                        datetime: "2014-01-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },
    HousingMarketLong2010: {
        id: "housing-long-2010",
        name: "Housing Market Long 2010",
        focus: "Longing the housing market",
        icon: getScenarioIcon(HomeIcon),
        tags: ["Real Estate", "Long", "Market"],
        risk: "High",
        value: 2000000,
        return: 300,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [{ name: "Housing Long", value: 100, color: "#00FF00" }],
        positions: [{
            id: "housing-long-2010",
            assetType: "stock",
            ticker: "HOM",
            quantity: 10000,
            avgPrice: 10,
            currentPrice: 40,
            basket: null,
            trades: [{
                tradeId: "housing-long-2010",
                action: "BUY",
                side: "LONG",
                quantity: 10000,
                price: 10,
                datetime: "2010-01-01T10:00:00Z"
            }]
        }]
    },
    HousingMarketShort2010: {
        id: "housing-short-2010",
        name: "Housing Market Short 2010",
        focus: "Shorting the housing market",
        icon: getScenarioIcon(HomeIcon),
        tags: ["Real Estate", "Short", "Market"],
        risk: "High",
        value: 2000000,
        return: 300,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [{ name: "Housing Short", value: 100, color: "#FF0000" }],
        positions: [{
            id: "housing-short-2010",
            assetType: "stock",
            ticker: "SHM",
            quantity: 10000,
            avgPrice: 10,
            currentPrice: 40,
            basket: null,
            trades: [{
                tradeId: "housing-short-2010",
                action: "BUY",
                side: "SHORT",
                quantity: 10000,
                price: 10,
                datetime: "2010-01-01T10:00:00Z"
            }]
        }]
    },
    covid2020: {
        id: "covid-2020",
        name: "COVID-19 Portfolio",
        focus: "Pandemic-driven market opportunities",
        icon: getScenarioIcon(VirusIcon),
        tags: ["Healthcare", "Tech", "Remote"],
        risk: "High",
        value: 2500000,
        return: 280,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Healthcare", value: 50, color: "#1E88E5" },
            { name: "Tech", value: 50, color: "#43A047" }
        ],
        positions: [{
            id: "covid-basket",
            assetType: "basket",
            name: "Pandemic Plays",
            positions: [
                {
                    id: "mrna",
                    assetType: "stock",
                    ticker: "MRNA",
                    quantity: 1000,
                    avgPrice: 20,
                    currentPrice: 150,
                    basket: null,
                    trades: [{
                        tradeId: "mrna-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 1000,
                        price: 20,
                        datetime: "2020-03-15T10:00:00Z"
                    }]
                },
                {
                    id: "zm",
                    assetType: "stock",
                    ticker: "ZM",
                    quantity: 500,
                    avgPrice: 150,
                    currentPrice: 350,
                    basket: null,
                    trades: [{
                        tradeId: "zm-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 500,
                        price: 150,
                        datetime: "2020-03-15T10:00:00Z"
                    }]
                }
            ]
        }]
    },

    remoteWork2020: {
        id: "remote-2020",
        name: "Remote Work Revolution",
        focus: "Work from home transformation",
        icon: getScenarioIcon(LaptopIcon),
        tags: ["Tech", "Software", "Remote"],
        risk: "Moderate",
        value: 1800000,
        return: 220,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Cloud", value: 60, color: "#7B1FA2" },
            { name: "Communication", value: 40, color: "#FB8C00" }
        ],
        positions: [{
            id: "remote-basket",
            assetType: "basket",
            name: "WFH Technologies",
            positions: [
                {
                    id: "docu",
                    assetType: "stock",
                    ticker: "DOCU",
                    quantity: 800,
                    avgPrice: 85,
                    currentPrice: 220,
                    basket: null,
                    trades: [{
                        tradeId: "docu-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 800,
                        price: 85,
                        datetime: "2020-03-20T10:00:00Z"
                    }]
                },
                {
                    id: "team",
                    assetType: "stock",
                    ticker: "TEAM",
                    quantity: 600,
                    avgPrice: 140,
                    currentPrice: 280,
                    basket: null,
                    trades: [{
                        tradeId: "team-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 600,
                        price: 140,
                        datetime: "2020-03-20T10:00:00Z"
                    }]
                }
            ]
        }]
    },
    marketNeutral2023: {
        id: "market-neutral-2023",
        name: "Market Neutral Strategy",
        focus: "Balanced long-short positions",
        icon: getScenarioIcon(BalanceIcon),
        tags: ["Hedge", "Neutral", "Low Correlation"],
        risk: "Moderate",
        value: 1600000,
        return: 85,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Long", value: 50, color: "#4CAF50" },
            { name: "Short", value: 50, color: "#F44336" }
        ],
        positions: [{
            id: "pair-trade",
            assetType: "basket",
            name: "Pair Trading Basket",
            positions: [
                {
                    id: "ko-long",
                    assetType: "stock",
                    ticker: "KO",
                    quantity: 2000,
                    avgPrice: 55,
                    currentPrice: 65,
                    basket: null,
                    trades: [{
                        tradeId: "ko-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 2000,
                        price: 55,
                        datetime: "2023-01-15T10:00:00Z"
                    }]
                },
                {
                    id: "pep-short",
                    assetType: "stock",
                    ticker: "PEP",
                    quantity: 1500,
                    avgPrice: 180,
                    currentPrice: 160,
                    basket: null,
                    trades: [{
                        tradeId: "pep-entry",
                        action: "BUY",
                        side: "SHORT",
                        quantity: 1500,
                        price: 180,
                        datetime: "2023-01-15T10:00:00Z"
                    }]
                }
            ]
        }]
    },

    alternativeAssets2022: {
        id: "alt-assets-2022",
        name: "Alternative Assets Mix",
        icon: getScenarioIcon(GemIcon),
        // icon: getScenarioIcon(DiamondsIcon),
        tags: ["Alternative", "Commodities", "Real Assets"],
        risk: "High",
        value: 2200000,
        return: 120,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Gold", value: 40, color: "#FFD700" },
            { name: "REITs", value: 30, color: "#8B4513" },
            { name: "Agriculture", value: 30, color: "#228B22" }
        ],
        positions: [{
            id: "alt-basket",
            assetType: "basket",
            name: "Alternative Assets",
            positions: [
                {
                    id: "gld-hold",
                    assetType: "stock",
                    ticker: "GLD",
                    quantity: 3000,
                    avgPrice: 160,
                    currentPrice: 185,
                    basket: null,
                    trades: [{
                        tradeId: "gld-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 3000,
                        price: 160,
                        datetime: "2022-06-01T10:00:00Z"
                    }]
                },
                {
                    id: "dba-hold",
                    assetType: "stock",
                    ticker: "DBA",
                    quantity: 5000,
                    avgPrice: 18,
                    currentPrice: 22,
                    basket: null,
                    trades: [{
                        tradeId: "dba-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 5000,
                        price: 18,
                        datetime: "2022-06-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },
    memeStocksCraze: {
        id: "meme-stocks-2021",
        name: "2021 Meme Stocks",
        focus: "Reddit-driven market phenomenon",
        icon: getScenarioIcon(RocketIcon),
        tags: ["Social", "Retail", "High Risk"],
        risk: "Extreme",
        value: 3500000,
        return: 1800,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "GameStop", value: 70, color: "#FF4136" },
            { name: "Other Memes", value: 30, color: "#B10DC9" }
        ],
        positions: [{
            id: "meme-basket",
            assetType: "basket",
            name: "Meme Stock Portfolio",
            positions: [
                {
                    id: "gme-dfv",
                    assetType: "stock",
                    ticker: "GME",
                    quantity: 50000,
                    avgPrice: 4,
                    currentPrice: 180,
                    basket: null,
                    trades: [{
                        tradeId: "gme-dfv-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 50000,
                        price: 4,
                        datetime: "2018-06-01T10:00:00Z"
                    }]
                },
                {
                    id: "gme-retail",
                    assetType: "stock",
                    ticker: "GME",
                    quantity: 250,
                    avgPrice: 40,
                    currentPrice: 180,
                    basket: null,
                    trades: [{
                        tradeId: "gme-retail-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 250,
                        price: 40,
                        datetime: "2018-06-01T10:00:00Z"
                    }]
                },
                {
                    id: "amc-retail",
                    assetType: "stock",
                    ticker: "AMC",
                    quantity: 1000,
                    avgPrice: 10,
                    currentPrice: 40,
                    basket: null,
                    trades: [{
                        tradeId: "amc-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 1000,
                        price: 10,
                        datetime: "2018-06-01T10:00:00Z"
                    }]
                },
                {
                    id: "bby-retail",
                    assetType: "stock",
                    ticker: "BBY",
                    quantity: 200,
                    avgPrice: 50,
                    currentPrice: 120,
                    basket: null,
                    trades: [{
                        tradeId: "bby-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 200,
                        price: 50,
                        datetime: "2018-06-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },
    // Add more scenarios as needed
    // ...
    pennyStockSpeculation: {
        id: "penny-spec-2023",
        name: "Small Cap Speculation",
        focus: "High-risk small cap investing",
        icon: getScenarioIcon(TrendingUpIcon),
        tags: ["Speculative", "Small Cap", "Growth"],
        risk: "Extreme",
        value: 1000,
        return: 0,
        returnClass: "text-yellow-500",
        chartVariant: "default",
        allocation: [
            { name: "Small Cap Stocks", value: 100, color: "#FF6B6B" }
        ],
        positions: [{
            id: "penny-basket",
            assetType: "basket",
            name: "Speculative Stocks",
            positions: [
                {
                    id: "spec-1",
                    assetType: "stock",
                    ticker: "SNDL",
                    quantity: 200,
                    avgPrice: 0.50,
                    currentPrice: 0.48,
                    basket: null,
                    trades: [{
                        tradeId: "sndl-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 200,
                        price: 0.50,
                        datetime: "2023-01-15T10:00:00Z"
                    }]
                },
                {
                    id: "spec-2",
                    assetType: "stock",
                    ticker: "EXPR",
                    quantity: 300,
                    avgPrice: 1.20,
                    currentPrice: 1.15,
                    basket: null,
                    trades: [{
                        tradeId: "expr-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 300,
                        price: 1.20,
                        datetime: "2023-01-15T10:00:00Z"
                    }]
                }
            ]
        }]
    },

    teslaEarlyInvestor: {
        id: "tsla-early-2013",
        name: "Tesla Early Investor",
        focus: "Early investment in electric vehicle revolution",
        icon: getScenarioIcon(ChargingPileIcon),
        tags: ["EV", "Growth", "Tech"],
        risk: "High",
        value: 7500000,
        return: 3000,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Tesla", value: 100, color: "#E82127" }],
        positions: [{
            id: "tsla-2013",
            assetType: "stock",
            ticker: "TSLA",
            quantity: 10000,
            avgPrice: 7.50,
            currentPrice: 750,
            basket: null,
            trades: [{
                tradeId: "tsla-initial",
                action: "BUY",
                side: "LONG",
                quantity: 10000,
                price: 7.50,
                datetime: "2013-01-15T10:00:00Z"
            }]
        }]
    },

    greenEnergyTransition: {
        id: "green-energy-2020",
        name: "Green Energy Transition",
        focus: "Renewable energy transformation",
        icon: getScenarioIcon(SunIcon),
        tags: ["Renewable", "ESG", "Growth"],
        risk: "Moderate",
        value: 1850000,
        return: 185,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Solar", value: 40, color: "#FDB813" },
            { name: "Wind", value: 30, color: "#7FDBFF" },
            { name: "Energy Storage", value: 30, color: "#2ECC40" }
        ],
        positions: [{
            id: "green-basket",
            assetType: "basket",
            name: "Clean Energy Portfolio",
            positions: [
                {
                    id: "enph-green",
                    assetType: "stock",
                    ticker: "ENPH",
                    quantity: 500,
                    avgPrice: 65,
                    currentPrice: 180,
                    basket: null,
                    trades: [{
                        tradeId: "enph-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 500,
                        price: 65,
                        datetime: "2020-05-01T10:00:00Z"
                    }]
                },
                {
                    id: "sedg-green",
                    assetType: "stock",
                    ticker: "SEDG",
                    quantity: 300,
                    avgPrice: 85,
                    currentPrice: 240,
                    basket: null,
                    trades: [{
                        tradeId: "sedg-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 300,
                        price: 85,
                        datetime: "2020-05-01T10:00:00Z"
                    }]
                },
                {
                    id: "vestas-green",
                    assetType: "stock",
                    ticker: "VWDRY",
                    quantity: 1000,
                    avgPrice: 30,
                    currentPrice: 65,
                    basket: null,
                    trades: [{
                        tradeId: "vestas-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 1000,
                        price: 30,
                        datetime: "2020-05-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },

    dotComSurvivor: {
        id: "dotcom-2000",
        name: "Dot-Com Bubble Survivor",
        focus: "Surviving the 2000 tech crash",
        icon: getScenarioIcon(GlobeIcon),
        tags: ["Tech", "Crisis", "Value"],
        risk: "Moderate",
        value: 4200000,
        return: 1050,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Amazon", value: 60, color: "#FF9900" },
            { name: "Apple", value: 40, color: "#A2AAAD" }
        ],
        positions: [{
            id: "dotcom-basket",
            assetType: "basket",
            name: "Tech Survivors",
            positions: [
                {
                    id: "amzn-2000",
                    assetType: "stock",
                    ticker: "AMZN",
                    quantity: 2000,
                    avgPrice: 15,
                    currentPrice: 1500,
                    basket: null,
                    trades: [{
                        tradeId: "amzn-crash",
                        action: "BUY",
                        side: "LONG",
                        quantity: 2000,
                        price: 15,
                        datetime: "2001-10-01T10:00:00Z"
                    }]
                },
                {
                    id: "aapl-2000",
                    assetType: "stock",
                    ticker: "AAPL",
                    quantity: 5000,
                    avgPrice: 1.2,
                    currentPrice: 150,
                    basket: null,
                    trades: [{
                        tradeId: "aapl-crash",
                        action: "BUY",
                        side: "LONG",
                        quantity: 5000,
                        price: 1.2,
                        datetime: "2001-10-01T10:00:00Z"
                    }]
                }
            ]
        }]
    },

    aiRevolution: {
        id: "ai-revolution-2022",
        name: "AI Revolution Portfolio",
        focus: "Artificial intelligence transformation",
        icon: getScenarioIcon(BrainIcon),
        tags: ["AI", "Tech", "Growth"],
        risk: "High",
        value: 3100000,
        return: 210,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Semiconductors", value: 50, color: "#76B900" },
            { name: "Software", value: 50, color: "#0078D7" }
        ],
        positions: [{
            id: "ai-basket",
            assetType: "basket",
            name: "AI Technologies",
            positions: [
                {
                    id: "nvda-ai",
                    assetType: "stock",
                    ticker: "NVDA",
                    quantity: 1000,
                    avgPrice: 150,
                    currentPrice: 450,
                    basket: null,
                    trades: [{
                        tradeId: "nvda-ai-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 1000,
                        price: 150,
                        datetime: "2022-05-20T10:00:00Z"
                    }]
                },
                {
                    id: "msft-ai",
                    assetType: "stock",
                    ticker: "MSFT",
                    quantity: 500,
                    avgPrice: 240,
                    currentPrice: 380,
                    basket: null,
                    trades: [{
                        tradeId: "msft-ai-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 500,
                        price: 240,
                        datetime: "2022-05-20T10:00:00Z"
                    }]
                },
                {
                    id: "goog-ai",
                    assetType: "stock",
                    ticker: "GOOGL",
                    quantity: 400,
                    avgPrice: 100,
                    currentPrice: 150,
                    basket: null,
                    trades: [{
                        tradeId: "goog-ai-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 400,
                        price: 100,
                        datetime: "2022-05-20T10:00:00Z"
                    }]
                }
            ]
        }]
    },

    topTechStocks: {
        id: "top-tech-2023",
        name: "Big Tech Leaders",
        focus: "Market-cap weighted tech giants",
        icon: getScenarioIcon(ChipIcon),
        tags: ["Tech", "Blue Chip", "Growth"],
        risk: "Moderate",
        value: 2500000,
        return: 180,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "FAANG+", value: 100, color: "#0078D4" }
        ],
        positions: [{
            id: "tech-leaders",
            assetType: "basket",
            name: "Tech Leaders Basket",
            positions: [
                {
                    id: "aapl-tech",
                    assetType: "stock",
                    ticker: "AAPL",
                    quantity: 1000,
                    avgPrice: 150,
                    currentPrice: 190,
                    basket: null,
                    trades: [{ tradeId: "aapl-entry", action: "BUY", side: "LONG", quantity: 1000, price: 150, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "msft-tech",
                    assetType: "stock",
                    ticker: "MSFT",
                    quantity: 800,
                    avgPrice: 280,
                    currentPrice: 340,
                    basket: null,
                    trades: [{ tradeId: "msft-entry", action: "BUY", side: "LONG", quantity: 800, price: 280, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "googl-tech",
                    assetType: "stock",
                    ticker: "GOOGL",
                    quantity: 1200,
                    avgPrice: 120,
                    currentPrice: 140,
                    basket: null,
                    trades: [{ tradeId: "googl-entry", action: "BUY", side: "LONG", quantity: 1200, price: 120, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    dividendAristocrats: {
        id: "div-aristocrats",
        name: "Dividend Aristocrats",
        focus: "Companies with 25+ years of dividend growth",
        icon: getScenarioIcon(CrownIcon),
        tags: ["Dividend", "Value", "Income"],
        risk: "Low",
        value: 1800000,
        return: 85,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Consumer Staples", value: 40, color: "#4CAF50" },
            { name: "Industrials", value: 30, color: "#2196F3" },
            { name: "Healthcare", value: 30, color: "#F44336" }
        ],
        positions: [{
            id: "dividend-basket",
            assetType: "basket",
            name: "Dividend Leaders",
            positions: [
                {
                    id: "jnj-div",
                    assetType: "stock",
                    ticker: "JNJ",
                    quantity: 500,
                    avgPrice: 160,
                    currentPrice: 170,
                    basket: null,
                    trades: [{ tradeId: "jnj-entry", action: "BUY", side: "LONG", quantity: 500, price: 160, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "ko-div",
                    assetType: "stock",
                    ticker: "KO",
                    quantity: 1000,
                    avgPrice: 55,
                    currentPrice: 60,
                    basket: null,
                    trades: [{ tradeId: "ko-entry", action: "BUY", side: "LONG", quantity: 1000, price: 55, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "mmm-div",
                    assetType: "stock",
                    ticker: "MMM",
                    quantity: 400,
                    avgPrice: 120,
                    currentPrice: 110,
                    basket: null,
                    trades: [{ tradeId: "mmm-entry", action: "BUY", side: "LONG", quantity: 400, price: 120, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    cleanEnergyETFs: {
        id: "clean-energy",
        name: "Clean Energy ETFs",
        focus: "Diversified renewable energy exposure",
        icon: getScenarioIcon(LeafIcon),
        tags: ["ESG", "Energy", "ETF"],
        risk: "High",
        value: 1600000,
        return: 95,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Solar", value: 40, color: "#FDB813" },
            { name: "Wind", value: 30, color: "#00A0DC" },
            { name: "Clean Tech", value: 30, color: "#00C853" }
        ],
        positions: [{
            id: "clean-basket",
            assetType: "basket",
            name: "Clean Energy ETFs",
            positions: [
                {
                    id: "tan-etf",
                    assetType: "stock",
                    ticker: "TAN",
                    quantity: 1000,
                    avgPrice: 75,
                    currentPrice: 85,
                    basket: null,
                    trades: [{ tradeId: "tan-entry", action: "BUY", side: "LONG", quantity: 1000, price: 75, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "fan-etf",
                    assetType: "stock",
                    ticker: "FAN",
                    quantity: 2000,
                    avgPrice: 20,
                    currentPrice: 22,
                    basket: null,
                    trades: [{ tradeId: "fan-entry", action: "BUY", side: "LONG", quantity: 2000, price: 20, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "qcln-etf",
                    assetType: "stock",
                    ticker: "QCLN",
                    quantity: 1500,
                    avgPrice: 50,
                    currentPrice: 55,
                    basket: null,
                    trades: [{ tradeId: "qcln-entry", action: "BUY", side: "LONG", quantity: 1500, price: 50, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    emergingMarkets: {
        id: "emerging-markets",
        name: "Emerging Markets Growth",
        focus: "High-growth developing economies",
        icon: getScenarioIcon(GlobeIcon),
        tags: ["International", "Growth", "ETF"],
        risk: "High",
        value: 1400000,
        return: 110,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Asia", value: 60, color: "#FF4081" },
            { name: "Latin America", value: 20, color: "#FFD740" },
            { name: "Eastern Europe", value: 20, color: "#40C4FF" }
        ],
        positions: [{
            id: "em-basket",
            assetType: "basket",
            name: "Emerging Markets ETFs",
            positions: [
                {
                    id: "vwo-etf",
                    assetType: "stock",
                    ticker: "VWO",
                    quantity: 2000,
                    avgPrice: 42,
                    currentPrice: 45,
                    basket: null,
                    trades: [{ tradeId: "vwo-entry", action: "BUY", side: "LONG", quantity: 2000, price: 42, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "kweb-etf",
                    assetType: "stock",
                    ticker: "KWEB",
                    quantity: 1500,
                    avgPrice: 30,
                    currentPrice: 35,
                    basket: null,
                    trades: [{ tradeId: "kweb-entry", action: "BUY", side: "LONG", quantity: 1500, price: 30, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    healthcareInnovation: {
        id: "healthcare-innovation",
        name: "Healthcare Innovation",
        focus: "Breakthrough medical technologies",
        icon: getScenarioIcon(MicroscopeIcon),
        tags: ["Healthcare", "Biotech", "Innovation"],
        risk: "High",
        value: 1900000,
        return: 160,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Biotech", value: 40, color: "#E91E63" },
            { name: "Medical Devices", value: 30, color: "#9C27B0" },
            { name: "Digital Health", value: 30, color: "#3F51B5" }
        ],
        positions: [{
            id: "health-basket",
            assetType: "basket",
            name: "Healthcare Innovation",
            positions: [
                {
                    id: "arkg-etf",
                    assetType: "stock",
                    ticker: "ARKG",
                    quantity: 1000,
                    avgPrice: 60,
                    currentPrice: 65,
                    basket: null,
                    trades: [{ tradeId: "arkg-entry", action: "BUY", side: "LONG", quantity: 1000, price: 60, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "dna-etf",
                    assetType: "stock",
                    ticker: "DNA",
                    quantity: 5000,
                    avgPrice: 2,
                    currentPrice: 2.5,
                    basket: null,
                    trades: [{ tradeId: "dna-entry", action: "BUY", side: "LONG", quantity: 5000, price: 2, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    cybersecurity: {
        id: "cybersecurity",
        name: "Cybersecurity Leaders",
        focus: "Digital security and defense",
        icon: getScenarioIcon(ShieldIcon),
        tags: ["Tech", "Security", "Growth"],
        risk: "High",
        value: 1700000,
        return: 140,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Cybersecurity", value: 100, color: "#607D8B" }],
        positions: [{
            id: "cyber-basket",
            assetType: "basket",
            name: "Cybersecurity Portfolio",
            positions: [
                {
                    id: "crwd-cyber",
                    assetType: "stock",
                    ticker: "CRWD",
                    quantity: 400,
                    avgPrice: 140,
                    currentPrice: 180,
                    basket: null,
                    trades: [{ tradeId: "crwd-entry", action: "BUY", side: "LONG", quantity: 400, price: 140, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "panw-cyber",
                    assetType: "stock",
                    ticker: "PANW",
                    quantity: 300,
                    avgPrice: 220,
                    currentPrice: 280,
                    basket: null,
                    trades: [{ tradeId: "panw-entry", action: "BUY", side: "LONG", quantity: 300, price: 220, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    semiconductors: {
        id: "semiconductor-leaders",
        name: "Semiconductor Leaders",
        focus: "Leading chip manufacturers and designers",
        icon: getScenarioIcon(MicrochipIcon),
        tags: ["Tech", "Hardware", "Growth"],
        risk: "High",
        value: 2200000,
        return: 200,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Semiconductors", value: 100, color: "#00BCD4" }],
        positions: [{
            id: "semi-basket",
            assetType: "basket",
            name: "Semiconductor Portfolio",
            positions: [
                {
                    id: "amd-semi",
                    assetType: "stock",
                    ticker: "AMD",
                    quantity: 1000,
                    avgPrice: 90,
                    currentPrice: 120,
                    basket: null,
                    trades: [{ tradeId: "amd-entry", action: "BUY", side: "LONG", quantity: 1000, price: 90, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "tsm-semi",
                    assetType: "stock",
                    ticker: "TSM",
                    quantity: 800,
                    avgPrice: 100,
                    currentPrice: 120,
                    basket: null,
                    trades: [{ tradeId: "tsm-entry", action: "BUY", side: "LONG", quantity: 800, price: 100, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    cloudComputing: {
        id: "cloud-computing",
        name: "Cloud Computing Giants",
        focus: "Leading cloud infrastructure providers",
        icon: getScenarioIcon(CloudIcon),
        tags: ["Tech", "Cloud", "Growth"],
        risk: "Moderate",
        value: 2400000,
        return: 175,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "Cloud Computing", value: 100, color: "#03A9F4" }],
        positions: [{
            id: "cloud-basket",
            assetType: "basket",
            name: "Cloud Computing Portfolio",
            positions: [
                {
                    id: "net-cloud",
                    assetType: "stock",
                    ticker: "NET",
                    quantity: 1200,
                    avgPrice: 65,
                    currentPrice: 85,
                    basket: null,
                    trades: [{ tradeId: "net-entry", action: "BUY", side: "LONG", quantity: 1200, price: 65, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "snow-cloud",
                    assetType: "stock",
                    ticker: "SNOW",
                    quantity: 400,
                    avgPrice: 180,
                    currentPrice: 220,
                    basket: null,
                    trades: [{ tradeId: "snow-entry", action: "BUY", side: "LONG", quantity: 400, price: 180, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    financialTech: {
        id: "fintech-leaders",
        name: "FinTech Innovators",
        focus: "Digital payment and financial technology",
        icon: getScenarioIcon(CreditCardIcon),
        tags: ["Fintech", "Payments", "Innovation"],
        risk: "High",
        value: 1800000,
        return: 155,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [{ name: "FinTech", value: 100, color: "#795548" }],
        positions: [{
            id: "fintech-basket",
            assetType: "basket",
            name: "FinTech Portfolio",
            positions: [
                {
                    id: "sq-fintech",
                    assetType: "stock",
                    ticker: "SQ",
                    quantity: 800,
                    avgPrice: 70,
                    currentPrice: 85,
                    basket: null,
                    trades: [{ tradeId: "sq-entry", action: "BUY", side: "LONG", quantity: 800, price: 70, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "pypl-fintech",
                    assetType: "stock",
                    ticker: "PYPL",
                    quantity: 600,
                    avgPrice: 80,
                    currentPrice: 95,
                    basket: null,
                    trades: [{ tradeId: "pypl-entry", action: "BUY", side: "LONG", quantity: 600, price: 80, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    quantumComputing: {
        id: "quantum-computing",
        name: "Quantum Computing Pioneers",
        focus: "Next-generation computing technology",
        icon: getScenarioIcon(AtomIcon),
        tags: ["Tech", "Innovation", "Future"],
        risk: "Very High",
        value: 1200000,
        return: 90,
        returnClass: "text-yellow-500",
        chartVariant: "tech",
        allocation: [{ name: "Quantum Tech", value: 100, color: "#9C27B0" }],
        positions: [{
            id: "quantum-basket",
            assetType: "basket",
            name: "Quantum Computing Portfolio",
            positions: [
                {
                    id: "ionq-quantum",
                    assetType: "stock",
                    ticker: "IONQ",
                    quantity: 2000,
                    avgPrice: 15,
                    currentPrice: 18,
                    basket: null,
                    trades: [{ tradeId: "ionq-entry", action: "BUY", side: "LONG", quantity: 2000, price: 15, datetime: "2023-01-01T10:00:00Z" }]
                },
                {
                    id: "rigetti-quantum",
                    assetType: "stock",
                    ticker: "RGTI",
                    quantity: 3000,
                    avgPrice: 8,
                    currentPrice: 9,
                    basket: null,
                    trades: [{ tradeId: "rgti-entry", action: "BUY", side: "LONG", quantity: 3000, price: 8, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    highYieldDividends: {
        id: "high-yield-div",
        name: "High Yield Dividend Portfolio",
        focus: "High dividend yield stocks with strong fundamentals",
        icon: getScenarioIcon(DollarSignIcon),
        tags: ["Dividend", "Income", "Value"],
        risk: "Moderate",
        value: 1500000,
        return: 75,
        returnClass: "text-green-500",
        chartVariant: "income",
        allocation: [
            { name: "Energy", value: 30, color: "#00529B" },
            { name: "REITs", value: 30, color: "#8B4513" },
            { name: "Utilities", value: 20, color: "#4A90E2" },
            { name: "Telecom", value: 20, color: "#9B59B6" }
        ],
        positions: [{
            id: "high-yield-basket",
            assetType: "basket",
            name: "High Yield Basket",
            positions: [
                { id: "mo", assetType: "stock", ticker: "MO", quantity: 2000, avgPrice: 45, currentPrice: 48, basket: null,
                    trades: [{ tradeId: "mo-entry", action: "BUY", side: "LONG", quantity: 2000, price: 45, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "o", assetType: "stock", ticker: "O", quantity: 1500, avgPrice: 65, currentPrice: 68, basket: null,
                    trades: [{ tradeId: "o-entry", action: "BUY", side: "LONG", quantity: 1500, price: 65, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    bluechipETFs: {
        id: "blue-chip-etfs",
        name: "Blue Chip ETF Collection",
        focus: "Major market index ETFs",
        icon: getScenarioIcon(BuildingLibraryIcon),
        tags: ["ETF", "Index", "Core"],
        risk: "Low",
        value: 2800000,
        return: 95,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "S&P 500", value: 40, color: "#2E7D32" },
            { name: "NASDAQ", value: 30, color: "#1565C0" },
            { name: "Dow Jones", value: 30, color: "#283593" }
        ],
        positions: [{
            id: "blue-chip-basket",
            assetType: "basket",
            name: "Index ETF Basket",
            positions: [
                { id: "spy", assetType: "stock", ticker: "SPY", quantity: 1000, avgPrice: 400, currentPrice: 440, basket: null,
                    trades: [{ tradeId: "spy-entry", action: "BUY", side: "LONG", quantity: 1000, price: 400, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "qqq", assetType: "stock", ticker: "QQQ", quantity: 800, avgPrice: 350, currentPrice: 380, basket: null,
                    trades: [{ tradeId: "qqq-entry", action: "BUY", side: "LONG", quantity: 800, price: 350, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    commoditiesBasket: {
        id: "commodities-basket",
        name: "Commodities Basket",
        focus: "Diversified commodities exposure",
        icon: getScenarioIcon(GoldIcon),
        tags: ["Commodities", "Materials", "Inflation"],
        risk: "High",
        value: 1200000,
        return: 110,
        returnClass: "text-green-500",
        chartVariant: "commodity",
        allocation: [
            { name: "Precious Metals", value: 40, color: "#FFD700" },
            { name: "Industrial Metals", value: 30, color: "#CD7F32" },
            { name: "Agriculture", value: 30, color: "#228B22" }
        ],
        positions: [{
            id: "commodities-etf-basket",
            assetType: "basket",
            name: "Commodities ETF Basket",
            positions: [
                { id: "gld", assetType: "stock", ticker: "GLD", quantity: 1200, avgPrice: 170, currentPrice: 185, basket: null,
                    trades: [{ tradeId: "gld-entry", action: "BUY", side: "LONG", quantity: 1200, price: 170, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "slv", assetType: "stock", ticker: "SLV", quantity: 2500, avgPrice: 22, currentPrice: 24, basket: null,
                    trades: [{ tradeId: "slv-entry", action: "BUY", side: "LONG", quantity: 2500, price: 22, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    globalInfrastructure: {
        id: "global-infra",
        name: "Global Infrastructure",
        focus: "Infrastructure and utilities worldwide",
        icon: getScenarioIcon(GlobeIcon),
        tags: ["Infrastructure", "Utilities", "Global"],
        risk: "Moderate",
        value: 1600000,
        return: 82,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Transportation", value: 35, color: "#1E88E5" },
            { name: "Utilities", value: 35, color: "#43A047" },
            { name: "Telecom", value: 30, color: "#FB8C00" }
        ],
        positions: [{
            id: "global-infra-basket",
            assetType: "basket",
            name: "Global Infrastructure Portfolio",
            positions: [
                { id: "bip", assetType: "stock", ticker: "BIP", quantity: 1000, avgPrice: 40, currentPrice: 45, basket: null,
                    trades: [{ tradeId: "bip-entry", action: "BUY", side: "LONG", quantity: 1000, price: 40, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "nee", assetType: "stock", ticker: "NEE", quantity: 800, avgPrice: 75, currentPrice: 80, basket: null,
                    trades: [{ tradeId: "nee-entry", action: "BUY", side: "LONG", quantity: 800, price: 75, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "vzt", assetType: "stock", ticker: "VZT", quantity: 600, avgPrice: 50, currentPrice: 55, basket: null,
                    trades: [{ tradeId: "vzt-entry", action: "BUY", side: "LONG", quantity: 600, price: 50, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    smallCapValue: {
        id: "small-cap-value",
        name: "Small Cap Value Stars",
        focus: "Undervalued small-cap companies",
        icon: getScenarioIcon(TrendingUpIcon),
        tags: ["Small Cap", "Value", "Growth"],
        risk: "High",
        value: 950000,
        return: 125,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Industrials", value: 40, color: "#FF7043" },
            { name: "Financials", value: 30, color: "#66BB6A" },
            { name: "Consumer", value: 30, color: "#42A5F5" }
        ],
        positions: [{
            id: "small-cap-value-basket",
            assetType: "basket",
            name: "Small Cap Value Portfolio",
            positions: [
                { id: "iwn", assetType: "stock", ticker: "IWN", quantity: 1000, avgPrice: 120, currentPrice: 130, basket: null,
                    trades: [{ tradeId: "iwn-entry", action: "BUY", side: "LONG", quantity: 1000, price: 120, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "vbr", assetType: "stock", ticker: "VBR", quantity: 800, avgPrice: 150, currentPrice: 160, basket: null,
                    trades: [{ tradeId: "vbr-entry", action: "BUY", side: "LONG", quantity: 800, price: 150, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "rfv", assetType: "stock", ticker: "RFV", quantity: 600, avgPrice: 90, currentPrice: 95, basket: null,
                    trades: [{ tradeId: "rfv-entry", action: "BUY", side: "LONG", quantity: 600, price: 90, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    roboticsAutomation: {
        id: "robotics-auto",
        name: "Robotics & Automation",
        focus: "Industrial automation and robotics",
        icon: getScenarioIcon(CpuIcon),
        tags: ["Technology", "Industrial", "Innovation"],
        risk: "High",
        value: 1750000,
        return: 145,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Industrial Robotics", value: 35, color: "#FF4081" },
            { name: "AI & Software", value: 35, color: "#2196F3" },
            { name: "Automation Systems", value: 30, color: "#4CAF50" }
        ],
        positions: [{
            id: "robotics-basket",
            assetType: "basket",
            name: "Robotics & Automation Portfolio",
            positions: [
                { id: "fanuy", assetType: "stock", ticker: "FANUY", quantity: 2000, avgPrice: 15, currentPrice: 22, basket: null,
                    trades: [{ tradeId: "fanuy-entry", action: "BUY", side: "LONG", quantity: 2000, price: 15, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "rok", assetType: "stock", ticker: "ROK", quantity: 500, avgPrice: 180, currentPrice: 310, basket: null,
                    trades: [{ tradeId: "rok-entry", action: "BUY", side: "LONG", quantity: 500, price: 180, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "sigy", assetType: "stock", ticker: "SIGY", quantity: 1000, avgPrice: 55, currentPrice: 85, basket: null,
                    trades: [{ tradeId: "sigy-entry", action: "BUY", side: "LONG", quantity: 1000, price: 55, datetime: "2019-02-15T10:00:00Z" }]
                }
            ]
        }]
    },

    waterResources: {
        id: "water-resources",
        name: "Water Resources",
        focus: "Water utilities and technology",
        icon: getScenarioIcon(DropletIcon),
        tags: ["Utilities", "ESG", "Resources"],
        risk: "Moderate",
        value: 1300000,
        return: 78,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Water Utilities", value: 40, color: "#00BCD4" },
            { name: "Infrastructure", value: 35, color: "#0097A7" },
            { name: "Treatment Tech", value: 25, color: "#006064" }
        ],
        positions: [{
            id: "water-basket",
            assetType: "basket",
            name: "Water Resources Portfolio",
            positions: [
                { id: "awk", assetType: "stock", ticker: "AWK", quantity: 1200, avgPrice: 85, currentPrice: 130, basket: null,
                    trades: [{ tradeId: "awk-entry", action: "BUY", side: "LONG", quantity: 1200, price: 85, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "xyl", assetType: "stock", ticker: "XYL", quantity: 800, avgPrice: 72, currentPrice: 105, basket: null,
                    trades: [{ tradeId: "xyl-entry", action: "BUY", side: "LONG", quantity: 800, price: 72, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "wts", assetType: "stock", ticker: "WTS", quantity: 600, avgPrice: 90, currentPrice: 185, basket: null,
                    trades: [{ tradeId: "wts-entry", action: "BUY", side: "LONG", quantity: 600, price: 90, datetime: "2019-02-15T10:00:00Z" }]
                }
            ]
        }]
    },

    cannabisSector: {
        id: "cannabis-sector",
        name: "Cannabis Industry",
        focus: "Legal cannabis and related industries",
        icon: getScenarioIcon(SproutIcon),
        tags: ["Cannabis", "Healthcare", "Growth"],
        risk: "Very High",
        value: 800000,
        return: 165,
        returnClass: "text-green-500",
        chartVariant: "growth",
        allocation: [
            { name: "Cultivators", value: 40, color: "#43A047" },
            { name: "Pharma & Research", value: 35, color: "#2E7D32" },
            { name: "Ancillary Services", value: 25, color: "#1B5E20" }
        ],
        positions: [{
            id: "cannabis-basket",
            assetType: "basket",
            name: "Cannabis Industry Portfolio",
            positions: [
                { id: "cgc", assetType: "stock", ticker: "CGC", quantity: 2500, avgPrice: 30, currentPrice: 15, basket: null,
                    trades: [{ tradeId: "cgc-entry", action: "BUY", side: "LONG", quantity: 2500, price: 30, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "tlry", assetType: "stock", ticker: "TLRY", quantity: 1800, avgPrice: 45, currentPrice: 20, basket: null,
                    trades: [{ tradeId: "tlry-entry", action: "BUY", side: "LONG", quantity: 1800, price: 45, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "acb", assetType: "stock", ticker: "ACB", quantity: 3000, avgPrice: 8, currentPrice: 3, basket: null,
                    trades: [{ tradeId: "acb-entry", action: "BUY", side: "LONG", quantity: 3000, price: 8, datetime: "2019-02-15T10:00:00Z" }]
                }
            ]
        }]
    },

    genomicsRevolution: {
        id: "genomics-rev",
        name: "Genomics Revolution",
        focus: "Genetic research and therapies",
        icon: getScenarioIcon(HeartPulseIcon),
        tags: ["Biotech", "Healthcare", "Innovation"],
        risk: "High",
        value: 1450000,
        return: 190,
        returnClass: "text-green-500",
        chartVariant: "biotech",
        allocation: [
            { name: "Genetic Research", value: 50, color: "#E91E63" },
            { name: "Therapies", value: 50, color: "#9C27B0" }
        ],
        positions: [{
            id: "genomics-basket",
            assetType: "basket",
            name: "Genomics Revolution Portfolio",
            positions: [
                { id: "crsp", assetType: "stock", ticker: "CRSP", quantity: 1000, avgPrice: 60, currentPrice: 70, basket: null,
                    trades: [{ tradeId: "crsp-entry", action: "BUY", side: "LONG", quantity: 1000, price: 60, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "ntla", assetType: "stock", ticker: "NTLA", quantity: 800, avgPrice: 50, currentPrice: 55, basket: null,
                    trades: [{ tradeId: "ntla-entry", action: "BUY", side: "LONG", quantity: 800, price: 50, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    metaverseVR: {
        id: "metaverse-vr",
        name: "Metaverse & VR",
        focus: "Virtual reality and digital worlds",
        icon: getScenarioIcon(HeadphonesIcon),
        tags: ["Technology", "Gaming", "Social"],
        risk: "High",
        value: 1100000,
        return: 135,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "VR Hardware", value: 50, color: "#00BCD4" },
            { name: "Digital Worlds", value: 50, color: "#9C27B0" }
        ],
        positions: [{
            id: "metaverse-basket",
            assetType: "basket",
            name: "Metaverse & VR Portfolio",
            positions: [
                { id: "meta-vr", assetType: "stock", ticker: "META", quantity: 500, avgPrice: 280, currentPrice: 330, basket: null,
                    trades: [{ tradeId: "meta-vr-entry", action: "BUY", side: "LONG", quantity: 500, price: 280, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "rblx-vr", assetType: "stock", ticker: "RBLX", quantity: 1000, avgPrice: 50, currentPrice: 55, basket: null,
                    trades: [{ tradeId: "rblx-vr-entry", action: "BUY", side: "LONG", quantity: 1000, price: 50, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    popularETFBasket: {
        id: "popular-etfs-2024",
        name: "Popular ETF Collection",
        focus: "Most traded ETFs on Robinhood",
        icon: getScenarioIcon(TrendingUpIcon),
        tags: ["ETF", "Popular", "Diverse"],
        risk: "Moderate",
        value: 2000000,
        return: 125,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "VOO", value: 30, color: "#1B5E20" },
            { name: "ARKK", value: 20, color: "#D32F2F" },
            { name: "VTI", value: 30, color: "#1565C0" },
            { name: "SCHD", value: 20, color: "#FFB300" }
        ],
        positions: [{
            id: "popular-etf-basket",
            assetType: "basket",
            name: "Popular ETF Collection",
            positions: [
                { id: "voo", assetType: "stock", ticker: "VOO", quantity: 1500, avgPrice: 380, currentPrice: 410 },
                { id: "arkk", assetType: "stock", ticker: "ARKK", quantity: 2000, avgPrice: 45, currentPrice: 52 },
                { id: "vti", assetType: "stock", ticker: "VTI", quantity: 1800, avgPrice: 200, currentPrice: 220 },
                { id: "schd", assetType: "stock", ticker: "SCHD", quantity: 2200, avgPrice: 70, currentPrice: 78 }
            ]
        }]
    },

    sp500TopTen: {
        id: "sp500-top-ten",
        name: "S&P 500 Top 10 Weights",
        focus: "Market-cap weighted top S&P 500 companies",
        icon: getScenarioIcon(BarChartIcon),
        tags: ["Large Cap", "Blue Chip", "Market Weight"],
        risk: "Low",
        value: 3000000,
        return: 145,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Technology", value: 60, color: "#00BCD4" },
            { name: "Communication", value: 20, color: "#9C27B0" },
            { name: "Consumer", value: 20, color: "#4CAF50" }
        ],
        positions: [{
            id: "sp500-top-basket",
            assetType: "basket",
            name: "S&P 500 Leaders",
            positions: [
                { id: "aapl", assetType: "stock", ticker: "AAPL", quantity: 2500, avgPrice: 170, currentPrice: 190 },
                { id: "msft", assetType: "stock", ticker: "MSFT", quantity: 2000, avgPrice: 310, currentPrice: 340 },
                { id: "amzn", assetType: "stock", ticker: "AMZN", quantity: 1500, avgPrice: 120, currentPrice: 145 }
            ]
        }]
    },

    growthStocks100: {
        id: "growth-100",
        name: "Growth 100",
        focus: "Top 100 growth stocks by momentum",
        icon: getScenarioIcon(RocketIcon),
        tags: ["Growth", "Momentum", "Multi-Cap"],
        risk: "High",
        value: 1800000,
        return: 180,
        returnClass: "text-green-500",
        chartVariant: "growth",
        allocation: [
            { name: "Tech", value: 50, color: "#00BCD4" },
            { name: "Healthcare", value: 30, color: "#9C27B0" },
            { name: "Consumer", value: 20, color: "#4CAF50" }
        ],
        positions: [{
            id: "growth-100-basket",
            assetType: "basket",
            name: "Growth 100 Portfolio",
            positions: [
                { id: "nvda-growth", assetType: "stock", ticker: "NVDA", quantity: 1000, avgPrice: 150, currentPrice: 450, basket: null,
                    trades: [{ tradeId: "nvda-growth-entry", action: "BUY", side: "LONG", quantity: 1000, price: 150, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "amzn-growth", assetType: "stock", ticker: "AMZN", quantity: 800, avgPrice: 120, currentPrice: 145, basket: null,
                    trades: [{ tradeId: "amzn-growth-entry", action: "BUY", side: "LONG", quantity: 800, price: 120, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "aapl-growth", assetType: "stock", ticker: "AAPL", quantity: 600, avgPrice: 170, currentPrice: 190, basket: null,
                    trades: [{ tradeId: "aapl-growth-entry", action: "BUY", side: "LONG", quantity: 600, price: 170, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    valueInvesting: {
        id: "value-picks",
        name: "Value Stock Picks",
        focus: "Undervalued companies with strong fundamentals",
        icon: getScenarioIcon(ScaleIcon),
        tags: ["Value", "Fundamentals", "Dividends"],
        risk: "Low",
        value: 1600000,
        return: 95,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Financials", value: 40, color: "#FF7043" },
            { name: "Industrials", value: 30, color: "#66BB6A" },
            { name: "Consumer", value: 30, color: "#42A5F5" }
        ],
        positions: [{
            id: "value-picks-basket",
            assetType: "basket",
            name: "Value Stock Picks Portfolio",
            positions: [
                { id: "brk-b", assetType: "stock", ticker: "BRK.B", quantity: 1000, avgPrice: 300, currentPrice: 320, basket: null,
                    trades: [{ tradeId: "brk-b-entry", action: "BUY", side: "LONG", quantity: 1000, price: 300, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "jpm", assetType: "stock", ticker: "JPM", quantity: 800, avgPrice: 140, currentPrice: 150, basket: null,
                    trades: [{ tradeId: "jpm-entry", action: "BUY", side: "LONG", quantity: 800, price: 140, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "pg", assetType: "stock", ticker: "PG", quantity: 600, avgPrice: 130, currentPrice: 140, basket: null,
                    trades: [{ tradeId: "pg-entry", action: "BUY", side: "LONG", quantity: 600, price: 130, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    indexFundCore: {
        id: "index-core",
        name: "Index Fund Core",
        focus: "Core index fund portfolio for long-term investors",
        icon: getScenarioIcon(BuildingIcon),
        tags: ["Index", "Long-Term", "Passive"],
        risk: "Low",
        value: 2500000,
        return: 110,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "S&P 500", value: 50, color: "#2E7D32" },
            { name: "Total Market", value: 30, color: "#1565C0" },
            { name: "International", value: 20, color: "#283593" }
        ],
        positions: [{
            id: "index-core-basket",
            assetType: "basket",
            name: "Index Fund Core Portfolio",
            positions: [
                { id: "vfinx", assetType: "stock", ticker: "VFINX", quantity: 1000, avgPrice: 400, currentPrice: 440, basket: null,
                    trades: [{ tradeId: "vfinx-entry", action: "BUY", side: "LONG", quantity: 1000, price: 400, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "vtsmx", assetType: "stock", ticker: "VTSMX", quantity: 800, avgPrice: 350, currentPrice: 380, basket: null,
                    trades: [{ tradeId: "vtsmx-entry", action: "BUY", side: "LONG", quantity: 800, price: 350, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "vgtsx", assetType: "stock", ticker: "VGTSX", quantity: 600, avgPrice: 200, currentPrice: 220, basket: null,
                    trades: [{ tradeId: "vgtsx-entry", action: "BUY", side: "LONG", quantity: 600, price: 200, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    evRevolution: {
        id: "ev-basket",
        name: "EV Revolution",
        focus: "Electric vehicle ecosystem investments",
        icon: getScenarioIcon(BatteryIcon),
        tags: ["EV", "Clean Energy", "Technology"],
        risk: "High",
        value: 1900000,
        return: 165,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "EV Manufacturers", value: 50, color: "#E91E63" },
            { name: "Battery Tech", value: 30, color: "#9C27B0" },
            { name: "Charging Infrastructure", value: 20, color: "#3F51B5" }
        ],
        positions: [{
            id: "ev-basket",
            assetType: "basket",
            name: "EV Revolution Portfolio",
            positions: [
                { id: "tsla-ev", assetType: "stock", ticker: "TSLA", quantity: 1000, avgPrice: 220, currentPrice: 240, basket: null,
                    trades: [{ tradeId: "tsla-ev-entry", action: "BUY", side: "LONG", quantity: 1000, price: 220, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "nio-ev", assetType: "stock", ticker: "NIO", quantity: 800, avgPrice: 40, currentPrice: 45, basket: null,
                    trades: [{ tradeId: "nio-ev-entry", action: "BUY", side: "LONG", quantity: 800, price: 40, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "chpt-ev", assetType: "stock", ticker: "CHPT", quantity: 600, avgPrice: 20, currentPrice: 22, basket: null,
                    trades: [{ tradeId: "chpt-ev-entry", action: "BUY", side: "LONG", quantity: 600, price: 20, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    defensiveSector: {
        id: "defensive-sector",
        name: "Defensive Sectors",
        focus: "Recession-resistant defensive sectors",
        icon: getScenarioIcon(ShieldIcon),
        tags: ["Defensive", "Low Beta", "Staples"],
        risk: "Low",
        value: 1400000,
        return: 82,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Consumer Staples", value: 40, color: "#4CAF50" },
            { name: "Utilities", value: 30, color: "#2196F3" },
            { name: "Healthcare", value: 30, color: "#F44336" }
        ],
        positions: [{
            id: "defensive-basket",
            assetType: "basket",
            name: "Defensive Sectors Portfolio",
            positions: [
                { id: "pg-defensive", assetType: "stock", ticker: "PG", quantity: 1000, avgPrice: 130, currentPrice: 140, basket: null,
                    trades: [{ tradeId: "pg-defensive-entry", action: "BUY", side: "LONG", quantity: 1000, price: 130, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "nee-defensive", assetType: "stock", ticker: "NEE", quantity: 800, avgPrice: 75, currentPrice: 80, basket: null,
                    trades: [{ tradeId: "nee-defensive-entry", action: "BUY", side: "LONG", quantity: 800, price: 75, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "jnj-defensive", assetType: "stock", ticker: "JNJ", quantity: 600, avgPrice: 160, currentPrice: 170, basket: null,
                    trades: [{ tradeId: "jnj-defensive-entry", action: "BUY", side: "LONG", quantity: 600, price: 160, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    reitsIncome: {
        id: "reit-income",
        name: "REIT Income Portfolio",
        focus: "High-yield real estate investment trusts",
        icon: getScenarioIcon(Building2Icon),
        tags: ["REITs", "Income", "Real Estate"],
        risk: "Moderate",
        value: 1700000,
        return: 115,
        returnClass: "text-green-500",
        chartVariant: "income",
        allocation: [
            { name: "Commercial REITs", value: 35, color: "#4A148C" },
            { name: "Residential REITs", value: 35, color: "#6A1B9A" },
            { name: "Industrial REITs", value: 20, color: "#8E24AA" },
            { name: "Specialty REITs", value: 10, color: "#AB47BC" }
        ],
        positions: [{
            id: "reit-basket",
            assetType: "basket",
            name: "REIT Income Portfolio",
            positions: [
                { id: "pld", assetType: "stock", ticker: "PLD", quantity: 1000, avgPrice: 120, currentPrice: 125, basket: null,
                    trades: [{ tradeId: "pld-entry", action: "BUY", side: "LONG", quantity: 1000, price: 120, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "eqr", assetType: "stock", ticker: "EQR", quantity: 1500, avgPrice: 65, currentPrice: 68, basket: null,
                    trades: [{ tradeId: "eqr-entry", action: "BUY", side: "LONG", quantity: 1500, price: 65, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "dlr", assetType: "stock", ticker: "DLR", quantity: 800, avgPrice: 110, currentPrice: 115, basket: null,
                    trades: [{ tradeId: "dlr-entry", action: "BUY", side: "LONG", quantity: 800, price: 110, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    internationaldeveloped: {
        id: "intl-developed",
        name: "International Developed",
        focus: "Developed markets outside US",
        icon: getScenarioIcon(Globe2Icon),
        tags: ["International", "Developed", "Diversification"],
        risk: "Moderate",
        value: 2100000,
        return: 105,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Europe", value: 40, color: "#0D47A1" },
            { name: "Japan", value: 30, color: "#1565C0" },
            { name: "Australia", value: 15, color: "#1976D2" },
            { name: "Canada", value: 15, color: "#1E88E5" }
        ],
        positions: [{
            id: "intl-basket",
            assetType: "basket",
            name: "International Developed Markets",
            positions: [
                { id: "eafe", assetType: "stock", ticker: "EFA", quantity: 2500, avgPrice: 72, currentPrice: 76, basket: null,
                    trades: [{ tradeId: "efa-entry", action: "BUY", side: "LONG", quantity: 2500, price: 72, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "ewj", assetType: "stock", ticker: "EWJ", quantity: 2000, avgPrice: 58, currentPrice: 62, basket: null,
                    trades: [{ tradeId: "ewj-entry", action: "BUY", side: "LONG", quantity: 2000, price: 58, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "ewa", assetType: "stock", ticker: "EWA", quantity: 1500, avgPrice: 22, currentPrice: 24, basket: null,
                    trades: [{ tradeId: "ewa-entry", action: "BUY", side: "LONG", quantity: 1500, price: 22, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    retailFavorites: {
        id: "retail-favs",
        name: "Retail Trader Favorites",
        focus: "Most popular stocks among retail traders",
        icon: getScenarioIcon(UsersIcon),
        tags: ["Popular", "Retail", "Mixed"],
        risk: "High",
        value: 1500000,
        return: 155,
        returnClass: "text-green-500",
        chartVariant: "volatile",
        allocation: [
            { name: "Tech Giants", value: 40, color: "#311B92" },
            { name: "EV & Green", value: 30, color: "#4527A0" },
            { name: "Social Media", value: 30, color: "#512DA8" }
        ],
        positions: [{
            id: "retail-basket",
            assetType: "basket",
            name: "Retail Favorites Portfolio",
            positions: [
                { id: "tsla-retail", assetType: "stock", ticker: "TSLA", quantity: 500, avgPrice: 220, currentPrice: 240, basket: null,
                    trades: [{ tradeId: "tsla-retail-entry", action: "BUY", side: "LONG", quantity: 500, price: 220, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "aapl-retail", assetType: "stock", ticker: "AAPL", quantity: 800, avgPrice: 170, currentPrice: 190, basket: null,
                    trades: [{ tradeId: "aapl-retail-entry", action: "BUY", side: "LONG", quantity: 800, price: 170, datetime: "2023-01-01T10:00:00Z" }]
                },
                { id: "meta-retail", assetType: "stock", ticker: "META", quantity: 400, avgPrice: 280, currentPrice: 330, basket: null,
                    trades: [{ tradeId: "meta-retail-entry", action: "BUY", side: "LONG", quantity: 400, price: 280, datetime: "2023-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    robinhoodPopular2024: {
        id: "rh-popular-2024",
        name: "Most Popular on Robinhood",
        focus: "Top traded stocks by Robinhood users",
        icon: getScenarioIcon(TrendingIcon),
        tags: ["Popular", "Mixed", "Growth"],
        risk: "High",
        value: 2200000,
        return: 135,
        returnClass: "text-green-500",
        chartVariant: "volatile",
        allocation: [
            { name: "Tech", value: 40, color: "#00BCD4" },
            { name: "EVs", value: 30, color: "#4CAF50" },
            { name: "Social", value: 30, color: "#9C27B0" }
        ],
        positions: [{
            id: "rh-pop-basket",
            assetType: "basket",
            name: "Robinhood Most Popular",
            positions: [
                { id: "aapl-pop", assetType: "stock", ticker: "AAPL", quantity: 1000, avgPrice: 170, currentPrice: 190, basket: null,
                    trades: [{ tradeId: "aapl-pop-entry", action: "BUY", side: "LONG", quantity: 1000, price: 170, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "tsla-pop", assetType: "stock", ticker: "TSLA", quantity: 800, avgPrice: 200, currentPrice: 240, basket: null,
                    trades: [{ tradeId: "tsla-pop-entry", action: "BUY", side: "LONG", quantity: 800, price: 200, datetime: "2019-02-15T10:00:00Z" }]
                },
                { id: "nvda-pop", assetType: "stock", ticker: "NVDA", quantity: 600, avgPrice: 400, currentPrice: 450, basket: null,
                    trades: [{ tradeId: "nvda-pop-entry", action: "BUY", side: "LONG", quantity: 600, price: 400, datetime: "2019-02-15T10:00:00Z" }]
                }
            ]
        }]
    },

    memeStocks2024: {
        id: "meme-2024",
        name: "2024 Meme Stocks",
        focus: "Social media driven stock picks",
        icon: getScenarioIcon(RocketIcon),
        tags: ["Meme", "Speculative", "Retail"],
        risk: "Extreme",
        value: 1200000,
        return: 250,
        returnClass: "text-green-500",
        chartVariant: "volatile",
        allocation: [
            { name: "WSB Favorites", value: 60, color: "#FF4500" },
            { name: "Short Squeeze", value: 40, color: "#9400D3" }
        ],
        positions: [{
            id: "meme-2024-basket",
            assetType: "basket",
            name: "2024 Meme Stock Portfolio",
            positions: [
                { id: "bbby", assetType: "stock", ticker: "BBBY", quantity: 5000, avgPrice: 4, currentPrice: 8, basket: null,
                    trades: [{ tradeId: "bbby-entry", action: "BUY", side: "LONG", quantity: 5000, price: 4, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "amc", assetType: "stock", ticker: "AMC", quantity: 3000, avgPrice: 6, currentPrice: 12, basket: null,
                    trades: [{ tradeId: "amc-entry", action: "BUY", side: "LONG", quantity: 3000, price: 6, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    topDividendETFs: {
        id: "div-etfs",
        name: "High Yield ETF Bundle",
        focus: "Top dividend-paying ETFs",
        icon: getScenarioIcon(DollarSignIcon),
        tags: ["Income", "Dividends", "ETF"],
        risk: "Low",
        value: 2500000,
        return: 95,
        returnClass: "text-green-500",
        chartVariant: "income",
        allocation: [
            { name: "Broad Market", value: 40, color: "#2E7D32" },
            { name: "Preferred", value: 30, color: "#1565C0" },
            { name: "REITs", value: 30, color: "#6A1B9A" }
        ],
        positions: [{
            id: "div-etf-basket",
            assetType: "basket",
            name: "Dividend ETF Portfolio",
            positions: [
                { id: "schd", assetType: "stock", ticker: "SCHD", quantity: 3000, avgPrice: 75, currentPrice: 78, basket: null,
                    trades: [{ tradeId: "schd-entry", action: "BUY", side: "LONG", quantity: 3000, price: 75, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "vym", assetType: "stock", ticker: "VYM", quantity: 2500, avgPrice: 105, currentPrice: 110, basket: null,
                    trades: [{ tradeId: "vym-entry", action: "BUY", side: "LONG", quantity: 2500, price: 105, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    techGiants: {
        id: "magnificent-seven",
        name: "Magnificent Seven",
        focus: "Top performing tech megacaps",
        icon: getScenarioIcon(AwardIcon),
        tags: ["Tech", "Large Cap", "Growth"],
        risk: "Moderate",
        value: 3500000,
        return: 180,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "AI & Cloud", value: 60, color: "#00BCD4" },
            { name: "Consumer Tech", value: 40, color: "#9C27B0" }
        ],
        positions: [{
            id: "mag-seven-basket",
            assetType: "basket",
            name: "Magnificent Seven Portfolio",
            positions: [
                { id: "nvda-mag7", assetType: "stock", ticker: "NVDA", quantity: 500, avgPrice: 400, currentPrice: 450, basket: null,
                    trades: [{ tradeId: "nvda-m7-entry", action: "BUY", side: "LONG", quantity: 500, price: 400, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "meta-mag7", assetType: "stock", ticker: "META", quantity: 600, avgPrice: 300, currentPrice: 330, basket: null,
                    trades: [{ tradeId: "meta-m7-entry", action: "BUY", side: "LONG", quantity: 600, price: 300, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    smallCapGrowth: {
        id: "small-cap-growth",
        name: "Small Cap Growth Stars",
        focus: "High-growth small cap companies",
        icon: getScenarioIcon(TrendingUpIcon),
        tags: ["Small Cap", "Growth", "Momentum"],
        risk: "High",
        value: 1400000,
        return: 165,
        returnClass: "text-green-500",
        chartVariant: "growth",
        allocation: [
            { name: "Technology", value: 50, color: "#00BCD4" },
            { name: "Healthcare", value: 30, color: "#4CAF50" },
            { name: "Consumer", value: 20, color: "#FFC107" }
        ],
        positions: [{
            id: "small-cap-basket",
            assetType: "basket",
            name: "Small Cap Growth Portfolio",
            positions: [
                { id: "upst", assetType: "stock", ticker: "UPST", quantity: 2000, avgPrice: 25, currentPrice: 35, basket: null,
                    trades: [{ tradeId: "upst-entry", action: "BUY", side: "LONG", quantity: 2000, price: 25, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "dkng", assetType: "stock", ticker: "DKNG", quantity: 3000, avgPrice: 15, currentPrice: 20, basket: null,
                    trades: [{ tradeId: "dkng-entry", action: "BUY", side: "LONG", quantity: 3000, price: 15, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    sustainableInvesting: {
        id: "esg-leaders",
        name: "ESG Leaders",
        focus: "Environmental, Social, Governance leaders",
        icon: getScenarioIcon(LeafIcon),
        tags: ["ESG", "Sustainable", "Clean Energy"],
        risk: "Moderate",
        value: 2000000,
        return: 120,
        returnClass: "text-green-500",
        chartVariant: "default",
        allocation: [
            { name: "Clean Energy", value: 40, color: "#4CAF50" },
            { name: "Social Impact", value: 30, color: "#2196F3" },
            { name: "Governance", value: 30, color: "#9C27B0" }
        ],
        positions: [{
            id: "esg-basket",
            assetType: "basket",
            name: "ESG Leaders Portfolio",
            positions: [
                { id: "icln", assetType: "stock", ticker: "ICLN", quantity: 4000, avgPrice: 20, currentPrice: 22, basket: null,
                    trades: [{ tradeId: "icln-entry", action: "BUY", side: "LONG", quantity: 4000, price: 20, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "esg", assetType: "stock", ticker: "ESG", quantity: 2500, avgPrice: 85, currentPrice: 90, basket: null,
                    trades: [{ tradeId: "esg-entry", action: "BUY", side: "LONG", quantity: 2500, price: 85, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    cryptoTraders: {
        id: "crypto-stocks",
        name: "Crypto Stock Basket",
        focus: "Crypto-related equities",
        icon: getScenarioIcon(BitcoinIcon),
        tags: ["Crypto", "Blockchain", "Fintech"],
        risk: "High",
        value: 1600000,
        return: 200,
        returnClass: "text-green-500",
        chartVariant: "crypto",
        allocation: [
            { name: "Mining", value: 40, color: "#F7931A" },
            { name: "Exchanges", value: 40, color: "#627EEA" },
            { name: "Infrastructure", value: 20, color: "#8C8C8C" }
        ],
        positions: [{
            id: "crypto-stock-basket",
            assetType: "basket",
            name: "Crypto Stock Portfolio",
            positions: [
                { id: "mstr", assetType: "stock", ticker: "MSTR", quantity: 300, avgPrice: 400, currentPrice: 500, basket: null,
                    trades: [{ tradeId: "mstr-entry", action: "BUY", side: "LONG", quantity: 300, price: 400, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "coin", assetType: "stock", ticker: "COIN", quantity: 1000, avgPrice: 80, currentPrice: 100, basket: null,
                    trades: [{ tradeId: "coin-entry", action: "BUY", side: "LONG", quantity: 1000, price: 80, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    aiInnovators: {
        id: "ai-basket",
        name: "AI Revolution Stocks",
        focus: "Leaders in artificial intelligence",
        icon: getScenarioIcon(BrainIcon),
        tags: ["AI", "Tech", "Innovation"],
        risk: "High",
        value: 2800000,
        return: 210,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Hardware", value: 50, color: "#76B900" },
            { name: "Software", value: 50, color: "#00A4EF" }
        ],
        positions: [{
            id: "ai-stock-basket",
            assetType: "basket",
            name: "AI Innovation Portfolio",
            positions: [
                { id: "nvda-ai", assetType: "stock", ticker: "NVDA", quantity: 400, avgPrice: 400, currentPrice: 450, basket: null,
                    trades: [{ tradeId: "nvda-ai-entry", action: "BUY", side: "LONG", quantity: 400, price: 400, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "crm-ai", assetType: "stock", ticker: "CRM", quantity: 500, avgPrice: 200, currentPrice: 240, basket: null,
                    trades: [{ tradeId: "crm-ai-entry", action: "BUY", side: "LONG", quantity: 500, price: 200, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    biotech2024: {
        id: "biotech-basket",
        name: "Biotech Breakthroughs",
        focus: "Innovative biotechnology companies",
        icon: getScenarioIcon(ActivityIcon),
        tags: ["Biotech", "Healthcare", "Research"],
        risk: "Very High",
        value: 1800000,
        return: 160,
        returnClass: "text-green-500",
        chartVariant: "biotech",
        allocation: [
            { name: "Gene Editing", value: 40, color: "#E91E63" },
            { name: "Drug Discovery", value: 40, color: "#9C27B0" },
            { name: "Diagnostics", value: 20, color: "#3F51B5" }
        ],
        positions: [{
            id: "biotech-basket",
            assetType: "basket",
            name: "Biotech Portfolio",
            positions: [
                { id: "beam", assetType: "stock", ticker: "BEAM", quantity: 1500, avgPrice: 40, currentPrice: 50, basket: null,
                    trades: [{ tradeId: "beam-entry", action: "BUY", side: "LONG", quantity: 1500, price: 40, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "crsp", assetType: "stock", ticker: "CRSP", quantity: 1000, avgPrice: 60, currentPrice: 70, basket: null,
                    trades: [{ tradeId: "crsp-entry", action: "BUY", side: "LONG", quantity: 1000, price: 60, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    },

    spaceExploration: {
        id: "space-tech",
        name: "Space Technology",
        focus: "Space exploration and satellite companies",
        icon: getScenarioIcon(RocketIcon),
        tags: ["Space", "Aerospace", "Technology"],
        risk: "High",
        value: 1500000,
        return: 140,
        returnClass: "text-green-500",
        chartVariant: "tech",
        allocation: [
            { name: "Launch", value: 40, color: "#303F9F" },
            { name: "Satellites", value: 40, color: "#0288D1" },
            { name: "Defense", value: 20, color: "#455A64" }
        ],
        positions: [{
            id: "space-basket",
            assetType: "basket",
            name: "Space Technology Portfolio",
            positions: [
                { id: "spce", assetType: "stock", ticker: "SPCE", quantity: 4000, avgPrice: 10, currentPrice: 15, basket: null,
                    trades: [{ tradeId: "spce-entry", action: "BUY", side: "LONG", quantity: 4000, price: 10, datetime: "2024-01-01T10:00:00Z" }]
                },
                { id: "maxr", assetType: "stock", ticker: "MAXR", quantity: 2000, avgPrice: 25, currentPrice: 30, basket: null,
                    trades: [{ tradeId: "maxr-entry", action: "BUY", side: "LONG", quantity: 2000, price: 25, datetime: "2024-01-01T10:00:00Z" }]
                }
            ]
        }]
    }
}

export type ScenarioKey = keyof typeof PORTFOLIO_SCENARIOS;