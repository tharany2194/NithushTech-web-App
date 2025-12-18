'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomer } from '@/store/slices/customersSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Plus, Search, Eye, Trash2, Phone, Mail } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CustomersPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { customers, isLoading } = useSelector((state: RootState) => state.customers);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchCustomers(search || undefined));
    }, [dispatch, search]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            await dispatch(deleteCustomer(id));
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500 mt-1">Manage your customer database</p>
                </div>
                <button className="btn btn-accent inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Customer
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Customer Cards */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : customers.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <p className="text-gray-500">No customers found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map((customer) => (
                        <div
                            key={customer._id}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm card-hover"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <Phone className="w-4 h-4" />
                                        <span>{customer.phone}</span>
                                    </div>
                                    {customer.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{customer.email}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/dashboard/customers/${customer._id}`}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4 text-gray-600" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500">Total Repairs</p>
                                    <p className="font-semibold text-gray-900">{customer.totalRepairs}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                    <p className="font-semibold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
