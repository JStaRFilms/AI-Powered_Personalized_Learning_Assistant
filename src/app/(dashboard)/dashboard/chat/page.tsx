import { getCachedSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default async function ChatPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getCachedSession();

    if (!session?.user) {
        redirect("/login");
    }

    const params = await searchParams;
    const isNewChat = !!params.new;

    // Fetch data in parallel
    const [latestConversation, documents] = await Promise.all([
        isNewChat ? Promise.resolve(null) : db.conversation.findFirst({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' },
            select: { id: true, title: true, messages: true },
        }),
        db.document.findMany({
            where: { userId: session.user.id },
            select: { id: true, title: true },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    const conversationId = latestConversation?.id || `conv_${Date.now()}`;
    const conversationTitle = latestConversation?.title || "New Tutor Session";
    const initialMessages = latestConversation?.messages
        ? (typeof latestConversation.messages === 'string'
            ? JSON.parse(latestConversation.messages)
            : latestConversation.messages)
        : [];

    return (
        <ChatInterface
            conversationId={conversationId}
            initialMessages={Array.isArray(initialMessages) ? initialMessages : []}
            conversationTitle={conversationTitle}
            userName={session.user.name || "Student"}
            documents={documents}
        />
    );
}
