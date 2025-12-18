'use client';

import { TrendingUp, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WelcomeBannerProps {
    totalRepairsToday?: number;
}

export default function WelcomeBanner({ totalRepairsToday = 0 }: WelcomeBannerProps) {
    const today = new Date();

    return (
        <div className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl px-10 py-9 text-white relative overflow-hidden min-h-44">
            {/* Decorative shapes */}
            <div className="absolute inset-0">
                <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/5" />
                <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/4" />
                <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white/5" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back!</h1>
                    <p className="text-slate-300 mt-2 text-base">NITHUSH TECH Management Dashboard</p>
                    <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(today)}</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl px-6 py-4 border border-slate-700/50 shadow-lg whitespace-nowrap">
                    <p className="text-xs text-slate-300 tracking-wide uppercase">Today&apos;s Activity</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-white/70" />
                        <span className="text-3xl font-extrabold text-white">{totalRepairsToday}</span>
                        <span className="text-xs text-slate-400 font-medium">Total Repairs</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
