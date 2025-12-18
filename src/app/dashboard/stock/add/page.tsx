'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createStockItem } from '@/store/slices/stockSlice';
import { AppDispatch } from '@/store/store';
import { generateSKU } from '@/lib/utils';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Screen', 'Battery', 'Charger', 'Cable', 'Case', 'Camera', 'Speaker', 'Other'];

export default function AddStockPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        partName: '',
        sku: '',
        category: 'Screen',
        quantity: '',
        reorderLevel: '5',
        costPrice: '',
        price: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Auto-generate SKU when category changes
        if (name === 'category' && !formData.sku) {
            setFormData(prev => ({ ...prev, sku: generateSKU(value) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await dispatch(createStockItem({
                ...formData,
                quantity: parseInt(formData.quantity) || 0,
                reorderLevel: parseInt(formData.reorderLevel) || 5,
                costPrice: parseFloat(formData.costPrice) || 0,
                price: parseFloat(formData.price) || 0,
            }));

            if (createStockItem.fulfilled.match(result)) {
                router.push('/dashboard/stock');
            } else {
                setError(result.payload as string || 'Failed to add stock item');
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
                    href="/dashboard/stock"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Stock</h1>
                    <p className="text-gray-500">Add new parts to inventory</p>
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
                        <div className="md:col-span-2">
                            <label className="label">Part Name *</label>
                            <input
                                type="text"
                                name="partName"
                                value={formData.partName}
                                onChange={handleChange}
                                placeholder="e.g., iPhone 13 Screen"
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="select"
                                required
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">SKU *</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="Auto-generated"
                                className="input font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Quantity *</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0"
                                className="input"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Reorder Level</label>
                            <input
                                type="number"
                                name="reorderLevel"
                                value={formData.reorderLevel}
                                onChange={handleChange}
                                placeholder="5"
                                className="input"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="label">Cost Price (€) *</label>
                            <input
                                type="number"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="input"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Sell Price (€) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="input"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                        <Link href="/dashboard/stock" className="btn btn-outline">
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
                                    Add Stock Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
