import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
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
  role?: string;
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    console.log('DEBUG: getCurrentUser called');
    // Prefer admin token if present over any other session
    const adminToken = request.cookies.get('admin_token')?.value;
    console.log('DEBUG: admin_token from cookies:', adminToken ? 'present' : 'null');
    if (adminToken) {
      try {
        const decoded = verify(adminToken, JWT_SECRET) as any;
        console.log('DEBUG: admin token decoded role:', decoded.role);
        if (decoded.role === 'admin') {
          await connectDB();
          const adminUser = await User.findById(decoded.userId).select('-password');
          console.log('DEBUG: admin user found:', adminUser ? 'yes' : 'no');
          if (adminUser) {
            return {
              _id: adminUser._id.toString(),
              firstName: adminUser.firstName,
              lastName: adminUser.lastName,
              email: adminUser.email,
              position: adminUser.position,
              userType: adminUser.userType,
              role: adminUser.role
            };
          }
        }
      } catch (adminError) {
        console.log('DEBUG: admin token error:', adminError);
        // Ignore admin token errors
      }
    }

    const sessionToken = await getToken({ req: request, secret: JWT_SECRET });
    if (sessionToken?.sub) {
      console.log('DEBUG: next-auth token found');
      await connectDB();
      const sessionUser = await User.findById(sessionToken.sub).select('-password');
      if (sessionUser) {
        return {
          _id: sessionUser._id.toString(),
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
          email: sessionUser.email,
          position: sessionUser.position,
          userType: sessionUser.userType,
          role: sessionUser.role
        };
      }
    }

    let token = request.cookies.get('user_token')?.value;
    console.log('DEBUG: user_token from cookies:', token ? 'present' : 'null');
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      console.log('DEBUG: Authorization header:', authHeader ? 'present' : 'null');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
        console.log('DEBUG: token from Bearer:', token ? 'present' : 'null');
      }
      if (!token) {
        const cookieHeader = request.headers.get('cookie');
        console.log('DEBUG: cookie header token:', cookieHeader ? 'present' : 'null');
        if (cookieHeader && cookieHeader.startsWith('Bearer ')) {
          token = cookieHeader.slice(7);
          console.log('DEBUG: token from cookie header bearer:', token ? 'present' : 'null');
        }
      }
    }

    if (!token) {
      console.log('DEBUG: no user token and no admin token, returning null');
      return null;
    }

    console.log('DEBUG: verifying user token');
    const decoded = verify(token, JWT_SECRET) as any;
    console.log('DEBUG: user token decoded userId:', decoded.userId);

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    console.log('DEBUG: user found:', user ? 'yes' : 'no');

    if (!user) {
      console.log('DEBUG: user not found, checking admin token');
      // Check admin token if user token failed
      const adminToken = request.cookies.get('admin_token')?.value;
      console.log('DEBUG: admin_token from cookies:', adminToken ? 'present' : 'null');
      if (adminToken) {
        try {
          const decoded = verify(adminToken, JWT_SECRET) as any;
          console.log('DEBUG: admin token decoded role:', decoded.role);
          if (decoded.role === 'admin') {
            await connectDB();
            const adminUser = await User.findById(decoded.userId).select('-password');
            console.log('DEBUG: admin user found:', adminUser ? 'yes' : 'no');
            if (adminUser) {
              return {
                _id: adminUser._id.toString(),
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                email: adminUser.email,
                position: adminUser.position,
                userType: adminUser.userType,
                role: adminUser.role
              };
            }
          }
        } catch (adminError) {
          console.log('DEBUG: admin token error:', adminError);
          // Ignore admin token errors
        }
      }
      console.log('DEBUG: returning null');
      return null;
    }

    return {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      position: user.position,
      userType: user.userType,
      role: user.role
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

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await getCurrentUser(request);

  const isPrivilegedUser = user && (
    user.role === 'ADMIN' ||
    user.userType === 'STAFF' ||
    user.email === (process.env.ADMIN_EMAIL || 'admin@mimsc.ma')
  );

  if (!user) {
    throw new Error('Authentication required');
  }

  if (!isPrivilegedUser) {
    throw new Error('Forbidden');
  }

  return user;
}
export async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const user = await getCurrentUser(request);
    return user?.role === 'ADMIN';
  } catch (error) {
    return false;
  }
}
