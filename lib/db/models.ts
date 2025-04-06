import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virgin_fund';

let cachedConnection: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return { connection: cachedConnection };
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
    });
    
    cachedConnection = connection;
    console.log('Connected to MongoDB');
    return { connection };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (!cachedConnection) {
    return;
  }
  
  try {
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
    throw error;
  }
}
