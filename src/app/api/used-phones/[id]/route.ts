import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UsedPhone from '@/models/UsedPhone';

// GET single used phone
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const phone = await UsedPhone.findById(id).populate('buyer', 'name phone email');

        if (!phone) {
            return NextResponse.json(
                { error: 'Used phone not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ phone });
    } catch (error) {
        console.error('Fetch used phone error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch used phone' },
            { status: 500 }
        );
    }
}

// PUT update used phone
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        const phone = await UsedPhone.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!phone) {
            return NextResponse.json(
                { error: 'Used phone not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ phone });
    } catch (error) {
        console.error('Update used phone error:', error);
        return NextResponse.json(
            { error: 'Failed to update used phone' },
            { status: 500 }
        );
    }
}

// DELETE used phone
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const phone = await UsedPhone.findByIdAndDelete(id);

        if (!phone) {
            return NextResponse.json(
                { error: 'Used phone not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Used phone deleted successfully' });
    } catch (error) {
        console.error('Delete used phone error:', error);
        return NextResponse.json(
            { error: 'Failed to delete used phone' },
            { status: 500 }
        );
    }
}
