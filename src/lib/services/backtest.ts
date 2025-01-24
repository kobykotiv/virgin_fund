import { validateTicker } from '../search';
import { BacktestParams, BacktestResult, BacktestPosition, Transaction, BacktestMetrics, TechnicalIndicators, PeriodReturns, DCAPosition } from '../../types/backtest';
import { RSI, MACD, BollingerBands, ADX, Stochastic, ATR } from '@debut/indicators';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface BacktestRequest extends BacktestParams {
  positions?: DCAPosition[];
}

async function getHistoricalData(ticker: string, startDate: Date, endDate: Date): Promise<HistoricalDataPoint[]> {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=full`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    const timeSeries = data['Time Series (Daily)'];
    return Object.entries(timeSeries)
      .filter(([date]) => {
        const dateObj = new Date(date);
        return dateObj >= startDate && dateObj <= endDate;
      })
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume'])
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

function calculateTechnicalIndicators(data: HistoricalDataPoint[]): TechnicalIndicators {
  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const rsi = new RSI(14);
  const macdObj = new MACD();
  const bb = new BollingerBands(20);
  const adx = new ADX();
  const stoch = new Stochastic();
  const atr = new ATR();

  const indicators: TechnicalIndicators = {
    rsi: closes.map(price => rsi.nextValue(price) || 0),
    macd: {
      macd: [],
      signal: [],
      histogram: []
    },
    bollingerBands: {
      upper: [],
      middle: [],
      lower: []
    },
    adx: [],
    stochastic: {
      k: [],
      d: []
    },
    atr: []
  };

  // Calculate indicators
  data.forEach((d, i) => {
    // MACD
    const macdValue = macdObj.nextValue(d.close);
    if (macdValue) {
      indicators.macd.macd.push(macdValue.macd);
      indicators.macd.signal.push(macdValue.signal);
      indicators.macd.histogram.push(macdValue.histogram);
    }

    // Bollinger Bands
    const bbValue = bb.nextValue(d.close);
    if (bbValue) {
      indicators.bollingerBands.upper.push(bbValue.upper);
      indicators.bollingerBands.middle.push(bbValue.middle);
      indicators.bollingerBands.lower.push(bbValue.lower);
    }

    // ADX
    const adxValue = adx.nextValue(highs[i], lows[i], closes[i]);
    if (adxValue) {
      indicators.adx.push(adxValue.adx);
    }

    // Stochastic
    const stochValue = stoch.nextValue(highs[i], lows[i], closes[i]);
    if (stochValue) {
      indicators.stochastic.k.push(stochValue.k);
      indicators.stochastic.d.push(stochValue.d);
    }

    // ATR
    const atrValue = atr.nextValue(highs[i], lows[i], closes[i]);
    if (atrValue) {
      indicators.atr.push(atrValue);
    }
  });

  return indicators;
}

function calculatePeriodReturns(positions: BacktestPosition[]): PeriodReturns {
  const latestPosition = positions[positions.length - 1];
  const findPositionAtOffset = (daysOffset: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - daysOffset);
    return positions.find(p => new Date(p.date) <= targetDate) || positions[0];
  };

  const weekPosition = findPositionAtOffset(7);
  const monthPosition = findPositionAtOffset(30);
  const threeMonthPosition = findPositionAtOffset(90);
  const sixMonthPosition = findPositionAtOffset(180);
  const yearPosition = findPositionAtOffset(365);

  return {
    '1w': ((latestPosition.totalValue - weekPosition.totalValue) / weekPosition.totalValue) * 100,
    '1m': ((latestPosition.totalValue - monthPosition.totalValue) / monthPosition.totalValue) * 100,
    '3m': ((latestPosition.totalValue - threeMonthPosition.totalValue) / threeMonthPosition.totalValue) * 100,
    '6m': ((latestPosition.totalValue - sixMonthPosition.totalValue) / sixMonthPosition.totalValue) * 100,
    '1y': ((latestPosition.totalValue - yearPosition.totalValue) / yearPosition.totalValue) * 100
  };
}

function calculateMetrics(positions: DCAPosition[], historicalData: HistoricalDataPoint[]): BacktestMetrics {
  // Calculate maximum drawdown
  let peak = -Infinity;
  let maxDrawdown = 0;
  positions.forEach(position => {
    peak = Math.max(peak, position.totalValue);
    const drawdown = (peak - position.totalValue) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  // Calculate volatility (standard deviation of daily returns)
  const dailyReturns = positions.slice(1).map((position, i) => 
    (position.totalValue - positions[i].totalValue) / positions[i].totalValue
  );
  const avgReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized

  const lastPosition = positions[positions.length - 1];
  const roi = ((lastPosition.totalValue - lastPosition.totalInvested) / lastPosition.totalInvested) * 100;

  // Create transactions from positions
  const transactions: Transaction[] = positions.reduce<Transaction[]>((txns, position) => {
    position.allocation.forEach(asset => {
      txns.push({
        date: position.date,
        symbol: asset.symbol,
        shares: asset.shares,
        price: asset.value / asset.shares,
        amount: asset.value,
        type: 'buy'
      });
    });
    return txns;
  }, []);

  return {
    totalInvestment: lastPosition.totalInvested,
    currentValue: lastPosition.totalValue,
    roi,
    maxDrawdown,
    volatility,
    returns: calculatePeriodReturns(positions),
    technicalIndicators: calculateTechnicalIndicators(historicalData),
    positions,
    transactions
  };
}

export async function runBacktest(params: BacktestRequest): Promise<BacktestResult> {
  // Validate all tickers first
  for (const ticker of params.tickers) {
    const isValid = await validateTicker(ticker);
    if (!isValid) {
      throw new Error(`Invalid ticker: ${ticker}`);
    }
  }

  // Get historical data for calculating technical indicators
  const mainData = await getHistoricalData(params.tickers[0], params.startDate, params.endDate);

  // Use provided positions or calculate new ones
  const positions = params.positions || [];

  const result: BacktestResult = {
    metrics: calculateMetrics(positions, mainData),
    benchmarkMetrics: params.benchmark ? 
      await calculateMetrics(positions, await getHistoricalData(params.benchmark, params.startDate, params.endDate)) : 
      undefined
  };

  return result;
}
