'use client';

import Link from 'next/link';
import {
    Activity,
    Plus,
    Smartphone,
    ShoppingCart,
    Package,
    FileText,
    Users,
    BarChart3,
    Eye,
} from 'lucide-react';

const quickActions = [
    { href: '/dashboard/repairs/new', label: 'New Repair', icon: Plus, variant: 'dark' as const },
    { href: '/dashboard/used-phones/buy', label: 'Buy Phone', icon: Smartphone, variant: 'muted' as const },
    { href: '/dashboard/used-phones/sell', label: 'Sell Phone', icon: ShoppingCart, variant: 'dark' as const },
    { href: '/dashboard/stock/add', label: 'Add Stock', icon: Package, variant: 'muted' as const },
    { href: '/dashboard/invoices', label: 'View Invoices', icon: FileText, variant: 'dark' as const },
    { href: '/dashboard/customers', label: 'Customers', icon: Users, variant: 'muted' as const },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3, variant: 'dark' as const },
    { href: '/dashboard/repairs', label: 'All Repairs', icon: Eye, variant: 'muted' as const },
];

export default function QuickActions() {
    return (
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    const isDark = action.variant === 'dark';

                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className={
                                `flex flex-col items-center justify-center gap-2.5 p-5 rounded-lg transition-transform duration-200 hover:scale-105 ` +
                                (isDark
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-700 text-white')
                            }
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-semibold text-center leading-tight">
                                {action.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
