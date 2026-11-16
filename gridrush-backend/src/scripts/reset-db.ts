import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Cell } from '../models/Cell.model.js';
import { Player } from '../models/Player.model.js';
import { seedBoard } from '../services/board.service.js';

const resetDatabase = async () => {
  if (!env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing in .env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB (database: test) to reset data...');
    await mongoose.connect(env.MONGODB_URI, {
      dbName: 'test',
    });
    console.log('✅ Connected to MongoDB (database: test)');

    console.log('🧹 Clearing existing cells and players in "test"...');
    await Cell.deleteMany({});
    await Player.deleteMany({});
    console.log('✅ Cleared old data.');

    console.log('🌱 Seeding 400 fresh unclaimed cells...');
    await seedBoard();

    console.log('🎉 Database "test" has been completely refreshed and seeded with 400 available blocks!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
