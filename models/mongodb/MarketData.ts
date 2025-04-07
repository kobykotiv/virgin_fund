import mongoose, { Document, Schema } from 'mongoose';
import { Bar } from '@/types/alpaca';

export interface IMarketData extends Document {
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  bars: Bar[];
  fetchedAt: Date;
  expiresAt: Date;
}

const MarketDataSchema = new Schema<IMarketData>({
  symbol: { type: String, required: true },
  timeframe: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  bars: [
    {
      t: Number, // Timestamp
      o: Number, // Open
      h: Number, // High
      l: Number, // Low
      c: Number, // Close
      v: Number  // Volume
    }
  ],
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Create compound index for efficient lookups
MarketDataSchema.index({ symbol: 1, timeframe: 1, startDate: 1, endDate: 1 });

// Automatic cleanup of expired entries
MarketDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.MarketData || mongoose.model<IMarketData>('MarketData', MarketDataSchema);
