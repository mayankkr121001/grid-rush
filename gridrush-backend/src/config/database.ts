import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<boolean> => {
  if (!env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI is not set in .env. Database connection skipped.');
    return false;
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'gridrush',
    });
    console.log('✅ Connected to MongoDB (database: gridrush)');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

