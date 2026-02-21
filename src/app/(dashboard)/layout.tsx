'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    Settings,
    Menu,
    X,
    Search,
    Bell,
    User as UserIcon,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { NavLink } from '@/components/dashboard/nav-link';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
        { name: 'My Materials', href: '/dashboard/materials', icon: <BookOpen /> },
        { name: 'AI Tutor', href: '/dashboard/chat', icon: <MessageSquare /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <Settings /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100">
                            <div className="h-5 w-5 rounded-sm bg-white dark:bg-zinc-900" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Lumen
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-10 flex-1 space-y-1">
                        {navigation.map((item) => (
                            <NavLink key={item.name} href={item.href} icon={item.icon}>
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Bottom Profile section */}
                    <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                        <button className="group flex w-full items-center gap-3 rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-all duration-200">
                            <div className="h-10 w-10 rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                <UserIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-semibold truncate">My Account</p>
                                <p className="text-xs truncate">Manage settings</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <button className="mt-2 flex w-full items-center gap-3 rounded-xl p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200">
                            <LogOut className="h-5 w-5" />
                            <span className="text-sm font-medium">Log out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                className="h-10 w-64 rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm transition-all focus:w-80 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-black" />
                        </button>
                        <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
                        <div className="flex items-center gap-3 pl-2">
                            {/* User Info Placeholder */}
                            <div className="hidden text-right md:block">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Student</p>
                                <p className="text-xs text-zinc-500">Free Plan</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-400 dark:from-zinc-700 dark:to-zinc-900 border-2 border-white dark:border-zinc-800 shadow-sm" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-10">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
