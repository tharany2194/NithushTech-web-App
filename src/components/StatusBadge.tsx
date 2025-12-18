import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

interface StatusBadgeProps {
    status: string;
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
}

const statusVariantMap: Record<string, BadgeVariant> = {
    // Repair statuses
    'New': 'info',
    'In Progress': 'warning',
    'Waiting Parts': 'secondary',
    'Completed': 'success',
    'Delivered': 'default',

    // Invoice statuses
    'Paid': 'success',
    'Partial': 'warning',
    'Overdue': 'danger',

    // Phone statuses
    'Bought': 'info',
    'Repaired': 'warning',
    'Sold': 'success',
};

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function StatusBadge({ status, variant, size = 'md' }: StatusBadgeProps) {
    const resolvedVariant = variant || statusVariantMap[status] || 'default';

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full border',
                variantStyles[resolvedVariant],
                size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
            )}
        >
            <span
                className={cn(
                    'w-1.5 h-1.5 rounded-full mr-1.5',
                    resolvedVariant === 'success' && 'bg-emerald-500',
                    resolvedVariant === 'warning' && 'bg-amber-500',
                    resolvedVariant === 'danger' && 'bg-red-500',
                    resolvedVariant === 'info' && 'bg-blue-500',
                    resolvedVariant === 'secondary' && 'bg-purple-500',
                    resolvedVariant === 'default' && 'bg-gray-500'
                )}
            />
            {status}
        </span>
    );
}
