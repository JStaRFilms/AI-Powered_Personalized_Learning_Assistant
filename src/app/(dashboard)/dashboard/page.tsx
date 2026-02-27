import { getCachedSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getCachedSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Run all DB queries in parallel to avoid sequential network round-trips to Neon
    const [documentCount, recentDocs, conversationDates, documentDates] = await Promise.all([
        db.document.count({
            where: { userId: session.user.id }
        }),
        db.document.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: { id: true, title: true, createdAt: true },
        }),
        db.conversation.findMany({
            where: { userId: session.user.id },
            select: { updatedAt: true },
        }),
        db.document.findMany({
            where: { userId: session.user.id },
            select: { createdAt: true },
        }),
    ]);

    const toDateStr = (d: Date) => d.toISOString().split('T')[0];
    const activityDays = new Set([
        ...conversationDates.map(c => toDateStr(c.updatedAt)),
        ...documentDates.map(d => toDateStr(d.createdAt)),
    ]);

    let activityStreak = 0;
    const today = new Date();
    const todayStr = toDateStr(today);

    // Allow streak to start from today or yesterday (forgiving)
    let startOffset = 0;
    if (!activityDays.has(todayStr)) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (activityDays.has(toDateStr(yesterday))) {
            startOffset = 1;
        }
    }

    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - startOffset - i);
        if (activityDays.has(toDateStr(checkDate))) {
            activityStreak++;
        } else {
            break;
        }
    }

    const streakPercent = Math.min(100, Math.round((activityStreak / 7) * 100));

    // Dynamic greeting based on time of day
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in duration-700">
            {/* Top Bar */}
            <header className="flex justify-between items-end mb-12">
                <div>
                    <span className="text-xs uppercase tracking-widest text-surface-800 font-medium mb-1 block">{greeting},</span>
                    <h1 className="text-4xl font-serif text-surface-900 leading-none">{session.user.name || "Student"}</h1>
                </div>
                <Link href="/dashboard/library" className="bg-brand-900 text-surface-50 px-6 py-3 rounded-2xl font-medium shadow-float hover:bg-brand-800 transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Upload Materials
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Focus & Stats */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Resume Learning Banner */}
                    <div className="glass p-8 rounded-3xl shadow-soft relative overflow-hidden flex items-center justify-between border-t border-white/60">
                        <div className="absolute -right-16 -top-16 opacity-10">
                            <svg className="w-64 h-64 text-brand-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        </div>

                        <div className="z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-brand-700 font-semibold mb-2 block">Ready to Learn</span>
                                <h2 className="text-2xl font-serif text-surface-900 mb-1">Start a Conversation</h2>
                                <p className="text-sm text-surface-800 font-light">Ask your AI tutor questions based on your uploaded context.</p>
                            </div>
                            <Link href="/dashboard/chat" className="bg-surface-900 text-surface-50 px-6 py-3 rounded-2xl font-medium shrink-0 hover:bg-surface-800 transition-colors flex items-center gap-2">
                                Open Chat
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass p-6 rounded-3xl shadow-soft">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <span className="text-sm text-surface-800 font-medium">Activity Streak</span>
                            </div>
                            <h4 className="text-3xl font-serif text-surface-900">{activityStreak}<span className="text-lg text-surface-400 font-sans ml-1"> {activityStreak === 1 ? 'Day' : 'Days'}</span></h4>
                            <div className="w-full bg-surface-200 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-brand-500 h-full rounded-full transition-all duration-500" style={{ width: `${streakPercent}%` }}></div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-3xl shadow-soft">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                                        </path>
                                    </svg>
                                </div>
                                <span className="text-sm text-surface-800 font-medium">Files Indexed</span>
                            </div>
                            <h4 className="text-3xl font-serif text-surface-900">{documentCount}</h4>
                            <p className="text-xs text-surface-800 mt-4 font-light">Available for RAG context.</p>
                        </div>
                    </div>

                </div>

                {/* Right Column: Recent Activity & Uploads */}
                <div className="space-y-8">
                    <div className="glass p-6 rounded-3xl shadow-soft h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-serif text-surface-900">Recent Materials</h3>
                            <Link href="/dashboard/library" className="text-xs font-semibold uppercase tracking-wide text-brand-600 hover:text-brand-800">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4 flex-1">
                            {recentDocs.length > 0 ? (
                                recentDocs.map((doc) => (
                                    <div key={doc.id} className="group flex items-center justify-between p-3 hover:bg-surface-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-surface-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                                                    </path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-surface-900 truncate w-32">{doc.title}</p>
                                                <p className="text-xs text-surface-800 font-light">
                                                    {new Date(doc.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-1 rounded-md">Indexed</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-surface-500 text-center py-4">No materials uploaded yet.</p>
                            )}
                        </div>

                        {/* Mini Drag & Drop Link */}
                        <Link href="/dashboard/library" className="mt-4 border-2 border-dashed border-surface-300 rounded-2xl p-6 text-center hover:border-brand-400 hover:bg-brand-50/50 transition-colors block cursor-pointer">
                            <svg className="w-6 h-6 mx-auto text-surface-800 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span className="text-xs font-medium text-surface-800 block">Go to Upload</span>
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
}
