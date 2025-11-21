import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const organizer = searchParams.get('organizer');
    const upcoming = searchParams.get('upcoming');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (organizer) {
      query.organizer = organizer;
    }
    
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
      query.status = { $in: ['UPCOMING', 'ONGOING'] };
    }
    
    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName title position')
      .populate('speakers', 'firstName lastName title position')
      .sort({ startDate: 1 })
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const event = new Event(body);
    await event.save();
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'firstName lastName title position')
      .populate('speakers', 'firstName lastName title position');
    
    return NextResponse.json({
      success: true,
      data: populatedEvent
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}