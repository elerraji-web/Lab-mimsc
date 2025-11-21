import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Student from '@/lib/models/Student';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const studentType = searchParams.get('type');
    const status = searchParams.get('status');
    const supervisor = searchParams.get('supervisor');
    
    let query: any = {};
    
    if (studentType) {
      query.studentType = studentType;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (supervisor) {
      query.supervisor = supervisor;
    }
    
    const students = await Student.find(query)
      .populate('supervisor', 'firstName lastName title position')
      .populate('coSupervisors', 'firstName lastName title position')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const student = new Student(body);
    await student.save();
    
    const populatedStudent = await Student.findById(student._id)
      .populate('supervisor', 'firstName lastName title position')
      .populate('coSupervisors', 'firstName lastName title position');
    
    return NextResponse.json({
      success: true,
      data: populatedStudent
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
}