'use client';

import { Wrench } from 'lucide-react';

interface RepairStatusCardsProps {
    received: number;
    inProgress: number;
    completed: number;
    delivered: number;
}

export default function RepairStatusCards({
    received = 0,
    inProgress = 0,
    completed = 0,
    delivered = 0,
}: RepairStatusCardsProps) {
    const statuses = [
        { label: 'Received', value: received, color: 'text-blue-600' },
        { label: 'In Progress', value: inProgress, color: 'text-orange-500' },
        { label: 'Completed', value: completed, color: 'text-emerald-600' },
        { label: 'Delivered', value: delivered, color: 'text-gray-600' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((status) => (
                <div
                    key={status.label}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                >
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                        <Wrench className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
                    <p className="text-4xl font-bold text-slate-900 mt-1">{status.value}</p>
                </div>
            ))}
        </div>
    );
}
