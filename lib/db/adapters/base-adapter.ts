export interface DatabaseAdapter {
  connect(): Promise<void>
  disconnect(): Promise<void>
  query<T>(query: string, params?: any[]): Promise<T[]>
  findOne<T>(collection: string, query: any): Promise<T | null>
  findMany<T>(collection: string, query?: any): Promise<T[]>
  insertOne<T>(collection: string, data: T): Promise<T>
  updateOne<T>(collection: string, query: any, data: Partial<T>): Promise<T | null>
  deleteOne(collection: string, query: any): Promise<boolean>
}
