import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketDataCache extends Document {
  key: string;
  data: any;
  timestamp: Date;
  expiresAt: Date;
}

const MarketDataCacheSchema = new Schema<IMarketDataCache>({
  key: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Index for faster queries and automatic cache expiry
MarketDataCacheSchema.index({ key: 1 });
MarketDataCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.models.MarketDataCache || 
  mongoose.model<IMarketDataCache>('MarketDataCache', MarketDataCacheSchema);
