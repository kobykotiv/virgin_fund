import mongoose, { Schema, Document } from 'mongoose'
import { NoSqlUser } from './types'

export interface UserDocument extends NoSqlUser, Document {}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  preferences: { type: Schema.Types.Mixed },
  lastActive: { type: Date },
  databaseType: { type: String, default: 'nosql' }
}, {
  timestamps: true
})

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)
