import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requireAuth, requireAdmin, isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type');
    const department = searchParams.get('department');
    const isActive = searchParams.get('isActive');
    const approvalStatus = searchParams.get('approvalStatus');
    
    let query: any = {};
    
    if (userType) {
      query.userType = userType;
    }
    
    if (department) {
      query.department = { $regex: department, $options: 'i' };
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    const isAdminUser = await isAdmin(request);
    if (!isAdminUser) {
      query.approvalStatus = 'APPROVED';
    }
    const users = await User.find(query)
      .sort({ order: 1, lastName: 1, firstName: 1 });
    
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/users called');
    const currentUser = await requireAdmin(request);
    console.log('Authenticated admin user:', currentUser._id);
    await connectDB();

    const body = await request.json();
    console.log('Request body:', body);

    if (Array.isArray(body)) {
      // Bulk insert
      const users = await User.insertMany(body);
      console.log('Users created successfully:', users.length);
      return NextResponse.json({
        success: true,
        data: users,
        count: users.length
      }, { status: 201 });
    } else {
      // Single user
      const user = new User(body);
      await user.save();
      console.log('User created successfully:', user);
      return NextResponse.json({
        success: true,
        data: user
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating user(s):', error);
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create user(s)' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/users called');
    const body = await request.json();
    const { id, ...updateData } = body;
    const needsAdmin = !!updateData.role;

    const currentUser = needsAdmin ? await requireAdmin(request) : await requireAuth(request);
    console.log('Authenticated user:', currentUser._id);
    await connectDB();

    console.log('Update target id:', id);
    console.log('Update data:', updateData);

    const isAdminUser = needsAdmin ? true : await isAdmin(request);
    // Users can only edit their own profile unless they are admin
    if (!isAdminUser && id !== currentUser._id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own profile' },
        { status: 403 }
      );
    }

    // Only admins can change email; normalize to lowercase for uniqueness
    if (updateData.email) {
      if (!isAdminUser) {
        console.log('Non-admin attempted email change, ignoring');
        delete updateData.email;
      } else {
        updateData.email = updateData.email.toLowerCase();
      }
    }

    // Only admins can change role; allow promoting to ADMIN
    if (updateData.role) {
      if (!isAdminUser) {
        console.log('Non-admin attempted role change, ignoring');
        delete updateData.role;
      } else {
        updateData.role = updateData.role.toUpperCase();
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      console.log('User not found for update');
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User updated successfully:', user);
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error && /E11000 duplicate key error/.test(error.message)) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      );
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE /api/users called');
    const currentUser = await requireAdmin(request);
    console.log('Authenticated admin user:', currentUser._id);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('Delete target id:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    if (id === currentUser._id) {
      return NextResponse.json(
        { success: false, error: 'Admins cannot delete their own account' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User deleted successfully:', user);
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
