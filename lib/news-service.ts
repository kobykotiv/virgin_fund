import { DEMO_ASSETS } from "./demo-data"

// News sources
export enum NewsSource {
  YAHOO_FINANCE = "Yahoo Finance",
  GOOGLE_FINANCE = "Google Finance",
  BLOOMBERG = "Bloomberg",
  CNBC = "CNBC",
  REUTERS = "Reuters",
  WALL_STREET_JOURNAL = "Wall Street Journal",
  FINANCIAL_TIMES = "Financial Times",
  SEEKING_ALPHA = "Seeking Alpha",
  MARKET_WATCH = "Market Watch",
  MOTLEY_FOOL = "Motley Fool",
}

// News sentiment
export enum NewsSentiment {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
}

// News article interface
export interface NewsArticle {
  id: string
  title: string
  summary: string
  content?: string
  url: string
  source: NewsSource
  publishedAt: string
  tickers: string[]
  image?: string
  sentiment?: NewsSentiment
  sentimentScore?: number // -1 to 1 scale
  keywords?: string[]
  isBreaking?: boolean
}

// News search params
export interface NewsSearchParams {
  ticker?: string
  query?: string
  sources?: NewsSource[]
  startDate?: Date
  endDate?: Date
  sentiment?: NewsSentiment
  limit?: number
  offset?: number
}

// Generate a random date within the last 7 days
function getRandomRecentDate(): Date {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 7) // 0-7 days ago
  const hoursAgo = Math.floor(Math.random() * 24) // 0-24 hours ago
  const minutesAgo = Math.floor(Math.random() * 60) // 0-60 minutes ago

  now.setDate(now.getDate() - daysAgo)
  now.setHours(now.getHours() - hoursAgo)
  now.setMinutes(now.getMinutes() - minutesAgo)

  return now
}

// Generate a random sentiment score between -1 and 1
function getRandomSentimentScore(): number {
  return Math.round((Math.random() * 2 - 1) * 100) / 100
}

// Determine sentiment category based on score
function getSentimentCategory(score: number): NewsSentiment {
  if (score > 0.2) return NewsSentiment.POSITIVE
  if (score < -0.2) return NewsSentiment.NEGATIVE
  return NewsSentiment.NEUTRAL
}

