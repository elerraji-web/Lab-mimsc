import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { sign } from 'jsonwebtoken';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mimsc.ma';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Connect to database and ensure admin user exists
    await connectDB();
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
      adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'ADMIN',
        userType: 'STAFF',
        isActive: true,
        approvalStatus: 'APPROVED'
      });
      await adminUser.save();
    }

    // Ensure the admin user has the 'ADMIN' role
    if (adminUser.role !== 'ADMIN') {
      adminUser.role = 'ADMIN';
      await adminUser.save();
    }

    process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-for-testing';

    // Generate JWT token
    const token = sign(
      {
        email: ADMIN_EMAIL,
        role: 'admin',
        userId: adminUser._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      },
      JWT_SECRET
    );

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}