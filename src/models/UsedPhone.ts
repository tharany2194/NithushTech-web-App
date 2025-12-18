import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUsedPhone extends Document {
    _id: mongoose.Types.ObjectId;
    brand: string;
    phoneModel: string;
    imei: string;
    condition: string;
    buyPrice: number;
    repairCost: number;
    sellPrice: number;
    status: 'Bought' | 'Repaired' | 'Sold';
    buyer?: mongoose.Types.ObjectId;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UsedPhoneSchema = new Schema<IUsedPhone>(
    {
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        phoneModel: {
            type: String,
            required: [true, 'Model is required'],
            trim: true,
        },
        imei: {
            type: String,
            required: [true, 'IMEI is required'],
            unique: true,
            trim: true,
        },
        condition: {
            type: String,
            default: 'Good',
            trim: true,
        },
        buyPrice: {
            type: Number,
            required: [true, 'Buy price is required'],
            min: 0,
        },
        repairCost: {
            type: Number,
            default: 0,
            min: 0,
        },
        sellPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['Bought', 'Repaired', 'Sold'],
            default: 'Bought',
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for profit calculation
UsedPhoneSchema.virtual('profit').get(function () {
    if (this.status === 'Sold' && this.sellPrice > 0) {
        return this.sellPrice - this.buyPrice - this.repairCost;
    }
    return 0;
});

// Indexes
UsedPhoneSchema.index({ imei: 1 });
UsedPhoneSchema.index({ status: 1 });
UsedPhoneSchema.index({ createdAt: -1 });

const UsedPhone: Model<IUsedPhone> = mongoose.models.UsedPhone || mongoose.model<IUsedPhone>('UsedPhone', UsedPhoneSchema);

export default UsedPhone;
