import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Research from '@/lib/models/Research';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const status = searchParams.get('status');

    const query: Record<string, any> = {};
    if (status) {
      query.status = status;
    }

    const researches = await Research.find(query)
      .populate('lead', 'firstName lastName title position')
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: researches });
  } catch (error) {
    console.error('Error fetching researches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch researches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const research = new Research(body);
    await research.save();

    const populatedResearch = await Research.findById(research._id)
      .populate('lead', 'firstName lastName title position');

    return NextResponse.json({ success: true, data: populatedResearch }, { status: 201 });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create research' },
      { status: 500 }
    );
  }
}
