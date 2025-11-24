const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const globalTeardown = async () => {
  const mongod = globalThis.__mongod__;
  if (mongod) {
    await mongod.stop();
    delete globalThis.__mongod__;
  }
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }
  if (mongoose.connection.readyState > 0) {
    await mongoose.connection.close();
  }
};

module.exports = globalTeardown;