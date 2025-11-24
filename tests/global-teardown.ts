import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const globalTeardown = async () => {
  const mongod = (globalThis as any).__mongod__ as MongoMemoryServer;
  if (mongod) {
    await mongod.stop();
    delete (globalThis as any).__mongod__;
  }
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }
  if (mongoose.connection.readyState > 0) {
    await mongoose.connection.close();
  }
};

export default globalTeardown;