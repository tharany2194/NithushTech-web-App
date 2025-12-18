'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStock, deleteStockItem } from '@/store/slices/stockSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Plus, Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function StockPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { items, isLoading } = useSelector((state: RootState) => state.stock);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchStock());
    }, [dispatch]);

    const filteredItems = items.filter(item =>
        item.partName.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            await dispatch(deleteStockItem(id));
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
                    <p className="text-gray-500 mt-1">Manage your parts inventory</p>
                </div>
                <Link
                    href="/dashboard/stock/add"
                    className="btn btn-accent inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Stock
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by part name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No stock items found</p>
                        <Link href="/dashboard/stock/add" className="text-blue-600 hover:underline mt-2 inline-block">
                            Add your first item
                        </Link>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>Part Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Cost Price</th>
                                <th>Sell Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => {
                                const isLowStock = item.quantity <= item.reorderLevel;
                                return (
                                    <tr key={item._id}>
                                        <td className="font-medium">{item.partName}</td>
                                        <td className="font-mono text-sm text-gray-500">{item.sku}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <span className={isLowStock ? 'text-red-600 font-medium' : ''}>
                                                {item.quantity}
                                            </span>
                                            <span className="text-gray-400 text-sm"> / {item.reorderLevel}</span>
                                        </td>
                                        <td>{formatCurrency(item.costPrice)}</td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>
                                            {isLowStock ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/stock/${item._id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
