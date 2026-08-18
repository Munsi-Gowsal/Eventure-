import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { env } from '../src/config/env';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Set testing environment variables
  env.NODE_ENV = 'test';
  env.JWT_ACCESS_SECRET = 'test_access_secret';
  env.JWT_REFRESH_SECRET = 'test_refresh_secret';

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  await mongoose.disconnect();
  await mongoServer.stop();
});
