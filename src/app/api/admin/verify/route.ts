import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getCurrentUser } from '@/lib/auth';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-super-secret-key-change-this-in-production';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      // Verify JWT token
      const decoded = verify(token, JWT_SECRET) as any;

      if (!decoded || decoded.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Invalid token' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          email: decoded.email,
          role: decoded.role
        }
      });
    }

    // Fallback: allow admins authenticated via user_token/next-auth session
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role === 'ADMIN') {
      return NextResponse.json({
        success: true,
        user: {
          email: currentUser.email,
          role: 'admin'
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'No authentication token' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}
