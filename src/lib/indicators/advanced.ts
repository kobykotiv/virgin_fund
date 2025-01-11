// import { calculateSMA, calculateEMA, calculateRSI, calculateMACD } from './calculations';
import type { Price } from './types.ts';


export function calculateADX(prices: Price[], period: number = 14): number[] {
  const tr: number[] = [];  // True Range
  const dmPlus: number[] = []; // Plus Directional Movement
  const dmMinus: number[] = []; // Minus Directional Movement
  
  // Calculate TR and DM
  for (let i = 1; i < prices.length; i++) {
    const high = prices[i].high;
    const low = prices[i].low;
    const prevHigh = prices[i-1].high;
    const prevLow = prices[i-1].low;
    const prevClose = prices[i-1].value;
    
    // True Range
    tr.push(Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    ));
    
    // Directional Movement
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    if (upMove > downMove && upMove > 0) {
      dmPlus.push(upMove);
      dmMinus.push(0);
    } else if (downMove > upMove && downMove > 0) {
      dmPlus.push(0);
      dmMinus.push(downMove);
    } else {
      dmPlus.push(0);
      dmMinus.push(0);
    }
  }
  
  // Calculate Smoothed TR and DM
  const smoothTR = calculateWilder(tr, period);
  const smoothDMPlus = calculateWilder(dmPlus, period);
  const smoothDMMinus = calculateWilder(dmMinus, period);
  
  // Calculate DI+ and DI-
  const diPlus = smoothDMPlus.map((dm, i) => (dm / smoothTR[i]) * 100);
  const diMinus = smoothDMMinus.map((dm, i) => (dm / smoothTR[i]) * 100);
  
  // Calculate ADX
  const dx = diPlus.map((plus, i) => 
    Math.abs(plus - diMinus[i]) / (plus + diMinus[i]) * 100
  );
  
  return calculateWilder(dx, period);
}

export function calculateMFI(prices: Price[], volume: number[], period: number = 14): number[] {
  const typicalPrices = prices.map(p => (p.high + p.low + p.value) / 3);
  const moneyFlow = typicalPrices.map((tp, i) => tp * volume[i]);
  
  const mfi: number[] = [];
  
  for (let i = period; i < prices.length; i++) {
    let posFlow = 0;
    let negFlow = 0;
    
    for (let j = i - period + 1; j <= i; j++) {
      if (typicalPrices[j] > typicalPrices[j-1]) {
        posFlow += moneyFlow[j];
      } else {
        negFlow += moneyFlow[j];
      }
    }
    
    const mfRatio = posFlow / negFlow;
    mfi.push(100 - (100 / (1 + mfRatio)));
  }
  
  return mfi;
}

function calculateWilder(values: number[], period: number): number[] {
  const result: number[] = [];
  let sum = values.slice(0, period).reduce((a, b) => a + b, 0);
  result.push(sum / period);
  
  for (let i = period; i < values.length; i++) {
    sum = (sum - (sum / period)) + values[i];
    result.push(sum / period);
  }
  
  return result;
}