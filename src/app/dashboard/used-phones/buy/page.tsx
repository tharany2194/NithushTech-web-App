'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createUsedPhone } from '@/store/slices/usedPhonesSlice';
import { AppDispatch } from '@/store/store';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function BuyPhonePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        brand: '',
        phoneModel: '',
        imei: '',
        condition: 'Good',
        buyPrice: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await dispatch(createUsedPhone({
                ...formData,
                buyPrice: parseFloat(formData.buyPrice) || 0,
            }));

            if (createUsedPhone.fulfilled.match(result)) {
                router.push('/dashboard/used-phones');
            } else {
                setError(result.payload as string || 'Failed to add phone');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/used-phones"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Buy Phone</h1>
                    <p className="text-gray-500">Add a new used phone to inventory</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Brand *</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
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
                                name="phoneModel"
                                value={formData.phoneModel}
                                onChange={handleChange}
                                placeholder="e.g., iPhone 12 Pro"
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">IMEI *</label>
                            <input
                                type="text"
                                name="imei"
                                value={formData.imei}
                                onChange={handleChange}
                                placeholder="15-digit IMEI number"
                                className="input font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Condition</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Buy Price (€) *</label>
                            <input
                                type="number"
                                name="buyPrice"
                                value={formData.buyPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="input"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Additional notes..."
                            className="input min-h-[80px]"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Link href="/dashboard/used-phones" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-accent inline-flex items-center gap-2"
                        >
                            {loading ? 'Adding...' : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Add Phone
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
