import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

// Generate unique repair ID (e.g., REP-2024-0001)
export function generateRepairId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    return `REP-${year}-${timestamp}${random.slice(-2)}`;
}

// Generate unique invoice number (e.g., INV-2024-0001)
export function generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    return `INV-${year}-${timestamp}${random.slice(-2)}`;
}

// Generate SKU for stock items
export function generateSKU(category: string): string {
    const prefix = category.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${random}`;
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency,
    }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
}

// Format short date
export function formatShortDate(date: Date | string): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
}

// Status colors for repairs
export const repairStatusColors: Record<string, { bg: string; text: string; border: string }> = {
    'New': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'In Progress': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Waiting Parts': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Completed': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Delivered': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

// Status colors for invoices
export const invoiceStatusColors: Record<string, { bg: string; text: string; border: string }> = {
    'Paid': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Partial': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Overdue': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

// Status colors for used phones
export const phoneStatusColors: Record<string, { bg: string; text: string; border: string }> = {
    'Bought': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Repaired': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Sold': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

// Calculate days overdue
export function getDaysOverdue(dueDate: Date | string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

// Repair statuses
export const REPAIR_STATUSES = ['New', 'In Progress', 'Waiting Parts', 'Completed', 'Delivered'] as const;
export type RepairStatus = typeof REPAIR_STATUSES[number];

// Invoice statuses
export const INVOICE_STATUSES = ['Paid', 'Partial', 'Overdue'] as const;
export type InvoiceStatus = typeof INVOICE_STATUSES[number];

// Phone statuses
export const PHONE_STATUSES = ['Bought', 'Repaired', 'Sold'] as const;
export type PhoneStatus = typeof PHONE_STATUSES[number];

// Device types
export const DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Computer', 'Other'] as const;
export type DeviceType = typeof DEVICE_TYPES[number];
