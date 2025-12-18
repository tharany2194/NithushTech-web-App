'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createRepair } from '@/store/slices/repairsSlice';
import { AppDispatch } from '@/store/store';
import { DEVICE_TYPES } from '@/lib/utils';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewRepairPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        deviceType: 'Phone',
        deviceBrand: '',
        deviceModel: '',
        imei: '',
        issue: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        estimatedCost: '',
        depositAmount: '',
        expectedDeliveryDate: '',
        assignedTechnician: '',
        beforeRepairPhoto: null as File | null,
        technicianNotes: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, beforeRepairPhoto: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Create FormData for file upload
            const submitFormData = new FormData();
            
            // Append all text fields
            submitFormData.append('deviceType', formData.deviceType);
            submitFormData.append('deviceBrand', formData.deviceBrand);
            submitFormData.append('deviceModel', formData.deviceModel);
            submitFormData.append('imei', formData.imei);
            submitFormData.append('issue', formData.issue);
            submitFormData.append('customerName', formData.customerName);
            submitFormData.append('customerPhone', formData.customerPhone);
            submitFormData.append('customerEmail', formData.customerEmail);
            submitFormData.append('estimatedCost', (parseFloat(formData.estimatedCost) || 0).toString());
            submitFormData.append('depositAmount', (parseFloat(formData.depositAmount) || 0).toString());
            submitFormData.append('expectedDeliveryDate', formData.expectedDeliveryDate);
            submitFormData.append('assignedTechnician', formData.assignedTechnician);
            submitFormData.append('technicianNotes', formData.technicianNotes);
            submitFormData.append('notes', formData.notes);
            
            // Append file if exists
            if (formData.beforeRepairPhoto) {
                submitFormData.append('beforeRepairPhoto', formData.beforeRepairPhoto);
            }

            // Send to API directly (bypassing Redux for file upload)
            const response = await fetch('/api/repairs', {
                method: 'POST',
                body: submitFormData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create repair');
            }

            // Success - redirect to repairs list
            router.push('/dashboard/repairs');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/repairs"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Repair Management</h1>
                    <p className="text-gray-500">Track and manage all device repairs</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">New Repair Ticket</h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Device Information */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Device Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Device Type *</label>
                                <select
                                    name="deviceType"
                                    value={formData.deviceType}
                                    onChange={handleChange}
                                    className="select"
                                    required
                                >
                                    {DEVICE_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Brand *</label>
                                <input
                                    type="text"
                                    name="deviceBrand"
                                    value={formData.deviceBrand}
                                    onChange={handleChange}
                                    placeholder="e.g., Apple, Samsung"
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Model *</label>
                                <input
                                    type="text"
                                    name="deviceModel"
                                    value={formData.deviceModel}
                                    onChange={handleChange}
                                    placeholder="e.g., iPhone 13 Pro"
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">IMEI / Serial Number</label>
                                <input
                                    type="text"
                                    name="imei"
                                    value={formData.imei}
                                    onChange={handleChange}
                                    placeholder="Device identifier"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="label">Problem Description *</label>
                            <textarea
                                name="issue"
                                value={formData.issue}
                                onChange={handleChange}
                                placeholder="Describe the issue in detail..."
                                className="input min-h-25"
                                required
                            />
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Customer Name *</label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Email (for notifications)</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="customer@email.com"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Repair Details */}
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">Repair Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Estimated Cost (€) *</label>
                                <input
                                    type="number"
                                    name="estimatedCost"
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="input"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">Deposit Amount (€)</label>
                                <input
                                    type="number"
                                    name="depositAmount"
                                    value={formData.depositAmount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="input"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label className="label">Expected Delivery Date</label>
                                <input
                                    type="date"
                                    name="expectedDeliveryDate"
                                    value={formData.expectedDeliveryDate}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="label">Assigned Technician</label>
                                <input
                                    type="text"
                                    name="assignedTechnician"
                                    value={formData.assignedTechnician}
                                    onChange={handleChange}
                                    placeholder="Technician name"
                                    className="input"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Before Repair Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData.beforeRepairPhoto && (
                                    <p className="text-sm text-gray-500 mt-2">Selected: {formData.beforeRepairPhoto.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="label">Technician Notes</label>
                            <textarea
                                name="technicianNotes"
                                value={formData.technicianNotes}
                                onChange={handleChange}
                                placeholder="Notes for technicians during repair..."
                                className="input min-h-25"
                            />
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                        <label className="label">Internal Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional notes for staff..."
                            className="input min-h-20"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Link
                            href="/dashboard/repairs"
                            className="btn btn-outline"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-accent inline-flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Create Repair Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
