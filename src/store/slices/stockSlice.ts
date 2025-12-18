'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface StockItem {
    _id: string;
    partName: string;
    sku: string;
    category: string;
    quantity: number;
    reorderLevel: number;
    supplier?: {
        _id: string;
        name: string;
    };
    price: number;
    costPrice: number;
    createdAt: string;
    updatedAt: string;
}

interface StockState {
    items: StockItem[];
    lowStockItems: StockItem[];
    isLoading: boolean;
    error: string | null;
}

const initialState: StockState = {
    items: [],
    lowStockItems: [],
    isLoading: false,
    error: null,
};

export const fetchStock = createAsyncThunk(
    'stock/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/stock');
            if (!response.ok) throw new Error('Failed to fetch stock');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch stock');
        }
    }
);

export const fetchLowStock = createAsyncThunk(
    'stock/fetchLowStock',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/stock/low-stock');
            if (!response.ok) throw new Error('Failed to fetch low stock');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch low stock');
        }
    }
);

export const createStockItem = createAsyncThunk(
    'stock/create',
    async (itemData: Partial<StockItem>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create stock item');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create stock item');
        }
    }
);

export const updateStockItem = createAsyncThunk(
    'stock/update',
    async ({ id, data }: { id: string; data: Partial<StockItem> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/stock/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update stock item');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to update stock item');
        }
    }
);

export const deleteStockItem = createAsyncThunk(
    'stock/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/stock/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete stock item');
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete stock item');
        }
    }
);

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStock.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.items;
            })
            .addCase(fetchStock.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchLowStock.fulfilled, (state, action) => {
                state.lowStockItems = action.payload.items;
            })
            .addCase(createStockItem.fulfilled, (state, action) => {
                state.items.unshift(action.payload.item);
            })
            .addCase(updateStockItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i._id === action.payload.item._id);
                if (index !== -1) {
                    state.items[index] = action.payload.item;
                }
            })
            .addCase(deleteStockItem.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i._id !== action.payload);
            });
    },
});

export const { clearError } = stockSlice.actions;
export default stockSlice.reducer;
