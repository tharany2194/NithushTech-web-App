import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

// POST record payment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const { amount } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid payment amount' },
                { status: 400 }
            );
        }

        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        const outstanding = invoice.totalAmount - invoice.paidAmount;

        if (amount > outstanding) {
            return NextResponse.json(
                { error: `Payment amount exceeds outstanding balance of €${outstanding.toFixed(2)}` },
                { status: 400 }
            );
        }

        invoice.paidAmount += amount;

        // Status will be updated by pre-save hook
        await invoice.save();
        await invoice.populate('customer', 'name phone email');

        return NextResponse.json({
            invoice,
            message: `Payment of €${amount.toFixed(2)} recorded successfully`,
        });
    } catch (error) {
        console.error('Record payment error:', error);
        return NextResponse.json(
            { error: 'Failed to record payment' },
            { status: 500 }
        );
    }
}
