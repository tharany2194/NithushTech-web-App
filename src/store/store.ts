'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import repairsReducer from './slices/repairsSlice';
import customersReducer from './slices/customersSlice';
import usedPhonesReducer from './slices/usedPhonesSlice';
import stockReducer from './slices/stockSlice';
import invoicesReducer from './slices/invoicesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        repairs: repairsReducer,
        customers: customersReducer,
        usedPhones: usedPhonesReducer,
        stock: stockReducer,
        invoices: invoicesReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
