import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon,
    trend,
    className,
}: StatsCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:shadow-none',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 transition-colors duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900">
                    {icon}
                </div>
                {trend && (
                    <div
                        className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                            trend.isPositive
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        )}
                    >
                        {trend.isPositive ? '+' : '-'}
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {title}
                </h3>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {value}
                </p>
                {description && (
                    <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                        {description}
                    </p>
                )}
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-zinc-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-zinc-800/20" />
        </div>
    );
}
