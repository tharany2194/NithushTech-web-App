import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface IInvoice extends Document {
    _id: mongoose.Types.ObjectId;
    invoiceNumber: string;
    type: 'Repair' | 'UsedPhone';
    reference: mongoose.Types.ObjectId;
    customer: mongoose.Types.ObjectId;
    items: IInvoiceItem[];
    subtotal: number;
    tax: number;
    totalAmount: number;
    paidAmount: number;
    status: 'Paid' | 'Partial' | 'Overdue';
    dueDate: Date;
    paidDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
});

const InvoiceSchema = new Schema<IInvoice>(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ['Repair', 'UsedPhone'],
            required: true,
        },
        reference: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'type',
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        items: [InvoiceItemSchema],
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        tax: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['Paid', 'Partial', 'Overdue'],
            default: 'Overdue',
        },
        dueDate: {
            type: Date,
            required: true,
        },
        paidDate: {
            type: Date,
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

// Virtual for outstanding amount
InvoiceSchema.virtual('outstandingAmount').get(function () {
    return this.totalAmount - this.paidAmount;
});

// Indexes
InvoiceSchema.index({ customer: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ createdAt: -1 });

// Pre-save hook to update status based on payment
InvoiceSchema.pre('save', function (next) {
    if (this.paidAmount >= this.totalAmount) {
        this.status = 'Paid';
        if (!this.paidDate) {
            this.paidDate = new Date();
        }
    } else if (this.paidAmount > 0) {
        this.status = 'Partial';
    } else {
        this.status = 'Overdue';
    }
    next();
});

const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
