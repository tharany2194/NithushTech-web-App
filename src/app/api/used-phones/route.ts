import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UsedPhone from '@/models/UsedPhone';

// GET all used phones
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let query: Record<string, unknown> = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const phones = await UsedPhone.find(query)
            .populate('buyer', 'name phone')
            .sort({ createdAt: -1 });

        // Calculate stats
        const allPhones = await UsedPhone.find();
        const stats = {
            total: allPhones.length,
            bought: allPhones.filter(p => p.status === 'Bought').length,
            repaired: allPhones.filter(p => p.status === 'Repaired').length,
            sold: allPhones.filter(p => p.status === 'Sold').length,
            totalProfit: allPhones
                .filter(p => p.status === 'Sold')
                .reduce((sum, p) => sum + (p.sellPrice - p.buyPrice - p.repairCost), 0),
        };

        return NextResponse.json({ phones, stats });
    } catch (error) {
        console.error('Fetch used phones error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch used phones' },
            { status: 500 }
        );
    }
}

// POST create used phone (buy phone)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const data = await request.json();

        // Check for existing IMEI
        const existing = await UsedPhone.findOne({ imei: data.imei });
        if (existing) {
            return NextResponse.json(
                { error: 'Phone with this IMEI already exists' },
                { status: 400 }
            );
        }

        const phone = await UsedPhone.create({
            ...data,
            status: 'Bought',
        });

        return NextResponse.json({ phone }, { status: 201 });
    } catch (error: any) {
        console.error('Create used phone error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create used phone' },
            { status: 500 }
        );
    }
}
