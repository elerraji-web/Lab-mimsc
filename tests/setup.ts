import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';

jest.setTimeout(120000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);

  // Seed test users
  const hashedTestUserPassword = await bcrypt.hash('password123', 12);
  const hashedTestAdminPassword = await bcrypt.hash('admin123', 12);

  const testUser = new User({
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: hashedTestUserPassword,
    position: 'Researcher',
    userType: 'FACULTY',
    isActive: true,
    approvalStatus: 'APPROVED'
  });

  const testAdmin = new User({
    firstName: 'Test',
    lastName: 'Admin',
    email: 'testadmin@example.com',
    password: hashedTestAdminPassword,
    position: 'Administrator',
    userType: 'STAFF',
    isActive: true,
    approvalStatus: 'APPROVED'
  });

  await testUser.save();
  await testAdmin.save();
});

beforeEach(async () => {
  await User.deleteMany({ email: { $ne: 'admin@mimsc.ma' } });

  // Seed test users
  const hashedTestUserPassword = await bcrypt.hash('password123', 12);
  const hashedTestAdminPassword = await bcrypt.hash('admin123', 12);

  const testUser = new User({
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: hashedTestUserPassword,
    position: 'Researcher',
    userType: 'FACULTY',
    isActive: true,
    approvalStatus: 'APPROVED'
  });

  const testAdmin = new User({
    firstName: 'Test',
    lastName: 'Admin',
    email: 'testadmin@example.com',
    password: hashedTestAdminPassword,
    position: 'Administrator',
    userType: 'STAFF',
    isActive: true,
    approvalStatus: 'APPROVED'
  });

  await testUser.save();
  await testAdmin.save();
});

afterAll(async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});