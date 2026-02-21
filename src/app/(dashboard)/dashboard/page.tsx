import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
    GraduationCap,
    BookOpen,
    MessageSquare,
    Upload,
    Plus,
    ArrowUpRight,
    Target,
    Zap
} from 'lucide-react';
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    // Fetch recent documents for the user
    const recentDocs = await db.document.findMany({
        where: {
            userId: session.user.id,
        },
        take: 3,
        orderBy: {
            createdAt: "desc",
        },
    });

    // Fetch recent conversations
    const recentConversations = await db.conversation.findMany({
        where: {
            userId: session.user.id,
        },
        take: 2,
        orderBy: {
            createdAt: "desc",
        },
    });

    // Combine and format activity
    const activityItems = [
        ...recentDocs.map(doc => ({
            id: doc.id,
            type: 'document' as const,
            title: doc.title,
            timestamp: doc.createdAt.toLocaleDateString(),
            href: `/dashboard/materials/${doc.id}`
        })),
        ...recentConversations.map(conv => ({
            id: conv.id,
            type: 'conversation' as const,
            title: conv.title,
            timestamp: conv.createdAt.toLocaleDateString(),
            href: `/dashboard/chat/${conv.id}`
        }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Welcome Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Welcome back, {session.user.name?.split(' ')[0] || 'Scholar'}
                    </h1>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        Ready to continue your learning journey?
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/materials/upload"
                        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </Link>
                    <Link
                        href="/dashboard/chat"
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        <Plus className="h-4 w-4" />
                        Start Chat
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Course Mastery"
                    value="72%"
                    description="Overall progress across all topics"
                    icon={<Target className="h-5 w-5" />}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Topics Covered"
                    value="24"
                    description="Specific modules completed"
                    icon={<BookOpen className="h-5 w-5" />}
                    trend={{ value: 4, isPositive: true }}
                />
                <StatsCard
                    title="Study Hours"
                    value="18.5"
                    description="Time spent learning this week"
                    icon={<Zap className="h-5 w-5" />}
                    trend={{ value: 2.1, isPositive: true }}
                />
                <StatsCard
                    title="Recent Score"
                    value="A-"
                    description="Latest assessment performance"
                    icon={<GraduationCap className="h-5 w-5" />}
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Activity Section */}
                <div className="lg:col-span-2">
                    <RecentActivity items={activityItems} />
                </div>

                {/* Quick Tips / Upgrade Card */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-zinc-900 p-6 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                        <h3 className="text-lg font-bold tracking-tight">Level Up Your Learning</h3>
                        <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                            Unlock personalized AI-generated quizzes and advanced topic mapping.
                        </p>
                        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800">
                            Upgrade to Plus
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Study Goal</h3>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500">Weekly Target</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">85%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                                    style={{ width: '85%' }}
                                />
                            </div>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                                You're just 2 hours away from your goal!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
