'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

interface UIState {
    sidebarOpen: boolean;
    modalOpen: string | null;
    toasts: Toast[];
    isPageLoading: boolean;
}

const initialState: UIState = {
    sidebarOpen: true,
    modalOpen: null,
    toasts: [],
    isPageLoading: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        openModal: (state, action: PayloadAction<string>) => {
            state.modalOpen = action.payload;
        },
        closeModal: (state) => {
            state.modalOpen = null;
        },
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            state.toasts.push({
                ...action.payload,
                id: Date.now().toString(),
            });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter(t => t.id !== action.payload);
        },
        setPageLoading: (state, action: PayloadAction<boolean>) => {
            state.isPageLoading = action.payload;
        },
    },
});

export const {
    toggleSidebar,
    openModal,
    closeModal,
    addToast,
    removeToast,
    setPageLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
