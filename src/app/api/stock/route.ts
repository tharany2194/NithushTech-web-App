import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/models/Stock';

// GET all stock items
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let query: Record<string, unknown> = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { partName: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }

        const items = await Stock.find(query)
            .populate('supplier', 'name')
            .sort({ partName: 1 });

        return NextResponse.json({ items });
    } catch (error) {
        console.error('Fetch stock error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stock' },
            { status: 500 }
        );
    }
}

// POST create stock item
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const data = await request.json();

        // Check for existing SKU
        const existing = await Stock.findOne({ sku: data.sku });
        if (existing) {
            return NextResponse.json(
                { error: 'SKU already exists' },
                { status: 400 }
            );
        }

        const item = await Stock.create(data);

        return NextResponse.json({ item }, { status: 201 });
    } catch (error: any) {
        console.error('Create stock error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create stock item' },
            { status: 500 }
        );
    }
}
