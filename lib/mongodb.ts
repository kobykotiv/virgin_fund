import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virgin_fund';
const MONGODB_DB = process.env.MONGODB_DB || 'virgin_fund';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to the MongoDB instance
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  // Cache the client and db for reuse
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Define collection names as constants to avoid typos
export const COLLECTIONS = {
  PORTFOLIOS: 'portfolios',
  POSITIONS: 'positions',
  TRANSACTIONS: 'transactions',
  TRADES: 'trades', 
  REBALANCES: 'rebalances',
  SETTINGS: 'settings',
  USERS: 'users'
}

// Initialize database collections
export async function initializeCollections() {
  const { db } = await connectToDatabase()
  
  // Create collections if they don't exist
  for (const collection of Object.values(COLLECTIONS)) {
    const collections = await db.listCollections({name: collection}).toArray()
    if (collections.length === 0) {
      await db.createCollection(collection)
      console.log(`Created collection: ${collection}`)
    }
  }
  
  // Create indexes
  await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
  await db.collection(COLLECTIONS.PORTFOLIOS).createIndex({ userId: 1 })
  await db.collection(COLLECTIONS.POSITIONS).createIndex({ portfolioId: 1 })
  await db.collection(COLLECTIONS.TRANSACTIONS).createIndex({ portfolioId: 1 })
  await db.collection(COLLECTIONS.TRADES).createIndex({ portfolioId: 1 })
  await db.collection(COLLECTIONS.REBALANCES).createIndex({ portfolioId: 1 })
  
  console.log('Database collections initialized')
}

// Specific collection helpers
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase()
  return db.collection(collectionName)
}

// Collection-specific helper functions
export async function getPortfoliosCollection() {
  return getCollection(COLLECTIONS.PORTFOLIOS)
}

export async function getPositionsCollection() {
  return getCollection(COLLECTIONS.POSITIONS)
}

export async function getTransactionsCollection() {
  return getCollection(COLLECTIONS.TRANSACTIONS)
}

export async function getTradesCollection() {
  return getCollection(COLLECTIONS.TRADES)
}

export async function getRebalancesCollection() {
  return getCollection(COLLECTIONS.REBALANCES)
}

export async function getSettingsCollection() {
  return getCollection(COLLECTIONS.SETTINGS)
}

export async function getUsersCollection() {
  return getCollection(COLLECTIONS.USERS)
}

// Helper to check if ObjectId is valid
export const isValidObjectId = ObjectId.isValid

// Export a module-scoped MongoClient promise
export { ObjectId }