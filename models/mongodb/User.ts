import mongoose, { Document, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  apiKey?: string;
  apiSecret?: string;
  registrationDate: Date;
  preferences: {
    timezone: string;
    currency: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  apiKey: { type: String },
  apiSecret: { type: String },
  registrationDate: { type: Date, default: Date.now },
  preferences: {
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' }
  }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const saltRounds = 10;
    this.passwordHash = await hash(this.passwordHash, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.passwordHash);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
