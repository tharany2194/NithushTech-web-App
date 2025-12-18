import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UsedPhone from '@/models/UsedPhone';
import Customer from '@/models/Customer';
import Invoice from '@/models/Invoice';
import { generateInvoiceNumber } from '@/lib/utils';

// POST sell used phone
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const { sellPrice, buyerName, buyerPhone, buyerEmail } = await request.json();

        const phone = await UsedPhone.findById(id);

        if (!phone) {
            return NextResponse.json(
                { error: 'Used phone not found' },
                { status: 404 }
            );
        }

        if (phone.status === 'Sold') {
            return NextResponse.json(
                { error: 'Phone is already sold' },
                { status: 400 }
            );
        }

        // Find or create customer (buyer)
        let buyer = await Customer.findOne({ phone: buyerPhone });

        if (!buyer) {
            buyer = await Customer.create({
                name: buyerName,
                phone: buyerPhone,
                email: buyerEmail,
            });
        }

        // Update phone status
        phone.status = 'Sold';
        phone.sellPrice = sellPrice;
        phone.buyer = buyer._id;
        await phone.save();

        // Create invoice
        const invoiceNumber = generateInvoiceNumber();
        const totalAmount = sellPrice;

        const invoice = await Invoice.create({
            invoiceNumber,
            type: 'UsedPhone',
            reference: phone._id,
            customer: buyer._id,
            items: [
                {
                    description: `${phone.brand} ${phone.phoneModel} (IMEI: ${phone.imei})`,
                    quantity: 1,
                    unitPrice: sellPrice,
                    total: sellPrice,
                },
            ],
            subtotal: totalAmount,
            tax: 0,
            totalAmount,
            paidAmount: totalAmount, // Assume paid on sale
            status: 'Paid',
            dueDate: new Date(),
            paidDate: new Date(),
        });

        // Update customer total spent
        await Customer.findByIdAndUpdate(buyer._id, {
            $inc: { totalSpent: totalAmount },
        });

        await phone.populate('buyer', 'name phone email');

        return NextResponse.json({
            phone,
            invoice,
            profit: phone.sellPrice - phone.buyPrice - phone.repairCost,
        });
    } catch (error) {
        console.error('Sell phone error:', error);
        return NextResponse.json(
            { error: 'Failed to sell phone' },
            { status: 500 }
        );
    }
}
