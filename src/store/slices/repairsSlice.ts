'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Repair {
    _id: string;
    repairId: string;
    customer: {
        _id: string;
        name: string;
        phone: string;
        email?: string;
    };
    deviceType: string;
    deviceBrand: string;
    deviceModel: string;
    imei?: string;
    issue: string;
    status: 'New' | 'In Progress' | 'Waiting Parts' | 'Completed' | 'Delivered';
    assignedParts: Array<{
        part: string;
        partName: string;
        quantity: number;
        price: number;
    }>;
    estimatedCost: number;
    finalCost: number;
    depositAmount: number;
    expectedDeliveryDate?: string;
    assignedTechnician?: string;
    beforeRepairPhoto?: string;
    technicianNotes?: string;
    qrCodeUrl?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface RepairsState {
    repairs: Repair[];
    currentRepair: Repair | null;
    isLoading: boolean;
    error: string | null;
    stats: {
        total: number;
        new: number;
        inProgress: number;
        waitingParts: number;
        completed: number;
        delivered: number;
    };
}

const initialState: RepairsState = {
    repairs: [],
    currentRepair: null,
    isLoading: false,
    error: null,
    stats: {
        total: 0,
        new: 0,
        inProgress: 0,
        waitingParts: 0,
        completed: 0,
        delivered: 0,
    },
};

export const fetchRepairs = createAsyncThunk(
    'repairs/fetchAll',
    async (params: { status?: string; search?: string } | undefined, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.status) queryParams.set('status', params.status);
            if (params?.search) queryParams.set('search', params.search);

            const response = await fetch(`/api/repairs?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch repairs');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch repairs');
        }
    }
);

export const fetchRepairById = createAsyncThunk(
    'repairs/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/repairs/${id}`);
            if (!response.ok) throw new Error('Failed to fetch repair');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch repair');
        }
    }
);

export const createRepair = createAsyncThunk(
    'repairs/create',
    async (repairData: Partial<Repair> & { customerName: string; customerPhone: string; customerEmail?: string }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/repairs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(repairData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create repair');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create repair');
        }
    }
);

export const updateRepairStatus = createAsyncThunk(
    'repairs/updateStatus',
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/repairs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('Failed to update status');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to update status');
        }
    }
);

export const updateRepair = createAsyncThunk(
    'repairs/update',
    async ({ id, data }: { id: string; data: Partial<Repair> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/repairs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update repair');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to update repair');
        }
    }
);

export const deleteRepair = createAsyncThunk(
    'repairs/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/repairs/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete repair');
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete repair');
        }
    }
);

const repairsSlice = createSlice({
    name: 'repairs',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentRepair: (state) => {
            state.currentRepair = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all repairs
            .addCase(fetchRepairs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRepairs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.repairs = action.payload.repairs;
                state.stats = action.payload.stats;
            })
            .addCase(fetchRepairs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch repair by ID
            .addCase(fetchRepairById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRepairById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRepair = action.payload.repair;
            })
            .addCase(fetchRepairById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create repair
            .addCase(createRepair.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRepair.fulfilled, (state, action) => {
                state.isLoading = false;
                state.repairs.unshift(action.payload.repair);
            })
            .addCase(createRepair.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update status
            .addCase(updateRepairStatus.fulfilled, (state, action) => {
                const index = state.repairs.findIndex(r => r._id === action.payload.repair._id);
                if (index !== -1) {
                    state.repairs[index] = action.payload.repair;
                }
                if (state.currentRepair?._id === action.payload.repair._id) {
                    state.currentRepair = action.payload.repair;
                }
            })
            // Update repair
            .addCase(updateRepair.fulfilled, (state, action) => {
                const index = state.repairs.findIndex(r => r._id === action.payload.repair._id);
                if (index !== -1) {
                    state.repairs[index] = action.payload.repair;
                }
                if (state.currentRepair?._id === action.payload.repair._id) {
                    state.currentRepair = action.payload.repair;
                }
            })
            // Delete repair
            .addCase(deleteRepair.fulfilled, (state, action) => {
                state.repairs = state.repairs.filter(r => r._id !== action.payload);
            });
    },
});

export const { clearError, clearCurrentRepair } = repairsSlice.actions;
export default repairsSlice.reducer;
