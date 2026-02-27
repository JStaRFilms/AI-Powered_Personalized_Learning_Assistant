import { getCachedSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
    const session = await getCachedSession();

    if (!session?.user) {
        redirect("/login");
    }

    // Run all DB queries in parallel to reduce load time
    const fiveWeeksAgo = new Date();
    fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 35);

    const [usage, conversationCount, documentCount, recentConversations, recentTopics] = await Promise.all([
        db.userUsage.findUnique({
            where: { userId: session.user.id },
        }),
        db.conversation.count({
            where: { userId: session.user.id },
        }),
        db.document.count({
            where: { userId: session.user.id },
        }),
        db.conversation.findMany({
            where: {
                userId: session.user.id,
                updatedAt: { gte: fiveWeeksAgo },
            },
            select: { updatedAt: true },
        }),
        db.conversation.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' },
            take: 5,
            select: { title: true, updatedAt: true, id: true },
        }),
    ]);

    // Compute weekly activity distribution
    const weeklyData: number[] = [0, 0, 0, 0, 0]; // W1 (oldest) → W5 (current)
    const now = new Date();
    for (const conv of recentConversations) {
        const diffDays = Math.floor((now.getTime() - conv.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(4, Math.floor(diffDays / 7));
        weeklyData[4 - weekIndex]++;
    }
    const maxWeekly = Math.max(1, ...weeklyData);

    const questionsAsked = usage?.apiCallsCount ?? 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-xs uppercase tracking-widest text-surface-800 font-medium mb-1 block">
                        Your Analytics
                    </span>
                    <h1 className="text-4xl font-serif text-surface-900 leading-none">Progress Overview</h1>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl shadow-soft">
                    <p className="text-sm text-surface-800 font-medium mb-2">Questions Asked</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-4xl font-serif text-surface-900">{questionsAsked}</h4>
                    </div>
                    <p className="text-xs text-surface-500 mt-3 font-light">Total AI tutor interactions</p>
                </div>
                <div className="glass p-6 rounded-3xl shadow-soft">
                    <p className="text-sm text-surface-800 font-medium mb-2">Chat Sessions</p>
                    <h4 className="text-4xl font-serif text-surface-900">{conversationCount}</h4>
                    <p className="text-xs text-surface-500 mt-3 font-light">Total learning conversations</p>
                </div>
                <div className="glass p-6 rounded-3xl shadow-soft">
                    <p className="text-sm text-surface-800 font-medium mb-2">Materials Indexed</p>
                    <h4 className="text-4xl font-serif text-surface-900">{documentCount}</h4>
                    <p className="text-xs text-surface-500 mt-3 font-light">Documents in your knowledge base</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Weekly Activity Chart */}
                <div className="glass p-8 rounded-3xl shadow-soft border-t border-white/60 flex flex-col">
                    <div className="w-full flex justify-between items-center mb-8">
                        <h3 className="text-lg font-serif text-surface-900">Weekly Activity</h3>
                        <span className="text-xs text-surface-500 font-light">Last 5 weeks</span>
                    </div>

                    <div className="w-full h-40 flex items-end gap-2 pt-5 border-b border-surface-200">
                        {weeklyData.map((count, i) => {
                            const heightPercent = Math.max(5, (count / maxWeekly) * 100);
                            const isLatest = i === weeklyData.length - 1;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                                    <span className="text-xs text-surface-500 font-medium">{count}</span>
                                    <div
                                        className={`w-full rounded-t transition-all duration-500 ${isLatest ? 'bg-brand-500 shadow-float' : count > 0 ? 'bg-brand-300' : 'bg-surface-200'
                                            }`}
                                        style={{ height: `${heightPercent}%` }}
                                    ></div>
                                    <span className={`text-xs ${isLatest ? 'text-brand-700 font-medium' : 'text-surface-500'}`}>
                                        W{i + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {recentConversations.length === 0 && (
                        <p className="text-sm text-surface-400 text-center mt-6 font-light">
                            Start chatting with your AI tutor to see activity here.
                        </p>
                    )}
                </div>

                {/* Recent Topics */}
                <div className="glass p-8 rounded-3xl shadow-soft flex flex-col">
                    <h3 className="text-lg font-serif text-surface-900 mb-6">Recent Topics</h3>

                    <div className="space-y-4 flex-1">
                        {recentTopics.length > 0 ? (
                            recentTopics.map((topic) => (
                                <div key={topic.id} className="flex items-center justify-between p-3 hover:bg-surface-50 rounded-2xl transition-colors border border-transparent hover:border-surface-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                                                </path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-surface-900 line-clamp-1">{topic.title}</p>
                                            <p className="text-xs text-surface-500 font-light">
                                                {new Date(topic.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-surface-400 text-center py-4 font-light">
                                No conversations yet. Start a chat session!
                            </p>
                        )}
                    </div>

                    {/* Mastery Tracking — Coming Soon */}
                    <div className="mt-6 border-2 border-dashed border-surface-200 rounded-2xl p-5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">Coming Soon</span>
                        </div>
                        <p className="text-xs text-surface-500 font-light">
                            Topic mastery tracking & adaptive study plans
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
