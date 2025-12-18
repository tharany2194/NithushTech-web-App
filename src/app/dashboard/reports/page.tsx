'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ReportData {
    repairs: { total: number; byStatus: Record<string, number> };
    revenue: { total: number; byMonth: { month: string; amount: number }[] };
    phones: { totalProfit: number; sold: number };
    outstanding: number;
}

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#6b7280'];

export default function ReportsPage() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const stats = await response.json();

                    // Transform data for charts
                    setData({
                        repairs: {
                            total: stats.repairs.total,
                            byStatus: {
                                'New': stats.repairs.new,
                                'In Progress': stats.repairs.inProgress,
                                'Waiting Parts': stats.repairs.waitingParts,
                                'Completed': stats.repairs.completed,
                                'Delivered': stats.repairs.delivered,
                            },
                        },
                        revenue: {
                            total: stats.invoices.totalRevenue,
                            byMonth: [
                                { month: 'Jan', amount: 0 },
                                { month: 'Feb', amount: 0 },
                                { month: 'Mar', amount: 0 },
                                { month: 'Apr', amount: 0 },
                                { month: 'May', amount: 0 },
                                { month: 'Jun', amount: 0 },
                                { month: 'Jul', amount: 0 },
                                { month: 'Aug', amount: 0 },
                                { month: 'Sep', amount: 0 },
                                { month: 'Oct', amount: 0 },
                                { month: 'Nov', amount: 0 },
                                { month: 'Dec', amount: stats.invoices.totalRevenue },
                            ],
                        },
                        phones: {
                            totalProfit: stats.phones.totalProfit,
                            sold: stats.phones.sold,
                        },
                        outstanding: stats.invoices.totalOutstanding,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch report data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const statusData = data ? Object.entries(data.repairs.byStatus).map(([name, value]) => ({
        name,
        value,
    })) : [];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1">Business performance overview</p>
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="select max-w-xs"
                >
                    <option value="week">Last 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="quarter">Last 3 Months</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(data?.revenue.total || 0)}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Phone Profits</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(data?.phones.totalProfit || 0)}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Outstanding Payments</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {formatCurrency(data?.outstanding || 0)}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500">Total Repairs</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {data?.repairs.total || 0}
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.revenue.byMonth || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                                <Tooltip
                                    formatter={(value) => formatCurrency(Number(value) || 0)}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Repair Status Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Repair Status Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
