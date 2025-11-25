import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import User from '@/lib/models/User';
import { requireAdmin, requireAuth, isAdmin } from '@/lib/auth';
import { normalizeAssetPath } from '@/lib/assetPaths';

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
    const normalized = events.map((ev) => ({
      ...ev.toObject(),
      poster: normalizeAssetPath((ev as any).poster),
      image: normalizeAssetPath((ev as any).image),
    }));

    return NextResponse.json({
      success: true,
      data: normalized
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
    const userIsAdmin = await isAdmin(request);
    console.log('Authenticated user:', currentUser._id, 'isAdmin:', userIsAdmin);
    await connectDB();

    const body = await request.json();
    console.log('Request body:', body);
    // Normalize asset paths
    if (body.poster) body.poster = normalizeAssetPath(body.poster);
    if (body.image) body.image = normalizeAssetPath(body.image);

    if (Array.isArray(body)) {
      // Bulk insert only allowed for admins
      if (!userIsAdmin) {
        return NextResponse.json(
          { success: false, error: 'Only admins can bulk create events' },
          { status: 403 }
        );
      }
      const events = await Event.insertMany(body);
      console.log('Events created successfully:', events.length);
      return NextResponse.json({
        success: true,
        data: events,
        count: events.length
      }, { status: 201 });
    } else {
      // Single event: any authenticated user can create; organizer defaults to current user
      const eventData = {
        ...body,
        organizer: body.organizer || currentUser._id
      };

      const event = new Event(eventData);
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
      { success: false, error: 'Failed to create event(s)' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/events called');
    const currentUser = await requireAuth(request);
    const userIsAdmin = await isAdmin(request);
    console.log('Authenticated user:', currentUser._id);
    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;
    console.log('Update data:', updateData);
    if (updateData.poster) updateData.poster = normalizeAssetPath(updateData.poster);
    if (updateData.image) updateData.image = normalizeAssetPath(updateData.image);

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only admin or organizer can update
    if (!userIsAdmin && event.organizer?.toString() !== currentUser._id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    console.log('Event updated successfully:', updatedEvent);
    return NextResponse.json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
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
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE /api/events called');
    const currentUser = await requireAuth(request);
    const userIsAdmin = await isAdmin(request);
    console.log('Authenticated user:', currentUser._id);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID required' },
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
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only admin or organizer can delete
    if (!userIsAdmin && event.organizer?.toString() !== currentUser._id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(id);

    console.log('Event deleted successfully:', event);
    return NextResponse.json({
      success: true,
      data: {
        ...event.toObject(),
        poster: normalizeAssetPath((event as any).poster),
        image: normalizeAssetPath((event as any).image),
      }
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    if (error instanceof Error && (error.message === 'Authentication required' || error.message === 'Admin authentication required')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
