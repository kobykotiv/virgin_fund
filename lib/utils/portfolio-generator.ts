import { 
  LucideIcon, 
  Bitcoin as BitcoinIcon, 
  Building2, 
  Gem, 
  Globe, 
  Scale, 
  DollarSign,
  BarChart2,
  LineChart,
  Landmark,
  Cpu,
  Zap,
  Cloud,
  Droplet,
  Briefcase
} from "lucide-react"

// Asset universe
const ASSET_UNIVERSE = {
  us_tech: ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "ADBE", "CRM", "INTC", "AMD", "PYPL"],
  us_blue_chips: ["JNJ", "PG", "KO", "WMT", "PEP", "JPM", "BAC", "V", "MA", "DIS", "HD", "MCD"],
  utilities: ["NEE", "DUK", "SO", "D", "AEP", "XEL", "ED", "EXC", "SRE", "PCG"],
  health: ["UNH", "PFE", "MRK", "ABT", "TMO", "DHR", "LLY", "BMY", "AMGN", "ISRG"],
  industrials: ["HON", "UPS", "BA", "CAT", "DE", "MMM", "LMT", "RTX", "UNP", "FDX"],
  energy: ["XOM", "CVX", "BP", "RDS.A", "TOT", "ENB", "KMI", "COP", "PSX", "VLO"],
  etfs: ["SPY", "QQQ", "DIA", "IWM", "VTI", "VOO", "VGT", "XLK", "XLF", "XLV", "XLE", "XLI", "XLU", "GLD", "SLV"],
  crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "ADA-USD", "DOT-USD", "LINK-USD"],
  international: ["BABA", "TCEHY", "TSM", "TM", "BP", "SHEL", "NSRGY", "NVO", "ASML", "SAN"],
  real_estate: ["AMT", "PLD", "CCI", "EQIX", "PSA", "O", "AVB", "ESS", "DLR", "VTR"]
}

// Portfolio templates for different strategies
const PORTFOLIO_TEMPLATES = [
  {
    name: "Tech Growth",
    focus: "High-growth technology companies",
    risk: "High",
    assets: [...ASSET_UNIVERSE.us_tech, ...ASSET_UNIVERSE.crypto.slice(0, 2)],
    icon: Cpu,
    tags: ["Tech", "Growth", "Innovation"]
  },
  {
    name: "Blue Chip Value",
    focus: "Stable dividend-paying companies",
    risk: "Low",
    assets: ASSET_UNIVERSE.us_blue_chips,
    icon: Building2,
    tags: ["Value", "Dividends", "Defensive"]
  },
  {
    name: "Balanced Portfolio",
    focus: "Diversified asset allocation",
    risk: "Moderate",
    assets: [...ASSET_UNIVERSE.us_blue_chips.slice(0, 5), ...ASSET_UNIVERSE.us_tech.slice(0, 3), ...ASSET_UNIVERSE.etfs.slice(0, 2)],
    icon: Scale,
    tags: ["Balanced", "Mixed", "Core"]
  },
  {
    name: "Crypto Pioneer",
    focus: "Emerging blockchain technologies",
    risk: "High",
    assets: ASSET_UNIVERSE.crypto,
    icon: BitcoinIcon,
    tags: ["Crypto", "Blockchain", "High Risk"]
  },
  {
    name: "Global Diversification",
    focus: "International market exposure",
    risk: "Moderate",
    assets: [...ASSET_UNIVERSE.international, ...ASSET_UNIVERSE.etfs.slice(5, 8)],
    icon: Globe,
    tags: ["Global", "International", "Diversified"]
  },
  {
    name: "Income Generator",
    focus: "High-yield dividend stocks",
    risk: "Low",
    assets: [...ASSET_UNIVERSE.utilities, ...ASSET_UNIVERSE.us_blue_chips.slice(0, 5)],
    icon: DollarSign,
    tags: ["Income", "Dividends", "Yield"]
  },
  {
    name: "Healthcare Innovation",
    focus: "Biotech and healthcare advancements",
    risk: "High",
    assets: ASSET_UNIVERSE.health,
    icon: Gem,
    tags: ["Healthcare", "Biotech", "Growth"]
  },
  {
    name: "Energy Transition",
    focus: "Clean energy and traditional producers",
    risk: "Moderate",
    assets: ASSET_UNIVERSE.energy,
    icon: Zap,
    tags: ["Energy", "Commodities", "Transition"]
  },
  {
    name: "Financial Services",
    focus: "Banking and payment systems",
    risk: "Moderate",
    assets: ["JPM", "BAC", "WFC", "C", "GS", "MS", "V", "MA", "AXP", "PYPL"],
    icon: Landmark,
    tags: ["Financial", "Banking", "Payments"]
  },
  {
    name: "Cloud Computing",
    focus: "Cloud infrastructure and SaaS",
    risk: "High",
    assets: ["MSFT", "AMZN", "GOOGL", "CRM", "NET", "DDOG", "SNOW", "ZS", "CRWD", "TEAM"],
    icon: Cloud,
    tags: ["Cloud", "SaaS", "Tech"]
  }
]

