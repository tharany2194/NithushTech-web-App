'use client';

import { useEffect, useState } from 'react';
import WelcomeBanner from '@/components/WelcomeBanner';
import QuickActions from '@/components/QuickActions';
import RepairStatusCards from '@/components/RepairStatusCards';
import FinancialStats from '@/components/FinancialStats';
import { AlertTriangle } from 'lucide-react';

interface DashboardStats {
    repairs: {
        total: number;
        new: number;
        inProgress: number;
        waitingParts: number;
        completed: number;
        delivered: number;
        today: number;
    };
    invoices: {
        total: number;
        paid: number;
        partial: number;
        overdue: number;
        totalRevenue: number;
        totalOutstanding: number;
    };
    phones: {
        total: number;
        bought: number;
        repaired: number;
        sold: number;
        totalProfit: number;
    };
    lowStockCount: number;
    financial: {
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
    };
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Welcome Banner */}
            <WelcomeBanner totalRepairsToday={stats?.repairs.today || 0} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Repair Status Cards */}
            <RepairStatusCards
                received={stats?.repairs.new || 0}
                inProgress={stats?.repairs.inProgress || 0}
                completed={stats?.repairs.completed || 0}
                delivered={stats?.repairs.delivered || 0}
            />

            {/* Financial Stats */}
            <FinancialStats
                totalIncome={stats?.financial.totalIncome || 0}
                totalExpenses={stats?.financial.totalExpenses || 0}
                netProfit={stats?.financial.netProfit || 0}
            />

            {/* Alerts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Low Stock Alert */}
                {(stats?.lowStockCount || 0) > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
                                <p className="text-sm text-amber-600">
                                    {stats?.lowStockCount} items need to be reordered
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Outstanding Payments */}
                {(stats?.invoices.totalOutstanding || 0) > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-800">Pending Payments</h3>
                                <p className="text-sm text-red-600">
                                    €{stats?.invoices.totalOutstanding.toFixed(2)} outstanding
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
