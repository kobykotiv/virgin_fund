import mongoose from 'mongoose'
import { DatabaseAdapter } from './base-adapter'

export class MongoDBAdapter implements DatabaseAdapter {
  private connection: typeof mongoose | null = null

  async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await mongoose.connect(process.env.MONGODB_URI!)
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect()
      this.connection = null
    }
  }

  async query<T>(query: string, params?: any[]): Promise<T[]> {
    // MongoDB aggregate pipeline
    const collection = mongoose.connection.db.collection(params?.[0] || 'default')
    return await collection.aggregate(JSON.parse(query)).toArray() as T[]
  }

  async findOne<T>(collection: string, query: any): Promise<T | null> {
    const Model = mongoose.model(collection)
    return await Model.findOne(query).lean() as T | null
  }

  async findMany<T>(collection: string, query?: any): Promise<T[]> {
    const Model = mongoose.model(collection)
    return await Model.find(query || {}).lean() as T[]
  }

  async insertOne<T>(collection: string, data: T): Promise<T> {
    const Model = mongoose.model(collection)
    const document = new Model(data)
    return await document.save() as T
  }

  async updateOne<T>(collection: string, query: any, data: Partial<T>): Promise<T | null> {
    const Model = mongoose.model(collection)
    return await Model.findOneAndUpdate(query, data, { new: true }).lean() as T
  }

  async deleteOne(collection: string, query: any): Promise<boolean> {
    const Model = mongoose.model(collection)
    const result = await Model.deleteOne(query)
    return result.deletedCount === 1
  }
}
