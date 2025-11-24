import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Student from '@/lib/models/Student';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request);
    await connectDB();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { approvalStatus: 'REJECTED' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // If the user is a student or postdoc, remove any corresponding Student record
    if (user.userType === 'STUDENT' || user.userType === 'POSTDOC') {
      try {
        await Student.findOneAndDelete({ email: user.email });
      } catch (studentError) {
        console.error('Error removing student record:', studentError);
        // Don't fail the rejection if student removal fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User rejected successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        approvalStatus: user.approvalStatus
      }
    });

  } catch (error) {
    console.error('Error rejecting user:', error);
    if (error instanceof Error && error.message === 'Admin authentication required') {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to reject user' },
      { status: 500 }
    );
  }
}