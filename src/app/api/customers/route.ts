import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

// GET all customers
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const customers = await Customer.find(query)
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json({ customers });
    } catch (error) {
        console.error('Fetch customers error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

// POST create customer
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const data = await request.json();

        // Check for existing customer with same phone
        const existing = await Customer.findOne({ phone: data.phone });
        if (existing) {
            return NextResponse.json(
                { error: 'Customer with this phone number already exists' },
                { status: 400 }
            );
        }

        const customer = await Customer.create(data);

        return NextResponse.json({ customer }, { status: 201 });
    } catch (error: any) {
        console.error('Create customer error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create customer' },
            { status: 500 }
        );
    }
}
