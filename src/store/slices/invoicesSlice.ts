'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Invoice {
    _id: string;
    invoiceNumber: string;
    type: 'Repair' | 'UsedPhone';
    reference: string;
    customer: {
        _id: string;
        name: string;
        phone: string;
        email?: string;
    };
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    totalAmount: number;
    paidAmount: number;
    status: 'Paid' | 'Partial' | 'Overdue';
    dueDate: string;
    paidDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface InvoicesState {
    invoices: Invoice[];
    currentInvoice: Invoice | null;
    isLoading: boolean;
    error: string | null;
    stats: {
        total: number;
        paid: number;
        partial: number;
        overdue: number;
        totalOutstanding: number;
    };
}

const initialState: InvoicesState = {
    invoices: [],
    currentInvoice: null,
    isLoading: false,
    error: null,
    stats: {
        total: 0,
        paid: 0,
        partial: 0,
        overdue: 0,
        totalOutstanding: 0,
    },
};

export const fetchInvoices = createAsyncThunk(
    'invoices/fetchAll',
    async (status: string | undefined, { rejectWithValue }) => {
        try {
            const queryParams = status ? `?status=${status}` : '';
            const response = await fetch(`/api/invoices${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch invoices');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch invoices');
        }
    }
);

export const fetchInvoiceById = createAsyncThunk(
    'invoices/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/invoices/${id}`);
            if (!response.ok) throw new Error('Failed to fetch invoice');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch invoice');
        }
    }
);

export const recordPayment = createAsyncThunk(
    'invoices/recordPayment',
    async ({ id, amount }: { id: string; amount: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/invoices/${id}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) throw new Error('Failed to record payment');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to record payment');
        }
    }
);

export const deleteInvoice = createAsyncThunk(
    'invoices/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete invoice');
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete invoice');
        }
    }
);

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentInvoice: (state) => {
            state.currentInvoice = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.invoices = action.payload.invoices;
                state.stats = action.payload.stats;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.currentInvoice = action.payload.invoice;
            })
            .addCase(recordPayment.fulfilled, (state, action) => {
                const index = state.invoices.findIndex(i => i._id === action.payload.invoice._id);
                if (index !== -1) {
                    state.invoices[index] = action.payload.invoice;
                }
                if (state.currentInvoice?._id === action.payload.invoice._id) {
                    state.currentInvoice = action.payload.invoice;
                }
            })
            .addCase(deleteInvoice.fulfilled, (state, action) => {
                state.invoices = state.invoices.filter(i => i._id !== action.payload);
            });
    },
});

export const { clearError, clearCurrentInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
