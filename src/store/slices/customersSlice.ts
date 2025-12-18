'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Customer {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    totalRepairs: number;
    totalSpent: number;
    createdAt: string;
    updatedAt: string;
}

interface CustomersState {
    customers: Customer[];
    currentCustomer: Customer | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CustomersState = {
    customers: [],
    currentCustomer: null,
    isLoading: false,
    error: null,
};

export const fetchCustomers = createAsyncThunk(
    'customers/fetchAll',
    async (search?: string, { rejectWithValue }) => {
        try {
            const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
            const response = await fetch(`/api/customers${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch customers');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch customers');
        }
    }
);

export const fetchCustomerById = createAsyncThunk(
    'customers/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/customers/${id}`);
            if (!response.ok) throw new Error('Failed to fetch customer');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to fetch customer');
        }
    }
);

export const createCustomer = createAsyncThunk(
    'customers/create',
    async (customerData: Partial<Customer>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create customer');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create customer');
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'customers/update',
    async ({ id, data }: { id: string; data: Partial<Customer> }, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update customer');
            return await response.json();
        } catch (error) {
            return rejectWithValue('Failed to update customer');
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    'customers/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete customer');
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete customer');
        }
    }
);

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCustomer: (state) => {
            state.currentCustomer = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.customers = action.payload.customers;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                state.currentCustomer = action.payload.customer;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.customers.unshift(action.payload.customer);
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const index = state.customers.findIndex(c => c._id === action.payload.customer._id);
                if (index !== -1) {
                    state.customers[index] = action.payload.customer;
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(c => c._id !== action.payload);
            });
    },
});

export const { clearError, clearCurrentCustomer } = customersSlice.actions;
export default customersSlice.reducer;
