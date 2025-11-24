import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import User from '@/lib/models/User';
import { requireAuth } from '@/lib/auth';

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
    console.log('POST /api/events called');
    const currentUser = await requireAuth(request);
    console.log('Authenticated user:', currentUser._id);
    await connectDB();

    const body = await request.json();
    console.log('Request body:', body);

    if (Array.isArray(body)) {
      // Bulk insert
      const events = await Event.insertMany(body);
      console.log('Events created successfully:', events.length);
      return NextResponse.json({
        success: true,
        data: events,
        count: events.length
      }, { status: 201 });
    } else {
      // Single event
      // Set organizer to current user
      body.organizer = currentUser._id;

      const event = new Event(body);
      await event.save();

      console.log('Event created successfully:', event);
      return NextResponse.json({
        success: true,
        data: event
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating event(s):', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create event(s)' },
      { status: 500 }
    );
  }
}