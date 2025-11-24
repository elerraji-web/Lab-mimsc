import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { orders } = body;

    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: 'Orders must be an array' },
        { status: 400 }
      );
    }

    // Update each user's order
    const updatePromises = orders.map(({ id, order }) =>
      User.findByIdAndUpdate(id, { order }, { new: true })
    );

    const updatedUsers = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      data: updatedUsers
    });
  } catch (error) {
    console.error('Error updating user orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user orders' },
      { status: 500 }
    );
  }
}