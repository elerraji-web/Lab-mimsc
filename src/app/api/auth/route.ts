import { NextRequest, NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, ...userData } = await request.json();

    await connectDB();

    if (action === 'register') {
      // Registration
      console.log('Registration attempt for email:', email);
      const { firstName, lastName, position, userType } = userData;
      console.log('Registration data:', { firstName, lastName, position, userType });

      // Validate required fields
      if (!firstName || !lastName || !email || !password || !position || !userType) {
        console.log('Missing required fields');
        return NextResponse.json(
          { success: false, error: 'All fields are required' },
          { status: 400 }
        );
      }

      // Check if user already exists
      console.log('Checking if user exists...');
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      console.log('Existing user found:', existingUser ? 'YES' : 'NO');
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'User already exists' },
          { status: 409 }
        );
      }

      // Hash password
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('Password hashed successfully');

      // Create user
      console.log('Creating user...');
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        position,
        userType,
        isActive: true,
        approvalStatus: 'PENDING'
      });

      await user.save();
      console.log('User saved successfully:', user._id);

      // Generate JWT
      const token = sign(
        {
          userId: user._id,
          email: user.email,
          role: 'user',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        },
        JWT_SECRET
      );

      const response = NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          position: user.position,
          userType: user.userType
        }
      });

      response.cookies.set('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      return response;

    } else if (action === 'login') {
      // Login
      console.log('Login attempt for email:', email);
      if (!email || !password) {
        console.log('Missing email or password');
        return NextResponse.json(
          { success: false, error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Find user
      console.log('Looking up user with email:', email.toLowerCase());
      const user = await User.findOne({ email: email.toLowerCase() });
      console.log('User found:', user ? 'YES' : 'NO');
      if (user) {
        console.log('User details:', {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          hasPassword: !!user.password
        });
      }

      if (!user) {
        console.log('User not found');
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      if (!user.password) {
        console.log('User has no password set, prompt Google sign-in');
        return NextResponse.json(
          { success: false, error: 'This account uses Google sign-in. Please continue with Google.' },
          { status: 400 }
        );
      }

      // Check password
      console.log('Checking password...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isValidPassword);
      if (!isValidPassword) {
        console.log('Invalid password');
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check approval status
      console.log('Checking approval status:', user.approvalStatus);
      if (user.approvalStatus !== 'APPROVED') {
        const errorMessage = user.approvalStatus === 'PENDING'
          ? 'Your account is pending approval. Please contact an administrator.'
          : 'Your account has been rejected. Please contact an administrator.';
        return NextResponse.json(
          { success: false, error: errorMessage },
          { status: 403 }
        );
      }

      // Generate JWT
      const token = sign(
        {
          userId: user._id,
          email: user.email,
          role: 'user',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        },
        JWT_SECRET
      );

      const response = NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          position: user.position,
          userType: user.userType
        }
      });

      response.cookies.set('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      return response;

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const nextAuthToken = await getToken({ req: request, secret: JWT_SECRET });
    if (nextAuthToken?.sub) {
      await connectDB();
      const user = await User.findById(nextAuthToken.sub).select('-password');

      if (user) {
        return NextResponse.json({
          success: true,
          user
        });
      }
    }

    // Verify user token
    const token = request.cookies.get('user_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verify(token, JWT_SECRET) as any;

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Logout
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.set('user_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    response.cookies.set('__Secure-next-auth.session-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
    response.cookies.set('next-auth.csrf-token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
