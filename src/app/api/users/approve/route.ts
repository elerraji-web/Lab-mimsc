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
      { approvalStatus: 'APPROVED' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // If the user is a student or postdoc, create a corresponding Student record
    if (user.userType === 'STUDENT' || user.userType === 'POSTDOC') {
      console.log('DEBUG: Creating student record for user:', user.email, 'userType:', user.userType);
      try {
        // Check if Student record already exists
        const existingStudent = await Student.findOne({ email: user.email });
        console.log('DEBUG: Existing student check result:', existingStudent ? 'Found' : 'Not found');

        if (!existingStudent) {
          // Map userType to studentType
          const studentType = user.userType === 'STUDENT' ? 'PHD' : 'POSTDOC';

          const studentData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            studentType: studentType,
            program: user.userType === 'STUDENT' ? 'Doctorat Informatique' : 'Postdoctorat',
            specialization: user.position || 'Non spécifiée',
            researchArea: user.position || 'Non spécifiée',
            startDate: new Date(),
            expectedEndDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years from now
            status: 'ACTIVE',
            bio: user.bio || '',
            interests: user.interests || []
          };

          console.log('DEBUG: Student data to create:', studentData);
          const createdStudent = await Student.create(studentData);
          console.log('DEBUG: Student record created successfully:', createdStudent._id);
        } else {
          console.log('DEBUG: Student record already exists, skipping creation');
        }
      } catch (studentError) {
        console.error('DEBUG: Error creating student record:', studentError);
        // Don't fail the approval if student creation fails
      }
    } else {
      console.log('DEBUG: User is not STUDENT or POSTDOC, skipping student record creation. userType:', user.userType);
    }

    return NextResponse.json({
      success: true,
      message: 'User approved successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        approvalStatus: user.approvalStatus
      }
    });

  } catch (error) {
    console.error('Error approving user:', error);
    if (error instanceof Error && error.message === 'Admin authentication required') {
      return NextResponse.json(
        { success: false, error: 'Admin authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to approve user' },
      { status: 500 }
    );
  }
}