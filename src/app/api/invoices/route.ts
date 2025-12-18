import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

// GET all invoices
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query: Record<string, unknown> = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const invoices = await Invoice.find(query)
            .populate('customer', 'name phone email')
            .sort({ createdAt: -1 });

        // Calculate stats
        const allInvoices = await Invoice.find();
        const stats = {
            total: allInvoices.length,
            paid: allInvoices.filter(i => i.status === 'Paid').length,
            partial: allInvoices.filter(i => i.status === 'Partial').length,
            overdue: allInvoices.filter(i => i.status === 'Overdue').length,
            totalOutstanding: allInvoices.reduce(
                (sum, i) => sum + (i.totalAmount - i.paidAmount),
                0
            ),
        };

        return NextResponse.json({ invoices, stats });
    } catch (error) {
        console.error('Fetch invoices error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}

// POST create invoice (manual)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const data = await request.json();

        const newInvoice = new Invoice(data);
        await newInvoice.save();
        const populatedInvoice = await newInvoice.populate('customer', 'name phone email');

        return NextResponse.json({ invoice: populatedInvoice }, { status: 201 });
    } catch (error: any) {
        console.error('Create invoice error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create invoice' },
            { status: 500 }
        );
    }
}
