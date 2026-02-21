'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function NavLink({ href, icon, children, className }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-none'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
                className
            )}
        >
            <span className={cn(
                'mr-3 h-5 w-5 transition-colors duration-200',
                isActive ? 'text-white dark:text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
            )}>
                {icon}
            </span>
            {children}
        </Link>
    );
}
