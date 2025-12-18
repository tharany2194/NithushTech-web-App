'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsedPhones, deleteUsedPhone } from '@/store/slices/usedPhonesSlice';
import { AppDispatch, RootState } from '@/store/store';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Search, Eye, Trash2, Filter, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function UsedPhonesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { phones, isLoading, stats } = useSelector((state: RootState) => state.usedPhones);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchUsedPhones(statusFilter !== 'all' ? statusFilter : undefined));
    }, [dispatch, statusFilter]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this phone?')) {
            await dispatch(deleteUsedPhone(id));
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Used Phones</h1>
                    <p className="text-gray-500 mt-1">Buy, repair, and sell used phones</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/used-phones/buy"
                        className="btn btn-accent inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Buy Phone
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600">Bought</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.bought}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-sm text-amber-600">Repaired</p>
                    <p className="text-2xl font-bold text-amber-900">{stats.repaired}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600">Sold</p>
                    <p className="text-2xl font-bold text-green-900">{stats.sold}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
                    <p className="text-sm text-slate-300">Total Profit</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalProfit)}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select max-w-xs"
                    >
                        <option value="all">All Status</option>
                        <option value="Bought">Bought</option>
                        <option value="Repaired">Repaired</option>
                        <option value="Sold">Sold</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : phones.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No phones found</p>
                        <Link href="/dashboard/used-phones/buy" className="text-blue-600 hover:underline mt-2 inline-block">
                            Buy your first phone
                        </Link>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>Phone</th>
                                <th>IMEI</th>
                                <th>Buy Price</th>
                                <th>Repair Cost</th>
                                <th>Sell Price</th>
                                <th>Profit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {phones.map((phone) => {
                                const profit = phone.status === 'Sold'
                                    ? phone.sellPrice - phone.buyPrice - phone.repairCost
                                    : 0;
                                return (
                                    <tr key={phone._id}>
                                        <td>
                                            <div>
                                                <p className="font-medium">{phone.brand} {phone.phoneModel}</p>
                                                <p className="text-sm text-gray-500">{phone.condition}</p>
                                            </div>
                                        </td>
                                        <td className="font-mono text-sm">{phone.imei}</td>
                                        <td>{formatCurrency(phone.buyPrice)}</td>
                                        <td>{formatCurrency(phone.repairCost)}</td>
                                        <td>{phone.sellPrice > 0 ? formatCurrency(phone.sellPrice) : '-'}</td>
                                        <td className={profit > 0 ? 'text-green-600 font-medium' : profit < 0 ? 'text-red-600' : ''}>
                                            {phone.status === 'Sold' ? formatCurrency(profit) : '-'}
                                        </td>
                                        <td>
                                            <StatusBadge status={phone.status} />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/used-phones/${phone._id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                {phone.status !== 'Sold' && (
                                                    <Link
                                                        href={`/dashboard/used-phones/${phone._id}/sell`}
                                                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Sell"
                                                    >
                                                        <ShoppingCart className="w-4 h-4 text-green-600" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(phone._id)}
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
