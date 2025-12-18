import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Repair from '@/models/Repair';
import Customer from '@/models/Customer';
import Stock from '@/models/Stock';
import Invoice from '@/models/Invoice';
import { generateInvoiceNumber } from '@/lib/utils';

// GET single repair
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Ensure Stock model is registered
        Stock.modelName;

        const repair = await Repair.findById(id)
            .populate('customer', 'name phone email address')
            .populate('assignedParts.part', 'partName sku price');

        if (!repair) {
            return NextResponse.json(
                { error: 'Repair not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ repair });
    } catch (error) {
        console.error('Fetch repair error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch repair' },
            { status: 500 }
        );
    }
}

// PUT update repair
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        const repair = await Repair.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate('customer', 'name phone email');

        if (!repair) {
            return NextResponse.json(
                { error: 'Repair not found' },
                { status: 404 }
            );
        }

        // If status changed to Completed, create invoice
        if (data.status === 'Completed' && repair.finalCost > 0) {
            // Check if invoice already exists
            const existingInvoice = await Invoice.findOne({
                type: 'Repair',
                reference: repair._id,
            });

            if (!existingInvoice) {
                const invoiceNumber = generateInvoiceNumber();

                const items = [
                    {
                        description: `Repair Service - ${repair.deviceBrand} ${repair.deviceModel}`,
                        quantity: 1,
                        unitPrice: repair.finalCost,
                        total: repair.finalCost,
                    },
                ];

                // Add parts to invoice items
                if (repair.assignedParts && repair.assignedParts.length > 0) {
                    for (const part of repair.assignedParts) {
                        items.push({
                            description: part.partName,
                            quantity: part.quantity,
                            unitPrice: part.price,
                            total: part.quantity * part.price,
                        });
                    }
                }

                const subtotal = items.reduce((sum, item) => sum + item.total, 0);
                const tax = 0; // Can be configured
                const totalAmount = subtotal + tax;

                await Invoice.create({
                    invoiceNumber,
                    type: 'Repair',
                    reference: repair._id,
                    customer: repair.customer._id,
                    items,
                    subtotal,
                    tax,
                    totalAmount,
                    paidAmount: repair.depositAmount || 0,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                });

                // Update customer total spent
                await Customer.findByIdAndUpdate(repair.customer._id, {
                    $inc: { totalSpent: totalAmount },
                });
            }
        }

        return NextResponse.json({ repair });
    } catch (error) {
        console.error('Update repair error:', error);
        return NextResponse.json(
            { error: 'Failed to update repair' },
            { status: 500 }
        );
    }
}

// DELETE repair
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const repair = await Repair.findByIdAndDelete(id);

        if (!repair) {
            return NextResponse.json(
                { error: 'Repair not found' },
                { status: 404 }
            );
        }

        // Decrement customer repair count
        await Customer.findByIdAndUpdate(repair.customer, {
            $inc: { totalRepairs: -1 },
        });

        return NextResponse.json({ message: 'Repair deleted successfully' });
    } catch (error) {
        console.error('Delete repair error:', error);
        return NextResponse.json(
            { error: 'Failed to delete repair' },
            { status: 500 }
        );
    }
}
