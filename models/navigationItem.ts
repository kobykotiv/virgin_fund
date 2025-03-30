import mongoose, { Schema, Document } from 'mongoose';

export interface NavigationItem extends Document {
  name: string;
  path: string;
  icon?: string;
  requiredRoles?: string[];
  order: number;
  active: boolean;
  isPublic?: boolean; // Added to identify public navigation items
}

const NavigationItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true, unique: true },
  icon: { type: String },
  requiredRoles: [{ type: String }],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: false } // Default to false for backward compatibility
}, { timestamps: true });

export default mongoose.models.NavigationItem || 
  mongoose.model<NavigationItem>('NavigationItem', NavigationItemSchema);
