'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteConversation(conversationId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const conv = await db.conversation.findUnique({
            where: { id: conversationId },
            select: { userId: true },
        });

        if (!conv || conv.userId !== session.user.id) {
            return { error: "Conversation not found" };
        }

        await db.conversation.delete({
            where: { id: conversationId },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/chat');
        revalidatePath('/dashboard/analytics');
        return { success: true };
    } catch (error) {
        console.error("Delete conversation error:", error);
        return { error: "Failed to delete conversation." };
    }
}
