'use client';

import { TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FinancialStatsProps {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    incomeTrend?: number;
    profitTrend?: number;
}

export default function FinancialStats({
    totalIncome = 0,
    totalExpenses = 0,
    netProfit = 0,
    incomeTrend = 12,
    profitTrend = 8,
}: FinancialStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Income */}
            <div className="bg-linear-to-br from-slate-700 to-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white">
                {/* Decorative pattern */}
                <div className="absolute inset-0">
                    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute right-10 top-4 w-16 h-16 rounded-full bg-white/5" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            <span>+{incomeTrend}%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-white/70 mt-5">Total Income</p>
                    <p className="text-3xl font-bold text-white mt-1">
                        {formatCurrency(totalIncome)}
                    </p>
                </div>
            </div>

            {/* Total Expenses */}
            <div className="bg-linear-to-br from-slate-600 to-slate-700 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white">
                {/* Decorative pattern */}
                <div className="absolute inset-0">
                    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute right-10 top-4 w-16 h-16 rounded-full bg-white/5" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-white/70 mt-5">Total Expenses</p>
                    <p className="text-3xl font-bold text-white mt-1">
                        {formatCurrency(totalExpenses)}
                    </p>
                </div>
            </div>

            {/* Net Profit */}
            <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white">
                {/* Decorative pattern */}
                <div className="absolute inset-0">
                    <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute right-10 top-4 w-16 h-16 rounded-full bg-white/5" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            <span>+{profitTrend}%</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-white/70 mt-5">Net Profit</p>
                    <p className="text-3xl font-bold text-white mt-1">
                        {formatCurrency(netProfit)}
                    </p>
                </div>
            </div>
        </div>
    );
}
