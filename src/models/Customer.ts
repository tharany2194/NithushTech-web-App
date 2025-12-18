import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    totalRepairs: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
        name: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            sparse: true,
        },
        address: {
            type: String,
            trim: true,
        },
        totalRepairs: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for text search
CustomerSchema.index({ name: 'text', phone: 'text' });

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
