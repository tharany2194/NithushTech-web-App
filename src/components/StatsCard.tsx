'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    subtitle?: string;
}

const variantStyles = {
    default: 'bg-white border border-gray-100',
    primary: 'bg-gradient-to-br from-slate-800 to-slate-900 text-white',
    success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
};

export default function StatsCard({
    title,
    value,
    icon,
    trend,
    variant = 'default',
    subtitle,
}: StatsCardProps) {
    const isLight = variant === 'default';

    return (
        <div
            className={cn(
                'rounded-2xl p-5 relative overflow-hidden shadow-sm card-hover',
                variantStyles[variant]
            )}
        >
            {/* Decorative pattern for dark cards */}
            {!isLight && (
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/20" />
                    <div className="absolute right-8 -bottom-2 w-16 h-16 rounded-full bg-white/10" />
                </div>
            )}

            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    {icon && (
                        <div
                            className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center',
                                isLight ? 'bg-gray-100' : 'bg-white/20'
                            )}
                        >
                            {icon}
                        </div>
                    )}

                    {trend !== undefined && (
                        <div
                            className={cn(
                                'flex items-center gap-1 text-sm font-medium',
                                trend >= 0 ? 'text-emerald-500' : 'text-red-500',
                                !isLight && 'text-white/80'
                            )}
                        >
                            {trend >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{trend >= 0 ? '+' : ''}{trend}%</span>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <p
                        className={cn(
                            'text-sm font-medium',
                            isLight ? 'text-gray-500' : 'text-white/70'
                        )}
                    >
                        {title}
                    </p>
                    <p
                        className={cn(
                            'text-2xl font-bold mt-1',
                            isLight ? 'text-gray-900' : 'text-white'
                        )}
                    >
                        {value}
                    </p>
                    {subtitle && (
                        <p
                            className={cn(
                                'text-xs mt-1',
                                isLight ? 'text-gray-400' : 'text-white/60'
                            )}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
