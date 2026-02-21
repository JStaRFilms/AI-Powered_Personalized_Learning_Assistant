import { cn } from '@/lib/utils';
import {
    FileText,
    MessageSquare,
    Clock,
    MoreVertical,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
    id: string;
    type: 'document' | 'conversation';
    title: string;
    timestamp: string;
    href: string;
}

interface RecentActivityProps {
    items: ActivityItem[];
    className?: string;
}

export function RecentActivity({ items, className }: RecentActivityProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50',
                className
            )}
        >
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800/50">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Recent Activity
                </h2>
                <Link
                    href="/dashboard/activity"
                    className="group flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    View all
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-zinc-50 p-3 dark:bg-zinc-800">
                            <Clock className="h-6 w-6 text-zinc-400" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            No recent activity yet.
                        </p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="group flex items-center justify-between p-4 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200',
                                        item.type === 'document'
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                    )}
                                >
                                    {item.type === 'document' ? (
                                        <FileText className="h-5 w-5" />
                                    ) : (
                                        <MessageSquare className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <Link
                                        href={item.href}
                                        className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                        {item.timestamp}
                                    </p>
                                </div>
                            </div>
                            <button className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
