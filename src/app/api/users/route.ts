import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('type');
    const department = searchParams.get('department');
    const isActive = searchParams.get('isActive');
    
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
    
    const users = await User.find(query)
      .sort({ lastName: 1, firstName: 1 });
    
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
    await connectDB();
    
    const body = await request.json();
    
    const user = new User(body);
    await user.save();
    
    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}