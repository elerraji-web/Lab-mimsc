import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';

jest.setTimeout(120000);

let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  // Prefer explicit env URI; otherwise build an isolated test DB name to avoid collisions
  const baseUri = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017';
  const testDbName = process.env.TEST_DB_NAME || `mimsc-lab-test-${Date.now()}`;
  const uri = `${baseUri}/${testDbName}${baseUri.includes('?') ? '' : '?authSource=admin'}`;
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
  // Ensure baseline test users exist without clearing other data needed across tests
  const hashedTestUserPassword = await bcrypt.hash('password123', 12);
  const hashedTestAdminPassword = await bcrypt.hash('admin123', 12);

  await User.updateOne(
    { email: 'testuser@example.com' },
    {
      $setOnInsert: {
        firstName: 'Test',
        lastName: 'User',
        position: 'Researcher',
        userType: 'FACULTY',
        isActive: true,
        approvalStatus: 'APPROVED'
      },
      $set: { password: hashedTestUserPassword }
    },
    { upsert: true }
  );

  await User.updateOne(
    { email: 'testadmin@example.com' },
    {
      $setOnInsert: {
        firstName: 'Test',
        lastName: 'Admin',
        position: 'Administrator',
        userType: 'STAFF',
        role: 'ADMIN',
        isActive: true,
        approvalStatus: 'APPROVED'
      },
      $set: { password: hashedTestAdminPassword }
    },
    { upsert: true }
  );
});

afterAll(async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});
