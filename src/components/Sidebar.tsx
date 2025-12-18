'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wrench,
    Smartphone,
    Package,
    FileText,
    Users,
    BarChart3,
    Settings,
} from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/repairs', label: 'Repairs', icon: Wrench },
    { href: '/dashboard/used-phones', label: 'Used Phones', icon: Smartphone },
    { href: '/dashboard/stock', label: 'Stock', icon: Package },
    { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40">
            {/* Header */}
            <div className="p-6 bg-linear-to-br from-slate-900 to-slate-800 text-white border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Wrench className="w-6 h-6 text-slate-900" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-lg tracking-tight leading-tight">NITHUSH TECH</h1>
                        <p className="text-xs text-white/70 truncate">77 Rue de Gravigny, France</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-5 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                ? 'bg-slate-100 text-slate-900'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h3 className="font-semibold text-sm text-slate-900">Phone & Computer Repair</h3>
                    <p className="text-xs text-slate-600 mt-1">Buy • Repair • Resell</p>
                </div>
            </div>
        </aside>
    );
}
