import { MongoClient, MongoClientOptions } from 'mongodb'

// Connection URI from environment variables
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.MONGODB_DB || 'virgin_fund'

// Connection options
const options: MongoClientOptions = {
  minPoolSize: 5,
  maxPoolSize: 50,
  connectTimeoutMS: 10000
}

// Cache client promise to reuse connections
let clientPromise: Promise<MongoClient>

// Initialize global mongo client
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to maintain connection across hot-reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri, options).connect()
  }
  
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, create a new client for each connection
  clientPromise = new MongoClient(uri, options).connect()
}

// Helper function to get database connection
export async function connectToDatabase() {
  const client = await clientPromise
  return client.db(dbName)
}

// Specific collection helpers
export async function getCollection(collectionName: string) {
  const db = await connectToDatabase()
  return db.collection(collectionName)
}

// Helper to check if ObjectId is valid
export function isValidObjectId(id: string): boolean {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/
  return objectIdPattern.test(id)
}