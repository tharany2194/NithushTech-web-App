import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Repair from '@/models/Repair';
import Customer from '@/models/Customer';
import { generateRepairId } from '@/lib/utils';
import { generateQRCode, getTrackingUrl } from '@/lib/qrcode';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET all repairs
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        let query: Record<string, unknown> = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { repairId: { $regex: search, $options: 'i' } },
                { deviceModel: { $regex: search, $options: 'i' } },
                { deviceBrand: { $regex: search, $options: 'i' } },
            ];
        }

        const repairs = await Repair.find(query)
            .populate('customer', 'name phone email')
            .sort({ createdAt: -1 })
            .limit(100);

        // Get counts for each status
        const stats = {
            total: await Repair.countDocuments(),
            new: await Repair.countDocuments({ status: 'New' }),
            inProgress: await Repair.countDocuments({ status: 'In Progress' }),
            waitingParts: await Repair.countDocuments({ status: 'Waiting Parts' }),
            completed: await Repair.countDocuments({ status: 'Completed' }),
            delivered: await Repair.countDocuments({ status: 'Delivered' }),
        };

        return NextResponse.json({ repairs, stats });
    } catch (error) {
        console.error('Fetch repairs error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch repairs' },
            { status: 500 }
        );
    }
}

// POST create repair
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const formData = await request.formData();
        
        // Extract fields from FormData
        const customerName = formData.get('customerName') as string;
        const customerPhone = formData.get('customerPhone') as string;
        const customerEmail = formData.get('customerEmail') as string;
        const deviceType = formData.get('deviceType') as string;
        const deviceBrand = formData.get('deviceBrand') as string;
        const deviceModel = formData.get('deviceModel') as string;
        const imei = formData.get('imei') as string;
        const issue = formData.get('issue') as string;
        const estimatedCost = parseFloat(formData.get('estimatedCost') as string) || 0;
        const depositAmount = parseFloat(formData.get('depositAmount') as string) || 0;
        const expectedDeliveryDate = formData.get('expectedDeliveryDate') as string;
        const assignedTechnician = formData.get('assignedTechnician') as string;
        const technicianNotes = formData.get('technicianNotes') as string;
        const notes = formData.get('notes') as string;
        const beforeRepairPhoto = formData.get('beforeRepairPhoto') as File | null;

        // Handle file upload
        let photoPath = '';
        if (beforeRepairPhoto && beforeRepairPhoto.size > 0) {
            const bytes = await beforeRepairPhoto.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            // Create unique filename
            const timestamp = Date.now();
            const originalName = beforeRepairPhoto.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const filename = `${timestamp}_${originalName}`;
            
            // Create uploads directory if it doesn't exist
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'repairs');
            await mkdir(uploadDir, { recursive: true });
            
            // Save file
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            
            // Store relative path for database
            photoPath = `/uploads/repairs/${filename}`;
        }

        // Find or create customer
        let customer = await Customer.findOne({ phone: customerPhone });

        if (!customer) {
            customer = await Customer.create({
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
            });
        } else {
            // Update customer info if provided
            if (customerEmail && !customer.email) {
                customer.email = customerEmail;
                await customer.save();
            }
        }

        // Generate repair ID
        const repairId = generateRepairId();

        // Generate QR code
        const qrCodeUrl = await generateQRCode(repairId);

        // Create repair
        const repair = await Repair.create({
            repairId,
            customer: customer._id,
            deviceType,
            deviceBrand,
            deviceModel,
            imei,
            issue,
            estimatedCost,
            depositAmount,
            expectedDeliveryDate: expectedDeliveryDate || undefined,
            assignedTechnician,
            beforeRepairPhoto: photoPath || undefined,
            technicianNotes,
            notes,
            qrCodeUrl,
        });

        // Update customer total repairs
        await Customer.findByIdAndUpdate(customer._id, {
            $inc: { totalRepairs: 1 },
        });

        // Populate customer info
        await repair.populate('customer', 'name phone email');

        // TODO: Send welcome email if customer has email

        return NextResponse.json({
            repair,
            trackingUrl: getTrackingUrl(repairId),
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create repair error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create repair' },
            { status: 500 }
        );
    }
}
