import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production';

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  userType: string;
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('user_token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(token, JWT_SECRET) as any;

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return null;
    }

    return {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      position: user.position,
      userType: user.userType
    };

  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

export async function requireAdmin(request: NextRequest): Promise<void> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      throw new Error('Admin authentication required');
    }

    const decoded = verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'admin') {
      throw new Error('Admin authentication required');
    }

  } catch (error) {
    throw new Error('Admin authentication required');
  }
}