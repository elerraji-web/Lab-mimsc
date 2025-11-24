import mongoose from 'mongoose';

const getMongoURI = () => process.env.MONGODB_URI || 'mongodb://localhost:27017/mimsc-lab';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const uri = getMongoURI();
    console.log('DEBUG: Connecting to MongoDB with URI:', uri);
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('DEBUG: MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;