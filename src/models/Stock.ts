import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStock extends Document {
    _id: mongoose.Types.ObjectId;
    partName: string;
    sku: string;
    category: string;
    quantity: number;
    reorderLevel: number;
    supplier?: mongoose.Types.ObjectId;
    price: number;
    costPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

const StockSchema = new Schema<IStock>(
    {
        partName: {
            type: String,
            required: [true, 'Part name is required'],
            trim: true,
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        reorderLevel: {
            type: Number,
            default: 5,
            min: 0,
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
        },
        price: {
            type: Number,
            required: [true, 'Selling price is required'],
            min: 0,
        },
        costPrice: {
            type: Number,
            required: [true, 'Cost price is required'],
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
StockSchema.index({ category: 1 });
StockSchema.index({ quantity: 1, reorderLevel: 1 });

// Virtual for checking if low stock
StockSchema.virtual('isLowStock').get(function () {
    return this.quantity <= this.reorderLevel;
});

const Stock: Model<IStock> = mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);

export default Stock;