// Generate mock news articles for a specific ticker
function generateMockNewsForTicker(ticker: string, count = 10): NewsArticle[] {
  const articles: NewsArticle[] = []
  const sources = Object.values(NewsSource)

  // Company name based on ticker
  const companyName = DEMO_ASSETS.find((asset) => asset.symbol === ticker)?.name || ticker

  // News templates for different sentiments
  const newsTemplates = {
    [NewsSentiment.POSITIVE]: [
      `${companyName} Reports Strong Quarterly Earnings, Exceeding Expectations`,
      `${companyName} Announces New Product Launch, Stock Surges`,
      `${companyName} Expands into New Markets, Analysts Bullish`,
      `${companyName} Secures Major Partnership Deal`,
      `Analysts Upgrade ${companyName} Stock to "Buy"`,
      `${companyName} Increases Dividend, Shareholders Rejoice`,
      `${companyName} Beats Revenue Forecasts, Shares Rally`,
      `${ticker} Stock Hits New 52-Week High on Positive Outlook`,
      `${companyName} Announces Share Buyback Program`,
      `${companyName} CEO Optimistic About Future Growth Prospects`,
    ],
    [NewsSentiment.NEGATIVE]: [
      `${companyName} Misses Earnings Targets, Stock Tumbles`,
      `${companyName} Faces Regulatory Scrutiny, Investors Concerned`,
      `${companyName} Announces Layoffs Amid Restructuring`,
      `${companyName} Lowers Guidance, Citing Market Challenges`,
      `Analysts Downgrade ${companyName} Stock to "Sell"`,
      `${companyName} Faces Increased Competition, Market Share Declining`,
      `${ticker} Stock Drops on Disappointing Sales Figures`,
      `${companyName} Delays Product Launch, Investors Wary`,
      `${companyName} Faces Lawsuit Over Business Practices`,
      `${companyName} CFO Resigns Unexpectedly, Raising Questions`,
    ],
    [NewsSentiment.NEUTRAL]: [
      `${companyName} Reports Quarterly Results In Line With Expectations`,
      `${companyName} Announces Leadership Changes`,
      `${companyName} Holds Annual Shareholder Meeting`,
      `${companyName} Updates Long-Term Strategy`,
      `Analysts Maintain "Hold" Rating on ${ticker} Stock`,
      `${companyName} Completes Previously Announced Acquisition`,
      `${companyName} Releases Sustainability Report`,
      `${companyName} to Present at Upcoming Industry Conference`,
      `${companyName} Refinances Existing Debt`,
      `${ticker} Trading Volume Increases Amid Market Volatility`,
    ],
  }

  // Summary templates
  const summaryTemplates = {
    [NewsSentiment.POSITIVE]: [
      `${companyName} reported strong financial results, with revenue and earnings exceeding analyst expectations.`,
      `Investors responded positively to ${companyName}'s latest announcement, pushing the stock higher.`,
      `The new strategic initiative by ${companyName} is expected to drive significant growth in the coming quarters.`,
      `Analysts are optimistic about ${companyName}'s prospects following the latest developments.`,
      `The market reacted favorably to ${companyName}'s latest news, with trading volume above average.`,
    ],
    [NewsSentiment.NEGATIVE]: [
      `${companyName} reported disappointing results, falling short of Wall Street expectations.`,
      `Investors expressed concern about ${companyName}'s latest announcement, sending shares lower.`,
      `The challenges facing ${companyName} could impact performance in the coming quarters.`,
      `Analysts have revised their outlook for ${companyName} following the negative developments.`,
      `Market sentiment toward ${companyName} has soured amid ongoing concerns.`,
    ],
    [NewsSentiment.NEUTRAL]: [
      `${companyName}'s latest announcement is not expected to significantly impact financial performance.`,
      `Analysts maintain a cautious stance on ${companyName} as the market assesses recent developments.`,
      `${companyName} continues to execute its strategy amid changing market conditions.`,
      `Investors are closely monitoring ${companyName}'s progress on key initiatives.`,
      `The latest news from ${companyName} aligns with the company's previously stated objectives.`,
    ],
  }

  for (let i = 0; i < count; i++) {
    const publishedAt = getRandomRecentDate()
    const sentimentScore = getRandomSentimentScore()
    const sentiment = getSentimentCategory(sentimentScore)

    // Select random templates based on sentiment
    const titleTemplates = newsTemplates[sentiment]
    const summaryTemplateOptions = summaryTemplates[sentiment]

    const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
    const summary = summaryTemplateOptions[Math.floor(Math.random() * summaryTemplateOptions.length)]

    // Generate related tickers (1-3 additional tickers)
    const relatedTickersCount = Math.floor(Math.random() * 3)
    const allTickers = [ticker]

    for (let j = 0; j < relatedTickersCount; j++) {
      const randomAsset = DEMO_ASSETS[Math.floor(Math.random() * DEMO_ASSETS.length)]
      if (!allTickers.includes(randomAsset.symbol)) {
        allTickers.push(randomAsset.symbol)
      }
    }

    // Generate keywords
    const keywords = [
      ticker,
      companyName,
      sentiment === NewsSentiment.POSITIVE ? "growth" : "",
      sentiment === NewsSentiment.NEGATIVE ? "risk" : "",
      "stocks",
      "market",
      "investing",
      Math.random() > 0.5 ? "earnings" : "",
      Math.random() > 0.7 ? "dividend" : "",
      Math.random() > 0.6 ? "trading" : "",
    ].filter((k) => k !== "")

    // Determine if this is a breaking news (10% chance)
    const isBreaking = Math.random() < 0.1

    articles.push({
      id: `news-${ticker}-${i}-${Date.now()}`,
      title,
      summary,
      url: `https://example.com/news/${ticker.toLowerCase()}/${i}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      publishedAt: publishedAt.toISOString(),
      tickers: allTickers,
      sentiment,
      sentimentScore,
      keywords,
      isBreaking,
    })
  }

  // Sort by published date (newest first)
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// Generate mock news for all assets
function generateAllMockNews(count = 100): NewsArticle[] {
  let allNews: NewsArticle[] = []

  // Generate some news for each asset
  DEMO_ASSETS.forEach((asset) => {
    const newsCount = Math.floor(Math.random() * 10) + 5 // 5-15 articles per asset
    const assetNews = generateMockNewsForTicker(asset.symbol, newsCount)
    allNews = [...allNews, ...assetNews]
  })

  // Generate some general market news
  const marketNews = generateMockNewsForTicker("MARKET", 20)
  allNews = [...allNews, ...marketNews]

  // Sort by published date (newest first) and limit to count
  return allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, count)
}

// Cache for news data
let newsCache: NewsArticle[] | null = null

// Search news articles
export async function searchNews(params: NewsSearchParams): Promise<NewsArticle[]> {
  // Generate mock news if cache is empty
  if (!newsCache) {
    newsCache = generateAllMockNews(200)
  }

  // Filter based on search params
  let results = [...newsCache]

  // Filter by ticker
  if (params.ticker) {
    results = results.filter(
      (article) =>
        article.tickers.includes(params.ticker!) ||
        article.title.includes(params.ticker!) ||
        article.summary.includes(params.ticker!),
    )
  }

  // Filter by query
  if (params.query) {
    const query = params.query.toLowerCase()
    results = results.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.keywords?.some((k) => k.toLowerCase().includes(query)),
    )
  }

  // Filter by sources
  if (params.sources && params.sources.length > 0) {
    results = results.filter((article) => params.sources!.includes(article.source))
  }

  // Filter by date range
  if (params.startDate) {
    const startDate = new Date(params.startDate).getTime()
    results = results.filter((article) => new Date(article.publishedAt).getTime() >= startDate)
  }

  if (params.endDate) {
    const endDate = new Date(params.endDate).getTime()
    results = results.filter((article) => new Date(article.publishedAt).getTime() <= endDate)
  }

  // Filter by sentiment
  if (params.sentiment) {
    results = results.filter((article) => article.sentiment === params.sentiment)
  }

  // Apply pagination
  const offset = params.offset || 0
  const limit = params.limit || 10

  return results.slice(offset, offset + limit)
}

// Get breaking news
export async function getBreakingNews(limit = 5): Promise<NewsArticle[]> {
  // Generate mock news if cache is empty
  if (!newsCache) {
    newsCache = generateAllMockNews(200)
  }

  // Filter breaking news and return the most recent ones
  return newsCache
    .filter((article) => article.isBreaking)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

// Get news for a specific ticker
export async function getNewsForTicker(ticker: string, limit = 10): Promise<NewsArticle[]> {
  return searchNews({ ticker, limit })
}

// Get latest news
export async function getLatestNews(limit = 10): Promise<NewsArticle[]> {
  // Generate mock news if cache is empty
  if (!newsCache) {
    newsCache = generateAllMockNews(200)
  }

  // Return the most recent news
  return newsCache.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, limit)
}

// Analyze sentiment for text
export function analyzeSentiment(text: string): { sentiment: NewsSentiment; score: number } {
  // In a real implementation, this would use NLP or a sentiment analysis API
  // For demo purposes, we'll generate a random sentiment
  const score = getRandomSentimentScore()
  return {
    sentiment: getSentimentCategory(score),
    score,
  }
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return `${diffSecs} seconds ago`
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString()
  }
}

