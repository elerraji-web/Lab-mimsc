import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Publication from '@/lib/models/Publication';
import User from '@/lib/models/User';
import { requireAdmin, requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const author = searchParams.get('author');
    const researchArea = searchParams.get('researchArea');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    let query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (author) {
      query.authors = author;
    }
    
    if (researchArea) {
      query.researchArea = { $regex: researchArea, $options: 'i' };
    }
    
    const skip = (page - 1) * limit;
    
    const publications = await Publication.find(query)
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Publication.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: publications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/publications called');
    const currentUser = await requireAuth(request);
    console.log('Authenticated user:', currentUser._id);
    await connectDB();

    const body = await request.json();
    console.log('Request body:', body);

    // Ensure authors is an array for downstream logic
    if (!Array.isArray(body.authors)) {
      body.authors = [];
    }

    // Add current user to authors if not already present
    const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
    if (!body.authors.includes(userFullName)) {
      body.authors.push(userFullName);
    }

    const publication = new Publication(body);
    console.log('Created publication instance, validating...');
    const validationError = publication.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { success: false, error: `Validation error: ${validationError.message}` },
        { status: 400 }
      );
    }
    await publication.save();

    console.log('Publication created successfully:', publication);
    return NextResponse.json({
      success: true,
      data: publication
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    const err = error as any;
    if (err.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { success: false, error: 'Publication with this DOI already exists' },
        { status: 409 }
      );
    }
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create publication' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/publications called');
    const currentUser = await requireAuth(request);
    console.log('Authenticated user:', currentUser._id);
    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;
    console.log('Update data:', updateData);

    const publication = await Publication.findById(id);

    if (!publication) {
      return NextResponse.json(
        { success: false, error: 'Publication not found' },
        { status: 404 }
      );
    }

    const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const isAdminUser = currentUser.role === 'ADMIN';
    if (!isAdminUser && !publication.authors.includes(userFullName)) {
      return NextResponse.json(
        { success: false, error: 'You can only modify your own publications' },
        { status: 403 }
      );
    }

    const updatedPublication = await Publication.findByIdAndUpdate(id, updateData, { new: true });

    console.log('Publication updated successfully:', updatedPublication);
    return NextResponse.json({
      success: true,
      data: updatedPublication
    });
  } catch (error) {
    console.error('Error updating publication:', error);
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update publication' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE /api/publications called');
    const currentUser = await requireAuth(request);
    console.log('Authenticated user:', currentUser._id);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Publication ID required' },
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
    const publication = await Publication.findById(id);

    if (!publication) {
      return NextResponse.json(
        { success: false, error: 'Publication not found' },
        { status: 404 }
      );
    }

    const userFullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const isAdminUser = currentUser.role === 'ADMIN';
    if (!isAdminUser && !publication.authors.includes(userFullName)) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own publications' },
        { status: 403 }
      );
    }

    await Publication.findByIdAndDelete(id);

    console.log('Publication deleted successfully:', publication);
    return NextResponse.json({
      success: true,
      data: publication
    });
  } catch (error) {
    console.error('Error deleting publication:', error);
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete publication' },
      { status: 500 }
    );
  }
}