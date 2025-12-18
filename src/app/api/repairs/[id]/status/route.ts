import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Repair from '@/models/Repair';
import Customer from '@/models/Customer';
import Invoice from '@/models/Invoice';
import { generateInvoiceNumber } from '@/lib/utils';

// PATCH update repair status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const { status } = await request.json();

        const validStatuses = ['New', 'In Progress', 'Waiting Parts', 'Completed', 'Delivered'];

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const repair = await Repair.findById(id).populate('customer', 'name phone email');

        if (!repair) {
            return NextResponse.json(
                { error: 'Repair not found' },
                { status: 404 }
            );
        }

        const oldStatus = repair.status;
        repair.status = status;
        await repair.save();

        // If status changed to Completed, create invoice
        if (status === 'Completed' && oldStatus !== 'Completed' && repair.finalCost > 0) {
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
                const totalAmount = subtotal;

                await Invoice.create({
                    invoiceNumber,
                    type: 'Repair',
                    reference: repair._id,
                    customer: repair.customer._id,
                    items,
                    subtotal,
                    tax: 0,
                    totalAmount,
                    paidAmount: repair.depositAmount || 0,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });

                await Customer.findByIdAndUpdate(repair.customer._id, {
                    $inc: { totalSpent: totalAmount },
                });
            }
        }

        // TODO: Send status update email notification

        return NextResponse.json({
            repair,
            message: `Status updated from ${oldStatus} to ${status}`,
        });
    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}
