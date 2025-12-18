import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignedPart {
    part: mongoose.Types.ObjectId;
    partName: string;
    quantity: number;
    price: number;
}

export interface IRepair extends Document {
    _id: mongoose.Types.ObjectId;
    repairId: string;
    customer: mongoose.Types.ObjectId;
    deviceType: string;
    deviceBrand: string;
    deviceModel: string;
    imei?: string;
    issue: string;
    status: 'New' | 'In Progress' | 'Waiting Parts' | 'Completed' | 'Delivered';
    assignedParts: IAssignedPart[];
    estimatedCost: number;
    finalCost: number;
    depositAmount: number;
    expectedDeliveryDate?: Date;
    assignedTechnician?: string;
    beforeRepairPhoto?: string;
    qrCodeUrl?: string;
    notes?: string;
    technicianNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssignedPartSchema = new Schema<IAssignedPart>({
    part: {
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        required: true,
    },
    partName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
});

const RepairSchema = new Schema<IRepair>(
    {
        repairId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        deviceType: {
            type: String,
            required: [true, 'Device type is required'],
            enum: ['Phone', 'Tablet', 'Laptop', 'Computer', 'Other'],
        },
        deviceBrand: {
            type: String,
            required: [true, 'Device brand is required'],
            trim: true,
        },
        deviceModel: {
            type: String,
            required: [true, 'Device model is required'],
            trim: true,
        },
        imei: {
            type: String,
            trim: true,
        },
        issue: {
            type: String,
            required: [true, 'Issue description is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['New', 'In Progress', 'Waiting Parts', 'Completed', 'Delivered'],
            default: 'New',
        },
        assignedParts: [AssignedPartSchema],
        estimatedCost: {
            type: Number,
            default: 0,
            min: 0,
        },
        finalCost: {
            type: Number,
            default: 0,
            min: 0,
        },
        depositAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        expectedDeliveryDate: {
            type: Date,
        },
        assignedTechnician: {
            type: String,
            trim: true,
        },
        beforeRepairPhoto: {
            type: String,
        },
        qrCodeUrl: {
            type: String,
        },
        notes: {
            type: String,
            trim: true,
        },
        technicianNotes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
RepairSchema.index({ customer: 1 });
RepairSchema.index({ status: 1 });
RepairSchema.index({ createdAt: -1 });

const Repair: Model<IRepair> = mongoose.models.Repair || mongoose.model<IRepair>('Repair', RepairSchema);

export default Repair;
