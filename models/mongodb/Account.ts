import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  exchangeName: string;
  accountName: string;
  baseCurrency: string;
  availableBalance: number;
  createdAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  exchangeName: { type: String, required: true },
  accountName: { type: String, required: true },
  baseCurrency: { type: String, default: 'USD' },
  availableBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
AccountSchema.index({ userId: 1 });

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
