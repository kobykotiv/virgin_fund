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
                }
            ]
        }]
    },
    darknetMarkets: {
        id: "darknet-markets",
        name: "Darknet Markets",
        focus: "Investing in darknet market cryptocurrencies",
        icon: "Skull",
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
        icon: "Home",
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
        icon: "Home",
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
        icon: "Virus",
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
        icon: "Laptop",
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
        icon: "Balance",
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
        focus: "Non-traditional investments",
        icon: "Diamonds",
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
        icon: "Rocket",
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
}

export type ScenarioKey = keyof typeof PORTFOLIO_SCENARIOS;