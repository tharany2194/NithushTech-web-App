import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/models/Stock';

// GET low stock items
export async function GET() {
    try {
        await dbConnect();

        // Find items where quantity <= reorderLevel
        const items = await Stock.find({
            $expr: { $lte: ['$quantity', '$reorderLevel'] },
        })
            .populate('supplier', 'name email phone')
            .sort({ quantity: 1 });

        return NextResponse.json({ items });
    } catch (error) {
        console.error('Fetch low stock error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch low stock items' },
            { status: 500 }
        );
    }
}
