import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketDataCache extends Document {
  symbol: string;
  timeframe: string;
  data: any[];
  lastUpdated: Date;
}

const MarketDataCacheSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  timeframe: { type: String, required: true },
  data: { type: Array, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

// Compound index for efficient lookups
MarketDataCacheSchema.index({ symbol: 1, timeframe: 1 }, { unique: true });

// Check if the model is already defined to prevent recompilation errors
const MarketDataCache = mongoose.models.MarketDataCache || 
  mongoose.model<IMarketDataCache>('MarketDataCache', MarketDataCacheSchema);

export default MarketDataCache;
