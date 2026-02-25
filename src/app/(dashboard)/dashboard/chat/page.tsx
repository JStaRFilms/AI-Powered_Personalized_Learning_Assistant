import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default async function ChatPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Fetch latest conversation or create a new ID
    const latestConversation = await db.conversation.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
    });

    const conversationId = latestConversation?.id || `conv_${Date.now()}`;
    const initialMessages = latestConversation?.messages
        ? (typeof latestConversation.messages === 'string'
            ? JSON.parse(latestConversation.messages)
            : latestConversation.messages)
        : [];

    return (
        <div className="flex flex-col h-[100vh] relative -mt-0">
            {/* Top Chat Header */}
            <header className="h-20 glass-solid flex items-center justify-between px-8 z-10 w-full sticky top-0 border-b border-surface-200">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-serif text-surface-900 leading-none">
                            {latestConversation?.title || "New Tutor Session"}
                        </h2>
                        <span className="text-xs font-medium text-brand-700 flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Active
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex-1 w-full max-w-5xl mx-auto py-6 px-4 md:px-8">
                <ChatInterface
                    conversationId={conversationId}
                    initialMessages={Array.isArray(initialMessages) ? initialMessages : []}
                />
            </div>
        </div>
    );
}
