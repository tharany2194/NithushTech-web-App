'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices, recordPayment, deleteInvoice } from '@/store/slices/invoicesSlice';
import { AppDispatch, RootState } from '@/store/store';
import StatusBadge from '@/components/StatusBadge';
import { Search, Eye, Trash2, Filter, DollarSign } from 'lucide-react';
import { formatCurrency, formatShortDate } from '@/lib/utils';

export default function InvoicesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { invoices, isLoading, stats } = useSelector((state: RootState) => state.invoices);
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentModal, setPaymentModal] = useState<{ id: string; outstanding: number } | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        dispatch(fetchInvoices(statusFilter !== 'all' ? statusFilter : undefined));
    }, [dispatch, statusFilter]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            await dispatch(deleteInvoice(id));
        }
    };

    const handlePayment = async () => {
        if (!paymentModal || !paymentAmount) return;
        await dispatch(recordPayment({ id: paymentModal.id, amount: parseFloat(paymentAmount) }));
        setPaymentModal(null);
        setPaymentAmount('');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                <p className="text-gray-500 mt-1">Manage invoices and payments</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600">Paid</p>
                    <p className="text-2xl font-bold text-green-900">{stats.paid}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-sm text-amber-600">Partial</p>
                    <p className="text-2xl font-bold text-amber-900">{stats.partial}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-sm text-red-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-900">{stats.overdue}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
                    <p className="text-sm text-slate-300">Outstanding</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</p>
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
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No invoices found</p>
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>Invoice #</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Outstanding</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => {
                                const outstanding = invoice.totalAmount - invoice.paidAmount;
                                return (
                                    <tr key={invoice._id}>
                                        <td className="font-mono font-medium text-blue-600">
                                            {invoice.invoiceNumber}
                                        </td>
                                        <td>
                                            <div>
                                                <p className="font-medium">{invoice.customer?.name}</p>
                                                <p className="text-sm text-gray-500">{invoice.customer?.phone}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${invoice.type === 'Repair' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                {invoice.type}
                                            </span>
                                        </td>
                                        <td className="font-medium">{formatCurrency(invoice.totalAmount)}</td>
                                        <td className="text-green-600">{formatCurrency(invoice.paidAmount)}</td>
                                        <td className={outstanding > 0 ? 'text-red-600 font-medium' : ''}>
                                            {formatCurrency(outstanding)}
                                        </td>
                                        <td>
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="text-gray-500">{formatShortDate(invoice.dueDate)}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/dashboard/invoices/${invoice._id}`}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </Link>
                                                {invoice.status !== 'Paid' && (
                                                    <button
                                                        onClick={() => setPaymentModal({ id: invoice._id, outstanding })}
                                                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Record Payment"
                                                    >
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(invoice._id)}
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

            {/* Payment Modal */}
            {paymentModal && (
                <div className="modal-overlay" onClick={() => setPaymentModal(null)}>
                    <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold mb-4">Record Payment</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Outstanding: {formatCurrency(paymentModal.outstanding)}
                        </p>
                        <div className="mb-4">
                            <label className="label">Payment Amount (€)</label>
                            <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                className="input"
                                max={paymentModal.outstanding}
                                min="0.01"
                                step="0.01"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setPaymentModal(null)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button onClick={handlePayment} className="btn btn-accent">
                                Record Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
