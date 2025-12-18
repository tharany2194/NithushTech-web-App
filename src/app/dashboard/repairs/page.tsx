'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepairs, deleteRepair } from '@/store/slices/repairsSlice';
import { AppDispatch, RootState } from '@/store/store';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Search, Eye, Trash2, Filter } from 'lucide-react';
import { formatShortDate } from '@/lib/utils';

export default function RepairsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { repairs, isLoading, stats } = useSelector((state: RootState) => state.repairs);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchRepairs({ status: statusFilter !== 'all' ? statusFilter : undefined, search }));
    }, [dispatch, statusFilter, search]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this repair?')) {
            await dispatch(deleteRepair(id));
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Repair Management</h1>
                    <p className="text-gray-500 mt-1">Track and manage all device repairs</p>
                </div>
                <Link
                    href="/dashboard/repairs/new"
                    className="btn btn-accent inline-flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Repair
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'bg-gray-100' },
                    { label: 'New', value: stats.new, color: 'bg-blue-100' },
                    { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-100' },
                    { label: 'Completed', value: stats.completed, color: 'bg-green-100' },
                    { label: 'Delivered', value: stats.delivered, color: 'bg-gray-100' },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by repair ID, device, or brand..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select"
                        >
                            <option value="all">All Status</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Waiting Parts">Waiting Parts</option>
                            <option value="Completed">Completed</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : repairs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No repairs found</p>
                        <Link href="/dashboard/repairs/new" className="text-blue-600 hover:underline mt-2 inline-block">
                            Create your first repair
                        </Link>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>Photo</th>
                                <th>Repair ID</th>
                                <th>Customer</th>
                                <th>Device</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repairs.map((repair) => (
                                <tr key={repair._id}>
                                    <td>
                                        {repair.beforeRepairPhoto ? (
                                            <img 
                                                src={repair.beforeRepairPhoto} 
                                                alt="Device" 
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <span className="text-xs text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className="font-mono font-medium text-blue-600">
                                            {repair.repairId}
                                        </span>
                                    </td>
                                    <td>
                                        <div>
                                            <p className="font-medium">{repair.customer?.name}</p>
                                            <p className="text-sm text-gray-500">{repair.customer?.phone}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <p className="font-medium">{repair.deviceBrand} {repair.deviceModel}</p>
                                            <p className="text-sm text-gray-500">{repair.deviceType}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <StatusBadge status={repair.status} />
                                    </td>
                                    <td className="text-gray-500">
                                        {formatShortDate(repair.createdAt)}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/dashboard/repairs/${repair._id}`}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(repair._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
