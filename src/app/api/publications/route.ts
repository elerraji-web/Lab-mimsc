import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Publication from '@/lib/models/Publication';

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
      .populate('authors', 'firstName lastName title position')
      .populate('project', 'title')
      .sort({ publishedAt: -1, createdAt: -1 })
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
    await connectDB();
    
    const body = await request.json();
    
    const publication = new Publication(body);
    await publication.save();
    
    const populatedPublication = await Publication.findById(publication._id)
      .populate('authors', 'firstName lastName title position')
      .populate('project', 'title');
    
    return NextResponse.json({
      success: true,
      data: populatedPublication
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating publication:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create publication' },
      { status: 500 }
    );
  }
}