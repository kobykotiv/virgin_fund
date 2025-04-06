import { Portfolio } from "@/types/portfolio"

export const PORTFOLIO_SCENARIOS = {
    // [Previous scenarios remain unchanged...]

    chipotle2015: {
        id: "cmg-2015",
        name: "Chipotle Crisis Recovery",
        focus: "Investing during food safety crisis",
        icon: "Utensils",
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
        icon: "ShoppingCart",
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
        icon: "Cloud",
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
        icon: "VirtualReality",
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
        icon: "Home",
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
        icon: "Home",
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
        icon: "Home",
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
        icon: "Bitcoin",
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
        icon: "Rocket",
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
                },
                {
                    id: "saitama",
                    assetType: "crypto",
                    ticker: "SAITAMA",
                    quantity: 100000000,
                    avgPrice: 0.0000001,
                    currentPrice: 0.000001,
                    basket: null,
                    trades: [{
                        tradeId: "saitama-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 100000000,
                        price: 0.0000001,
                        datetime: "2021-07-01T10:00:00Z"
                    }]
                },
                {
                    id: "baby-doge",
                    assetType: "crypto",
                    ticker: "BABYDOGE",
                    quantity: 5000000000,
                    avgPrice: 0.00000001,
                    currentPrice: 0.0000001,
                    basket: null,
                    trades: [{
                        tradeId: "babydoge-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 5000000000,
                        price: 0.00000001,
                        datetime: "2021-08-01T10:00:00Z"
                    }]
                },
                {
                    id: "dogelon",
                    assetType: "crypto",
                    ticker: "ELON",
                    quantity: 1000000000,
                    avgPrice: 0.0000001,
                    currentPrice: 0.000001,
                    basket: null,
                    trades: [{
                        tradeId: "dogelon-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 1000000000,
                        price: 0.0000001,
                        datetime: "2021-09-01T10:00:00Z"
                    }]
                },
                {
                    id: "kishu",
                    assetType: "crypto",
                    ticker: "KISHU",
                    quantity: 10000000000,
                    avgPrice: 0.00000001,
                    currentPrice: 0.0000001,
                    basket: null,
                    trades: [{
                        tradeId: "kishu-entry",
                        action: "BUY",
                        side: "LONG",
                        quantity: 10000000000,
                        price: 0.00000001,
                        datetime: "2021-10-01T10:00:00Z"
                    }]
                }

            ]
        }]
    }
} as const

export type ScenarioKey = keyof typeof PORTFOLIO_SCENARIOS;