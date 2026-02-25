'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                    </path>
                </svg>
            )
        },
        {
            name: 'Library',
            href: '/dashboard/library',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                    </path>
                </svg>
            )
        },
        {
            name: 'AI Tutor',
            href: '/dashboard/chat',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                    </path>
                </svg>
            )
        },
        {
            name: 'Analytics',
            href: '/dashboard/analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                </svg>
            )
        }
    ];

    return (
        <div className="antialiased min-h-screen pattern-dots flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-surface-900/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-glass rounded-xl text-surface-800 shadow-soft border border-surface-200"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar (Full width for normal, Icon-only for chat if needed, but going with normal for layout) */}
            <aside className={cn(
                "w-64 glass border-r border-surface-200 flex flex-col justify-between fixed h-full z-50 transition-transform duration-300 lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div>
                    {/* Logo */}
                    <div className="p-8 flex justify-between items-center">
                        <Link href="/dashboard" className="text-2xl font-serif font-medium tracking-tight text-surface-900">
                            Lumina<span className="text-brand-500 italic">.ai</span>
                        </Link>
                        <button className="lg:hidden text-surface-500 hover:text-surface-900" onClick={() => setIsSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="px-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors",
                                        isActive
                                            ? "bg-brand-50 text-brand-700 font-medium shadow-inner"
                                            : "text-surface-800 hover:bg-surface-100 hover:text-surface-900 font-light"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* User Section */}
                <div className="p-6 border-t border-surface-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center font-serif text-surface-900 border-2 border-surface-50">
                            S
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-surface-900">Student Name</h5>
                            <Link href="/dashboard/settings" className="text-xs text-surface-800 hover:text-brand-600 transition-colors">
                                Settings & Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content wrapped dynamically */}
            {/* If we're strictly full page with no margin for Chat, we can conditionally add ml-64 based on children, but let's standardise ml-64 for now and override in Chat if needed. */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {children}
            </div>
        </div>
    );
}

