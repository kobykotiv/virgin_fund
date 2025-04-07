import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { DatabaseAdapter } from './base-adapter'

export class SupabaseAdapter implements DatabaseAdapter {
  private client: SupabaseClient

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  async connect(): Promise<void> {
    // Supabase client is initialized in constructor
  }

  async disconnect(): Promise<void> {
    // No explicit disconnect needed for Supabase
  }

  async query<T>(query: string, params?: any[]): Promise<T[]> {
    const { data, error } = await this.client.rpc(query, params)
    if (error) throw error
    return data as T[]
  }

  async findOne<T>(collection: string, query: any): Promise<T | null> {
    const { data, error } = await this.client
      .from(collection)
      .select()
      .match(query)
      .single()
    
    if (error) throw error
    return data as T
  }

  async findMany<T>(collection: string, query?: any): Promise<T[]> {
    let builder = this.client.from(collection).select()
    if (query) {
      builder = builder.match(query)
    }
    
    const { data, error } = await builder
    if (error) throw error
    return data as T[]
  }

  async insertOne<T>(collection: string, data: T): Promise<T> {
    const { data: inserted, error } = await this.client
      .from(collection)
      .insert(data)
      .single()
    
    if (error) throw error
    return inserted as T
  }

  async updateOne<T>(collection: string, query: any, data: Partial<T>): Promise<T | null> {
    const { data: updated, error } = await this.client
      .from(collection)
      .update(data)
      .match(query)
      .single()
    
    if (error) throw error
    return updated as T
  }

  async deleteOne(collection: string, query: any): Promise<boolean> {
    const { error } = await this.client
      .from(collection)
      .delete()
      .match(query)
    
    return !error
  }
}
