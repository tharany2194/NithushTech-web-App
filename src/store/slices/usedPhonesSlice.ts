'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface UsedPhone {
    _id: string;
    brand: string;
    phoneModel: string;
    imei: string;
    condition: string;
    buyPrice: number;
    repairCost: number;
    sellPrice: number;
    status: 'Bought' | 'Repaired' | 'Sold';
    profit: number;
    buyer?: {
        _id: string;
        name: string;
        phone: string;
    };
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface UsedPhonesState {
    phones: UsedPhone[];
    currentPhone: UsedPhone | null;
    isLoading: boolean;
    error: string | null;
    stats: {
        total: number;
        bought: number;
        repaired: number;
        sold: number;
        totalProfit: number;
    };
}

const initialState: UsedPhonesState = {
    phones: [],
    currentPhone: null,
    isLoading: false,
    error: null,
    stats: {
        total: 0,
        bought: 0,
        repaired: 0,
        sold: 0,
        totalProfit: 0,
    },
};

export const fetchUsedPhones = createAsyncThunk(
    'usedPhones/fetchAll',
    async (status?: string, { rejectWithValue }) => {
        try {
            const queryParams = status ? `?status=${status}` : '';
            const response = await fetch(`/api/used-phones${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch phones');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch phones');
        }
    }
);

export const createUsedPhone = createAsyncThunk(
    'usedPhones/create',
    async (phoneData: Partial<UsedPhone>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/used-phones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(phoneData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create phone');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create phone');
        }
    }
);

export const updateUsedPhone = createAsyncThunk(
    'usedPhones/update',
    async ({ id, data }: { id: string; data: Partial<UsedPhone> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/used-phones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update phone');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to update phone');
        }
    }
);

export const sellUsedPhone = createAsyncThunk(
    'usedPhones/sell',
    async ({ id, sellData }: { id: string; sellData: { sellPrice: number; buyerName: string; buyerPhone: string; buyerEmail?: string } }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/used-phones/${id}/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sellData),
            });

            if (!response.ok) throw new Error('Failed to sell phone');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to sell phone');
        }
    }
);

export const deleteUsedPhone = createAsyncThunk(
    'usedPhones/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/used-phones/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete phone');
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete phone');
        }
    }
);

const usedPhonesSlice = createSlice({
    name: 'usedPhones',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsedPhones.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsedPhones.fulfilled, (state, action) => {
                state.isLoading = false;
                state.phones = action.payload.phones;
                state.stats = action.payload.stats;
            })
            .addCase(fetchUsedPhones.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createUsedPhone.fulfilled, (state, action) => {
                state.phones.unshift(action.payload.phone);
            })
            .addCase(updateUsedPhone.fulfilled, (state, action) => {
                const index = state.phones.findIndex(p => p._id === action.payload.phone._id);
                if (index !== -1) {
                    state.phones[index] = action.payload.phone;
                }
            })
            .addCase(sellUsedPhone.fulfilled, (state, action) => {
                const index = state.phones.findIndex(p => p._id === action.payload.phone._id);
                if (index !== -1) {
                    state.phones[index] = action.payload.phone;
                }
            })
            .addCase(deleteUsedPhone.fulfilled, (state, action) => {
                state.phones = state.phones.filter(p => p._id !== action.payload);
            });
    },
});

export const { clearError } = usedPhonesSlice.actions;
export default usedPhonesSlice.reducer;