// Generate 45+ unique portfolios using templates with variations
export function generatePortfolios(count = 48) {
  const portfolios = [];
  
  // First, ensure we have enough templates as a base
  for (let i = 0; i < count; i++) {
    // Select a template, cycling through all templates multiple times
    const templateIndex = i % PORTFOLIO_TEMPLATES.length;
    const template = PORTFOLIO_TEMPLATES[templateIndex];
    
    // Create variations to make each portfolio unique
    const seed = i / count; // 0 to almost 1
    const positions = generatePositions(template.assets, seed);
    const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
    
    // Generate a variety of sentiment indicators
    // Distribute sentiments: ~40% bullish, ~30% neutral, ~30% bearish
    let sentiment;
    if (i % 10 < 4) sentiment = "bullish";
    else if (i % 10 < 7) sentiment = "neutral";
    else sentiment = "bearish";
    
    // Strength varies from 30-95%
    const sentimentStrength = 30 + Math.floor(seed * 65);
    
    // For fear/greed, create a distribution:
    // 0-25: Extreme Fear, 25-40: Fear, 40-60: Neutral, 60-75: Greed, 75-100: Extreme Greed
    let fearGreedIndex;
    if (sentiment === "bearish") {
      // Bearish portfolios have lower fear/greed (more fear)
      fearGreedIndex = 5 + Math.floor(seed * 35);
    } else if (sentiment === "neutral") {
      // Neutral portfolios are in the middle range
      fearGreedIndex = 40 + Math.floor(seed * 20);
    } else {
      // Bullish portfolios have higher fear/greed (more greed)
      fearGreedIndex = 60 + Math.floor(seed * 35);
    }
    
    // Set the appropriate fear/greed label
    let fearGreedLabel;
    if (fearGreedIndex < 25) fearGreedLabel = "Extreme Fear";
    else if (fearGreedIndex < 40) fearGreedLabel = "Fear";
    else if (fearGreedIndex < 60) fearGreedLabel = "Neutral";
    else if (fearGreedIndex < 75) fearGreedLabel = "Greed";
    else fearGreedLabel = "Extreme Greed";
    
    // Create allocation data from positions
    const allocation = positions.map(pos => ({
      name: pos.symbol,
      value: Number(((pos.value / totalValue) * 100).toFixed(1))
    }));
    
    // Generate historical data for the chart
    const historicalData = generateHistoricalData(seed, sentiment);
    
    // Define a return based on sentiment
    const returnValue = sentiment === "bullish" ? (5 + seed * 25) :
                      sentiment === "neutral" ? (-5 + seed * 10) :
                      (-25 + seed * 15);
                      
    const returnStr = returnValue >= 0 ? `+${returnValue.toFixed(1)}%` : `${returnValue.toFixed(1)}%`;
    
    // Add a unique number to make the name distinct
    const uniqueSuffix = i + 1;
    
    portfolios.push({
      id: `portfolio-${uniqueSuffix}`,
      name: `${template.name} ${uniqueSuffix}`,
      focus: template.focus,
      risk: template.risk,
      tags: template.tags,
      value: `$${totalValue.toLocaleString()}`,
      return: returnStr,
      returnClass: returnValue >= 0 ? "text-green-500" : "text-red-500",
      chartVariant: returnValue > 5 ? "up" : returnValue > -5 ? "volatile" : "down",
      icon: template.icon,
      allocation,
      historicalData,
      sentiment,
      sentimentStrength,
      fearGreedIndex,
      fearGreedLabel,
      positions
    });
  }
  
  return portfolios;
}

// Generate realistic positions based on asset list
function generatePositions(assets, seed) {
  const positions = [];
  const assetCount = 4 + Math.floor(seed * 6); // 4-10 assets
  
  // Select random assets based on seed
  const shuffledAssets = [...assets].sort(() => 0.5 - Math.random());
  const selectedAssets = shuffledAssets.slice(0, Math.min(assetCount, assets.length));
  
  // Create positions with realistic values
  selectedAssets.forEach(symbol => {
    const basePrice = getAssetBasePrice(symbol);
    const quantity = Math.floor(10 + seed * 990); // 10-1000 units
    const value = basePrice * quantity;
    
    positions.push({
      symbol,
      quantity,
      avgPrice: basePrice * (0.8 + seed * 0.4), // Some variety in entry price
      currentPrice: basePrice,
      value
    });
  });
  
  return positions;
}

// Generate historical price data based on sentiment
function generateHistoricalData(seed, sentiment) {
  const days = 90;
  const data = [];
  
  // Base starting value
  let value = 100000 + seed * 900000; // $100k to $1M
  
  // Trend factor based on sentiment
  let trendFactor;
  if (sentiment === "bullish") {
    trendFactor = 0.001 + seed * 0.003; // Strong positive trend
  } else if (sentiment === "bearish") {
    trendFactor = -0.003 + seed * 0.002; // Negative trend
  } else {
    trendFactor = -0.001 + seed * 0.002; // Mixed/neutral trend
  }
  
  // Generate daily data points
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Add some randomness to each day's change
    const dailyChange = trendFactor + (Math.random() * 0.02 - 0.01);
    value = value * (1 + dailyChange);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }
  
  return data;
}

// Get realistic base prices for various assets
function getAssetBasePrice(symbol) {
  // Common asset prices
  const prices = {
    "AAPL": 180, "MSFT": 330, "GOOGL": 130, "AMZN": 145, "META": 300,
    "NVDA": 430, "TSLA": 240, "JNJ": 150, "PG": 160, "WMT": 59,
    "BTC-USD": 60000, "ETH-USD": 3000, "SPY": 450, "QQQ": 380
  };
  
  // Return known price or generate a reasonable one based on asset type
  if (prices[symbol]) return prices[symbol];
  
  // Generate reasonable prices for other assets
  if (symbol.includes("USD")) {
    // Crypto prices - wide range
    return 100 + Math.random() * 9900;
  } else if (symbol.includes("X") && symbol.length <= 4) {
    // ETFs usually $30-$200
    return 30 + Math.random() * 170;
  } else {
    // Regular stocks $20-$500
    return 20 + Math.random() * 480;
  }
}
