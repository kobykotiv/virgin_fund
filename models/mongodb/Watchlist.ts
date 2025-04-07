import mongoose, { Document, Schema } from 'mongoose';

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  symbols: string[];
  createdAt: Date;
  updatedAt: Date;
  alpacaId?: string;
}

const WatchlistSchema = new Schema<IWatchlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  symbols: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  alpacaId: { type: String } // ID from Alpaca API for synced watchlists
});

// Index for faster lookups
WatchlistSchema.index({ userId: 1 });
WatchlistSchema.index({ alpacaId: 1 });

export default mongoose.models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
