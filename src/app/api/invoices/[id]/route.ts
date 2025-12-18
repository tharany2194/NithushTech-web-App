import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

// GET single invoice
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const invoice = await Invoice.findById(id)
            .populate('customer', 'name phone email address');

        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ invoice });
    } catch (error) {
        console.error('Fetch invoice error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice' },
            { status: 500 }
        );
    }
}

// PUT update invoice
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        const invoice = await Invoice.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate('customer', 'name phone email');

        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ invoice });
    } catch (error) {
        console.error('Update invoice error:', error);
        return NextResponse.json(
            { error: 'Failed to update invoice' },
            { status: 500 }
        );
    }
}

// DELETE invoice
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const invoice = await Invoice.findByIdAndDelete(id);

        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        return NextResponse.json(
            { error: 'Failed to delete invoice' },
            { status: 500 }
        );
    }
}
