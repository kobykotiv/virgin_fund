import { createClient } from '@supabase/supabase-js'
import mongoose from 'mongoose'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseKey)

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || ''

// MongoDB connection function
export const connectMongo = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI is not defined')
    }
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI)
    }
    return mongoose.connection
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

// Database type guard
export const isMongoConnected = () => mongoose.connection.readyState === 1
export const isSupabaseConnected = () => !!supabaseUrl && !!supabaseKey

// Generic database interface
export interface DbConnection {
  type: 'sql' | 'nosql'
  isConnected: boolean
}

// Get current database status
export const getDatabaseStatus = async (): Promise<DbConnection> => {
  const mongoConnected = isMongoConnected()
  const supabaseConnected = isSupabaseConnected()

  // Prefer SQL if both are available
  if (supabaseConnected) {
    return { type: 'sql', isConnected: true }
  } else if (mongoConnected) {
    return { type: 'nosql', isConnected: true }
  }

  return { type: 'sql', isConnected: false }
}
