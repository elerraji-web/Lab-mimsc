import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { POST as adminAuth } from '@/app/api/admin/auth/route';
import { POST as login } from '@/app/api/auth/route';

const globalSetup = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;

  await connectDB();
  (globalThis as any).__mongod__ = mongod;
};

async function loginAsAdmin() {
  const req = new NextRequest('http://localhost:3000/api/admin/auth', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@mimsc.ma',
      password: 'Admin@123456'
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const res = await adminAuth(req);
  const data = await res.json();
  if (res.status !== 200 || !data.success) {
    throw new Error('Failed to login as admin');
  }

  const setCookie = res.headers.get('set-cookie');
  return setCookie?.split(';')[0] || '';
}

async function loginAsUser() {
  const req = new NextRequest('http://localhost:3000/api/auth', {
    method: 'POST',
    body: JSON.stringify({
      action: 'login',
      email: 'testuser@example.com',
      password: 'password123'
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const res = await login(req);
  const data = await res.json();
  if (res.status !== 200 || !data.success) {
    throw new Error('Failed to login as user');
  }

  const setCookie = res.headers.get('set-cookie');
  const token = setCookie?.split(';')[0].split('=')[1] || '';
  return `Bearer ${token}`;
}

async function loginAsTestAdmin() {
  const req = new NextRequest('http://localhost:3000/api/auth', {
    method: 'POST',
    body: JSON.stringify({
      action: 'login',
      email: 'testadmin@example.com',
      password: 'admin123'
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const res = await login(req);
  const data = await res.json();
  if (res.status !== 200 || !data.success) {
    throw new Error('Failed to login as test admin');
  }

  const setCookie = res.headers.get('set-cookie');
  const token = setCookie?.split(';')[0].split('=')[1] || '';
  return `Bearer ${token}`;
}

export default globalSetup;

export { loginAsAdmin, loginAsUser, loginAsTestAdmin };