import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/models/Stock';

// GET single stock item
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const item = await Stock.findById(id).populate('supplier', 'name email phone');

        if (!item) {
            return NextResponse.json(
                { error: 'Stock item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ item });
    } catch (error) {
        console.error('Fetch stock item error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stock item' },
            { status: 500 }
        );
    }
}

// PUT update stock item
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        const item = await Stock.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate('supplier', 'name');

        if (!item) {
            return NextResponse.json(
                { error: 'Stock item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ item });
    } catch (error) {
        console.error('Update stock item error:', error);
        return NextResponse.json(
            { error: 'Failed to update stock item' },
            { status: 500 }
        );
    }
}

// DELETE stock item
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const item = await Stock.findByIdAndDelete(id);

        if (!item) {
            return NextResponse.json(
                { error: 'Stock item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Stock item deleted successfully' });
    } catch (error) {
        console.error('Delete stock item error:', error);
        return NextResponse.json(
            { error: 'Failed to delete stock item' },
            { status: 500 }
        );
    }
}
