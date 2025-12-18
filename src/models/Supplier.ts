import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupplier extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
    {
        name: {
            type: String,
            required: [true, 'Supplier name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Supplier: Model<ISupplier> = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', SupplierSchema);

export default Supplier;
