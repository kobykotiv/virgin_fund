import clientPromise from '@/lib/mongodb'
import { Collection, Db, Document } from 'mongodb'

export class DatabaseService {
  protected db: Promise<Db>
  
  constructor() {
    this.db = this.getDatabase()
  }

  private async getDatabase(): Promise<Db> {
    const client = await clientPromise
    return client.db(process.env.MONGODB_DB || 'virgin_fund')
  }

  protected async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
    const db = await this.db
    return db.collection<T>(name)
  }
}